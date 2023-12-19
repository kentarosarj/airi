import fetch from 'node-fetch';
import axios from 'axios';

const vegetables = [
  { name: 'Carrot', coinValue: getRandomValue(5000, 10000), emoji: '🥕' },
  { name: 'Tomato', coinValue: getRandomValue(7000, 12000), emoji: '🍅' },
  { name: 'Broccoli', coinValue: getRandomValue(8000, 15000), emoji: '🥦' },
  { name: 'Spinach', coinValue: getRandomValue(6000, 11000), emoji: '🍃' },
  { name: 'Pepper', coinValue: getRandomValue(9000, 16000), emoji: '🌶️' },
  { name: 'Cucumber', coinValue: getRandomValue(4000, 90000), emoji: '🥒' },
  { name: 'Zucchini', coinValue: getRandomValue(6000, 11000), emoji: '🥒' },
  { name: 'Lettuce', coinValue: getRandomValue(5000, 10000), emoji: '🥬' },
  { name: 'Onion', coinValue: getRandomValue(3000, 70000), emoji: '🧅' },
  { name: 'Potato', coinValue: getRandomValue(6000, 12000), emoji: '🥔' },
  { name: 'Eggplant', coinValue: getRandomValue(7000, 13000), emoji: '🍆' },
  { name: 'Corn', coinValue: getRandomValue(4000, 90000), emoji: '🌽' },
  { name: 'Radish', coinValue: getRandomValue(4000, 80000), emoji: '🍽️' },
  { name: 'Cabbage', coinValue: getRandomValue(7000, 13000), emoji: '🥬' },
  { name: 'Artichoke', coinValue: getRandomValue(8000, 15000), emoji: '🌿' },
  { name: 'Mushroom', coinValue: getRandomValue(5000, 10000), emoji: '🍄' },
  { name: 'Beetroot', coinValue: getRandomValue(6000, 11000), emoji: '🍠' },
  // Add even more vegetables here
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
  name: "harvest",
  aliases: ["h", "gather"],
  description: "Harvest vegetables and earn coins.",
  usage: "<text>",
  cooldown: 100,
  permissions: [0, 1, 2],
  credits: 'Rue',
  extra: {}
};

export async function onCall({ message, args, data }) {
  const { Users } = global.controllers;
  const harvest = (await axios.get("https://i.imgur.com/Kio12vS.gif", {
    responseType: "stream"
  })).data;
  try {
    const targetID = message.senderID;
    let totalAmount = 0;
    let harvestedData = [];

    for (let i = 0; i < 3; i++) {
      const randomVegetable = vegetables[Math.floor(Math.random() * vegetables.length)];

      const name = randomVegetable.name;
      const coin = randomVegetable.coinValue;
      const emoji = randomVegetable.emoji;

      totalAmount += coin;

      harvestedData.push({
        name: `Vegetable: ${name} ${emoji}`,
        coin: ` ${coin.toLocaleString()} coins`
      });
    }

    let replyMessage = `『 You've harvested 🗑️』\n`;
    for (let i = 0; i < harvestedData.length; i++) {
      replyMessage += `${harvestedData[i].name}: ${harvestedData[i].coin}\n`;
    }

    replyMessage += `💰 Total coins earned: ${totalAmount.toLocaleString()} coins 💰`;

    message.reply({
      body: replyMessage,
      attachment: harvest
    });

    await Users.increaseMoney(targetID, totalAmount);

  } catch (error) {
    console.error(error);
    message.reply('An error occurred while harvesting!');
  }
}

export default {
  config,
  onCall,
};
