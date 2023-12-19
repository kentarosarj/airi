// Import the required modules
import axios from 'axios';

// Configuration for the horse racing game
const config = {
  name: "horse-racing",
  aliases: ["hr"],
  description: "Play horse racing with multiplayer.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Dymyrius",
};

// Define the horseImages array outside the onCall function
const horseImages = [
  // URLs of horse images
  // Add or modify horse images as needed
  { number: 1, url: "https://i.imgur.com/I7ZElJ0.png" },
  { number: 2, url: "https://i.imgur.com/cRBu7li.png" },
  { number: 3, url: "https://i.imgur.com/SOaK0P6.png" },
  { number: 4, url: "https://i.imgur.com/NjiaX1B.png" },
  { number: 5, url: "https://i.imgur.com/ZY4m1zd.png" },
  { number: 6, url: "https://i.imgur.com/5F6VC3q.png" },
  { number: 7, url: "https://i.imgur.com/Ff5w1Me.png" },
  { number: 8, url: "https://i.imgur.com/DhEzQp9.png" },
  { number: 9, url: "https://i.imgur.com/F29yd5M.png" },
];

async function startRacingGame(threadID, bcl, message) {
  const horseRaceGif = (await axios.get("https://i.imgur.com/mHdw73G.png", {
    responseType: "stream",
  })).data;

  // Get the number of horses available based on the number of players who joined
  const numberOfPlayers = bcl.players.length;
  const horsesAvailable = Array.from({ length: numberOfPlayers }, (_, index) => index + 1).join(", ");

  global.api.sendMessage({
    body: `HORSE RACING\n\nPlease pick a horse number from 1 to 9 by typing the command "!hr <horse_number>".\nHorses Available: ${horsesAvailable}`,
    attachment: horseRaceGif,
  }, threadID);

  // Unsend the racing animation and message after 8 seconds
  setTimeout(async () => {
    try {
      const messages = await api.getThreadMessages(threadID);
      const racingMessage = messages.find((msg) => msg.body === message);
      if (racingMessage) {
        await api.unsendMessage(racingMessage.messageID);
      }
    } catch (error) {
      console.error("Error occurred while unsending the racing message:", error.message);
    }
  }, 8000); // 8 seconds
}

// Main function to handle commands
async function onCall({ message, args }) {
  const { Users } = global.controllers;
  global.chanle || (global.chanle = new Map);
  var bcl = global.chanle.get(message.threadID);
  const horseImg = (await axios.get("https://i.imgur.com/lDiULBt.jpg", {
    responseType: "stream"
  })).data;
  const horseCrush = (await axios.get("https://i.imgur.com/thQbSER.gif", {
    responseType: "stream"
  })).data;
  const { senderID, threadID, messageID, body } = message;

  // Function to display the horse racing GIF and results
  async function displayRaceResults(threadID, bcl, winningHorseNumber, winner, payout) {
    const horseRaceGif = (await axios.get("https://i.imgur.com/zIKiq8B.gif", {
      responseType: "stream",
    })).data;

    global.api.sendMessage({
      body: "RACING...",
      attachment: horseRaceGif,
    }, threadID, async (err, racingMessage) => {
      if (err) {
        console.error("Error occurred while sending the racing message:", err);
      } else {
        setTimeout(async () => {
          if (racingMessage) {
            await api.unsendMessage(racingMessage.messageID);
          }

          const horseNumber = (await axios.get(horseImages.find(horse => horse.number === winningHorseNumber).url, {
            responseType: "stream",
          })).data;

          const formattedPayout = payout.toLocaleString();

          const raceResult = `[🐴] » The horse race game has ended!\n\nThe winning horse is number ${winningHorseNumber}!\n\nThe winner is ${winner.name}!\n\nWinning payout: ${formattedPayout}$`;

          await global.api.sendMessage({
            body: raceResult,
            attachment: horseNumber,
          }, threadID);
        }, 8000); // 5 seconds
      }
    });
  }

  // Function to handle horse selection
  async function handleHorseSelection(threadID, bcl, senderID, horseNumber) {
    const player = bcl.players.find((p) => p.userID === senderID);
    if (!player) {
      return global.api.sendMessage("You haven't joined this horse racing game yet!", threadID, messageID);
    }
    if (player.horse !== null) {
      return global.api.sendMessage(`Sorry, ${player.name}, you have already picked horse number ${player.horse}!`, threadID, messageID);
    }
    if (isNaN(horseNumber) || horseNumber < 1 || horseNumber > bcl.horses.length) {
      return global.api.sendMessage("Please choose a valid horse number.", threadID, messageID);
    }
    if (bcl.players.some((p) => p.horse === horseNumber)) {
      return global.api.sendMessage("Another player has already picked this horse number! Please choose another one.", threadID, messageID);
    }
    player.horse = horseNumber;
    global.chanle.set(threadID, bcl);
    const playerName = player.name || senderID;
    global.api.sendMessage(`${playerName}, you picked horse number ${player.horse}.`, threadID, messageID);
  
    // Check if all players have made their choices
    const allPlayersChosen = bcl.players.every((p) => p.horse !== null);
    if (allPlayersChosen) {
      // All players have made their choices, start the race!
      const winningHorseNumber = Math.floor(Math.random() * bcl.horses.length) + 1; // Generate a random horse number between 1 and the number of horses
      const winner = bcl.players.find((p) => p.horse === winningHorseNumber);
      // If a user wins the race, calculate and pay out winnings
      if (winner) {
        const playerName = winner.name || senderID;
        const betAmount = bcl.reservationAmount;
        const totalPlayers = bcl.players.length;
  
        // Calculate the payout for each winner
        const payout = betAmount * (totalPlayers);
  
        // Increase the money for the winner(s)
        await Users.increaseMoney(winner.userID, payout);
  
        // Display the race results with payouts
        displayRaceResults(threadID, bcl, winningHorseNumber, winner, payout);
      } else {
        global.api.sendMessage("The horse racing game has ended!\n\nUnfortunately, there is no winner this time. Better luck next time!", threadID);
      }
  
      // Reset the game state
      global.chanle.delete(threadID);
    }
  }

  if (args[0] === "create" || args[0] === "new" || args[0] === "-c") {
    // Create a new horse racing game
    if (!args[1] || isNaN(args[1])) {
      return global.api.sendMessage("You need to enter a reservation amount!", threadID, messageID);
    }
    const reservationAmount = parseInt(args[1]);
    if (reservationAmount < 500) {
      return global.api.sendMessage("Amount must be greater than or equal to 500$!", threadID, messageID);
    }
    const userMoney = await Users.getMoney(senderID) || 0;
    if (userMoney < reservationAmount) {
      return global.api.sendMessage(`You don't have enough ${reservationAmount}$ to create a new game!`, threadID, messageID);
    }
    if (global.chanle.has(threadID)) {
      return global.api.sendMessage("This group has already opened a game table!", threadID, messageID);
    }

    // Deduct bet amount when creating the game
    await Users.decreaseMoney(senderID, reservationAmount);

    const playerName = (await global.controllers.Users.getInfo(senderID))?.name || senderID;
    global.chanle.set(threadID, {
      box: threadID,
      start: false,
      author: senderID,
      players: [{
        name: playerName,
        userID: senderID,
        horse: null,
      }],
      reservationAmount: reservationAmount,
    });
    return global.api.sendMessage(`Successfully created a horse racing game with a reservation amount of ${reservationAmount}$.`, threadID);
  } else if (args[0] === "join" || args[0] === "-j") {
    // Join the horse racing game
    if (!global.chanle.has(threadID)) {
      return global.api.sendMessage("There is currently no horse racing game in this group!\n=> Please create a new game to join!", threadID, messageID);
    }
    bcl = global.chanle.get(threadID);
    if (bcl.start) {
      return global.api.sendMessage("This horse racing game has already started!", threadID, messageID);
    }
    const reservationAmount = bcl.reservationAmount;
    const playerMoney = await Users.getMoney(senderID) || 0;
    if (playerMoney < reservationAmount) {
      return global.api.sendMessage(`You don't have enough ${reservationAmount}$ to join this horse racing game!`, threadID, messageID);
    }
    const playerName = (await global.controllers.Users.getInfo(senderID))?.name || senderID;
    if (bcl.players.find((player) => player.userID === senderID)) {
      return global.api.sendMessage("You have already joined this horse racing game!", threadID, messageID);
    }
    bcl.players.push({
      name: playerName,
      userID: senderID,
      horse: null,
    });

    // Deduct bet amount when joining the game
    await Users.decreaseMoney(senderID, reservationAmount);

    global.chanle.set(threadID, bcl);
    return global.api.sendMessage(`You have joined the horse racing game!\n=> The current number of players is: ${bcl.players.length}`, threadID, messageID);
  } else if (args[0] === "start" || args[0] === "-s") {
    // Start the horse racing game
    bcl = global.chanle.get(threadID);
    if (!bcl) {
      return global.api.sendMessage("There is currently no horse racing game in this group!\n=> Please create a new game to join!", threadID, messageID);
    }
    if (bcl.author !== senderID) {
      return global.api.sendMessage("You are not the creator of this horse racing game, so you cannot start the game.", threadID, messageID);
    }
    if (bcl.players.length < 2) {
      return global.api.sendMessage("Your horse racing game doesn't have enough players to start!", threadID, messageID);
    }
    if (bcl.start) {
      return global.api.sendMessage("This horse racing game has already started!", threadID, messageID);
    }
    bcl.start = true;
    // Set the number of horses based on the number of players
    const numberOfPlayers = bcl.players.length;
    bcl.horses = Array.from({ length: numberOfPlayers }, (_, index) => index + 1);
    // Shuffle the horses randomly
    bcl.horses.sort(() => Math.random() - 0.5);
    global.chanle.set(threadID, bcl);
    // Start the race with the new number of horses
    startRacingGame(threadID, bcl, message);
  } else if (!isNaN(args[0])) {
    // Player picks a horse number
    bcl = global.chanle.get(threadID);
    if (!bcl) {
      return global.api.sendMessage("There is currently no horse racing game in this group!\n=> Please create a new game to join!", threadID, messageID);
    }
    if (!bcl.start) {
      return global.api.sendMessage("The horse racing game has not started yet!", threadID, messageID);
    }
    const horseNumber = parseInt(args[0]);
    handleHorseSelection(threadID, bcl, senderID, horseNumber);
  } else if (args[0] === "end" || args[0] === "-e") {
    // End the horse racing game and determine the winner
    bcl = global.chanle.get(threadID);
    if (!bcl) {
      return global.api.sendMessage("There is currently no horse racing game in this group!\n=> Please create a new game to join!", threadID, messageID);
    }

    const isCreator = bcl.author === senderID;
    if (isCreator) {
      // The game creator uses the command, delete the game

      // Refund the bet amount to all players (excluding the creator)
      const betAmount = bcl.reservationAmount;
      for (const player of bcl.players) {
        if (player.userID !== senderID) {
          await Users.increaseMoney(player.userID, betAmount);
        }
      }

      global.chanle.delete(threadID);
      return global.api.sendMessage("The horse racing game has been deleted by the creator, and your bets have been refunded.", threadID, messageID);
    } else {
      // Another player uses the command, determine the winner and show the results

      if (!bcl.start) {
        return global.api.sendMessage("The horse racing game has not started yet!", threadID, messageID);
      }

      const numberOfPlayers = bcl.players.length;
      let winner = null;
      const winningHorseNumber = Math.floor(Math.random() * bcl.horses.length) + 1; // Generate a random horse number between 1 and the number of horses
      for (let i = 0; i < numberOfPlayers; i++) {
        const player = bcl.players[i];
        if (player.horse === winningHorseNumber) {
          winner = player;
          break;
        }
      }
      if (winner) {
        const playerName = winner.name || senderID;

        // Calculate the payout for each winner
        const payout = betAmount * (numberOfPlayers);

        // Increase the money for the winner(s)
        await Users.increaseMoney(winner.userID, payout);

        // Display the race results with payouts
        displayRaceResults(threadID, bcl, winningHorseNumber, winner, payout);
      } else {
        // No winner, refund the bets to all players (excluding the player who used the command)
        for (const player of bcl.players) {
          if (player.userID !== senderID) {
            await Users.increaseMoney(player.userID, betAmount);
          }
        }

        global.api.sendMessage({
          body: "The horse racing game has ended!\n\nUnfortunately, there is no winner this time. Better luck next time!",
          attachment: horseCrush
        }, threadID);
      }

      // Reset the game state
      global.chanle.delete(threadID);
    }
  } else {
    // Display help information if the command is not recognized
    return global.api.sendMessage({
      body: "=【𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐚𝐲𝐞𝐫 𝐇𝐨𝐫𝐬𝐞 𝐑𝐚𝐜𝐢𝐧𝐠 𝐆𝐚𝐦𝐞】=\n1. /hr -c/create <price> => Create a new horse racing game.\n2. /hr -j/join => Join to enter the game.\n3. /hr -s/start => Start the game.\n4. /hr <horse_number> => Pick a horse number (1 to 9).\n5. /hr -e/end => End the game (for players) or delete the game (for the creator).",
      attachment: horseImg,
    }, threadID, messageID);
  }
}

// Export the configuration and the main function
export default {
  config,
  onCall,
};