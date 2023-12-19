import fetch from "node-fetch";

const config = {
  "name": "sim",
  "aliases": ["simsimi"],
  "description": "Chat with Sim",
  "usage": "<text>",
  "cooldown": 3,
  "permissions": [0, 1, 2],
  "credits": "WaifuCat(Fixed by Dymyrius)",
  "extra": {}
};

async function onCall({message, args}) {
  const text = encodeURIComponent(args.join(" "));
  const url = `https://api.simsimi.net/v2/?text=${text}&lc=en`;
  const apiResponse = await fetch(url);
  const responseJson = await apiResponse.json();

  if (responseJson.success) {
    message.reply(responseJson.success);
  } else {
    message.reply("Sorry, I couldn't understand your message.");
  }
}

export default {
  config,
  onCall,
};