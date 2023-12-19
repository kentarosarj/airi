const config = {
  name: "top",
  aliases: ["topgc", "gctop"],
  description: "Shows top richest users in group chat.",
  usage: "",
  cooldown: 10,
  permissions: [0, 1, 2],
  credits: "TakiUwU && Isai"
};

const langData = {
  "en_US": {
    "topMoney": "💰『𝐓𝐎𝐏 {numUsers} 𝐑𝐈𝐂𝐇𝐄𝐒𝐓 𝐔𝐒𝐄𝐑𝐒 𝐈𝐍 𝐆𝐂』💰\n{topMoney}"
  }
};

async function onCall({ message, getLang, db, args }) {
  const { threadID, participantIDs } = message;
  let query = args.join(" ");
  try {
    const users = Array.from(global.data.users.values());
    const threadusers = users.filter(obj => participantIDs.includes(obj.userID));
    let topUsers = '';
    const numUsers = Math.min(threadusers.length, 10);
    if (query === 'global') {
      topUsers = users.sort((a, b) => (b.data.money || 0) - (a.data.money || 0)).slice(0, numUsers);
    } else {
     topUsers = threadusers.sort((a, b) => (b.data.money || 0) - (a.data.money || 0)).slice(0, numUsers);
    }
    const topMoney = topUsers.map((user, index) => `【${index + 1}】 ${global.data.users.get(user.userID)?.info?.name}: $${Number(user.data.money || 0).toLocaleString()}`).join("\n\n");
    const formattedTopMoney = getLang("topMoney", { numUsers, topMoney });
    return message.reply(formattedTopMoney);
  } catch (e) {
    console.error(e);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
};