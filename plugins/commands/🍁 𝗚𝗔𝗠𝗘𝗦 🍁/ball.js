import crypto from "crypto";

const config = {
  name: "shoot",
  aliases: ["ballshoot", "ballshot"],
  description: "Shoot a ball and try your luck to win or lose.",
  usage: "[bet]",
  credits: "Rue",
  cooldown: 10,
  extra: {
    minbet: 100, // The minimum bet amount
    maxbet: 5000000000000000000000000000000, // The maximum bet amount (5 octillion)
  },
};

const langData = {
  "en_US": {
    "ballshoot.not_enough_money": "You don't have enough money to place this bet.",
    "ballshoot.min_bet": "𝘛𝘩𝘦 𝘮𝘪𝘯𝘪𝘮𝘶𝘮 𝘣𝘦𝘵 𝘢𝘮𝘰𝘶𝘯𝘵 𝘪𝘴 ₱{minBet}. 🪙",
    "ballshoot.max_bet": "The maximum bet amount is ₱{maxBet}. 🪙",
    "ballshoot.result_win": "【🏀 𝚃𝚑𝚎 𝚋𝚊𝚕𝚕 𝚠𝚊𝚜 𝚜𝚑𝚘𝚝】 🎉 𝘾𝙤𝙣𝙜𝙧𝙖𝙩𝙪𝙡𝙖𝙩𝙞𝙤𝙣𝙨! 𝙔𝙤𝙪 𝙬𝙤𝙣 ${bet}💵",
    "ballshoot.result_lose": "【🏀 𝚃𝚑𝚎 𝚋𝚊𝚕𝚕 𝚠𝚊𝚜 𝚜𝚑𝚘𝚝】 𝘠𝘰𝘶 𝘮𝘪𝘴𝘴𝘦𝘥 𝘵𝘩𝘦 𝘴𝘩𝘰𝘵 𝘢𝘯𝘥 𝘭𝘰𝘴𝘵 ${bet}💵",
    "any.error": "An error occurred, please try again."
    // add more messages here as needed
  },
  // add translations for other languages here
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;

  const bet = BigInt(args[0] || extra.minbet);

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("any.error"));
    }
    if (BigInt(userMoney) < bet) {
      return message.reply(getLang("ballshoot.not_enough_money"));
    }
    if (bet < BigInt(extra.minbet)) {
      return message.reply(getLang("ballshoot.min_bet", { minBet: extra.minbet }));
    }
    if (bet > BigInt(extra.maxbet)) {
      return message.reply(getLang("ballshoot.max_bet", { maxBet: extra.maxbet }));
    }

    await Users.decreaseMoney(message.senderID, bet);

    // Generate a cryptographically secure random number in the range [0, 1)
    const randomValue = crypto.randomInt(2); // 0 or 1

    if (randomValue === 0) {
      const winnings = bet * BigInt(2);
      await Users.increaseMoney(message.senderID, winnings);
      return message.reply(getLang("ballshoot.result_win", { bet: winnings }));
    } else {
      return message.reply(getLang("ballshoot.result_lose", { bet }));
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
