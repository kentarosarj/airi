import axios from 'axios';

const config = {
  name: "animequiz",
  aliases: ["ani"],
  description: "Answer a question to win money",
  usage: "",
  credits: "Margaux"
};

String.prototype.toTitleCase = function() {
  return this.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

async function onCall({ message, args, getLang }) {
  const { Users } = global.controllers;
  const userBalance = await Users.getMoney(message.senderID);

  const betAmount = parseInt(args[0]);

  const maxBet = 1000000000; // Maximum bet set to 1 billion

  if (isNaN(betAmount) || betAmount <= 0) {
    return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝.");
  }

  if (betAmount > maxBet) {
    return message.reply(`𝚃𝚑𝚎 𝚖𝚊𝚡𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝 𝚒𝚜 ${maxBet.toLocaleString()}$. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚋𝚎𝚝 𝚊 𝚕𝚘𝚠𝚎𝚛 𝚊𝚖𝚘𝚞𝚗𝚝.`);
  }

  if (userBalance < betAmount) {
    return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚒𝚜 𝚋𝚎𝚝.");
  }

  // Randomize the difficulty level
  const difficultyLevels = ["easy", "medium", "hard"];
  const randomDifficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];

  const apiUrl = `
https://opentdb.com/api.php?amount=50&category=31`;
  try {
    const { data } = await axios.get(apiUrl);

    const specialChars = {
      "&quot;": '"',
      "&#039;": "'",
      "&amp;": "'"
    };
    const decodedResults = data.results.map(result => {
      const decodedQuestion = unescape(result.question.replace(/&quot;|&#039;|&amp;/g, m => specialChars[m]));
      const decodedCorrectAnswer = unescape(result.correct_answer.replace(/&quot;|&#039;/g, m => specialChars[m]));
      const decodedIncorrectAnswers = result.incorrect_answers.map(ans => unescape(ans.replace(/&quot;|&#039;/g, m => specialChars[m])));
      return {
        ...result,
        question: decodedQuestion,
        correct_answer: decodedCorrectAnswer,
        incorrect_answers: decodedIncorrectAnswers
      };
    });

    const question = decodedResults[0].question;
    const type = decodedResults[0].type;
    const difficulty = randomDifficulty.toTitleCase();

    // Define the time limit in seconds
    const timeLimitSeconds = 30;
    const timeout = setTimeout(() => {
      message.reply("𝚃𝚒𝚖𝚎'𝚜 𝚞𝚙! 𝚈𝚘𝚞 𝚍𝚒𝚍𝚗'𝚝 𝚊𝚗𝚜𝚠𝚎𝚛 𝚒𝚗 𝚝𝚒𝚖𝚎.")
        .then(() => global.api.unsendMessage(message.messageID));
    }, timeLimitSeconds * 1000);

    if (type === 'boolean') {
      const correctAnswer = decodedResults[0].correct_answer.toLowerCase();
      const incorrectAnswer = decodedResults[0].incorrect_answers[0].toLowerCase();

      message.reply(`${question}\n━━━━━━━━━━━━━━━\n𝙳𝚒𝚏𝚏𝚒𝚌𝚞𝚕𝚝𝚢: ${difficulty}\n𝚈𝚘𝚞𝚛 𝙱𝚎𝚝: ${betAmount}$\n𝚃𝚒𝚖𝚎 𝙻𝚒𝚖𝚒𝚝: ${timeLimitSeconds} secs ⏱`)
        .then(data => data.addReplyEvent({ callback: getBooleanReply, myData: { correctAnswer, betAmount, timeout } }))
        .catch(err => console.error(err));

      async function getBooleanReply({ message, eventData }) {
        clearTimeout(eventData.myData.timeout); // Clear the timer

        const answer = message.body.toLowerCase();
        if (answer === correctAnswer) {
          await Users.increaseMoney(message.senderID, betAmount);
          message.reply(`𝙲𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚈𝚘𝚞 𝚠𝚘𝚗 ${betAmount}$!`)
            .then(() => global.api.unsendMessage(eventData.messageID));
        } else if (answer === incorrectAnswer) {
          await Users.decreaseMoney(message.senderID, betAmount);
          message.reply(`𝚆𝚛𝚘𝚗𝚐 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚈𝚘𝚞 𝚕𝚘𝚜𝚝 ${betAmount}$. 𝙱𝚎𝚝𝚝𝚎𝚛 𝚕𝚞𝚌𝚔 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎.`)
            .then(() => global.api.unsendMessage(eventData.messageID));
        } else {
          message.reply(`𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚊𝚗𝚜𝚠𝚎𝚛, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 "True" 𝚘𝚛 "False".`)
        }
      }
    } else if (type === 'multiple') {
      const correctAnswer = decodedResults[0].correct_answer.toLowerCase();
      const options = [...decodedResults[0].incorrect_answers, decodedResults[0].correct_answer];
      const shuffledOptions = options.sort(() => Math.random() - 0.5);

      const optionsText = shuffledOptions.map((option, index) => `${index + 1}) ${option}`).join('\n');
      const questionText = `${question}\n\n${optionsText}\n━━━━━━━━━━━━━━━\n𝙳𝚒𝚏𝚏𝚒𝚌𝚞𝚕𝚝𝚢: ${difficulty}\n𝚈𝚘𝚞𝚛 𝙱𝚎𝚝: ${betAmount}$\n𝚃𝚒𝚖𝚎 𝙻𝚒𝚖𝚒𝚝: ${timeLimitSeconds} secs ⏱`;

      message.reply(questionText)
        .then(data => data.addReplyEvent({ callback: getMultipleReply, myData: { correctAnswer, shuffledOptions, betAmount, timeout } }))
        .catch(err => console.error(err));

      async function getMultipleReply({ message, eventData }) {
        clearTimeout(eventData.myData.timeout); // Clear the timer

        const answer = message.body.toLowerCase();
        const index = parseInt(answer) - 1;
        const isCorrect = (shuffledOptions[index].toLowerCase() === correctAnswer);

        if (isCorrect) {
          await Users.increaseMoney(message.senderID, betAmount);
          message.reply(`𝙲𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚈𝚘𝚞 𝚠𝚘𝚗 ${betAmount}$!`)
            .then(() => global.api.unsendMessage(eventData.messageID));
        } else {
          await Users.decreaseMoney(message.senderID, betAmount);
          message.reply(`𝚆𝚛𝚘𝚗𝚐 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚃𝚑𝚎 𝚌𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛 𝚒𝚜 ${decodedResults[0].correct_answer}. 𝚈𝚘𝚞 𝚕𝚘𝚜𝚝 ${betAmount}$. 𝙱𝚎𝚝𝚝𝚎𝚛 𝚕𝚞𝚌𝚔 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎.`)
            .then(() => global.api.unsendMessage(eventData.messageID));
        }
      }
    } else {
      message.reply("𝚂𝚘𝚛𝚛𝚢, 𝙸 𝚍𝚘𝚗'𝚝 𝚔𝚗𝚘𝚠 𝚑𝚘𝚠 𝚝𝚘 𝚑𝚊𝚗𝚍𝚕𝚎 𝚝𝚑𝚒𝚜 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚝𝚢𝚙𝚎. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.");
    }
  } catch (error) {
    console.error(error);
    message.reply("𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚝𝚑𝚎 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.");
  }
}

export default {
  config,
  onCall
};