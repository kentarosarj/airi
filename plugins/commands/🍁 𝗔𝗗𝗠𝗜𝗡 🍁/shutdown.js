const config = {
    name: "shutdown",
    aliases: ["ex"],
    description: "Tắt bot đi thôi",
    usage: "[query]",
    cooldown: 3,
    permissions: [2],
    isAbsolute: false,
    isHidden: false,
    credits: "Sies",
    
}

const langData = {
    "vi_VN": {
        "off.1": "[⚜️] - [⚜️]\n[🔰𝙊𝙁𝙁𝘽𝙊𝙏🔰] Bye cậu chủ nha em đi ngủ đây:33",
    },
    "en_US": {
        "off.1": "[⚜️] - [⚜️]\n[🔰𝙊𝙁𝙁𝘽𝙊𝙏🔰] Goodbye!",
    }
}

async function onCall({ message, args, getLang, extra, data, userPermissions, prefix }) {  
  
  message.send(getLang("off.1"));
  global.shutdown();
    // args: Arguments, if /example 1 2 3, args = ["1", "2", "3"]
    // getLang: Get language from langData
    // extra: Extra property from config.plugins.json
    // data { user, thread }
    // userPermissions: User permissions (0: Member, 1: Admin, 2: Bot Admin)
    // prefix: Prefix used
}

export default {
    config,
    langData,
    onCall
}

// or
// export {
//     config,
//     langData,
//     onCall
// }