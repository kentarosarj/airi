const config = {
    name: "offbot",
    aliases: ["turnoff", "shutdown"],
    permissions: [2],
    isAbsolute: true
}

async function onCall({ message, getLang }) {
    await message.reply("Shutting down...");
    global.shutdown();
}

export default {
    config,
    onCall,
    getLang
}