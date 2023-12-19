import { cpu, time, cpuTemperature, currentLoad, memLayout, diskLayout, mem, osInfo }  from "systeminformation";

const config = {
	    name: "system",
    description: "get system information",
    usage: "",
    cooldown: 3,
    permissions: [2],
    credits: "Isai Ivanov"
};

function byte2mb(bytes) {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let l = 0, n = parseInt(bytes, 10) || 0;
	while (n >= 1024 && ++l) n = n / 1024;
	return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)}${units[l]}`;
}

export async function onCall({ message, userPermissions }) {
	const isGroupAdmin = userPermissions.some(p => p == 2, 3);
	
	const timeStart = Date.now();

	try {
		if (!isGroupAdmin) return message.reply("You don’t have enough permission to use this command.");
		var { manufacturer, brand, speedMax, physicalCores, cores } = await cpu();
		var { main: mainTemp } = await cpuTemperature();
		var { currentLoad: load } = await currentLoad();
		var { uptime } = await time();
		var diskInfo = await diskLayout();
		var memInfo = await memLayout();
		var { total: totalMem, available: availableMem } = await mem();
		var { platform: OSPlatform, build: OSBuild } = await osInfo();;
		var disk = [], i = 1;

		var hours = Math.floor(uptime / (60 * 60));
		var minutes = Math.floor((uptime % (60 * 60)) / 60);
		var seconds = Math.floor(uptime % 60);
		if (hours < 10) hours = "0" + hours;
		if (minutes < 10) minutes = "0" + minutes;
		if (seconds < 10) seconds = "0" + seconds;

		for (const singleDisk of diskInfo) {
			disk.push(
				`==== 「 DISK ${i++} 」 ====\n` +
				"Name: " + singleDisk.name + "\n" +
				"Type: " + singleDisk.interfaceType + "\n" + 
				"Size: " + byte2mb(singleDisk.size) + "\n" +
				"Temperature: " + singleDisk.temperature + "°C"
			)
		}
		if (isGroupAdmin) return message.reply(
			"====== System Info ======\n" +
			"==== 「 CPU 」 ====\n" +
			"CPU Model: " + manufacturer + " " + brand + " " + speedMax + "GHz\n" +
			"Cores: " + cores + "\n" +
			"Threads: " + physicalCores + "\n" +
			"Temperature: " + mainTemp + "°C\n" +
			"Load: " + load + "%\n" +
			"==== 「 MEMORY 」 ====\n" +
			"Size: " + byte2mb(memInfo[0].size) +
			"\nType: " + memInfo[0].type +
			"\nTotal: " + byte2mb(totalMem) +
			"\nAvailable: " + byte2mb(availableMem) + "\n" +
			disk.join("\n") + "\n" +
			"==== 「 OS 」 ====\n" +
			"Platform: " + OSPlatform +
			"\nBuild: " + OSBuild +
			"\nUptime: " + hours + ":" + minutes + ":" + seconds +
			"\nPing: " + (Date.now() - timeStart) + "ms",
			
		)
	}
	catch (e) {
      message.reply(error);
	}
      }
export default {
    config,
    onCall
  }