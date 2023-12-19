import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "food",
  aliases: ["f"],
  description: "eating game",
  usage: "use /food menu",
  cooldown: 1,
  credits: "rue"
};

const langData = {
  "en_US": {
    "pokemon.noPokémon": "You don't have any food. Use [food buy] to buy food.",
    "pokemon.buySuccess": "Successfully! You've buy a food named {pokemonName}!",
    "pokemon.buyFailure": "kindly check your balance",
    "pokemon.feedSuccess": "You fed your {pokemonName}! Its level has increased to {newLevel}.",
    "pokemon.feedSuccessEvolved": "You fed your evolved {pokemonName}! Its level has increased to {newLevel}.",
    "pokemon.feedFailure": "You don't have any Pokémon to feed.",
    "pokemon.checkStatus": "𝙷𝚞𝚗𝚐𝚎𝚛 𝚋𝚊𝚛: {pokemonValue}%",
    "pokemon.menuOptions": "𝙼𝚎𝚗𝚞\n\n1) 𝚕𝚒𝚜𝚝 : 𝚂𝚑𝚘𝚠 𝚝𝚑𝚎 𝙵𝚘𝚘𝚍 𝚊𝚗𝚍 𝙳𝚛𝚒𝚗𝚔𝚜 𝙼𝚎𝚗𝚞\n 2) 𝚋𝚞𝚢 {𝚗𝚊𝚖𝚎} 𝚎𝚡𝚊𝚖𝚙𝚕𝚎: /𝚏𝚘𝚘𝚍 𝚋𝚞𝚢 𝚔𝚒𝚖𝚌𝚑𝚒\n3) 𝚌𝚑𝚎𝚌𝚔: 𝚜𝚑𝚘𝚠 𝚢𝚘𝚞𝚛 𝚑𝚞𝚗𝚐𝚎𝚛 𝚋𝚊𝚛 \n4) 𝙴𝚊𝚝 {𝚏𝚘𝚘𝚍𝙽𝚊𝚖𝚎} : 𝚎𝚊𝚝 𝚊𝚗𝚍 𝚑𝚞𝚗𝚐𝚎𝚛 𝚞𝚙"
  },
  // Add translations for other languages if needed
};

const valueIncreaseInterval = 2 * 60 * 1000; // 3 minutes in milliseconds
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
  "Raichu", "Charizard", "Azumarill", "Blastoise", "Venusaur",
  "Persian", "Ninetales", "Arcanine", "Vaporeon", "Sylveon",
  "Typhlosion", "Feraligatr", "Empoleon", "Greninja", "Pidgeotto",
  "Electivire", "Alakazam", "Dewgong", "Flareon", "Wigglytuff", 
  "Meganium", "Snorlax", "Wobbuffet", "Butterfree", "Clefable", "Golduck",
  "Scizor" , "Magikarp", "Mew"
];

const evolveImages = [
  "https://i.imgur.com/8NH55vo.png",  //1
  "https://i.imgur.com/NrwN5VD.png",  //2
  "https://i.imgur.com/9c4Kb08.png",  //3
  "https://i.imgur.com/5jAGUBf.png",  //4
  "https://i.imgur.com/mnOz3kw.png",  //5 
  "https://i.imgur.com/yKo35qa.png",  //6
  "https://i.imgur.com/c7khomv.png",  //7
  "https://i.imgur.com/nAmvvbX.png",  //8
  "https://i.imgur.com/h158sBU.jpg",  //9
  "https://i.imgur.com/8d0AG1h.jpg",  //10
  "https://i.imgur.com/2VYxESv.png",  //11
  "https://i.imgur.com/4CaSjJY.png",  //12
  "https://i.imgur.com/K94uf1b.png",  //13
  "https://i.imgur.com/uQpfZlJ.png",  //14
  "https://i.imgur.com/8cKYgIr.jpg",  //15
  "https://i.imgur.com/zZe03As.jpg",  //16
  "https://i.imgur.com/vYZDb1d.jpg",  //17
  "https://i.imgur.com/UU75wPG.png",  //18
  "https://i.imgur.com/LLGdMuu.jpg",  //19
  "https://i.imgur.com/etjvNgz.png",  //20
  "https://i.imgur.com/RJ06xWX.png",  //21
  "https://i.imgur.com/5LAErId.png",  //22
  "https://i.imgur.com/sczntt8.png",  //23
  "https://i.imgur.com/yrTHr25.png",
  "https://i.imgur.com/oTnvczh.jpg",
  "https://i.imgur.com/lbQ73tD.png",
  "https://i.imgur.com/s12rB5g.png",
  "https://i.imgur.com/p6PKMJB.jpg",
  ""
];

const pokemonNames = ["Grapes", "Melon", "watermelon", "orange", "Lemon", "Banana", "Pineapple", "Apple", "Green Apple", "Strawberry", "Sandwich", "Medium Soup", "Shrimp", "Pie", "Pizza", "Burger", "Donut", "Squid", "Bread", "Small Icecream", "Large Icecream","Medium Icecream", "Pan cake", "coffe", "Chocolate", "Coke", "Lolipop" ,"Milk" ,"Water"];
const pokemonImages = [
  "https://i.ibb.co/fptDWCs/xva213.jpg",  //1
  "https://i.ibb.co/stYLbM3/xva213.jpg",  //2
  "https://i.ibb.co/R9KjKbY/xva213.jpg",  //3
  "https://i.ibb.co/cXFHhwp/xva213.jpg",  //4
  "https://i.ibb.co/bdT98G0/xva213.jpg",  //5
  "https://i.ibb.co/m9wNVWJ/xva213.jpg",  //6
  "https://i.imgur.com/wkIjaxK.jpg",  //7
  "https://i.ibb.co/cwVX0Pn/xva213.jpg",  //8
  "https://i.ibb.co/St5Kk1z/xva213.jpg",  //9
  "https://i.ibb.co/sPvZkgy/xva213.jpg",  //10
  "https://i.ibb.co/Sc97g3R/xva213.jpg",  //11
  "https://i.ibb.co/X52NsdZ/xva213.jpg",  //12
  "https://i.ibb.co/VQYgVfr/xva213.jpg",  //13
  "https://i.ibb.co/pPZT3LV/xva213.jpg",  //14
  "https://i.ibb.co/vhFzMsb/xva213.jpg",  //15
  "https://i.ibb.co/p4JtGkN/xva213.jpg",  //16
  "https://i.ibb.co/YZzXTcw/xva213.jpg",  //17
  "https://i.ibb.co/HFpXs4d/xva213.jpg",  //18
  "https://i.ibb.co/ssWbcfr/xva213.jpg",  //19
  "https://i.ibb.co/VtSzBHR/xva213.jpg",  //20
  "https://i.ibb.co/c2vkStp/xva213.jpg",  //21
  "https://i.ibb.co/GP05VJc/xva213.jpg",  //22
  "https://i.ibb.co/BwXJSyW/xva213.jpg",  //23
  "https://i.ibb.co/RhQV7nK/xva213.jpg",
  "https://i.ibb.co/hfG8DJ7/xva213.jpg",
  "https://i.ibb.co/xS3zWJy/xva213.jpg",
  "https://i.ibb.co/WyPwyTP/xva213.jpg",
  "https://i.ibb.co/L90XgH2/xva213.jpg",
"https://i.ibb.co/N9GX0h8/xva213.jpg"
];

let lastBattleTimestamps = new Map();
let tradeRequests = new Map();
let lastFeedTimestamps = new Map();
let userPokémon = new Map();
const PATH = join(global.assetsPath, 'gagoOwner.json');

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
  const pokemonImage = (await axios.get("https://i.ibb.co/0CzkrPc/xva213.jpg", {
    responseType: "stream"
  })).data;
  const battleCheckingGif = (await axios.get("https://i.imgur.com/vdgFO0w.gif", {
    responseType: "stream"
  })).data;
  const battle = (await axios.get("https://i.imgur.com/fZgCYe2.gif", {
    responseType: "stream"
  })).data;
  const levelup = (await axios.get("https://i.imgur.com/VIp6w8l.gif", {
    responseType: "stream"
  })).data;
  const evolving = (await axios.get("https://i.imgur.com/RtyKMy0.gif", {
    responseType: "stream"
  })).data;

  if (!message || !message.body) {
    console.error('Invalid message object or message body!');
    return;
  }

  const { senderID, mentions } = message;
  const mentionedUserID = Object.keys(mentions)[0]; // Get the user ID of the mentioned user
  const mentionedUser = await global.controllers.Users.getInfo(mentionedUserID); // Retrieve mentioned user's information

  if (args.length === 0 || args[0] === "menu") {
    const menuOptions = getLang("pokemon.menuOptions");
    return message.reply({
      body: menuOptions,
      attachment: pokemonImage
    });
  }

  if (args[0] === "buy") {
    if (args.length < 2) {
      return message.reply("Please put the food that you want to buy or use food list to see all available food.");
    }
    if (userPokémon.has(senderID)) {
      return message.reply("You already have a food please use food eat, to buy another food");
    }

    const pokemonPrice = 100000;
    const userBalance = await Users.getMoney(senderID);

    if (userBalance < pokemonPrice) {
      return message.reply(getLang("pokemon.buyFailure"));
    }

    const requestedPokemonName = args[1].toLowerCase(); // Convert to lowercase
    const pokemonIndex = pokemonNames.findIndex(name => name.toLowerCase() === requestedPokemonName);

    if (pokemonIndex === -1) {
      return message.reply(`please use food list to see available food to buy`);
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

  if (args[0] === "zwikeksdkdkdk") {
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

  if (args[0] === "wpodkxcmfoddpepepeflkfkkddlls") {
    const userPokemon = userPokémon.get(senderID);
    
    if (!userPokemon) {
      return message.reply(getLang("pokemon.noPokémon"));
    }
    
    const currentLevel = userPokemon.level;
    const maxLevel = 100; // Assuming the maximum level is 100
    
    if (currentLevel >= maxLevel) {
      return message.reply("Your Pokémon is already at the maximum level!");
    }
    
    const lastFeedTime = lastFeedTimestamps.get(senderID) || 0;
    const currentTime = Date.now();
    const cooldownDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    
    const timeSinceLastFeed = currentTime - lastFeedTime;
    
    if (timeSinceLastFeed < cooldownDuration) {
      const remainingCooldown = cooldownDuration - timeSinceLastFeed;
      const remainingCooldownHours = Math.ceil(remainingCooldown / (60 * 60 * 1000));
    
      return message.reply(`Your Pokémon is full and needs time to digest. You can feed it again in ${remainingCooldownHours} hours.`);
    }
    
    // Decrease the user's balance by 1000 credits for feeding
    const feedCost = 50000;
    const userBalance = await Users.getMoney(senderID);
    
    if (feedCost > userBalance) {
      return message.reply(`You don't have ${feedCost.toLocaleString()}$ to feed your Pokémon.`);
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
    const listMessage = `Here is the list of available food to buy:\n\n${availablePokémonList}`;
    return message.reply(listMessage);
  }

  if (args[0] === "wlsppdllflflflfl") {
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
  
    const maxBet = 1000000000; // Maximum bet set to 1 billion
  
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
      ? `Congratulations! Your Pokémon defeated the opponent's Pokémon. \n― You won ${betAmount} credits.`
      : `Oh no! Your Pokémon was defeated by the opponent's Pokémon. \n― You lost ${betAmount} credits.`;
  
    // Update user balance based on battle outcome
    if (battleResult) {
      await Users.increaseMoney(senderID, betAmount);
    } else {
      await Users.decreaseMoney(senderID, betAmount);
    }
  
    const battleCheckingMessage = await message.reply({
      body: "Checking battle results...",
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

  if (args[0] === "wpdoldkdkkdkkd") {
    if (!mentionedUser) {
      return message.reply("You need to mention a user to challenge.");
    }
  
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }
  
    if (!userPokémon.has(mentionedUserID)) {
      return message.reply(`${mentionedUser.name} doesn't have a Pokémon to challenge.`);
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

  if (args[0] === "wooddllddlskd") {
    if (!tradeRequests.has(senderID)) {
      return message.reply("No pending challenge request.");
    }
  
    const { challengerID, betAmount } = tradeRequests.get(senderID);
    if (!userPokémon.has(senderID) || !userPokémon.has(challengerID)) {
      return message.reply("Either you or the challenger doesn't have a Pokémon anymore.");
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
  
    const challengeOutcomeMessage = `𝗪𝗶𝗻𝗻𝗲𝗿: ${winnerName}\n𝗟𝗼𝘀𝗲𝗿: ${loserName}\n━━━━━━━━━━━━━\n𝗕𝗲𝘁: ${formattedBetAmount} credits`;
  
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

  if (args[0] === "eksllsksksks") {
    if (!tradeRequests.has(senderID)) {
      return message.reply("No pending challenge request.");
    }

    // Clear the challenge request
    tradeRequests.delete(senderID);

    return message.reply("You declined the challenge.");
  }

  if (args[0] === "elellddldld") {
    if (!mentionedUser) {
      return message.reply("You need to mention a user to trade with.");
    }

    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    if (!userPokémon.has(mentionedUserID)) {
      return message.reply(`The user ${mentionedUser.name} doesn't have a Pokémon to trade.`);
    }

    tradeRequests.set(mentionedUserID, senderID); // Store the trade request with the target user's ID

    return message.reply(`Trade requested with ${mentionedUser.name}. The other user must type "pokemon confirm @user" to agree.`);
  }

  if (args[0] === "slelslslsldl") {
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

  if (args[0] === "eat") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    const userPokemon = userPokémon.get(senderID);
    if (!userPokemon.value || userPokemon.value === 0) {
      return message.reply("Your hunger bar is full please comeback later.");
    }

    const userBalance = await Users.getMoney(senderID);
    const collectAmount = userPokemon.value;

    await Users.increaseMoney(senderID, collectAmount);
    userPokemon.value = 0; // Reset the collected value
    saveUserPokémon();

   userPokémon.delete(senderID);
    saveUserPokémon();
    
    const collectMessage = `eating...`;
    return message.reply(collectMessage);
  }

  if (args[0] === "eat") {
    if (!userPokémon.has(senderID)) {
      return message.reply("You don't have a food to eat.");
    }

    // Remove the user's current Pokémon
    userPokémon.delete(senderID);
    saveUserPokémon();

    const releaseMessage = "Your food is now done eating."
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