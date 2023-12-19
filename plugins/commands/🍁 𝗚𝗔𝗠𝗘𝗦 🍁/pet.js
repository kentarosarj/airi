import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "pet",
  aliases: ["animal"],
  description: "Buy, feed, and sell your virtual pet",
  usage: "<buy/feed/check/sell>",
  cooldown: 6,
  credits: "Gauxy"
};

const langData = {
  "en_US": {
    "pet.buySuccess": "⌜🎊⌟ : \n—  Congratulations, you've adopted a new pet named {petName}! ",
    "pet.buyFailure": "⌜🤦🏻‍♂️⌟ : \n—  You already have a pet. Take care of it!",
    "pet.feedSuccess": "⌜🍖⌟ : \n—  You fed {petName}. It looks happier now! 💕",
    "pet.feedCost": "⌜💰⌟ : \n— Feeding {petName} costs ${feedCost}.",
    "pet.feedFailure": "⌜🙅🏻‍♂️⌟ : \n— You can't feed a pet you don't own.",
    "pet.noPet": "⌜🤷🏻‍♂️⌟ : \n— You don't have a pet. Use `pet buy` to get one.",
    "pet.checkInfo": "⌜💁🏻‍♂️⌟ : \n— Your pet {petName} has grown worth ${petValue}💰. Don't forget to feed it.",
    "pet.sellSuccess": "⌜💰⌟ : \n— You sold {petName} for ${amount}. Goodbye, little friend!",
    "pet.sellFailure": "⌜🙅🏻‍♂️⌟ : \n—  You can't sell a pet.",
  }
};

let petOwners = new Map();
const GROWTH_INTERVAL = 2 * 60 * 60 * 1000; // Slower growth interval (2 hours)
const PATH = join(global.assetsPath, 'pet_owners.json');

function loadPetOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    petOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load pet owners:', err);
  }
}

function savePetOwners() {
  try {
    const data = JSON.stringify([...petOwners]);
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save pet owners:', err);
  }
}

function updatePetGrowth() {
  const currentTime = Date.now();
  petOwners.forEach((pet, ownerID) => {
    const growthPercentage = pet.growthFactor || 0.01;
    const elapsedTime = currentTime - pet.lastFed;
    const growthCycles = Math.floor(elapsedTime / GROWTH_INTERVAL);

    if (growthCycles > 0) {
      const newPetValue = Math.floor(pet.value * Math.pow(1 + growthPercentage, growthCycles));
      pet.value = newPetValue;
      pet.lastFed = currentTime;
    }
  });
}

loadPetOwners();

async function onCall({ message, getLang, args }) {
  const feeding = (await axios.get("https://i.imgur.com/82Knrjb.gif", {
    responseType: "stream"
  })).data;
  const pets = (await axios.get("https://i.imgur.com/uiq7lEw.png", {
    responseType: "stream"
  })).data;
  const { Users } = global.controllers;

  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;

  async function decreaseMoney(ownerID, amount) {
    await Users.decreaseMoney(ownerID, amount);
  }

  updatePetGrowth();

  if (args.length === 0 || args[0] === "menu") {
    return message.reply({
      body: "『 𝗣𝗘𝗧 𝗠𝗘𝗡𝗨 』\n1. `pet buy <petname> <amount>` » adopt a pet.\n2. `pet feed` » feed your pet.\n3. `pet check` » check your pet's value.\n4. `pet sell` » sell your pet and earn money.",
      attachment: pets
    });
  }

if (args[0] === "buy") {
  if (args.length < 3) {
    return message.reply("⌜💁🏻‍♂️⌟ : \n— Please provide a valid name and amount for your new pet.");
  }

  if (petOwners.has(senderID)) {
    return message.reply(getLang("pet.buyFailure"));
  }

  const petName = args[1];
  const amount = parseInt(args[2]);

  if (!petName || isNaN(amount) || amount <= 0) {
    return message.reply("⌜💁🏻‍♂️⌟ : \n— Please provide a valid name and amount for your new pet.");
  }

  // Limit the purchase amount to 5 billion
  const maxPurchaseAmount = 5000000000; // 5 billion
  if (amount > maxPurchaseAmount) {
    return message.reply("⌜🙅🏻‍♂️⌟ : \n— You can't buy a pet for more than 5 billion.");
  }

  const userBalance = await Users.getMoney(senderID);

  if (userBalance < amount) {
    return message.reply("⌜🙅🏻‍♂️⌟ : \n— You don't have enough balance to buy a pet.");
  }

  petOwners.set(senderID, {
    name: petName,
    value: amount,
    lastFed: Date.now()
  });

  await decreaseMoney(senderID, amount); // Decrease user's money
  savePetOwners();

  const buySuccessMessage = getLang("pet.buySuccess").replace("{petName}", petName);
  return message.reply(buySuccessMessage);
}


  if (args[0] === "feed") {
    if (!petOwners.has(senderID)) {
      return message.reply(getLang("pet.noPet"));
    }

    const petData = petOwners.get(senderID);
    const petValue = petData.value;
    const feedCost = 100; // Replace with the actual feed cost value

    if (petValue < feedCost) {
      return message.reply("⌜🤦🏻‍♂️⌟ : \n— You don't have enough value to feed your pet.");
    }

    await Users.decreaseMoney(senderID, feedCost);
    petData.value -= feedCost;
    petData.lastFed = Date.now();

    savePetOwners();

    const feedSuccessMessage = getLang("pet.feedSuccess")
      .replace("{petName}", petData.name)
      .replace("{amount}", feedCost);
    return message.reply({
      body: feedSuccessMessage,
      attachment: feeding});
  }

  if (args[0] === "check") {
    if (!petOwners.has(senderID)) {
      return message.reply(getLang("pet.noPet"));
    }

    const petData = petOwners.get(senderID);
    const petValue = petData.value;

    const currentTime = Date.now();
    const elapsedTime = currentTime - petData.lastFed;
    const growthCycles = Math.floor(elapsedTime / GROWTH_INTERVAL);

    const growthFactor = petData.growthFactor || 0.01; // Retrieve growthFactor from petData
    const newPetValue = Math.floor(petValue * Math.pow(1 + growthFactor, growthCycles));

    const ageInMinutes = Math.floor(elapsedTime / (60 * 1000));

    const checkMessage = getLang("pet.checkInfo")
      .replace("{petName}", petData.name)
      .replace("{petValue}", newPetValue)
      .replace("{ageInMinutes}", ageInMinutes)
      .replace("{growthFactor}", growthFactor)
      .replace("{growthCycles}", growthCycles); // Replace the placeholder with the actual value
    return message.reply(checkMessage);
  }

  if (args[0] === "sell") {
    if (!petOwners.has(senderID)) {
      return message.reply(getLang("pet.noPet"));
    }

    const petData = petOwners.get(senderID);
    const petValue = petData.value;

    await Users.increaseMoney(senderID, petValue);
    petOwners.delete(senderID);
    savePetOwners();

    return message.reply(getLang("pet.sellSuccess").replace("{petName}", petData.name).replace("{amount}", petValue));
  }

  return message.reply({
    body: "『 𝗣𝗘𝗧 𝗠𝗘𝗡𝗨 』\n1. `pet buy <petname> <amount>` » adopt a pet.\n2. `pet feed` » feed your pet.\n3. `pet check` » check your pet's value.\n4. `pet sell` » sell your pet and earn money.",
  });
}

export default {
  config,
  langData,
  onCall
};

  