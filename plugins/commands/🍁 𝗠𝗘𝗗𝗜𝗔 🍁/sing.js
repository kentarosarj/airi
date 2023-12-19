import axios from 'axios';
import fs from 'fs-extra';
import ytdl from 'ytdl-core';
import request from 'request';
import yts from 'yt-search';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const config = {
  name: 'sing',
  version: '2.0.4',
  credits: 'KSHITIZ/kira (Converted by Dymyrius)',
  description: 'Play a song with lyrics.',
  usages: '[title]',
  cooldowns: 5,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function onCall({ message }) {
  const { messageID, threadID, body, senderID, reply } = message;
  const input = body;
  const text = input.substring(12);
  const data = input.split(' ');

  if (data.length < 2) {
    return global.api.sendMessage('Please write music name.', threadID, messageID);
  }

  data.shift();
  const song = data.join(' ');

  try {
    await message.reply(`Searching for "${song}". ⏳`)

    const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(song)}`);
    const lyrics = res.data.lyrics || 'Not found!';
    const title = res.data.title || 'Not found!';
    const artist = res.data.artist || 'Not found!';

    const searchResults = await yts(song);
    if (!searchResults.videos.length) {
      return global.api.sendMessage('Error: Invalid request.', threadID, messageID);
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: 'audioonly' });

    const fileName = `${senderID}.mp3`;
    const cacheDir = __dirname + '/cache'; 
    
    if (!fs.existsSync(cacheDir))
    {
      fs.mkdirSync(cacheDir, { recursive: true }); 
    }
    
    const filePath = __dirname + `/cache/${fileName}`;

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      console.info('[DOWNLOADER] Downloaded');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return global.api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', threadID, messageID);
      }

      const message = {
        body: `❏ 𝗧𝗶𝘁𝗹𝗲: ${title}\n❏ 𝗔𝗿𝘁𝗶𝘀𝘁: ${artist}\n━━━━━━[𝗟𝘆𝗿𝗶𝗰𝘀]━━━━━━\n${lyrics}`,
        attachment: fs.createReadStream(filePath),
      };
      reply(message, threadID, (err) => {
        if (err) {
          console.error('[ERROR]', err);
                             }
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('[ERROR]', error);
    global.api.sendMessage('Try again later.', threadID, messageID);
  }
};

export default {
  config,
  onCall,
};
