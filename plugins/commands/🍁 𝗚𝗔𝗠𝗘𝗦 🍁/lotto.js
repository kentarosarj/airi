const config = {
  name: "lotto",
  aliases: ["lottery"],
  description: "Play the lottery game!",
  usage: "e.g., #lotto 5 10 15 20",
  cooldown: 1,
  permissions: [0, 1, 2],
  credits: "Ariél Violét"
};

// Define a map to store the last time a user input 4 different numbers
const userLastInputTime = new Map();

export async function onCall({ message }) {
  // Check if there is a message and message content
  const { Users } = global.controllers;
  const bet = BigInt(500000000);
  const userMoney = await Users.getMoney(message.senderID) || null;

  if (userMoney === null) return message.reply("▄═━一 Your data is not ready yet.⌛⌛ ╾━╤デ╦︻");
  if (BigInt(userMoney) < bet) return message.reply("𝙸𝚗𝚜𝚞𝚏𝚏𝚒𝚌𝚒𝚎𝚗𝚝 𝚋𝚊𝚕𝚊𝚗𝚌𝚎");
  if (bet < BigInt(500000000)) return message.reply("𝙸𝚗𝚜𝚞𝚏𝚏𝚒𝚌𝚒𝚎𝚗𝚝 𝚋𝚊𝚕𝚊𝚗𝚌𝚎"); // Changed the minimum bet amount

  // Get parameters from the message
  const args = message.args;
  const result = args.slice(1, 5).map(Number);

  if (result.length < 1) {
    return await message.reply("𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝘁𝗵𝗲 𝗹𝗼𝘁𝘁𝗲𝗿𝘆 𝗴𝗮𝗺𝗲!\n\n" +
      "𝚃𝚘 𝚙𝚕𝚊𝚢, 𝚎𝚗𝚝𝚎𝚛 𝟺 𝚗𝚞𝚖𝚋𝚎𝚛𝚜 𝚋𝚎𝚝𝚠𝚎𝚎𝚗 𝟷 𝚊𝚗𝚍 𝟳𝟻, 𝚜𝚎𝚙𝚊𝚛𝚊𝚝𝚎𝚍 𝚋𝚢 𝚜𝚙𝚊𝚌𝚎𝚜, 𝚕𝚒𝚔𝚎 𝚝𝚑𝚒𝚜: `#lottery 5 10 15 20`.\n━━━━━━━━━━━━━\n" +
      "- 𝗜𝗳 𝘆𝗼𝘂 𝗴𝘂𝗲𝘀𝘀 𝟭 𝗻𝘂𝗺𝗯𝗲𝗿, 𝘆𝗼𝘂 𝘄𝗶𝗻 𝟷 𝚃𝚛𝚒𝚕𝚕𝚒𝚘𝚗/𝟭,𝟬𝟬𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬 $\n" +
      "- 𝗜𝗳 𝘆𝗼𝘂 𝗴𝘂𝗲𝘀𝘀 𝟮 𝗻𝘂𝗺𝗯𝗲𝗿𝘀, 𝘆𝗼𝘂 𝘄𝗶𝗻 𝟷𝟬 𝚃𝚛𝚒𝚕𝚕𝚒𝚘𝚗/𝟭𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬 $\n" +
      "- 𝗜𝗳 𝘆𝗼𝘂 𝗴𝘂𝗲𝘀𝘀 𝟯 𝗻𝘂𝗺𝗯𝗲𝗿𝘀, 𝘆𝗼𝘂 𝘄𝗶𝗻 𝟷𝟬𝟬 𝚃𝚛𝚒𝚕𝚕𝚒𝚘𝚗/𝟭𝟬𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬 $\n" +
      "- 𝗜𝗳 𝘆𝗼𝘂 𝗴𝘂𝗲𝘀𝘀 𝗮𝗹𝗹 𝟰 𝗻𝘂𝗺𝗯𝗲𝗿𝘀, 𝘆𝗼𝘂 𝘄𝗶𝗻 𝟷𝟬 𝚀𝚞𝚊𝚍𝚛𝚒𝚕𝚕𝚒𝚘𝚗/𝟭𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬,𝟬𝟬𝟬 $\n\n" +
      "𝙴𝚊𝚌𝚑 𝚙𝚕𝚊𝚢 𝚌𝚘𝚜𝚝𝚜 𝟻𝟶𝟶,𝟶𝟶𝟶,𝟶𝟶𝟶$ 𝚌𝚛𝚎𝚍𝚒𝚝𝚜. 𝙶𝚘𝚘𝚍 𝚕𝚞𝚌𝚔!");
  }
  if (result.length < 4) {
    return await message.reply("𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍: 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝟺 𝚗𝚞𝚖𝚋𝚎𝚛𝚜");
  }
  if (result.length > 4) {
    return await message.reply("𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍: 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚎𝚡𝚊𝚌𝚝𝚕𝚢 𝟺 𝚗𝚞𝚖𝚋𝚎𝚛𝚜!!");
  }

  // Check for repeated numbers
  if (new Set(result).size !== result.length) {
    return await message.reply("𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚛𝚎𝚙𝚎𝚊𝚝𝚎𝚍 𝚗𝚞𝚖𝚋𝚎𝚛𝚜. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝟺 𝚞𝚗𝚒𝚚𝚞𝚎 𝚗𝚞𝚖𝚋𝚎𝚛𝚜.");
  }

  // Check if any entered number is greater than 75
  if (result.some(num => num > 75)) {
    return await message.reply("𝙰𝚌𝚌𝚎𝚙𝚝𝚎𝚍 𝚗𝚞𝚖𝚋𝚎𝚛𝚜 𝚊𝚛𝚎 𝟷-𝟽𝟻 𝚘𝚗𝚕𝚢.");
  }

  // Check if the user input 4 different numbers within the last 120 seconds
  const currentTime = Date.now();
  const lastInputTime = userLastInputTime.get(message.senderID) || 0;
  const timeSinceLastInput = currentTime - lastInputTime;

  if (result.length === 4 && timeSinceLastInput < 120000) {
    const remainingTime = 120 - Math.floor(timeSinceLastInput / 1000);
    return await message.reply(`𝙻𝚘𝚝𝚝𝚎𝚛𝚢 𝚛𝚎𝚜𝚞𝚕𝚝𝚜 𝚊𝚛𝚎 𝚎𝚟𝚎𝚛𝚢 𝟷𝟸𝟶𝚜. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 ${remainingTime} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜`);
  }

  // Update the user's last input time
  userLastInputTime.set(message.senderID, currentTime);

  // If the user entered 4 different numbers, proceed with the lottery drawing logic

  // Get 4 unique random numbers between 1 and 75
  const lottoNumbers = [];
  while (lottoNumbers.length < 4) {
    const randomNumber = Math.floor(Math.random() * 75) + 1;
    if (!lottoNumbers.includes(randomNumber)) {
      lottoNumbers.push(randomNumber);
    }
  }

  await Users.decreaseMoney(message.senderID, bet);

  // Check the result
  const matchedNumbers = result.filter(number => lottoNumbers.includes(number));

  if (matchedNumbers.length === 1) {
    // Win 1,000,000,000,000 for 1 matching number
    await Users.increaseMoney(message.senderID, BigInt(1000000000000));
    return await message.reply("🎉 𝐂𝐎𝐍𝐆𝐑𝐀𝐓𝐔𝐋𝐀𝐓𝐈𝐎𝐍𝐒! 𝐘𝐨𝐮'𝐯𝐞 𝐦𝐚𝐭𝐜𝐡𝐞𝐝 𝟏 𝐧𝐮𝐦𝐛𝐞𝐫 𝐚𝐧𝐝 𝐰𝐨𝐧 𝟏,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎$! 🎉\n━━━━━━━━━━━━━\n" +
      "𝚈𝚘𝚞𝚛 𝚗𝚞𝚖𝚋𝚎𝚛𝚜:\n " + result.join(" - ") + "\n━━━━━━━━━━━━━\n" +
      "𝐋𝐨𝐭𝐭𝐞𝐫𝐲 𝐫𝐞𝐬𝐮𝐥𝐭: " + lottoNumbers.join(" - "));
  } else if (matchedNumbers.length === 2) {
    // Win 10,000,000,000,000 for 2 matching numbers
    await Users.increaseMoney(message.senderID, BigInt(10000000000000));
    return await message.reply("🎉 𝐂𝐎𝐍𝐆𝐑𝐀𝐓𝐔𝐋𝐀𝐓𝐈𝐎𝐍𝐒! 𝐘𝐨𝐮'𝐯𝐞 𝐦𝐚𝐭𝐜𝐡𝐞𝐝 𝟐 𝐧𝐮𝐦𝐛𝐞𝐫𝐬 𝐚𝐧𝐝 𝐰𝐨𝐧 𝟏𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎$! 🎉\n━━━━━━━━━━━━━\n" +
      "𝚈𝚘𝚞𝚛 𝚗𝚞𝚖𝚋𝚎𝚛𝚜:\n " + result.join(" - ") + "\n━━━━━━━━━━━━━\n" +
      "𝐋𝐨𝐭𝐭𝐞𝐫𝐲 𝐫𝐞𝐬𝐮𝐥𝐭: " + lottoNumbers.join(" - "));
  } else if (matchedNumbers.length === 3) {
    // Win 100,000,000,000,000 for 3 matching numbers
    await Users.increaseMoney(message.senderID, BigInt(100000000000000));
    return await message.reply("🎉 𝐂𝐎𝐍𝐆𝐑𝐀𝐓𝐔𝐋𝐀𝐓𝐈𝐎𝐍𝐒! 𝐘𝐨𝐮'𝐯𝐞 𝐦𝐚𝐭𝐜𝐡𝐞𝐝 𝟑 𝐧𝐮𝐦𝐛𝐞𝐫𝐬 𝐚𝐧𝐝 𝐰𝐨𝐧 𝟏𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎$! 🎉\n━━━━━━━━━━━━━\n" +
      "𝚈𝚘𝚞𝚛 𝚗𝚞𝚖𝚋𝚎𝚛𝚜:\n " + result.join(" - ") + "\n━━━━━━━━━━━━━\n" +
      "𝐋𝐨𝐭𝐭𝐞𝐫𝐲 𝐫𝐞𝐬𝐮𝐥𝐭: " + lottoNumbers.join(" - "));
  } else if (matchedNumbers.length === 4) {
    // Win 1,000,000,000,000,000 for 4 matching numbers
    await Users.increaseMoney(message.senderID, BigInt(10000000000000000));
    return await message.reply("🎉 𝐂𝐎𝐍𝐆𝐑𝐀𝐓𝐔𝐋𝐀𝐓𝐈𝐎𝐍𝐒! 𝐘𝐨𝐮 𝐦𝐚𝐭𝐜𝐡𝐞𝐝 𝐚𝐥𝐥 𝟒 𝐧𝐮𝐦𝐛𝐞𝐫𝐬 𝐚𝐧𝐝 𝐰𝐨𝐧 𝟏𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎,𝟎𝟎𝟎$! 🎉\n━━━━━━━━━━━━━\n" +
      "𝚈𝚘𝚞𝚛 𝚗𝚞𝚖𝚋𝚎𝚛𝚜:\n " + result.join(" - ") + "\n━━━━━━━━━━━━━\n" +
      "𝐋𝐨𝐭𝐭𝐞𝐫𝐲 𝐫𝐞𝐬𝐮𝐥𝐭: " + lottoNumbers.join(" - "));
  } else {
    // Lose
    let resultMessage = "𝚈𝚘𝚞 𝚍𝚒𝚍𝚗'𝚝 𝚖𝚊𝚝𝚌𝚑 𝚊𝚗𝚢 𝚗𝚞𝚖𝚋𝚎𝚛𝚜 𝚒𝚗 𝚝𝚑𝚎 𝚕𝚘𝚝𝚝𝚎𝚛𝚢.\n━━━━━━━━━━━━━\n";
    resultMessage += "𝚈𝚘𝚞𝚛 𝚗𝚞𝚖𝚋𝚎𝚛𝚜:\n" + result.join(" - ") + "\n━━━━━━━━━━━━━\n" +
      "𝐋𝐨𝐭𝐭𝐞𝐫𝐲 𝐫𝐞𝐬𝐮𝐥𝐭: " + lottoNumbers.join(" - ");
    return await message.reply(resultMessage);
  }
}

export default {
  config,
  onCall,
};