const config = {
  name: "topall",
  aliases: ["topallmoney", "topam"],
  description: "Shows all the top users with highest money.",
  usage: "",
  cooldown: 5,
  credits: "XaviaTeam",
};

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  let top = parseInt(args[0]) || 10;

  if (top > 100) top = 100;

  const allUsers = await Users.getAll();
  const topBalances = allUsers.filter((user) => user.data.money !== undefined)
    .sort((a, b) => b.data.money - a.data.money).slice(0, top);

  let messageToSend = "";
  topBalances.forEach((user, index) => {
    messageToSend += `【${index + 1}】 ${user.info.name}: $${Number(user.data.money).toLocaleString('en-US')}\n\n`;
  });

  const resultMessage = `💰『𝐓𝐎𝐏 ${top} 𝐑𝐈𝐂𝐇𝐄𝐒𝐓 𝐔𝐒𝐄𝐑𝐒』💰\n`;
  const response = `${resultMessage}\n${messageToSend}`;

  try {
    await message.reply(response);
  } catch (err) {
    console.error(err);
  }
}

export default {
  config,
  onCall,
}; 