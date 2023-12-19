const config = {
    name: "adduser",
    aliases: ["add"],
    description: "Add user to group",
    usage: "[uid/profileUrl]",
    cooldown: 3,
    credits: "XaviaTeam",
};

const langData = {
    // ... Language data for different locales
};

async function adduser(userID, threadID) {
    return new Promise((resolve, reject) => {
        global.api.addUserToGroup(userID, threadID, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

async function onCall({ message, args, getLang, data }) {
    if (!message.isGroup) return;

    const { threadID, senderID, reply } = message;
    
    try {
        const input = args[0]?.toLowerCase();

        if (!input) return reply(getLang("missingInput"));

        let uid = null;

        if (!isNaN(input)) {
            uid = input;
        } else {
            const uidMatch = input.match(/(?:facebook\.com\/)?profile\.php\?id=(\d+)/);
            if (uidMatch) {
                uid = uidMatch[1];
            } else {
                return reply(getLang("invalidInput"));
            }
        }

        if (uid === global.botID) return reply(getLang("botAdd"));
        if (uid === senderID) return reply(getLang("selfAdd"));

        await adduser(uid, threadID);
        return reply(getLang("success"));
    } catch (e) {
        console.error(e);
        return reply(getLang("error"));
    }
}

export default {
    config,
    langData,
    onCall,
};
