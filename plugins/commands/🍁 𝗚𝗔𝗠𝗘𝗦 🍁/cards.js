import axios from "axios";

const config = {
  name: "card",
  aliases: ["cards"],
  description: "Scratch cards with bots and bet money",
  usage: "<bet amount>",
  cooldown: 15,
  permissions: [0, 1, 2],
  credits: "WaifuCat",
  extra: {}
};

const cards = [
  "A♥",
  "2♥",
  "3♥",
  "4♥",
  "5♥",
  "6♥",
  "7♥",
  "8♥",
  "9♥",
  "10♥",
  "J♥",
  "Q♥",
  "K♥",
  "A♠",
  "2♠",
  "3♠",
  "4♠",
  "5♠",
  "6♠",
  "7♠",
  "8♠",
  "9♠",
  "10♠",
  "J♠",
  "Q♠",
  "K♠",
  "A♦",
  "2♦",
  "3♦",
  "4♦",
  "5♦",
  "6♦",
  "7♦",
  "8♦",
  "9♦",
  "10♦",
  "J♦",
  "Q♦",
  "K♦",
  "A♣",
  "2♣",
  "3♣",
  "4♣",
  "5♣",
  "6♣",
  "7♣",
  "8♣",
  "9♣",
  "10♣",
  "J♣",
  "Q♣",
  "K♣",
];

const cardValues = {
  "A": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  "J": 10,
  "Q": 10,
  "K": 10
};

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  const amount = parseInt(args[0]);

  if (isNaN(amount) || amount <= 0) {
    return message.reply("𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝.");
  }

  const userBalance = await Users.getMoney(message.senderID);

  if (userBalance == null || userBalance < amount) {
    return message.reply("𝙸𝚗𝚜𝚞𝚏𝚏𝚒𝚌𝚒𝚎𝚗𝚝 𝚋𝚊𝚕𝚊𝚗𝚌𝚎 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚎 𝚋𝚎𝚝.");
  }

  const userCards = cards.sort(() => 0.5 - Math.random()).slice(0, 3);
  const botCards = cards.sort(() => 0.5 - Math.random()).slice(0, 3);

  const userScore = calculateScore(userCards);
  const botScore = calculateScore(botCards);

  let result;
  if (userScore > botScore) {
    result = "Win";
  } else if (userScore === botScore) {
    result = "Tie";
  } else {
    result = "Lose";
  }

  let winnings = 0;
  if (result === "Win") {
    winnings = amount;
  } else if (result === "Lose") {
    winnings = -amount;
  }

  await Users.increaseMoney(message.senderID, winnings);

  const response = `𝗬𝗼𝘂𝗿 𝗰𝗮𝗿𝗱𝘀: ${userCards.join(", ")} - 𝘛𝘰𝘵𝘢𝘭 𝘴𝘤𝘰𝘳𝘦: ${userScore}\n𝗕𝗼𝘁'𝘀 𝗰𝗮𝗿𝗱𝘀: ${botCards.join(", ")} - 𝘛𝘰𝘵𝘢𝘭 𝘴𝘤𝘰𝘳𝘦: ${botScore}\n𝗥𝗲𝘀𝘂𝗹𝘁: ${result}\n${winnings > 0 ? `━━━━━━━━━━━━━━━\n― 𝚈𝚘𝚞 𝚠𝚘𝚗 $${winnings}! 💵` : winnings < 0 ? `━━━━━━━━━━━━━━━\n― 𝚈𝚘𝚞 𝚕𝚘𝚜𝚝 $${Math.abs(winnings)}. 💸` : "𝙸𝚝'𝚜 𝚊 𝚝𝚒𝚎."}`;

  message.reply(response);
}

function calculateScore(cards) {
  return cards.reduce((total, card) => {
    const value = cardValues[card.slice(0, -1)];
    return total + value;
  }, 0);
}

export default {
  config,
  onCall
};
