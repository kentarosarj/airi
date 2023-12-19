const config = {
  name: "admins",
  aliases: ["ads"],
  version: "1.0.1",
  description: "List, Add or remove group Admins",
  permissions: [0, 1, 2],
  cooldown: 5,
  credits: "Isai Ivanov"
}

async function onCall({ message, args, data, userPermissions }) {
  const { type, messageReply, mentions, senderID, threadID, reply } = message;
  const { Users, Threads } = global.controllers;
  
  // Assuming you have correctly defined adminIDs and global.botID
  const adminIDs = []; // Replace with your actual admin IDs
  const botID = "your-bot-id"; // Replace with your actual bot ID

  const threadInfo = await Threads.getInfoAPI(threadID);
  const threadAdminIDs = threadInfo.adminIDs || []; // Initialize as an empty array if undefined

  try {
    const isGroupAdmin = userPermissions.some(p => p == 1);

    let query = args[0]?.toLowerCase();
    switch (query) {
      case "add":
        {
          if (!threadAdminIDs.some(e => e.id == botID)) return reply("Bot needed to be an admin!");
          if (!isGroupAdmin) return reply("You dont have enough permission use this command");

          let success = [];
          if (type == "message_reply") {
            let userID = messageReply.senderID;
            if (threadAdminIDs.some(e => e.id == userID)) return reply('This user is already an admin');
            // Add code to change admin status here
            // global.api.changeAdminStatus(threadID, userID, true);
            success.push({
              id: userID,
              name: (await global.controllers.Users.getInfo(userID))?.name || userID
            });
          } else if (Object.keys(mentions).length > 0) {
            for (const userID in mentions) {
              // Add code to change admin status here
              // global.api.changeAdminStatus(threadID, userID, true);
              if (threadAdminIDs.some(e => e.id == userID)) reply(`${(await global.controllers.Users.getInfo(userID))?.name} is already an admin`);
              success.push({
                id: userID,
                name: (await global.controllers.Users.getInfo(userID))?.name || userID
              });
            }
          } else return reply("Please mention or reply to someone");

          reply({
            body: `Added ${success.map(user => user.name).join(", ")} as Admin`,
            mentions: success.map(user => ({ tag: user.name, id: user.id }))
          });
          break;
        }
      // Add cases for "remove" and "list" commands here
      // ...
      default:
        {
          const adminlist = threadAdminIDs.map(e => e.id);
          let msg = "Group Admins:\n";
          let arraytag = []
          for (let i = 0; i < adminlist.length; i++) {
            let Name = (await global.controllers.Users.getName(adminlist[i])) || "Facebook user";
            msg += `• ${Name} - ${adminlist[i]}\n`;
            let tagss = { id: adminlist[i], tag: Name };
            arraytag.push(tagss);
          }
          console.log(arraytag)
          reply({
            body: msg,
            mentions: arraytag
          });
          break;
        }
    }
  } catch (error) {
    reply(`${error}`);
    console.log(error);
  }
  return;
}

export default {
  config,
  onCall
}
