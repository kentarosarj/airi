const _24HOURs = 26400000;
import axios from 'axios'
const config = {
    name: "daily",
    aliases: ["claim"],
    description: "Claim daily reward",
    credits: "XaviaTeam",
    extra: {
        min: 8000,
        max: 15000
    }
}

const langData = {
    "en_US": {
        "daily.selfNoData": "𝚈𝚘𝚞𝚛 𝚍𝚊𝚝𝚊 𝚒𝚜 𝚗𝚘𝚝 𝚛𝚎𝚊𝚍𝚢.",
        "daily.alreadyClaimed": "𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚌𝚕𝚊𝚒𝚖𝚎𝚍 𝚢𝚘𝚞𝚛 𝚍𝚊𝚒𝚕𝚢, 𝚢𝚘𝚞 𝚌𝚊𝚗 𝚌𝚕𝚊𝚒𝚖 𝚊𝚐𝚊𝚒𝚗 𝚒𝚗 {time}. ⏱️",
        "daily.successfullyClaimed": "𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚌𝚕𝚊𝚒𝚖𝚎𝚍 𝚢𝚘𝚞𝚛 𝚍𝚊𝚒𝚕𝚢 𝚛𝚎𝚠𝚊𝚛𝚍 𝚘𝚏 ${amount}. 💵",
        "daily.failed": "𝙵𝚊𝚒𝚕𝚎𝚍!"
    },
    "vi_VN": {
        "daily.selfNoData": "Dữ liệu của bạn chưa sẵn sàng",
        "daily.alreadyClaimed": "Bạn đã nhận thưởng hàng ngày, bạn có thể nhận lại sau {time}",
        "daily.successfullyClaimed": "Bạn đã nhận thưởng hàng ngày {amount}XC",
        "daily.failed": "Thất bại"
    },
    "ar_SY": {
        "daily.selfNoData": "البيانات الخاصة بك ليست جاهزة",
        "daily.alreadyClaimed": "لقد طالبت بالفعل على مكافأتك اليومية ، يمكنك المطالبة مرة أخرى في {time}",
        "daily.successfullyClaimed": "لقد طالبت بمكافأتك اليومية البالغة {amount}XC",
        "daily.failed": "فشل"
    }
}

async function onCall({ message, extra, getLang }) {
    const { Users } = global.controllers;
    const daily = (await axios.get("https://i.imgur.com/L2OsbcZ.gif", {
    responseType: "stream"
  })).data;
    const { min, max } = extra;
    const userData = await Users.getData(message.senderID);
    if (!userData) return message.reply(getLang("daily.selfNoData"));

    if (!userData.hasOwnProperty("daily")) userData.daily = 0;
    if (Date.now() - userData.daily < _24HOURs) return message.reply(getLang("daily.alreadyClaimed", { time: global.msToHMS(_24HOURs - (Date.now() - userData.daily)) }));

    const amount = global.random(min, max);
    const result = await Users.updateData(message.senderID, { money: BigInt(userData.money || 0) + BigInt(amount), daily: Date.now() });

    if (result) {
        message.reply({body: getLang("daily.successfullyClaimed", { amount: global.addCommas(amount) }),
attachment: daily});
    } else {
        message.reply(getLang("daily.failed"));
    }
}


export default {
    config,
    langData,
    onCall
}
