const config = {
    name: "trash",
    description: "Delete this trash!",
    usage: "[mention/reply]",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "Isai Ivanov"
}

async function onCall ({ message, args }) {
  const { type, messageReply, senderID, mentions } = message;
  let id = undefined;
  if (type == 'message_reply') { id = messageReply.senderID }
  else if (Object.keys(mentions).length > 0)  { id = Object.keys(mentions)[0] }
  else { id = senderID }
  let imageStream = await global.getStream(`http://tanjiro-api.onrender.com/delete?uid=${id}&api_key=tanjiro`);
  try {
  message.reply({ body: "Are you sure you want to delete this trash?", attachment: [imageStream]})
  } catch (e) {
    console.log(e)
    return message.reply("An error occurred, please try again later!")
  }
}

export {
  onCall,
  config
}