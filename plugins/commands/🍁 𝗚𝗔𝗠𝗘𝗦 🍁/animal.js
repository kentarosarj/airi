const config = {
  name: "animalhunt",
  aliases: ["hunt"],
  description: "Embark on an animal hunting adventure and collect rare animals and treasures.",
  usage: "",
  credits: "Rue",
  cooldown: 20,
  extra: {
    minbet: 400
  }
}

const langData = {
  "en_US": {
    "animalhunt.userNoData": "𝚈𝚘𝚞𝚛 𝚍𝚊𝚝𝚊 𝚒𝚜 𝚗𝚘𝚝 𝚛𝚎𝚊𝚍𝚢 𝚢𝚎𝚝.",
    "animalhunt.notEnoughMoney": "𝙽𝚘𝚝 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢.",
    "animalhunt.minMoney": "𝙼𝚒𝚗𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚒𝚜 ${min}. 💵",
    "animalhunt.fail": "𝚈𝚘𝚞 𝚍𝚒𝚍𝚗'𝚝 𝚏𝚒𝚗𝚍 𝚊𝚗𝚢 𝚊𝚗𝚒𝚖𝚊𝚕𝚜 𝚘𝚛 𝚝𝚛𝚎𝚊𝚜𝚞𝚛𝚎𝚜. 𝙱𝚎𝚝𝚝𝚎𝚛 𝚕𝚞𝚌𝚔 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎!",
    "animalhunt.successAnimal": "𝚈𝚘𝚞 𝚑𝚞𝚗𝚝𝚎𝚍 𝚍𝚘𝚠𝚗 𝚊 {animal} 𝚠𝚘𝚛𝚝𝚑 ${value}! 💵",
    "animalhunt.successTreasure": "𝚈𝚘𝚞 𝚍𝚒𝚜𝚌𝚘𝚟𝚎𝚛𝚎𝚍 𝚊 𝚝𝚛𝚎𝚊𝚜𝚞𝚛𝚎 𝚌𝚑𝚎𝚜𝚝 𝚠𝚘𝚛𝚝𝚑 $𝟻𝟶,𝟶𝟶𝟶! 💰",
    "any.error": "𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚑𝚊𝚜 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍, 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛."
  }
  // Add translations for other languages if needed
}

const animalTypes = ["🐂", "🐉", "🐕‍🦺", "🦓", "🦜", "🐅", "🦔,"]
const minAnimalValue = 8000;
const maxAnimalValue = 20000;

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers
  const bet = BigInt(args[0] || extra.minbet);

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) return message.reply(getLang("animalhunt.userNoData"));
    if (BigInt(userMoney) < bet) return message.reply(getLang("animalhunt.notEnoughMoney"));
    if (bet < BigInt(extra.minbet)) return message.reply(getLang("animalhunt.minMoney", { min: extra.minbet }));

    await Users.decreaseMoney(message.senderID, bet);

    const huntSuccessful = Math.random() < 0.6;
    if (huntSuccessful) {
      const isTreasureFound = Math.random() < 0.1; // 10% chance for treasure
      if (isTreasureFound) {
        await Users.increaseMoney(message.senderID, 50000);
        message.reply(getLang("animalhunt.successTreasure"));
      } else {
        const animalType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
        const animalValue = BigInt(Math.floor(Math.random() * (maxAnimalValue - minAnimalValue + 1) + minAnimalValue));
        await Users.increaseMoney(message.senderID, animalValue);
        message.reply(getLang("animalhunt.successAnimal", {
          animal: animalType,
          value: String(animalValue)
        }));
      }
    } else {
      message.reply(getLang("animalhunt.fail"));
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
