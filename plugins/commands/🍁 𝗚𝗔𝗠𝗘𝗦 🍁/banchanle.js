import axios from 'axios';

const config = {
  name: "even-odd",
  aliases: ["eo"],
  description: "Play even-odd with multiplayer.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Sies",

}

const { api } = global;
async function onCall({ message, args, getLang, extra, data, userPermissions, prefix }) {
  // Do something
  try {
    const { senderID, threadID, messageID, body, send, reply, react } = message;
    const { Users } = global.controllers
    global.chanle || (global.chanle = new Map);
    var bcl = global.chanle.get(message.threadID);
    const anhbcl = (await axios.get("https://i.imgur.com/u7jZ2Js.jpg", {
      responseType: "stream"
    })).data;
    switch (args[0]) {
      case "create":
      case "new":
      case "-c": {
        if (!args[1] || isNaN(args[1])) return global.api.sendMessage("[SIES-WARN ⚠] » You need to enter a reservation amount!", message.threadID, message.messageID);
        if (parseInt(args[1]) < 500) return global.api.sendMessage("[SIES-WARN ⚠] » Amount must be greater than or equal to 500!", message.threadID, message.messageID);
        const userMoney = await Users.getMoney(message.senderID) || null;
        if (userMoney < parseInt(args[1])) return global.api.sendMessage(`[SIES-WARN ⚠] » You don't have enough ${args[1]} to create a new game table!`, message.threadID, message.messageID);
        if (global.chanle.has(message.threadID)) return global.api.sendMessage("[SIES-WARN ⚠] » This group has opened the game table!", message.threadID, message.messageID);
        const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
        return global.chanle.set(message.threadID, {
          box: message.threadID,
          start: !1,
          author: message.senderID,
          player: [{
            name: name,
            userID: message.senderID,
            choose: {
              status: !1,
              msg: null
            }
          }],
          money: parseInt(args[1])
        }), global.api.sendMessage("[SIES-NOTI] » Successfully created party room with bet amount: " + args[1], message.threadID)
      }
      case "join":
      case "-j": {
        if (!global.chanle.has(message.threadID)) return global.api.sendMessage("[SIES-WARN ⚠] » There are currently no game tables in this group!\n=> Please create a new game table to join!", message.threadID, message.messageID);
        if (1 == bcl.start) return global.api.sendMessage("[SIES-WARN ⚠] » This game table has already started!", message.threadID, message.messageID);
        const playerMoney = await Users.getMoney(message.senderID) || null;
        if (playerMoney < bcl.money) return global.api.sendMessage(`[SIES-WARN ⚠] » You don't have enough $ to join this game table! ${bcl.money}$`, message.threadID, message.messageID);
        const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
        if (bcl.player.find((player) => player.userID == message.senderID)) return global.api.sendMessage("You have now joined this game table!", message.threadID, message.messageID);
        return bcl.player.push({
          name: name,
          userID: message.senderID,
          choose: {
            stats: !1,
            msg: null
          }
        }), global.chanle.set(message.threadID, bcl), global.api.sendMessage(`[ SIES-NOTI ] » You have joined the game table!\n=> The current number of members is : ${bcl.player.length}`, message.threadID, message.messageID)
      }
      case "start":
      case "-s":
        return bcl ? bcl.author != message.senderID ? global.api.sendMessage("[SIES-WARN ⚠] » You are not the creator of this game board, so you cannot start the game", message.threadID, message.messageID) : bcl.player.length <= 1 ? global.api.sendMessage("[SIES-WARN ⚠] » Your game board doesn't have enough members to get started!", message.threadID, message.messageID) : 1 == bcl.start ? global.api.sendMessage("[SIES-WARN ⚠] » This game table has already started!", message.threadID, message.messageID) : (bcl.start = !0, global.chanle.set(message.threadID, bcl), global.api.sendMessage(`[SIES-NOTI ] » Game start\n\nNumber of members : ${bcl.player.length}\n\nPlease chat "Even" or "Odd" `, message.threadID)) : global.api.sendMessage("[SIES-WARN ⚠] » This group does not have any game tables yet!\n=> Please create a new game table to join!", message.threadID, message.messageID);
      case "end":
      case "-e":
        return bcl ? bcl.author != message.senderID ? global.api.sendMessage("[SIES-WARN ⚠] » You are not the creator of the game table, so you cannot delete the game table.", message.threadID, message.messageID) : (global.chanle.delete(message.threadID), global.api.sendMessage("[ SIES-NOTI ] » Deleted game board!", message.threadID, message.messageID)) : global.api.sendMessage("[SIES-WARN ⚠] » This group does not have any game tables yet!\n=> Please create a new game table to join!", message.threadID, message.messageID);
      case "leave":
      case "-l":
        if (!global.chanle.has(message.threadID)) return api.sendMessage('[SIES-WARN ⚠] » Currently there are no game tables for you to leave!', message.threadID, message.messageID);
        if (!bcl.player.find((player) => player.userID == message.senderID)) return api.sendMessage('[SIES-WARN ⚠] » You don’t have any games left!', threadID, messageID);
        if (bcl.start == true) return api.sendMessage('[SIES-WARN ⚠] » You didn’t see the game disappear just after starting!', threadID, messageID);
        if (bcl.author == message.senderID) {
          global.chanle.delete(message.threadID);
          const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
          return global.api.sendMessage('[SIES-NOTI ⚠] » ➣ <' + name + '> left the gaming table, their gaming table will be discounted!', message.threadID, message.messageID);
        }
        else {
          bcl.player.splice(bcl.player.findIndex((player) => player.userID == message.senderID), 1);
          global.chanle.set(message.threadID, bcl);
          const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
          global.api.sendMessage('[SIES-NOTI] » Mouse falls off the table!', message.threadID, message.messageID);
          return global.api.sendMessage('[ SIES-NOTI ] »➣ <' + name + '> left the gaming table!\n=> Their gaming table will be discounted. ' + bcl.player.length + ' Player ', message.threadID);
        }
        
      default:
        return global.api.sendMessage({
          body: "==【Multiplayer Odd and Even Play】==\n1. !eo -c/create <price> => To create a room.\n2. !eo -j/join => Join to enter the room. \n3. !eo -s/start => To start the game.\n4. !eo -l/leave => To leave the game.\n5. !eo -e/end => To end the game.",
          attachment: anhbcl
        }, message.threadID, message.messageID)
    }
  } catch (e) {
    message.send("Error :", e);
    console.error(e);
  }

}


export default {
  config,
  onCall
}

// or
// export {
//     config,
//     langData,
//     onCall
// }