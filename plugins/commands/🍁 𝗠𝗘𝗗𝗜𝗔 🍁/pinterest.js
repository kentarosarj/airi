import axios from 'axios';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const config = {
  name: 'pinterest',
  version: '1.0.0',
  credits: 'Joshua Sy (Converted by Dymyrius)',
  description: 'Image search',
  usages: '<query> - <amount>',
  cooldowns: 0,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cacheFolder = __dirname + '/cache';

// Function to create the cache folder if it doesn't exist
async function ensureCacheFolderExists() {
  try {
    await fs.ensureDir(cacheFolder);
  } catch (error) {
    console.error('Error creating cache folder:', error);
  }
}

async function onCall({ api, message, args, prefix }) {
  const { messageID, threadID } = message;
  const keySearch = args.join(' ');
  if (!keySearch.includes('-')) {
    return global.api.sendMessage(
      `Invalid usage!\nExample: ${prefix}pinterest Zoro - 10 (Depends on you how many images you want to appear in the result).`,
      threadID,
      messageID
    );
  }
  const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
  const numberSearch = keySearch.split('-').pop() || 6;

  // Ensure that the cache folder exists
  await ensureCacheFolderExists();

  await message.react("⏳");
  const res = await axios.get(`https://api.samirthakuri.repl.co/api/pinterest?search=${encodeURIComponent(keySearchs)}`);
  const data = res.data.data;
  var num = 0;
  var imgData = [];
  for (var i = 0; i < parseInt(numberSearch); i++) {
    let path = cacheFolder + `/${(num += 1)}.jpg`;
    let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
    imgData.push(fs.createReadStream(cacheFolder + `/${num}.jpg`));
  }
  message.react("✅");
  global.api.sendMessage(
    {
      attachment: imgData,
      body: `${numberSearch} Search results for keyword: ${keySearchs}`,
    },
    threadID,
    messageID
  );
  for (let ii = 1; ii < parseInt(numberSearch); ii++) {
    fs.unlinkSync(cacheFolder + `/${ii}.jpg`);
  }
}

export default {
  config,
  onCall,
};