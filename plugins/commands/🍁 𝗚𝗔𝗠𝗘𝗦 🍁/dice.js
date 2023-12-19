const config = {
  name: "dice",
  _name: {
    "en_US": "dice"
  },
  aliases: ["rolldice", "roll"],
  description: "Roll the dice game with the bot.",
  usage: "roll [bet] (default bet is 50)",
  credits: "Ariél Violét",
  extra: {
    minbet: 50
  }
};

const langData = {
  "en_US": {
    "rolldice.userNoData": "Your data is not ready yet.",
    "rolldice.notEnoughMoney": "Not enough money.",
    "rolldice.minMoney": "Minimum bet is ${50}💵",
    "rolldice.result": "🎲 The dice landed on【{result}】, {message}",
    "rolldice.win": "🎉 Congratulations! You won ${money}💵",
    "rolldice.lose": "You lost ${money}💵",
    "any.error": "An error has occurred, please try again later."
  }
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;
  const bet = BigInt(args[0] || extra.minbet);
  const choice = Math.floor(Math.random() * 6) + 1; // Roll the dice

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) return message.reply(getLang("rolldice.userNoData"));
    if (BigInt(userMoney) < bet) return message.reply(getLang("rolldice.notEnoughMoney"));
    if (bet < BigInt(extra.minbet)) return message.reply(getLang("rolldice.minMoney", { min: extra.minbet }));

    await Users.decreaseMoney(message.senderID, bet);

    let winMessage = "";

    if (choice >= 4 && choice <= 6) {
      await Users.increaseMoney(message.senderID, bet * BigInt(2));
      winMessage = getLang("rolldice.win", { money: String(bet) });
    } else {
      await Users.increaseMoney(message.senderID, BigInt(0)); // User loses, no money added
      winMessage = getLang("rolldice.lose", { money: String(bet) });
    }

    const resultMessage = getLang("rolldice.result", { result: choice, message: winMessage });
    message.reply(resultMessage);
  } catch (error) {
    console.error(error);
    return message.reply(getLang("any.error"));
  }
}

export default {
  config,
  langData,
  onCall
};
    