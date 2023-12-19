import axios from 'axios';

const config = {
  name: "mathquiz",
  aliases: ["mq"],
  description: "Answer a challenging math question to win money.",
  usage: "",
  cooldown: 10,
  credits: "Rue"
};

async function onCall({ message, args, getLang }) {
  const { Users } = global.controllers;
  const userBet = parseInt(args[0]);

  if (isNaN(userBet) || userBet <= 0) {
    return message.reply("Please enter a valid bet amount.");
  }

  if (userBet > 5000000) {
    return message.reply("The maximum bet is 50,000,00$.");
  }
  
  const userBalance = await Users.getMoney(message.senderID);

  if (userBalance < userBet) {
    return message.reply("You don't have enough money to place this bet.");
  }

  await Users.decreaseMoney(message.senderID, userBet);

  // Generate a random math question
  const randomNumber1 = Math.floor(Math.random() * 100);
  const randomNumber2 = Math.floor(Math.random() * 100);
  const operators = ['+', '-', '*', '/'];
  const randomOperator = operators[Math.floor(Math.random() * operators.length)];
  const correctAnswer = eval(`${randomNumber1} ${randomOperator} ${randomNumber2}`);

  const question = `What is ${randomNumber1} ${randomOperator} ${randomNumber2}?`;
  const timeLimit = 14; // Increased time limit to allow for more complex calculations ⏰

  message.reply(`${question}\n━━━━━━━━━━━━━━━\nTime Limit: ${timeLimit} seconds. ⏰`)
    .then(data => {
      const messageId = data.messageID;

      // Set the timer for the time limit
      const timerId = setTimeout(() => {
        global.api.unsendMessage(messageId);
      }, timeLimit * 1000);

      data.addReplyEvent({ callback: getMathReply, myData: { correctAnswer, userBet, messageId, timerId } });
    })
    .catch(err => console.error(err));

  async function getMathReply({ message, eventData }) {
    // Clear the timer since the user has made a choice
    clearTimeout(eventData.timerId);

    const userAnswer = parseFloat(message.body);

    if (isNaN(userAnswer)) {
      message.reply("Please enter a valid number.");
      return;
    }

    if (userAnswer === correctAnswer) {
      const winnings = userBet * 2;
      await Users.increaseMoney(message.senderID, winnings);
      message.reply(`Correct answer! You've won $${winnings}!💵`)
        .then(() => global.api.unsendMessage(eventData.messageId));
    } else {
      message.reply(`Wrong answer! The correct answer was ${correctAnswer}. Better luck next time.`)
        .then(() => global.api.unsendMessage(eventData.messageId));
    }
  }
}

export default {
  config,
  onCall
};
