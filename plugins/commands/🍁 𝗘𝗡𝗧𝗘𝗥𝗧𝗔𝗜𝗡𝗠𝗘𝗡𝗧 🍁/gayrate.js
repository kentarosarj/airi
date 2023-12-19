const config = {
name: "gayrate",
aliases: ["howgay"],
description: "Generate a random percentage of how gay you are",
usage: "gayrate",
cooldown: 300,
permissions: [0, 1, 2],
credits: "",
extra: {}
}

const langData = {
"en_US": {
"rolled": "🌈 You are {result}% gay!"
}
}

async function onCall({ message, args, getLang }) {
const result = Math.floor(Math.random() * 101); // generate a random percentage between 0 and 100 (inclusive)
message.reply(getLang("rolled", {result}));
}

export default {
config,
langData,
onCall
}