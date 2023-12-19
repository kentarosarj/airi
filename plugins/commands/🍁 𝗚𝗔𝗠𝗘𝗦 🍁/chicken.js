import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "chicken",
  aliases: ["chick"],
  description: "battle with your legendary chicken",
  usage: "",
  cooldown: 1,
  credits: "Dymyrius"
};

const langData = {
  "en_US": {
    "pokemon.noPokémon": "You don't have any Chicken. Use `Chiken buy` to buy one.",
    "pokemon.buySuccess": "Congratulations! You've purchased a Chicken named {pokemonName}!",
    "pokemon.buyFailure": "You don't have enough credits to buy a Pokémon.",
    "pokemon.feedSuccess": "You upgrade your {pokemonName}! Its level has increased to {newLevel}.",
    "pokemon.feedSuccessEvolved": "You upgrade your evolved {pokemonName}! Its level has increased to {newLevel}.",
    "pokemon.feedFailure": "You don't have any chicken to upgrade.",
    "pokemon.checkStatus": "📛 𝗖𝗵𝗶𝗰𝗸𝗲𝗻 𝗡𝗮𝗺𝗲: {pokemonName}\n🆙 𝗟𝗲𝘃𝗲𝗹: {pokemonLevel}\n⬆️ 𝗣𝗼𝘄𝗲𝗿 𝗟𝗲𝘃𝗲𝗹: {pokemonPower}\n🪙 𝗖𝗼𝗹𝗹𝗲𝗰𝘁𝗮𝗯𝗹𝗲 𝗩𝗮𝗹𝘂𝗲: ${pokemonValue}\n━━━━━━━━━━━━\n🏆 𝗪𝗶𝗻: {totalWins}\n🪦 𝗟𝗼𝘀𝘀: {totalLosses}",
    "pokemon.menuOptions": "◦❭❯❱【Chicken Game】❰❮❬◦\n\n1. `chicken buy` » Buy a chicken.\n2. chicken battle <amount> » Bet on your chicken in a fight.\n3. chicken challenge @user » Challenge another user to a chicken fight.\n4. chicken list » show all the chicken that can be used for cockfighting\n5. chicken accept » accept the challenge\n6. chicken decline » decline the challenge on user\n7. chicken sell » sell your chicken\n8. chicken upgrade » upgrade your chicken to another level.\n9. chicken get » get your collectable money on your chicken"
  },
  // Add translations for other languages if needed
};

const valueIncreaseInterval = 3 * 60 * 1000; // 3 minutes in milliseconds
const battleCooldownDuration = 30 * 1000; // 2 minutes in milliseconds

setInterval(() => {
  for (const [userID, userPokemon] of userPokémon.entries()) {
    const increaseAmount = 30000; // Value increase amount
    // Increase the value of the Pokémon
    userPokemon.value = (userPokemon.value || 0) + increaseAmount;
  }

  const currentTime = Date.now();
  for (const [userID, lastBattleTime] of lastBattleTimestamps.entries()) {
    if (currentTime - lastBattleTime >= battleCooldownDuration) {
      lastBattleTimestamps.delete(userID); // Reset cooldown
    }
  }

  saveUserPokémon(); // Save the updated values
}, valueIncreaseInterval);

const evolveNames = [
  "Manoknapulaevolve", "Manoknahubadevolve", "Manoknaisangsuntokevolve", "Manoknaakatchukievolve", "Manoknarobotevolve", "Manoknaputievolve", "Manoknapinkevolve", "Manoknanaglalabaevolve", "Manoknaharievolve", "ManokniTaguroevolve", "Supersisiw3", "Manoknamaritesevolve"
];

const evolveImages = [
  "https://i.imgur.com/DjYuLK6.jpg",
  "https://i.imgur.com/swpFmJq.jpg",  
  "https://i.imgur.com/IYEcTsB.jpg",  //1
  "https://i.imgur.com/9kdjAb1.jpg",  //2
  "https://i.imgur.com/TCKK2fm.jpg",  //3
  "https://i.imgur.com/z3sf9T1.jpg",  //4
  "https://i.imgur.com/jxJWpkg.jpg",  //5 
  "https://i.imgur.com/N7dAqCu.jpg",  //6
  "https://i.imgur.com/gWEL2sC.jpg",  //7
  "https://i.imgur.com/g8onNq8.jpg",  //8
  "https://i.imgur.com/LezBT9m.jpg",  //9
  "https://i.imgur.com/1OaPyEB.jpg",  //10
  "",  //11
  "",  //12
  "",  //13
  "",  //14
  "",  //15
  "",  //16
  "",  //17
  "",  //18
  "",  //19
  "",  //20
  "",  //21
  "",  //22
  "",  //23
  "",  //24
  "",  //25
  "",  //26
  "",  //27
  "",  //28
  ""   //29
];

const pokemonNames = ["Manoknapula", "Manoknahubad", "Manoknaisangsuntok", "Manoknaakatchuki", "Manoknarobot", "Manoknaputi", "Manoknapink", "Manoknanaglalaba", "Manoknahari", "Manoknitaguro", "Supersisiw", "Manoknamarites"];
const pokemonImages = [
  "https://i.imgur.com/DjYuLK6.jpg",
  "https://i.imgur.com/swpFmJq.jpg", "https://i.imgur.com/IYEcTsB.jpg",  //1
  "https://i.imgur.com/9kdjAb1.jpg",  //2
  "https://i.imgur.com/TCKK2fm.jpg",  //3
  "https://i.imgur.com/z3sf9T1.jpg",  //4
  "https://i.imgur.com/jxJWpkg.jpg",  //5
  "https://i.imgur.com/N7dAqCu.jpg",  //6
  "https://i.imgur.com/gWEL2sC.jpg",  //7
  "https://i.imgur.com/g8onNq8.jpg",  //8
  "https://i.imgur.com/LezBT9m.jpg",  //9
  "https://i.imgur.com/1OaPyEB.jpg",  //10
  "",  //11
  "",  //12
  "",  //13
  "",  //14
  "",  //15
  "",  //16
  "",  //17
  "",  //18
  "",  //19
  "",  //20
  "",  //21
  "",  //22
  "",  //23
  "",
  "",
  "",
  "",
  "",
  ""
];

let lastBattleTimestamps = new Map();
let tradeRequests = new Map();
let lastFeedTimestamps = new Map();
let userPokémon = new Map();
const PATH = join(global.assetsPath, 'chicken_owners.json');

function loadUserPokémon() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    const parsedData = JSON.parse(data);
    userPokémon = new Map(parsedData.userPokémon);
    lastFeedTimestamps = new Map(parsedData.lastFeedTimestamps);
  } catch (err) {
    console.error('Failed to load user Pokémon:', err);
  }
}

function saveUserPokémon() {
  try {
    const data = JSON.stringify({
      userPokémon: Array.from(userPokémon),
      lastFeedTimestamps: Array.from(lastFeedTimestamps)
    });

    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save user Pokémon:', err);
  }
}

function calculatePokemonPower(level) {
  // Assume some attributes that contribute to power
  const basePower = 10; // A base power value
  const levelMultiplier = 5; // A multiplier based on level
  const otherAttributes = 2; // Additional attributes that contribute to power

  // Calculate the power using the attributes
  const power = basePower + (level * levelMultiplier) + otherAttributes;

  return power;
}

loadUserPokémon();

async function onCall({ message, getLang, args}) {
  const { Users } = global.controllers;
  const pokemonImage = (await axios.get("https://i.imgur.com/gDk896t.jpg", {
    responseType: "stream"
  })).data;
  const battleCheckingGif = (await axios.get("https://i.imgur.com/yKVfBf5.gif", {
    responseType: "stream"
  })).data;
  const battle = (await axios.get("https://i.imgur.com/yKVfBf5.gif", {
    responseType: "stream"
  })).data;
  const levelup = (await axios.get("https://i.imgur.com/A9HORkU.gif", {
    responseType: "stream"
  })).data;
  const evolving = (await axios.get("https://i.imgur.com/haX4QH2.gif", {
    responseType: "stream"
  })).data;

  if (!message || !message.body) {
    console.error('Invalid message object or message body!');
    return;
  }

  const { senderID, mentions } = message;
  const mentionedUserID = Object.keys(mentions)[0]; // Get the user ID of the mentioned user
  const mentionedUser = await global.controllers.Users.getInfo(mentionedUserID); // Retrieve mentioned user's information

  if (args.length === 0 || args[0] === "available") {
    const menuOptions = getLang("pokemon.menuOptions");
    return message.reply({
      body: menuOptions,
      attachment: pokemonImage
    });
  }

  if (args[0] === "buy") {
    if (args.length < 2) {
      return message.reply("Please specify the name of the Chicken you want to buy.");    }
    if (userPokémon.has(senderID)) {
      return message.reply("You already have a Chicken. If you want to get a new one, you can sell your current Chicken using `chicken sell`.");
    }

    const pokemonPrice = 100000;
    const userBalance = await Users.getMoney(senderID);

    if (userBalance < pokemonPrice) {
      return message.reply(getLang("pokemon.buyFailure"));
    }

    const requestedPokemonName = args[1].toLowerCase(); // Convert to lowercase
    const pokemonIndex = pokemonNames.findIndex(name => name.toLowerCase() === requestedPokemonName);

    if (pokemonIndex === -1) {
      return message.reply(`Sorry, the chicken "${args[1]}" is not available for purchase.`);
    }

    const randomPokemonName = pokemonNames[pokemonIndex];
    const randomPokemonImageURL = pokemonImages[pokemonIndex];

    const imageResponse = await axios.get(randomPokemonImageURL, {
      responseType: "stream"
    });

    await Users.decreaseMoney(senderID, pokemonPrice);
    userPokémon.set(senderID, { name: randomPokemonName, level: 1 });
    saveUserPokémon();

    const buySuccessMessage = getLang("pokemon.buySuccess").replace("{pokemonName}", randomPokemonName);

    return message.reply({
      body: buySuccessMessage,
      attachment: imageResponse.data
    });
  }

  if (args[0] === "testtedttestgwapoko") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    if (args.length < 2) {
      return message.reply("Please specify the new nickname for your Pokémon.");
    }

    const newNickname = args.slice(1).join(" ");
    const userPokemon = userPokémon.get(senderID);

    // Update the nickname for the user's Pokémon
    userPokemon.nickname = newNickname;
    saveUserPokémon();

    return message.reply(`You've set a new nickname for your Pokémon: ${newNickname}`);
  }

  if (args[0] === "upgrade") {
    const userPokemon = userPokémon.get(senderID);

    if (!userPokemon) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    const currentLevel = userPokemon.level;
    const maxLevel = 1000; // Assuming the maximum level is 100

    if (currentLevel >= maxLevel) {
      return message.reply("Your  is already at the maximum level!");
    }

    const lastFeedTime = lastFeedTimestamps.get(senderID) || 0;
    const currentTime = Date.now();
    const cooldownDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    const timeSinceLastFeed = currentTime - lastFeedTime;

    if (timeSinceLastFeed < cooldownDuration) {
      const remainingCooldown = cooldownDuration - timeSinceLastFeed;
      const remainingCooldownHours = Math.ceil(remainingCooldown / (60 * 60 * 1000));

      return message.reply(`You can upgrade it again in ${remainingCooldownHours} hours.`);
    }

    // Decrease the user's balance by 1000 credits for feeding
    const feedCost = 5000000000000;
    const userBalance = await Users.getMoney(senderID);

    if (feedCost > userBalance) {
      return message.reply(`You don't have ${feedCost.toLocaleString()}$ to upgrade your Chicken.`);
    }

    await Users.decreaseMoney(senderID, feedCost);

    // Increase the Pokémon's level by 1
    userPokemon.level += 1;
    lastFeedTimestamps.set(senderID, currentTime); // Update last feed timestamp
    saveUserPokémon();

    // Check if the Pokémon has evolved
    const pokemonIndex = pokemonNames.indexOf(userPokemon.name);
    let pokemonName = userPokemon.name;

    if (pokemonIndex !== -1 && userPokemon.level === 10) {
      const evolvedPokemonName = evolveNames[pokemonIndex];
      if (evolvedPokemonName) {
        pokemonName = evolvedPokemonName;

        // Send a notification about Pokémon evolution with GIF
        const evolutionMessage = await message.reply({
          body: `Your ${userPokemon.name} is evolving into ${evolvedPokemonName}!`,
          attachment: evolving
        });

        setTimeout(async () => {
          // Unsend the evolving message after 3 seconds
          if (global.api && global.api.unsendMessage) {
            await global.api.unsendMessage(evolutionMessage.messageID);
          }
        }, 5000);
      }
    }

    const feedSuccessMessage = getLang(pokemonIndex !== -1 && userPokemon.level >= 10 ? "pokemon.feedSuccessEvolved" : "pokemon.feedSuccess")
      .replace("{pokemonName}", pokemonIndex !== -1 && userPokemon.level >= 10 ? evolveNames[pokemonIndex] : pokemonName) // Use the evolved name if applicable
      .replace("{newLevel}", userPokemon.level);

    return message.reply({
      body: feedSuccessMessage,
      attachment: levelup
    });
  }

  if (args[0] === "check") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    const userPokemon = userPokémon.get(senderID);
    const pokemonIndex = pokemonNames.indexOf(userPokemon.name);
    let pokemonName = userPokemon.name;

    if (pokemonIndex !== -1 && userPokemon.level >= 10) {
      const evolvedPokemonName = evolveNames[pokemonIndex];
      if (evolvedPokemonName) {
        pokemonName = evolvedPokemonName;
      }
    }

    const totalWins = userPokemon.wins || 0; // Get total wins
    const totalLosses = userPokemon.losses || 0; // Get total losses

    // Check if the Pokémon has a nickname, if not, use the original name
    const pokemonDisplayName = userPokemon.nickname ? `${userPokemon.nickname} (${pokemonName})` : pokemonName;

    const checkStatusMessage = getLang("pokemon.checkStatus")
      .replace("{pokemonName}", pokemonDisplayName)
      .replace("{pokemonLevel}", userPokemon.level)
      .replace("{pokemonPower}", calculatePokemonPower(userPokemon.level))
      .replace("{pokemonValue}", userPokemon.value || 0)
      .replace("{totalWins}", totalWins)
      .replace("{totalLosses}", totalLosses);

    let pokemonImageURL;

    if (pokemonIndex !== -1 && userPokemon.level >= 10) {
      pokemonImageURL = evolveImages[pokemonIndex] || pokemonImages[pokemonIndex];
    } else {
      pokemonImageURL = pokemonImages[pokemonIndex];
    }

    if (pokemonImageURL) {
      const imageResponse = await axios.get(pokemonImageURL, {
        responseType: "stream"
      });

      return message.reply({
        body: checkStatusMessage,
        attachment: imageResponse.data
      });
    } else {
      return message.reply(checkStatusMessage);
    }
  }

  if (args[0] === "list") {
    const availablePokémonList = pokemonNames.map(name => `• ${name}`).join("\n");
    const listMessage = `Here's available chicken to buy\n\n${availablePokémonList}`;
    return message.reply(listMessage);
  }

  if (args[0] === "battle") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    if (args.length < 2) {
      return message.reply("Please specify the bet amount for the battle.");
    }

    const betAmount = parseFloat(args[1]);

    if (isNaN(betAmount)) {
      return message.reply("Invalid bet amount. Please provide a valid number.");
    }

    const userBalance = await Users.getMoney(senderID);

    const maxBet = 1000000000000000000000000000000000000; // Maximum bet set to 1 billion

    if (betAmount > maxBet) {
      return message.reply(`The maximum bet amount is ${maxBet.toLocaleString()}$. Please bet a lower amount.`);
    }

    if (betAmount > userBalance) {
      return message.reply("You don't have enough credits to place this bet.");
    }

    const opponentPokémonLevel = Math.floor(Math.random() * 50) + 1; // Generate a random level for the opponent's Pokémon
    const userPokémonLevel = userPokémon.get(senderID).level;

    const battleResult = userPokémonLevel > opponentPokémonLevel;
    const battleResultMessage = battleResult
      ? `Congratulations! Your Chicken defeated the opponent's Chicken. \n― You won ${betAmount} credits.`
      : `Your Chicken was defeated by the opponent's Chicken. \n― You lost ${betAmount} credits.`;

    // Update user balance based on battle outcome
    if (battleResult) {
      await Users.increaseMoney(senderID, betAmount);
    } else {
      await Users.decreaseMoney(senderID, betAmount);
    }

    const battleCheckingMessage = await message.reply({
      body: "Fighting...",
      attachment: battle
    });

    setTimeout(() => {
      message.reply(battleResultMessage);
      if (global.api && global.api.unsendMessage) {
        global.api.unsendMessage(battleCheckingMessage.messageID);
      }
    }, 3500);

    return;
  }

  if (args[0] === "challenge") {
    if (!mentionedUser) {
      return message.reply("You need to mention a user to challenge.");
    }

    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    if (!userPokémon.has(mentionedUserID)) {
      return message.reply(`${mentionedUser.name} doesn't have a Chicken to challenge.`);
    }

    // Find the index of the last numeric argument
    let betAmountIndex = args.findIndex(arg => !isNaN(parseFloat(arg)));

    if (betAmountIndex === -1) {
      return message.reply("Invalid command format. Please specify a valid bet amount.");
    }

    // Extract the bet amount from the argument
    let betAmount = parseFloat(args[betAmountIndex]);

    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply("Invalid bet amount. Please provide a valid positive number.");
    }

    const userBalance = await Users.getMoney(senderID);

    if (betAmount > userBalance) {
      return message.reply("You don't have enough credits to place this bet.");
    }

    const opponentBalance = await Users.getMoney(mentionedUserID);

    if (betAmount > opponentBalance) {
      return message.reply(`${mentionedUser.name} doesn't have enough credits to accept this bet.`);
    }

    // Get the sender's name manually
    const senderInfo = await Users.getInfo(senderID);
    const senderName = senderInfo.name;

    // Send a challenge request to the opponent
    await message.reply(`${mentionedUser.name}, you've been challenged to a Pokémon battle by ${senderName}. Do you accept? Reply with 'pokemon accept' or 'pokemon decline'.`);

    // Store the challenge data for the opponent to respond
    tradeRequests.set(mentionedUserID, {
      challengerID: senderID,
      betAmount: betAmount
    });

    return;
  }

  if (args[0] === "accept") {
    if (!tradeRequests.has(senderID)) {
      return message.reply("No pending challenge request.");
    }

    const { challengerID, betAmount } = tradeRequests.get(senderID);
    if (!userPokémon.has(senderID) || !userPokémon.has(challengerID)) {
      return message.reply("Either you or the challenger doesn't have a Chicken anymore.");
    }

    // Deduct the bet amount from both users
    const senderBalance = await Users.decreaseMoney(senderID, betAmount);
    const challengerBalance = await Users.decreaseMoney(challengerID, betAmount);

    // Get the names of the users using senderID and challengerID
    const senderInfo = await global.controllers.Users.getInfo(senderID);
    const senderName = senderInfo ? senderInfo.name : "Sender";
    const challengerInfo = await global.controllers.Users.getInfo(challengerID);
    const challengerName = challengerInfo ? challengerInfo.name : "Challenger";

    // Determine the winner and loser of the battle
    const userPokemonLevel = userPokémon.get(senderID).level;
    const challengerPokemonLevel = userPokémon.get(challengerID).level;

    let winnerName, loserName, winnerID, loserID;
    if (userPokemonLevel > challengerPokemonLevel) {
      winnerName = senderName;
      loserName = challengerName;
      winnerID = senderID;
      loserID = challengerID;
    } else if (userPokemonLevel < challengerPokemonLevel) {
      winnerName = challengerName;
      loserName = senderName;
      winnerID = challengerID;
      loserID = senderID;
    } else {
      // If both Pokémon have the same level, determine the winner randomly
      const randomWinnerID = [senderID, challengerID][Math.floor(Math.random() * 2)];
      const randomLoserID = randomWinnerID === senderID ? challengerID : senderID;
      winnerID = randomWinnerID;
      loserID = randomLoserID;
      winnerName = randomWinnerID === senderID ? senderName : challengerName;
      loserName = randomLoserID === senderID ? senderName : challengerName;
    }

    // Update the users' balances based on the battle outcome
    await Users.increaseMoney(winnerID, betAmount * 2); // Winner gets both bets
    // Record wins and losses
    userPokémon.get(winnerID).wins = (userPokémon.get(winnerID).wins || 0) + 1;
    userPokémon.get(loserID).losses = (userPokémon.get(loserID).losses || 0) + 1;
    saveUserPokémon();

    const formattedBetAmount = betAmount.toLocaleString();

    const challengeOutcomeMessage = `Victory: ${winnerName}\nDefeat:${loserName}\n𝗕𝗲𝘁: ${formattedBetAmount} credits`;

    // Send the checking result message with a GIF
    const checkingResultMessage = await message.reply({
      body: `${senderName} 𝘃𝗲𝗿𝘀𝘂𝘀 ${challengerName}`,
      attachment: battleCheckingGif
    });

    // Set a timeout to automatically unsend the checking result message after 3 seconds
    setTimeout(() => {
      message.reply(challengeOutcomeMessage);
      if (global.api && global.api.unsendMessage) {
        global.api.unsendMessage(checkingResultMessage.messageID);
      }
    }, 4000);

    // Clear the challenge request
    tradeRequests.delete(senderID);

    return;
  }

  if (args[0] === "decline") {
    if (!tradeRequests.has(senderID)) {
      return message.reply("No pending challenge request.");
    }

    // Clear the challenge request
    tradeRequests.delete(senderID);

    return message.reply("You declined the challenge.");
  }

  if (args[0] === "testgwapokotalagahaha") {
    if (!mentionedUser) {
      return message.reply("You need to mention a user to trade with.");
    }

    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    if (!userPokémon.has(mentionedUserID)) {
      return message.reply(`The user ${mentionedUser.name} doesn't have a Chicken to trade.`);
    }

    tradeRequests.set(mentionedUserID, senderID); // Store the trade request with the target user's ID

    return message.reply(`Trade requested with ${mentionedUser.name}. The other user must type "pokemon confirm @user" to agree.`);
  }

  if (args[0] === "thisisnotgoodgotchickengame") {
    if (!tradeRequests.has(senderID)) {
      return message.reply("No pending trade request.");
    }

    const initiatorID = tradeRequests.get(senderID);
    if (initiatorID !== mentionedUserID) {
      return message.reply("There is no trade request from this user.");
    }

    // Swap Pokémon between the users
    const userPokemon = userPokémon.get(senderID);
    const mentionedUserPokemon = userPokémon.get(mentionedUserID);
    userPokémon.set(senderID, mentionedUserPokemon);
    userPokémon.set(mentionedUserID, userPokemon);
    saveUserPokémon();

    tradeRequests.delete(senderID); // Clear the trade request

    return message.reply(`Trade successful! You received ${mentionedUser.name}'s Pokémon.`);
  }

  if (args[0] === "get") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    const userPokemon = userPokémon.get(senderID);
    if (!userPokemon.value || userPokemon.value === 0) {
      return message.reply("There's no value to get for your Chicken.");
    }

    const userBalance = await Users.getMoney(senderID);
    const collectAmount = userPokemon.value;

    await Users.increaseMoney(senderID, collectAmount);
    userPokemon.value = 0; // Reset the collected value
    saveUserPokémon();

    const collectMessage = `You've collected $${collectAmount} value from your Pokémon!`;
    return message.reply(collectMessage);
  }

  if (args[0] === "sell") {
    if (!userPokémon.has(senderID)) {
      return message.reply("You don't have a Chicken to sell.");
    }

    // Remove the user's current Pokémon
    userPokémon.delete(senderID);
    saveUserPokémon();

    const releaseMessage = "You have sell your Pokémon Successful ly!";
    return message.reply(releaseMessage);
  }

  // If the command is not recognized, show the menu
  const menuOptions = getLang("pokemon.menuOptions");
  return message.reply(menuOptions);
}

export default {
  config,
  langData,
  onCall
};