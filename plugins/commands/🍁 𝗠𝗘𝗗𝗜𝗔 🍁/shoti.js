module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  credits: "libyzxy0",
  description: "Generate random tiktok girl videos",
  hasPermssion: 0,
  commandCategory: "other",
  usage: "[shoti]",
  cooldowns: 1,
  dependencies: [],
  usePrefix: true,
};

module.exports.run = async function({ api, event }) {
  const axios = require("axios");
  const request = require('request');
  const fs = require("fs"); 
api.sendMessage(`⏱️ | Sending Shoti Please Wait...`, event.threadID, event.messageID);
  let data = await axios.get('https://shoti-api.libyzxy0.repl.co/api/get-shoti?apikey=shoti-1h708cngd8l38mgb77');
  var file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
  var rqs = request(encodeURI(data.data.data.url));
  console.log('Shoti Downloaded >>> ' + data.data.data.id)
  rqs.pipe(file);
  file.on('finish', () => {
    return api.sendMessage({
      attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
    }, event.threadID, event.messageID)
  })
};