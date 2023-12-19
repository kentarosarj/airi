import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "resort",
  aliases: [],
  description: "Manage your resort.",
  usage: "",
  cooldown: 5,
  credits: "Dymyrius"
};

const langData = {
  "en_US": {
    "resort.noResort": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝. 𝚄𝚜𝚎 `𝚛𝚎𝚜𝚘𝚛𝚝 𝚋𝚞𝚢` 𝚝𝚘 𝚐𝚎𝚝 𝚘𝚗𝚎.",
    "resort.buySuccess": "𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜! 𝚈𝚘𝚞'𝚟𝚎 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎𝚍 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝 𝚗𝚊𝚖𝚎𝚍 {resortName}!",
    "resort.buyFailure": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚌𝚛𝚎𝚍𝚒𝚝𝚜 𝚝𝚘 𝚋𝚞𝚢 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝.",
    "resort.menuOptions": "◦❭❯❱【𝐑𝐄𝐒𝐎𝐑𝐓 𝐌𝐄𝐍𝐔】❰❮❬◦\n\n𝖶𝖾𝗅𝖼𝗈𝗆𝖾 𝗍𝗈 𝗍𝗁𝖾 𝖢𝖺𝗌𝗂𝗇𝗈 𝖱𝖾𝗌𝗈𝗋𝗍 𝖬𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 𝖲𝗒𝗌𝗍𝖾𝗆! 🌴\n\n𝖦𝖾𝗍 𝗋𝖾𝖺𝖽𝗒 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺𝗇𝖽 𝗆𝖺𝗇𝖺𝗀𝖾 𝗒𝗈𝗎𝗋 𝖽𝗋𝖾𝖺𝗆 𝗋𝖾𝗌𝗈𝗋𝗍.\n\n𝖢𝗁𝗈𝗈𝗌𝖾 𝖺𝗇 𝗈𝗉𝗍𝗂𝗈𝗇:\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘣𝘶𝘺 <𝗇𝖺𝗆𝖾>` » 𝖯𝗎𝗋𝖼𝗁𝖺𝗌𝖾 𝖺 𝗇𝖾𝗐 𝗋𝖾𝗌𝗈𝗋𝗍.\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘤𝘩𝘦𝘤𝘬` » 𝖢𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝗌𝗍𝖺𝗍𝗎𝗌 𝗈𝖿 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍.\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘤𝘭𝘦𝘢𝘯` » 𝖢𝗅𝖾𝖺𝗇 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍.\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘶𝘱𝘨𝘳𝘢𝘥𝘦` » 𝖴𝗉𝗀𝗋𝖺𝖽𝖾 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍.\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘤𝘰𝘭𝘭𝘦𝘤𝘵` » 𝖢𝗈𝗅𝗅𝖾𝖼𝗍 𝗏𝖺𝗅𝗎𝖾 𝖿𝗋𝗈𝗆 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍.\n𝟨. `𝘳𝘦𝘴𝘰𝘳𝘵 𝘳𝘦𝘯𝘢𝘮𝘦 <𝗇𝖾𝗐𝖭𝖺𝗆𝖾>` » 𝖱𝖾𝗇𝖺𝗆𝖾 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍."
    // Add more translations if needed
  },
  // Add translations for other languages if needed
};

const resortImages = [
  "https://i.imgur.com/SOA08ZY.png",
  "https://i.imgur.com/TJjSR0b.jpg",
  "https://i.imgur.com/2rbIdig.jpg",
  "https://i.imgur.com/B4LfB3N.png",
  "https://i.imgur.com/rAp1ht1.png",
  "https://i.imgur.com/m0U81MX.jpg",
  "https://i.imgur.com/cAYBO5u.jpg",
  "https://i.imgur.com/TlA5ses.jpg",
  "https://i.imgur.com/hHIw2Ay.jpg",
  "https://i.imgur.com/Sgj79Gi.jpg",
  "https://i.imgur.com/ZoldXIQ.png",
  "https://i.imgur.com/CZD4GrY.jpg",
  "https://i.imgur.com/kJciB1v.jpg",
  "https://i.imgur.com/8dbenRw.png",
  "https://i.imgur.com/OHpHq2I.png",
  "https://i.imgur.com/54iBcHP.jpg",
  "https://i.imgur.com/Hgr4MDD.jpg",
  "https://i.imgur.com/qUqWSMD.jpg",
  "https://i.imgur.com/8LtPOT9.jpg",
  "https://i.imgur.com/zokGGXP.jpg",
  "https://i.imgur.com/OxfHFlI.jpg",
  "https://i.imgur.com/c3Q7gxt.jpg",
  "https://i.imgur.com/4KvBgkQ.jpg",
  "https://i.imgur.com/AJikYqr.jpg"
  // ... Add URLs for other levels
];

const valueIncreaseInterval = 7 * 60 * 1000; // 7 minutes in milliseconds
const cleanCooldownDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const maxResortLevel = 24; // Maximum level of the resort

setInterval(() => {
  for (const [userID, userResort] of userResorts.entries()) {
    const { valueIncrease, imageURL } = calculateResortValue(userResort.level);
    userResort.value = (userResort.value || 0) + valueIncrease;

    // Decrease cleanliness by 5% every 3 minutes
    const cleanlinessDecrease = 2; // Percentage to decrease
    userResort.cleanliness = Math.max(userResort.cleanliness - cleanlinessDecrease, 0);

    userResort.imageURL = imageURL; // Store the image URL in the user's resort object
  }

  const currentTime = Date.now();
  for (const [userID, lastCleanTime] of cleanlinessCooldowns.entries()) {
    if (currentTime - lastCleanTime >= cleanCooldownDuration) {
      cleanlinessCooldowns.delete(userID); // Reset cooldown
    }
  }

  saveUserData(); // Save the updated values
}, valueIncreaseInterval);

let cleanlinessCooldowns = new Map();
let userResorts = new Map();
const PATH = join(global.assetsPath, 'user_resorts.json');

function loadUserData() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    const parsedData = JSON.parse(data);

    userResorts = new Map(parsedData.userResorts.map(([userID, userData]) => {
      const { lastUpgradeTime = 0, ...restData } = userData;
      return [userID, { ...restData, name: restData.name || "", lastUpgradeTime }];
    }));
    cleanlinessCooldowns = new Map(parsedData.cleanlinessCooldowns);
  } catch (err) {
    console.error('Failed to load user resorts:', err);
  }
}

function saveUserData() {
  try {
    const data = JSON.stringify({
      userResorts: Array.from(userResorts).map(([userID, userData]) => {
        const { lastUpgradeTime, ...restData } = userData;
        return [userID, { ...restData, name: restData.name || "", lastUpgradeTime }];
      }),
      cleanlinessCooldowns: Array.from(cleanlinessCooldowns)
    });
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save user resorts:', err);
  }
}

function calculateResortValue(level) {
  const baseValue = level * 10000; // Base value for the resort based on level
  const valueIncrease = level * 3000 * level; // Increased value every 2 minutes based on level (incremental increase)
  const imageURL = resortImages[level - 1]; // Subtract 1 because levels are 1-based

  return { value: baseValue, valueIncrease, imageURL };
}

loadUserData();

async function onCall({ message, getLang, args }) {
  const { Users } = global.controllers;
  const resortimage = (await axios.get("https://i.imgur.com/kKP3G5t.png", {
    responseType: "stream"
  })).data;

  if (!message || !message.body) {
    console.error('𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚘𝚋𝚓𝚎𝚌𝚝 𝚘𝚛 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚋𝚘𝚍𝚢!');
    return;
  }

  const { senderID } = message;

  if (args.length === 0 || args[0] === "menu") {
    const menuOptions = getLang("resort.menuOptions");
    return message.reply({
      body: menuOptions,
      attachment: resortimage
    });
  }

  if (args[0] === "buy") {
    if (userResorts.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚘𝚠𝚗 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝. 𝙸𝚏 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚊 𝚗𝚎𝚠 𝚘𝚗𝚎, 𝚢𝚘𝚞 𝚌𝚊𝚗 𝚜𝚎𝚕𝚕 𝚢𝚘𝚞𝚛 𝚌𝚞𝚛𝚛𝚎𝚗𝚝 𝚛𝚎𝚜𝚘𝚛𝚝 𝚞𝚜𝚒𝚗𝚐 `resort sell`.");
    }

    const resortPrice = 1000000; // Price for purchasing a resort
    const userBalance = await Users.getMoney(senderID);

    if (userBalance < resortPrice) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚌𝚛𝚎𝚍𝚒𝚝𝚜 𝚝𝚘 𝚋𝚞𝚢 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝.");
    }

    if (args.length < 2) {
      return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚗𝚊𝚖𝚎 𝚏𝚘𝚛 𝚢𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝.");
    }

    const newResort = {
      name: args.slice(1).join(" "),
      level: 1,
      cleanliness: 100,
      value: calculateResortValue(1).value, // Access the 'value' property
      imageURL: resortImages[0] // Set the image URL for level 1
    };

    userResorts.set(senderID, newResort);
    saveUserData();

    await Users.decreaseMoney(senderID, resortPrice); // Deduct the purchase price
    const buySuccessMessage = `𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜! 𝚈𝚘𝚞'𝚟𝚎 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎𝚍 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝 𝚗𝚊𝚖𝚎𝚍 ${newResort.name}! 🏖`;
    const imageResponse = await axios.get(resortImages[0], {
      responseType: 'stream'
    });

    return message.reply({
      body: buySuccessMessage,
      attachment: imageResponse.data
    });
  }

  if (args[0] === "clean") {
    if (!userResorts.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝. 𝚄𝚜𝚎 `resort buy` 𝚝𝚘 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎 𝚘𝚗𝚎");
    }

    const cleanlinessCooldownDuration = 1 * 60 * 60 * 1000; // 1 hours in milliseconds
    const lastCleanTime = cleanlinessCooldowns.get(senderID) || 0;
    const currentTime = Date.now();

    if (currentTime - lastCleanTime < cleanlinessCooldownDuration) {
      const remainingCooldown = cleanlinessCooldownDuration - (currentTime - lastCleanTime);
      const remainingCooldownHours = Math.ceil(remainingCooldown / (60 * 60 * 1000));

      return message.reply(`𝚈𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚌𝚕𝚎𝚊𝚗. 𝙸𝚝 𝚌𝚊𝚗 𝚋𝚎 𝚌𝚕𝚎𝚊𝚗𝚎𝚍 𝚊𝚐𝚊𝚒𝚗 𝚒𝚗 ${remainingCooldownHours} 𝚑𝚘𝚞𝚛. ⏱`);
    }

    // Set the last clean time and reset cleanliness
    cleanlinessCooldowns.set(senderID, currentTime);
    userResorts.get(senderID).cleanliness = 100;
    saveUserData();

    return message.reply("𝚈𝚘𝚞'𝚟𝚎 𝚌𝚕𝚎𝚊𝚗𝚎𝚍 𝚢𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝! 𝙸𝚝'𝚜 𝚗𝚘𝚠 𝚜𝚙𝚊𝚛𝚔𝚕𝚒𝚗𝚐 𝚌𝚕𝚎𝚊𝚗. 🧹");
  }

  if (args[0] === "check") {
    if (!userResorts.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝. 𝚄𝚜𝚎 `resort buy` 𝚝𝚘 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎 𝚘𝚗𝚎.");
    }

    const userResort = userResorts.get(senderID);
    const resortCleanliness = userResort.cleanliness; // Retrieve the actual cleanliness value

    const resortStatusMessage = `🏨 𝗥𝗲𝘀𝗼𝗿𝘁 𝗡𝗮𝗺𝗲: ${userResort.name}\n⬆️ 𝗥𝗲𝘀𝗼𝗿𝘁 𝗟𝗲𝘃𝗲𝗹: ${userResort.level}\n🧹 𝗖𝗹𝗲𝗮𝗻𝗹𝗶𝗻𝗲𝘀𝘀: ${resortCleanliness}%\n📈 𝗜𝗻𝗰𝗼𝗺𝗲: ₱${userResort.value}`;

    if (userResort.imageURL) {
      const imageResponse = await axios.get(userResort.imageURL, {
        responseType: "stream"
      });

      return message.reply({
        body: resortStatusMessage,
        attachment: imageResponse.data
      });
    } else {
      return message.reply(resortStatusMessage);
    }
  }

  if (args[0] === "upgrade") {
    if (!userResorts.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝. 𝚄𝚜𝚎 `resort buy` 𝚝𝚘 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎 𝚘𝚗𝚎.");
    }

    const userResort = userResorts.get(senderID);
    const currentLevel = userResort.level;

    if (currentLevel >= maxResortLevel) {
      return message.reply("𝚈𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚊𝚝 𝚝𝚑𝚎 𝚖𝚊𝚡𝚒𝚖𝚞𝚖 𝚕𝚎𝚟𝚎𝚕.");
    }

    const currentTime = Date.now(); // Get the current time

    // Calculate the time that must pass before the user can upgrade again
    const timeSinceLastUpgrade = currentTime - (userResort.lastUpgradeTime || 0);
    const upgradeCooldownDuration = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

    if (timeSinceLastUpgrade < upgradeCooldownDuration) {
      const remainingCooldown = upgradeCooldownDuration - timeSinceLastUpgrade;
      const remainingCooldownHours = Math.ceil(remainingCooldown / (60 * 60 * 1000));

      return message.reply(`𝚈𝚘𝚞 𝚌𝚊𝚗'𝚝 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚢𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝 𝚢𝚎𝚝. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 ${remainingCooldownHours} 𝚑𝚘𝚞𝚛𝚜 𝚋𝚎𝚏𝚘𝚛𝚎 𝚞𝚙𝚐𝚛𝚊𝚍𝚒𝚗𝚐 𝚊𝚐𝚊𝚒𝚗. ⏱`);
    }

    // Calculate upgrade price
    const baseUpgradePrice = 50000; // Base price for upgrading the resort
    const upgradeMultiplier = 2 ** (currentLevel - 1); // Calculate the multiplier based on current level
    const upgradePrice = baseUpgradePrice * upgradeMultiplier;

    const userBalance = await Users.getMoney(senderID);

    if (userBalance < upgradePrice) {
      return message.reply(`𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚌𝚛𝚎𝚍𝚒𝚝𝚜 𝚝𝚘 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚢𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝. 𝚃𝚑𝚎 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚌𝚘𝚜𝚝𝚜 ${upgradePrice}.`);
    }

    // Deduct the balance
    try {
      await Users.decreaseMoney(senderID, upgradePrice);
    } catch (error) {
      console.error('Failed to deduct balance:', error);
      return message.reply("𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚍𝚎𝚍𝚞𝚌𝚝𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚋𝚊𝚕𝚊𝚗𝚌𝚎.");
    }

    const nextLevel = Math.min(currentLevel + 1, maxResortLevel); // Increment the level by 1 or up to the maximum level
    const { value: nextValue, imageURL: nextImageURL } = calculateResortValue(nextLevel);

    userResort.level = nextLevel;
    userResort.value = nextValue; // Update the value directly
    userResort.lastUpgradeTime = currentTime; // Update the lastUpgradeTime
    userResort.imageURL = nextImageURL; // Update the imageURL

    saveUserData();

    const upgradeSuccessMessage = `𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜! 𝚈𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚞𝚙𝚐𝚛𝚊𝚍𝚎𝚍 𝚝𝚘 𝚕𝚎𝚟𝚎𝚕 ${nextLevel}. 𝙸𝚝𝚜 𝚟𝚊𝚕𝚞𝚎 𝚑𝚊𝚜 𝚒𝚗𝚌𝚛𝚎𝚊𝚜𝚎𝚍 𝚝𝚘 ₱${nextValue}. 𝚃𝚑𝚎 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚌𝚘𝚜𝚝 𝚢𝚘𝚞 ₱${upgradePrice}. ⬆`;

    if (nextLevel === maxResortLevel) {
      return message.reply(upgradeSuccessMessage + "𝚈𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝 𝚒𝚜 𝚗𝚘𝚠 𝚊𝚝 𝚝𝚑𝚎 𝚖𝚊𝚡𝚒𝚖𝚞𝚖 𝚕𝚎𝚟𝚎𝚕!");
    }

    return message.reply(upgradeSuccessMessage);
  }

  if (args[0] === "collect") {
    if (!userResorts.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝. 𝚄𝚜𝚎 `resort buy` 𝚝𝚘 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎 𝚘𝚗𝚎.");
    }

    const userResort = userResorts.get(senderID);
    const collectedAmount = userResort.value;

    if (collectedAmount <= 0) {
      return message.reply("𝚃𝚑𝚎𝚛𝚎'𝚜 𝚗𝚘 𝚟𝚊𝚕𝚞𝚎 𝚝𝚘 𝚌𝚘𝚕𝚕𝚎𝚌𝚝 𝚏𝚛𝚘𝚖 𝚢𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝.");
    }

    await Users.increaseMoney(senderID, collectedAmount);
    userResort.value = 0; // Reset the collected value
    saveUserData();

    const collectMessage = `𝚈𝚘𝚞'𝚟𝚎 𝚌𝚘𝚕𝚕𝚎𝚌𝚝𝚎𝚍 ₱${collectedAmount} 𝚟𝚊𝚕𝚞𝚎 𝚏𝚛𝚘𝚖 𝚢𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝! 💰`; // Using collectedAmount as a number
    return message.reply(collectMessage);
  }

  if (args[0] === "rename") {
    if (!userResorts.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝. 𝚄𝚜𝚎 `resort buy` 𝚝𝚘 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎 𝚘𝚗𝚎");
    }

    if (args.length < 2) {
      return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚗𝚎𝚠 𝚗𝚊𝚖𝚎 𝚏𝚘𝚛 𝚢𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝.");
    }

    const newResortName = args.slice(1).join(" ");
    userResorts.get(senderID).name = newResortName;
    saveUserData();

    return message.reply(`𝚈𝚘𝚞𝚛 𝚛𝚎𝚜𝚘𝚛𝚝 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚛𝚎𝚗𝚊𝚖𝚎𝚍 𝚝𝚘 "${newResortName}". 🏨`);
  }

  // If the command is not recognized, show the menu
  const menuOptions = getLang("resort.menuOptions");
  return message.reply(menuOptions);
}

export default {
  config,
  langData,
  onCall
};