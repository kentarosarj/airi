import fetch from 'node-fetch';
import axios from 'axios';

const recyclableMaterials = [
  { name: 'Phoenix Feather', emoji: '🔥', coinValue: getRandomValue(5000, 20000) },
  { name: 'Fairy Wings', emoji: '🍯', coinValue: getRandomValue(1000, 25000) },
  { name: 'Ancient Relic', emoji: '🏺', coinValue: getRandomValue(1500, 30000) },
  { name: 'Mystic Scroll', emoji: '📜', coinValue: getRandomValue(3000, 15000) },
  { name: 'Enchanted Sword', emoji: '⚔️', coinValue: getRandomValue(3000, 15000) },
  { name: 'Mermaid Pearl', emoji: '🧜‍♀️', coinValue: getRandomValue(3000, 15000) },
  { name: 'Crystal Orb', emoji: '🔮', coinValue: getRandomValue(3000, 15000) },
  { name: 'Emerald Idol', emoji: '🌿', coinValue: getRandomValue(3000, 15000) },
  { name: 'Golden Crown', emoji: '👑', coinValue: getRandomValue(3000, 15000) },
  { name: 'Jeweled', emoji: '💎', coinValue: getRandomValue(3000, 15000) },
  { name: 'Compass', emoji: '🧭', coinValue: getRandomValue(8000, 18000) },
  // Add more recyclable materials here
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
  name: "explore",
  aliases: ["e", "find"],
  description: "Explore a virtual world to find hidden treasures and earn rewards.",
  usage: "-e <text>",
  cooldown: 120,
  permissions: [0, 1, 2],
  credits: 'Margaux',
  extra: {}
};

export async function onCall({ message, args, data }) {
  const { Users } = global.controllers;
  const collect = (await axios.get("https://i.ibb.co/HBjv4p9/xva213.gif", {
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

    let replyMessage = `〘𝗬𝗼𝘂 𝗳𝗼𝘂𝗻𝗱 𝘁𝗿𝗲𝗮𝘀𝘂𝗿𝗲𝘀! 🗺️〙  \n`;
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
        