const config = {
  name: 'algebraquiz',
  aliases: ['aq'],
  description: 'Multiply algebraic expressions to win $26k. Use #algebraquiz to play.',
  usage: 'algebra',
  cooldown: 10,
  credits: 'Ariél Violét',
};

async function onCall({ message }) {
  const { Users } = global.controllers;
  const prize = 1000000;
  const timeLimit = 25; 

  const [question, correctAnswer] = generateAlgebraicQuestion();

  message.reply(`${question}\n━━━━━━━━━━━━━━━\nTime Limit: ${timeLimit} seconds. ⏱`)
    .then((data) => {
      const messageId = data.messageID;

      const timerId = setTimeout(() => {
        global.api.unsendMessage(messageId);
      }, timeLimit * 1000);

      data.addReplyEvent({ callback: getAlgebraReply, myData: { correctAnswer, prize, messageId, timerId } });
    })
    .catch((err) => console.error(err));

  async function getAlgebraReply({ message, eventData }) {
    clearTimeout(eventData.timerId);

    const answer = message.body;
    if (answer === correctAnswer.toString()) {
      await Users.increaseMoney(message.senderID, prize);
      message.reply(`🎉 Congratulations! You won \n₱${prize}! 💵`)
        .then(() => global.api.unsendMessage(eventData.messageId));
    } else {
      message.reply(`Wrong! ❌ The correct answer is " ${correctAnswer} ". Better luck next time! 🍀 Try again!`)
        .then(() => global.api.unsendMessage(eventData.messageId));
    }
  }
}

function generateAlgebraicQuestion() {
  const min = 1;
  const max = 10;

  const num1 = getRandomNumber(min, max);
  const num2 = getRandomNumber(min, max);
  const variable = getRandomVariable();
  let exponent1, exponent2;

  do {
    exponent1 = getRandomExponent();
    exponent2 = getRandomExponent();
  } while (exponent1 === exponent2);

  const question = `${num1}${variable}^${exponent1} * (${num2}${variable}^${exponent2}) = ?`;
  const correctAnswer = num1 * num2;

  return [question, correctAnswer];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomVariable() {
  const variables = ['x', 'y'];
  const randomIndex = Math.floor(Math.random() * variables.length);
  return variables[randomIndex];
}

function getRandomExponent() {
  const exponents = ['2', '3', '4'];
  const randomIndex = Math.floor(Math.random() * exponents.length);
  return exponents[randomIndex];
}

export default {
  config,
  onCall,
};