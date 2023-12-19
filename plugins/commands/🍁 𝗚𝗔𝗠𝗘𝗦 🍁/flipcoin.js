import crypto from "crypto";

const config = {
  name: "flip",
  aliases: ["f", "flipcoin"],
  description: "flipcoin game you can win or loss and this game",
  usage: "[head/tails] [bet amount]",
  credits: "Rue",
  cooldown: 50,
  extra: {
    minbet: 50, // The minimum bet amount
  },
};

const langData = {
  "en_US": {
    "flipcoin.invalid_choice": "𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚌𝚑𝚘𝚒𝚌𝚎! 𝚅𝚊𝚕𝚒𝚍 𝚌𝚑𝚘𝚒𝚌𝚎𝚜: \n{validChoices}.",
    "flipcoin.not_enough_money": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚒𝚜 𝚋𝚎𝚝.",
    "flipcoin.min_bet": "𝚃𝚑𝚎 𝚖𝚒𝚗𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝 𝚒𝚜 ${minBet}. 💵",
    "flipcoin.result_win": "【𝚃𝚑𝚎 𝚌𝚘𝚒𝚗 𝚕𝚊𝚗𝚍𝚎𝚍 𝚘𝚗 ⌜{result}⌟】 ― 𝚈𝚘𝚞 𝚠𝚘𝚗 $100! 💵",
    "flipcoin.result_lose": "【𝚃𝚑𝚎 𝚌𝚘𝚒𝚗 𝚕𝚊𝚗𝚍𝚎𝚍 𝚘𝚗 ⌜{result}⌟】\n― 𝚈𝚘𝚞 𝚕𝚘𝚜𝚝 ${bet}. 💸",
    "any.error": "𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗."
    // add more messages here as needed
  },
  // add translations for other languages here
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;
  const validChoices = ["heads", "h", "tails", "t"];

  const choice = args[0]?.toLowerCase();
  const bet = BigInt(args[1] || extra.minbet);

  if (!choice || !validChoices.includes(choice)) {
    const validStr = validChoices.join(", ");
    return message.reply(getLang("flipcoin.invalid_choice", { validChoices: validStr }));
  }

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("any.error"));
    }
    if (BigInt(userMoney) < bet) {
      return message.reply(getLang("flipcoin.not_enough_money"));
    }
    if (bet < BigInt(extra.minbet)) {
      return message.reply(getLang("flipcoin.min_bet", { minBet: extra.minbet }));
    }

    await Users.decreaseMoney(message.senderID, bet);

    // Generate a cryptographically secure random number
    const buffer = crypto.randomBytes(1);
    const randomByte = buffer[0];
    const isHeads = randomByte % 2 === 0; // Heads if even, Tails if odd

    const result = isHeads ? "heads" : "tails";
    const didWin = (choice === "h" || choice === "heads") ? isHeads : !isHeads;

    const winnings = didWin ? bet * BigInt(2) : BigInt(0);
    if (didWin) {
      await Users.increaseMoney(message.senderID, winnings);
      return message.reply(getLang("flipcoin.result_win", { bet: winnings, result }));
    } else {
      return message.reply(getLang("flipcoin.result_lose", { bet, result }));
    }
  } catch (error) {
    console.error(error);
    return message.reply(getLang("any.error"));
  }
}

export default {
  config,
  langData,
  onCall,
};

