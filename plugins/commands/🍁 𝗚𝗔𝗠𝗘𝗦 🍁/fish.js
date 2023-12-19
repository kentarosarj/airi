const config = {
  name: "fishing",
  aliases: ["fish"],
  description: "Go fishing and try to catch a fish or a treasure chest.",
  usage: "",
  credits: "Dymyrius",
  cooldown: 20,
  extra: {
    minbet: 300
  }
}

const langData = {
  "en_US": {
    "fishing.userNoData": "𝚈𝚘𝚞𝚛 𝚍𝚊𝚝𝚊 𝚒𝚜 𝚗𝚘𝚝 𝚛𝚎𝚊𝚍𝚢 𝚢𝚎𝚝.",
    "fishing.notEnoughMoney": "𝙽𝚘𝚝 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢.",
    "fishing.minMoney": "𝙼𝚒𝚗𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚒𝚜 ${min}. 💵",
    "fishing.fail": "𝚈𝚘𝚞 𝚍𝚒𝚍𝚗'𝚝 𝚌𝚊𝚝𝚌𝚑 𝚊𝚗𝚢𝚝𝚑𝚒𝚗𝚐. 𝙱𝚎𝚝𝚝𝚎𝚛 𝚕𝚞𝚌𝚔 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎! 💸" || "𝚈𝚘𝚞 𝚌𝚊𝚞𝚐𝚑𝚝 𝚊 🐡 𝚠𝚘𝚛𝚝𝚑 𝚗𝚘𝚝𝚑𝚒𝚗𝚐.",
    "fishing.success": "𝚈𝚘𝚞 𝚌𝚊𝚞𝚐𝚑𝚝 𝚊 {fish} 𝚠𝚘𝚛𝚝𝚑 ${money}! 💵",
    "fishing.successTreasure": "𝚈𝚘𝚞 𝚌𝚊𝚞𝚐𝚑𝚝 𝚊 𝚝𝚛𝚎𝚊𝚜𝚞𝚛𝚎 𝚌𝚑𝚎𝚜𝚝 𝚠𝚘𝚛𝚝𝚑 $𝟻𝟶,𝟶𝟶𝟶! 💰",
    "any.error": "𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚑𝚊𝚜 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍, 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛."
  },
  "vi_VN": {
    "fishing.userNoData": "Dữ liệu của bạn chưa sẵn sàng.",
    "fishing.notEnoughMoney": "Không đủ tiền.",
    "fishing.minMoney": "Cược tối thiểu là {min} XC.",
    "fishing.fail": "Bạn không bắt được cá nào. Chúc may mắn lần sau!",
    "fishing.success": "Bạn đã bắt được một con {fish} trị giá {money}! 💰",
    "fishing.successTreasure": "Bạn đã bắt được một chiếc hòm báu trị giá $150,000! 💰",
    "any.error": "Đã xảy ra lỗi, vui lòng thử lại sau."
  },
  "ar_SY": {
    "fishing.userNoData": "البيانات الخاصة بك ليست جاهزة بعد.",
    "fishing.notEnoughMoney": "مال غير كاف.",
    "fishing.minMoney": "الحد الأدنى للرهان هو {min} XC.",
    "fishing.fail": "لم تصطاد شيئًا. حظاً أوفر في المرة القادمة!",
    "fishing.success": "لقد اصطادت {fish} بقيمة {money}! 💰",
    "fishing.successTreasure": "لقد اصطادت كنزًا يستحق 150,000 دولار! 💰",
    "any.error": "حدث خطأ ، حاول مرة أخرى في وقت لاحق."
  }
}

const fishTypes = ["🐟", "🐠", "🦈", "🐙", "🦑", "🦞", "🦀"];
const minFishValue = 3000;
const maxFishValue = 8000;

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers
  const bet = BigInt(args[0] || extra.minbet);

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) return message.reply(getLang("fishing.userNoData"));
    if (BigInt(userMoney) < bet) return message.reply(getLang("fishing.notEnoughMoney"));
    if (bet < BigInt(extra.minbet)) return message.reply(getLang("fishing.minMoney", { min: extra.minbet }));

    await Users.decreaseMoney(message.senderID, bet);

    const fishCaught = Math.random() < 0.6;
    if (fishCaught) {
      const isTreasureChest = Math.random() < 0.1; // 10% chance for treasure chest
      if (isTreasureChest) {
        await Users.increaseMoney(message.senderID, 50000);
        message.reply(getLang("fishing.successTreasure"));
      } else {
        const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        const fishValue = BigInt(Math.floor(Math.random() * (maxFishValue - minFishValue + 1) + minFishValue));
        await Users.increaseMoney(message.senderID, fishValue);
        message.reply(getLang("fishing.success", {
          fish: fishType,
          money: String(fishValue)
        }));
      }
    } else {
      message.reply(getLang("fishing.fail"));
    }
    
  } catch (error) {
    console.error(error);
    return message.reply(getLang("any.error"));
  }
}

export default {
  config,
  langData,
  onCall
}
