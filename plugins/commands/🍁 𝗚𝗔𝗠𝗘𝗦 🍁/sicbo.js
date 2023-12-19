const config = {
    name: "sicbo",
    _name: {
        "vi_VN": "taixiu"
    },
    aliases: ["taixiu", "tx"],
    description: "Play sicbo with bot.",
    usage: "[tai/xiu] [bet] | [big/small] [bet] (default bet is 50)",
    credits: "XaviaTeam",
    extra: {
        minbet: 50
    }
}

const langData = {
    "en_US": {
        "sicbo.userNoData": "Your data is not ready yet.",
        "sicbo.invalidChoice": "Invalid choice, available choices:\n{small}\n{big}",
        "sicbo.notEnoughMoney": "Not enough money.",
        "sicbo.minMoney": "Minimum bet is {min} 💵.",
        "sicbo.win": "{dices}\nYou won {money} XC.",
        "sicbo.lose": "{dices}\nYou lost {money} 💵.",
        "sicbo.result_1": "small",
        "sicbo.result_2": "big",
        "sicbo.result_0": "triples",
        "any.error": "An error has occurred, try again later."
    },
    "vi_VN": {
        "sicbo.userNoData": "Dữ liệu của bạn chưa sẵn sàng.",
        "sicbo.invalidChoice": "Lựa chọn không hợp lệ, các lựa chọn có sẵn:\n{small}\n{big}",
        "sicbo.notEnoughMoney": "Không đủ tiền.",
        "sicbo.minMoney": "Cược tối thiểu là {min} XC.",
        "sicbo.win": "{dices}\nBạn đã thắng {money} XC.",
        "sicbo.lose": "{dices}\nBạn đã thua {money} XC.",
        "sicbo.result_1": "xỉu",
        "sicbo.result_2": "tài",
        "sicbo.result_0": "ba nút bằng nhau",
        "any.error": "Đã xảy ra lỗi, vui lòng thử lại sau."
    },
    "ar_SY": {
        "sicbo.userNoData": "البيانات الخاصة بك ليست جاهزة بعد.",
        "sicbo.invalidChoice": "خيار غير صالح ، الخيارات المتاحة:\n{small}\n{big}",
        "sicbo.notEnoughMoney": "مال غير كاف.",
        "sicbo.minMoney": "الحد الأدنى للرهان هو {min} XC.",
        "sicbo.win": "{dices}\nلقد فزت {money} XC.",
        "sicbo.lose": "{dices}\nلقد خسرت {money} XC.",
        "sicbo.result_1": "صغير",
        "sicbo.result_2": "كبير",
        "sicbo.result_0": "ثلاث مرات",
        "any.error": "حدث خطأ ، حاول مرة أخرى في وقت لاحق."
    }
}

const small = ["small", "s", "xỉu", "xiu", "x"];
const big = ["big", "b", "tài", "tai", "t"];

async function onCall({ message, args, extra, getLang }) {
    const { Users } = global.controllers
    const choice = args[0];
    const bet = BigInt(args[1] || extra.minbet);

    if (!choice || (!big.includes(choice) && !small.includes(choice)))
        return message.reply(getLang("sicbo.invalidChoice", { small: small.join(", "), big: big.join(", ") }));

    try {
        const userMoney = await Users.getMoney(message.senderID) || null;
        if (userMoney === null) return message.reply(getLang("sicbo.userNoData"));
        if (BigInt(userMoney) < bet) return message.reply(getLang("sicbo.notEnoughMoney"));
        if (bet < BigInt(extra.minbet)) return message.reply(getLang("sicbo.minMoney", { min: extra.minbet }));

        await Users.decreaseMoney(message.senderID, bet);
        const valueIncreaseIfWin = BigInt(bet) * BigInt(2);

        const valueToPass = big.includes(choice) ? "tai" : "xiu";
        const { dices, results } = (await global.GET(`${global.xva_api.main}/taixiu/${valueToPass}`)).data;
        if (results === "thắng") await Users.increaseMoney(message.senderID, valueIncreaseIfWin);

        const _dices = dices
            .replace("3 nút bằng nhau", getLang("sicbo.result_0"))
            .replace("tài", getLang("sicbo.result_2"))
            .replace("xỉu", getLang("sicbo.result_1"));

        const _results = results === "thắng" ? "win" : "lose";
        message.reply(getLang(`sicbo.${_results}`, {
            dices: _dices,
            money: String(bet)
        }));
    } catch (error) {
        console.error(error);
        return message.reply(getLang("any.error"));
    }
}

export default {
    config,
    langData,
    onCall
}
