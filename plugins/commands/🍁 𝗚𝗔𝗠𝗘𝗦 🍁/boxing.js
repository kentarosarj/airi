import axios from 'axios';

const config = {
  name: "boxing",
  aliases: ["bx", "box"],
  description: "Play a boxing game with another player.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Dymyrius",
}

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  global.boxes || (global.boxes = new Map());
  const box = global.boxes.get(message.threadID);
  const boxing = (await axios.get("https://i.imgur.com/AmuVh7a.gif", {
    responseType: "stream"
  })).data;
  const ring = (await axios.get("https://i.imgur.com/OWd9m1i.jpg", {
    responseType: "stream"
  })).data;

  if (args[0] === "create") {
    if (box) {
      return global.api.sendMessage("[🥊 ⚠] » 𝙰 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚋𝚎𝚎𝚗 𝚌𝚛𝚎𝚊𝚝𝚎𝚍 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙.", message.threadID, message.messageID);
    }

    const betAmount = parseInt(args[1]);
    if (!betAmount || isNaN(betAmount) || betAmount < 500) {
      return global.api.sendMessage("[🥊 ⚠] » 𝚈𝚘𝚞 𝚗𝚎𝚎𝚍 𝚝𝚘 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝 (𝚖𝚒𝚗𝚒𝚖𝚞𝚖 𝟻𝟶𝟶$).", message.threadID, message.messageID);
    }

    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney < betAmount) {
      return global.api.sendMessage(`[🥊 ⚠] » 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚠𝚒𝚝𝚑 𝚊 𝚋𝚎𝚝 𝚘𝚏 ${betAmount}$.`, message.threadID, message.messageID);
    }

    // Deduct the bet amount from the user's money
    await Users.decreaseMoney(message.senderID, betAmount);

    const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
    global.boxes.set(message.threadID, {
      host: {
        name: name,
        userID: message.senderID,
        choose: null,
      },
      bet: betAmount,
      status: "waiting",
      players: 1,
    });

    return global.api.sendMessage(`[🥊ℹ] » 𝙱𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚌𝚛𝚎𝚊𝚝𝚎𝚍 𝚠𝚒𝚝𝚑 𝚊 𝚋𝚎𝚝 𝚘𝚏 ${betAmount}$. 𝚆𝚊𝚒𝚝𝚒𝚗𝚐 𝚏𝚘𝚛 𝚊𝚗𝚘𝚝𝚑𝚎𝚛 𝚙𝚕𝚊𝚢𝚎𝚛 𝚝𝚘 𝚓𝚘𝚒𝚗...`, message.threadID);
  }

  if (args[0] === "join") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("[🥊 ⚠] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚓𝚘𝚒𝚗.", message.threadID, message.messageID);
    }

    if (box.players >= 2) {
      return global.api.sendMessage("[🥊 ⚠] » 𝚃𝚑𝚎 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚏𝚞𝚕𝚕. 𝚈𝚘𝚞 𝚌𝚊𝚗𝚗𝚘𝚝 𝚓𝚘𝚒𝚗.", message.threadID, message.messageID);
    }

    if (box.host.userID === message.senderID) {
      return global.api.sendMessage("[🥊 ⚠] » 𝚈𝚘𝚞 𝚌𝚊𝚗𝚗𝚘𝚝 𝚓𝚘𝚒𝚗 𝚝𝚑𝚎 𝚛𝚒𝚗𝚐 𝚢𝚘𝚞'𝚟𝚎 𝚌𝚛𝚎𝚊𝚝𝚎𝚍.", message.threadID, message.messageID);
    }

    const betAmount = box.bet;
    const playerMoney = await Users.getMoney(message.senderID) || null;
    if (playerMoney < betAmount) {
      return global.api.sendMessage(`[🥊 ⚠] » 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚓𝚘𝚒𝚗 𝚝𝚑𝚒𝚜 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚠𝚒𝚝𝚑 𝚊 𝚋𝚎𝚝 𝚘𝚏 ${betAmount}$.`, message.threadID, message.messageID);
    }

    // Deduct the bet amount from the user's money
    await Users.decreaseMoney(message.senderID, betAmount);

    const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
    box.players += 1;
    box.player = {
      name: name,
      userID: message.senderID,
      choose: null,
    };
    global.boxes.set(message.threadID, box);

    return global.api.sendMessage(`[🥊ℹ] » ${name} 𝚑𝚊𝚜 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚎 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐. 𝚆𝚊𝚒𝚝𝚒𝚗𝚐 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚑𝚘𝚜𝚝 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎...`, message.threadID);
  }

  if (args[0] === "fight") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("[🥊 ⚠] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", message.threadID, message.messageID);
    }
  
    if (box.host.userID !== message.senderID) {
      return global.api.sendMessage("[🥊 ⚠] » 𝙾𝚗𝚕𝚢 𝚝𝚑𝚎 𝚑𝚘𝚜𝚝 𝚌𝚊𝚗 𝚜𝚝𝚊𝚛𝚝 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", message.threadID, message.messageID);
    }
  
    if (box.players !== 2) {
      return global.api.sendMessage("[🥊 ⚠] » 𝚃𝚑𝚎 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚖𝚞𝚜𝚝 𝚑𝚊𝚟𝚎 𝚎𝚡𝚊𝚌𝚝𝚕𝚢 𝟸 𝚙𝚕𝚊𝚢𝚎𝚛𝚜 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", message.threadID, message.messageID);
    }
  
    box.status = "playing";
    global.boxes.set(message.threadID, box);
  
    const choices = ["punch", "block"];
    const hostChoice = choices[Math.floor(Math.random() * choices.length)];
    const playerChoice = choices[Math.floor(Math.random() * choices.length)];
  
    box.host.choose = hostChoice;
    box.player.choose = playerChoice;
  
    global.api.sendMessage({
      body: `𝗧𝗵𝗲 𝗯𝗼𝘅𝗶𝗻𝗴 𝗺𝗮𝘁𝗰𝗵 𝗶𝘀 𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴!\n━━━━━━━━━━━━━━━\n${box.host.name} 𝗰𝗵𝗼𝘀𝗲: ` + hostChoice + `\n${box.player.name} 𝗰𝗵𝗼𝘀𝗲: ` + playerChoice,
      attachment: boxing,
    }, message.threadID, async (err, data) => {
      if (err) {
        return global.api.sendMessage("[🥊 ⚠] » 𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚍𝚒𝚜𝚙𝚕𝚊𝚢𝚒𝚗𝚐 𝚝𝚑𝚎 𝚛𝚎𝚜𝚞𝚕𝚝𝚜. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗.", message.threadID, message.messageID);
      }
  
      setTimeout(async function () {
        api.unsendMessage(data.messageID);
  
        let winnerName;
        let winnerID;
        let loserID;
        let betWon;
  
        if ((hostChoice === "punch" && playerChoice === "block") || (hostChoice === "block" && playerChoice === "punch")) {
          winnerName = box.host.name;
          winnerID = box.host.userID;
          loserID = box.player.userID;
          betWon = box.bet;
        } else {
          winnerName = box.player.name;
          winnerID = box.player.userID;
          loserID = box.host.userID;
          betWon = box.bet;
        }

        // Double the betWon for the winner
        betWon *= 2;
  
        // Increase the winner's money by the total bet amount
        await Users.increaseMoney(winnerID, betWon);
  
        // Deduct the total bet amount from the loser's money
        await Users.decreaseMoney(loserID, betWon);
  
        const resultMsg = `[🥊ℹ] » 𝚃𝚑𝚎 𝚏𝚒𝚐𝚑𝚝 𝚒𝚜 𝚘𝚟𝚎𝚛! ${winnerName} 𝚠𝚘𝚗 𝚊𝚗𝚍 𝚠𝚘𝚗 ₱${betWon}! 🪙`;
  
        global.api.sendMessage(resultMsg, message.threadID);
        global.boxes.delete(message.threadID);
      }, 4000);
    });
  }

  if (args[0] === "end") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("[🥊 ⚠] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚎𝚗𝚍 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", message.threadID, message.messageID);
    }

    if (box.host.userID !== message.senderID) {
      return global.api.sendMessage("[🥊 ⚠] » 𝙾𝚗𝚕𝚢 𝚝𝚑𝚎 𝚑𝚘𝚜𝚝 𝚌𝚊𝚗 𝚎𝚗𝚍 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", message.threadID, message.messageID);
    }

    global.api.sendMessage("[🥊ℹ] » 𝚃𝚑𝚎 𝚑𝚘𝚜𝚝 𝚑𝚊𝚜 𝚎𝚗𝚍𝚎𝚍 𝚝𝚑𝚎 𝚋𝚘𝚡𝚒𝚗𝚐 𝚛𝚒𝚗𝚐.", message.threadID);
    global.boxes.delete(message.threadID);
  }

  if (!args[0]) {
    global.api.sendMessage({
      body: "==【𝐁𝐨𝐱𝐢𝐧𝐠 𝐆𝐚𝐦𝐞】==\n1. /bx create <bet amount> => Create a boxing ring with a bet.\n2. /bx join => Join an existing boxing ring.\n3. /bx fight => Start the boxing match (only for the host).\n4. /bx end => End the boxing ring (only for the host).",
      attachment: ring, // Replace this with the URL of an image related to the boxing ring
    }, message.threadID);
  }
}

export default {
  config,
  onCall
}