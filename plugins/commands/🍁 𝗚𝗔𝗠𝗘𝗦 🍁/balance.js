const config = {
    name: "balance",
    aliases: ["bal", "money"],
    description: "Check user's/self money",
    usage: "<reply/tag/none>",
    cooldown: 5,
    credits: "XaviaTeam"
}

const langData = {
    "en_US": {
        "balance.userNoData": "𝚄𝚜𝚎𝚛 𝚗𝚘𝚝 𝚏𝚘𝚞𝚗𝚍/𝚗𝚘𝚝 𝚛𝚎𝚊𝚍𝚢.",
        "balance.selfNoData": "𝚈𝚘𝚞𝚛 𝚍𝚊𝚝𝚊 𝚒𝚜 𝚗𝚘𝚝 𝚛𝚎𝚊𝚍𝚢.",
        "balance.result": "\n【 𝙱𝚊𝚕𝚊𝚗𝚌𝚎 】 \n ₱{money}"
    },
    "vi_VN": {
        "balance.userNoData": "Người dùng không tìm thấy/chưa sẵn sàng",
        "balance.selfNoData": "Dữ liệu của bạn chưa sẵn sàng",
        "balance.result": "Số dư: {money}XC"
    },
    "ar_SY": {
        "balance.userNoData": "المستخدم غير موجود / غير جاهز",
        "balance.selfNoData": "البيانات الخاصة بك ليست جاهزة",
        "balance.result": "فائض: {money}XC"
    }
}

async function onCall({ message, getLang }) {
    const { type, mentions } = message;
    const { Users } = global.controllers;
    let userBalance;
    if (type == "message_reply") {
        const { senderID: TSenderID } = message.messageReply;

        userBalance = await Users.getMoney(TSenderID);
        if (!userBalance) return message.reply(getLang("balance.userNoData"));
    } else if (Object.keys(mentions).length >= 1) {
        let msg = "";

        for (const TSenderID in mentions) {
            userBalance = await Users.getMoney(TSenderID);
            msg += `${mentions[TSenderID].replace(/@/g, '')}: $${global.addCommas(userBalance || 0)}.\n`;
        }

        return message.reply(msg);
    } else {
        userBalance = await Users.getMoney(message.senderID);
        if (!userBalance) return message.reply(getLang("balance.selfNoData"));
    }

    message.reply(getLang("balance.result", { money: global.addCommas(userBalance) }));
}

export default {
    config,
    langData,
    onCall
}
