import axios from 'axios'; 

const config = {
    name: "anya",
    aliases: ["sayv2", "jb", "vc"],
    description: "Convert text fragments to Japanese speech",
    usage: '[text]',
    credits: "WaifuCat"
}

const langData = {
    "en_US": {
        "notext": "Please enter text !"
    },
    "vi_VN": {
        "notext": "Vui lòng nhập nội dung !"
    }
}

async function onCall({ message, args, getLang }) {
    const { reply } = message;
    const text = args.join(" ").toLowerCase(); 

    if (args.length === 0) {
        reply(getLang("notext"));
        return;
    }

    try {
        const response = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${text}&speaker=3&fbclid=IwAR01Y4UydrYh7kvt0wxmExdzoFTL30VkXsLZZ2HjXjDklJsYy2UR3b9uiHA`);
        const { mp3StreamingUrl } = response.data;
        const stream = await getStream(mp3StreamingUrl); 
        reply({ attachment: stream });
    } catch (err) {
        console.error(err);
        reply("Error");
    }

    return;
}

export default {
    config,
    langData,
    onCall
}