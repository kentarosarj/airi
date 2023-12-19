import fetch from 'node-fetch';
import axios from 'axios';

const recyclableMaterials = [
  { name: '𝙿𝚕𝚊𝚜𝚝𝚒𝚌 𝙱𝚘𝚝𝚝𝚕𝚎', emoji: '🥤', coinValue: getRandomValue(5000, 20000) },
  { name: '𝙶𝚕𝚊𝚜𝚜 𝙹𝚊𝚛', emoji: '🍯', coinValue: getRandomValue(1000, 25000) },
  { name: '𝙰𝚕𝚞𝚖𝚒𝚗𝚞𝚖 𝙲𝚊𝚗', emoji: '🥫', coinValue: getRandomValue(1500, 30000) },
  { name: '𝙿𝚊𝚙𝚎𝚛', emoji: '📄', coinValue: getRandomValue(3000, 15000) },
  { name: 'Glass bottles', emoji: '🍾', coinValue: getRandomValue(3000, 15000) },
  { name: 'Newspapers', emoji: '🗞️', coinValue: getRandomValue(3000, 15000) },
  { name: 'Magazines', emoji: '📰', coinValue: getRandomValue(3000, 15000) },
  { name: 'Cardstock', emoji: '📄', coinValue: getRandomValue(3000, 15000) },
  { name: 'Office paper', emoji: '📑', coinValue: getRandomValue(3000, 15000) },
  { name: 'Takeout containers', emoji: '🥡', coinValue: getRandomValue(3000, 15000) },
  { name: '𝙲𝚊𝚛𝚍𝚋𝚘𝚊𝚛𝚍', emoji: '📦', coinValue: getRandomValue(8000, 18000) },
  // Add more recyclable materials here
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
  name: "recycle",
  aliases: ["r", "collect"],
  description: "Collect recyclable materials and earn coins.",
  usage: "<text>",
  cooldown: 50,
  permissions: [0, 1, 2],
  credits: 'Rue',
  extra: {}
};

export async function onCall({ message, args, data }) {
  const { Users } = global.controllers;
  const collect = (await axios.get("https://i.imgur.com/pLkwIyn.gif", {
    responseType: "stream"
  })).data;
  try {
    const targetID = message.senderID;
    let totalAmount = 0;
    let collectedData = [];

    for (let i = 0; i < 3; i++) {
      const randomMaterial = recyclableMaterials[Math.floor(Math.random() * recyclableMaterials.length)];

      const name = randomMaterial.name;
      const emoji = randomMaterial.emoji;
      const coin = randomMaterial.coinValue;

      totalAmount += coin;

      collectedData.push({
        name: `Material: ${emoji} ${name}`,
        coin: ` ${coin.toLocaleString()} 𝚌𝚘𝚒𝚗𝚜`
      });
    }

    let replyMessage = `『𝚈𝚘𝚞'𝚟𝚎 𝚌𝚘𝚕𝚕𝚎𝚌𝚝𝚎𝚍 𝚛𝚎𝚌𝚢𝚌𝚕𝚊𝚋𝚕𝚎 𝚖𝚊𝚝𝚎𝚛𝚒𝚊𝚕𝚜』 \n`;
    for (let i = 0; i < collectedData.length; i++) {
      replyMessage += `✓ ${collectedData[i].name}: ${collectedData[i].coin}\n`;
    }

    replyMessage += `💰 Total coins earned: ${totalAmount.toLocaleString()} coins 💰`;

    message.reply({
      body: replyMessage,
      attachment: collect
    });

    await Users.increaseMoney(targetID, totalAmount);

  } catch (error) {
    console.error(error);
    message.reply('An error occurred while collecting recyclable materials!');
  }
}

export default {
  config,
  onCall,
};
