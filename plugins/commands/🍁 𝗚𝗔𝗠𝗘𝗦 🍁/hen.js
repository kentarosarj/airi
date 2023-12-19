import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "hen",
  aliases: ["egg"],
  description: "Buy hens, collect eggs, and sell your hens",
  usage: "<buy/check/collect/sell>",
  cooldown: 6,
  credits: "Ariél Violét"
};

const langData = {
  "en_US": {
    "hen.buySuccess": "𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬, 𝚢𝚘𝚞'𝚟𝚎 𝚋𝚘𝚞𝚐𝚑𝚝 𝚊 𝚑𝚎𝚗 🐔!",
    "hen.buyFailure": "𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚑𝚊𝚟𝚎 𝚊 𝚑𝚎𝚗. 𝚃𝚊𝚔𝚎 𝚌𝚊𝚛𝚎 𝚘𝚏 𝚒𝚝!",
    "hen.checkInfo": "𝐘𝐨𝐮𝐫 𝐡𝐞𝐧 𝐢𝐧𝐟𝐨:\n━━━━━━━━━━━━\n𝙴𝚐𝚐 𝚌𝚘𝚞𝚗𝚝: {eggCount} 🥚 \n𝚆𝚘𝚛𝚝𝚑: {collectedEggValue} 💰",
    "hen.collectSuccess": "𝚈𝚘𝚞 𝚌𝚘𝚕𝚕𝚎𝚌𝚝𝚎𝚍 {eggCount} 𝚎𝚐𝚐𝚜\n𝚆𝚘𝚛𝚝𝚑 {collectedValue}💰",
    "hen.sellSuccess": "𝚈𝚘𝚞 𝚜𝚘𝚕𝚍 𝚢𝚘𝚞𝚛 𝚑𝚎𝚗 𝚏𝚘𝚛 ${amount}. 𝙶𝚘𝚘𝚍𝚋𝚢𝚎, 𝚑𝚎𝚗 𝚏𝚛𝚒𝚎𝚗𝚍!🐔",
    "hen.noHen": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚊 𝚑𝚎𝚗. 𝚄𝚜𝚎 `𝚑𝚎𝚗 𝚋𝚞𝚢` 𝚝𝚘 𝚐𝚎𝚝 𝚘𝚗𝚎."
  }
};

let henOwners = new Map();
const EGG_INTERVAL = 8 * 60 * 1000; // Egg generation interval
const EGG_VALUE = 12345670;
const HEN_COST = 10000000;
const HEN_SELL_VALUE = 7500000;
const PATH = join(global.assetsPath, 'hen_owners.json');

function loadHenOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    henOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load hen owners:', err);
  }
}

function saveHenOwners() {
  try {
    const data = JSON.stringify([...henOwners]);
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save hen owners:', err);
  }
}
function calculateCollectedEggValue(eggCount) {
  return eggCount * EGG_VALUE;
}
function updateEggGeneration() {
  const currentTime = Date.now();
  henOwners.forEach((hen, ownerID) => {
    const elapsedTime = currentTime - hen.lastCollected;
    const eggCount = Math.floor(elapsedTime / EGG_INTERVAL);
    hen.eggCount += eggCount;
    hen.lastCollected = currentTime;
  });
}

loadHenOwners();

async function onCall({ message, getLang, args }) {
  const eggCollecting = (await axios.get("https://i.pinimg.com/564x/ac/f4/78/acf478df0337c976d3db91d13aeb348a.jpg", {
    responseType: "stream"
  })).data;
  const henImage = (await axios.get("https://i.pinimg.com/564x/ac/f4/78/acf478df0337c976d3db91d13aeb348a.jpg", {
    responseType: "stream"
  })).data;
  const { Users } = global.controllers;

  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;

  async function decreaseMoney(ownerID, amount) {
    await Users.decreaseMoney(ownerID, amount);
  }

  updateEggGeneration();

  if (args.length === 0 || args[0] === "menu") {
    return message.reply({
      body: "『🐔 𝐇𝐞𝐧 𝐄𝐠𝐠 𝐅𝐚𝐫𝐦𝐢𝐧𝐠 𝐆𝐚𝐦𝐞』\n1. `hen buy` » 𝚋𝚞𝚢 𝚊 𝚑𝚎𝚗.\n2. `hen check` » 𝚌𝚑𝚎𝚌𝚔 𝚢𝚘𝚞𝚛 𝚑𝚎𝚗'𝚜 𝚒𝚗𝚏𝚘.\n3. `hen collect` » 𝚌𝚘𝚕𝚕𝚎𝚌𝚝 𝚎𝚐𝚐𝚜 𝚏𝚛𝚘𝚖 𝚢𝚘𝚞𝚛 𝚑𝚎𝚗.\n4. `hen sell` » 𝚜𝚎𝚕𝚕 𝚢𝚘𝚞𝚛 𝚑𝚎𝚗 𝚊𝚗𝚍 𝚎𝚊𝚛𝚗 𝚖𝚘𝚗𝚎𝚢.",
      attachment: henImage
    });
  }

  if (args[0] === "buy") {
    if (henOwners.has(senderID)) {
      return message.reply(getLang("hen.buyFailure"));
    }

    const userBalance = await Users.getMoney(senderID);

    if (userBalance < HEN_COST) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚋𝚊𝚕𝚊𝚗𝚌𝚎 𝚝𝚘 𝚋𝚞𝚢 𝚊 𝚑𝚎𝚗.");
    }

    henOwners.set(senderID, {
      value: HEN_COST,
      eggCount: 0,
      lastCollected: Date.now()
    });

    await decreaseMoney(senderID, HEN_COST); // Decrease user's money
    saveHenOwners();

    return message.reply(getLang("hen.buySuccess"));
  }

  if (args[0] === "check") {
    if (!henOwners.has(senderID)) {
      return message.reply(getLang("hen.noHen"));
    }

    const henData = henOwners.get(senderID);
    const eggCount = henData.eggCount;
    const collectedEggValue = calculateCollectedEggValue(eggCount);

    const checkMessage = getLang("hen.checkInfo")
      .replace("{eggCount}", eggCount)
      .replace("{collectedEggValue}", collectedEggValue);
    return message.reply(checkMessage);
  }

if (args[0] === "collect") {
  if (!henOwners.has(senderID)) {
    return message.reply(getLang("hen.noHen"));
  }

  const henData = henOwners.get(senderID);
  const eggCount = henData.eggCount;

  if (eggCount === 0) {
    return message.reply("𝚈𝚘𝚞𝚛 𝚑𝚎𝚗 𝚑𝚊𝚜𝚗'𝚝 𝚕𝚊𝚒𝚍 𝚊𝚗𝚢 𝚎𝚐𝚐𝚜 𝚢𝚎𝚝.");
  }

  const collectedEggs = eggCount * EGG_VALUE;
  const collectedValue = calculateCollectedEggValue(eggCount);

  henData.eggCount = 0;
  saveHenOwners();

  await Users.increaseMoney(senderID, collectedValue);

  return message.reply({
    body: getLang("hen.collectSuccess")
      .replace("{eggCount}", eggCount)
      .replace("{collectedValue}", collectedValue),  // Add collectedValue to the response
    attachment: eggCollecting
  });
}


  if (args[0] === "sell") {
    if (!henOwners.has(senderID)) {
      return message.reply(getLang("hen.noHen"));
    }

    const henData = henOwners.get(senderID);
    const henValue = henData.value;

    await Users.increaseMoney(senderID, HEN_SELL_VALUE);
    henOwners.delete(senderID);
    saveHenOwners();

    return message.reply(getLang("hen.sellSuccess").replace("{amount}", HEN_SELL_VALUE));
  }

  return message.reply({
    body: "『 🐔 𝐇𝐞𝐧 𝐄𝐠𝐠 𝐅𝐚𝐫𝐦𝐢𝐧𝐠 𝐆𝐚𝐦𝐞 』\n━━━━━━━━━━━━\n1. `hen buy` » 𝚋𝚞𝚢 𝚊 𝚑𝚎𝚗.\n2. `hen check` » 𝚌𝚑𝚎𝚌𝚔 𝚢𝚘𝚞𝚛 𝚑𝚎𝚗'𝚜 𝚒𝚗𝚏𝚘.\n3. `hen collect` » 𝚌𝚘𝚕𝚕𝚎𝚌𝚝 𝚎𝚐𝚐𝚜 𝚏𝚛𝚘𝚖 𝚢𝚘𝚞𝚛 𝚑𝚎𝚗.\n4. `hen sell` » 𝚜𝚎𝚕𝚕 𝚢𝚘𝚞𝚛 𝚑𝚎𝚗 𝚊𝚗𝚍 𝚎𝚊𝚛𝚗 𝚖𝚘𝚗𝚎𝚢.",
  });
}

export default {
  config,
  langData,
  onCall
};