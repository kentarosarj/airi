import axios from 'axios';

const config = {
  name: "tictactoe",
  aliases: ["ttt", "tic", "t"],
  description: "Play a Tic-Tac-Toe game with another player.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Gauxy (fixed by Dymyrius)",
}

const BOARD_SIZE = 3;
const EMPTY_CELL = ' ';
const PLAYER_X = '❌';
const PLAYER_O = '⭕';

function createEmptyBoard() {
  return Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(EMPTY_CELL));
}

function printBoard(board) {
  let result = '';
  for (let i = 0; i < BOARD_SIZE; i++) {
    result += board[i].map(cell => cell === EMPTY_CELL ? '⬜' : cell).join(' | ') + '\n';
    if (i < BOARD_SIZE - 1) {
      result += '━━━━━━\n';
    }
  }
  return result;
}

function checkWin(board, player) {
  // Check rows
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
      return true;
    }
  }

  // Check diagonals
  if ((board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
    (board[0][2] === player && board[1][1] === player && board[2][0] === player)) {
    return true;
  }

  return false;
}

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  global.boards || (global.boards = new Map());
  const tictac = (await axios.get("https://i.imgur.com/rcJsD9X.png", {
    responseType: "stream"
  })).data;
  const board = global.boards.get(message.threadID) || createEmptyBoard();

  if (args[0] === "create") {
    if (global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » A game is already in progress in this group.", message.threadID, message.messageID);
    }

    const betAmount = parseInt(args[1]);
    if (!betAmount || isNaN(betAmount) || betAmount < 500) {
      return global.api.sendMessage("[🎮] » You need to enter a valid bet amount (minimum 500$).", message.threadID, message.messageID);
    }

    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney < betAmount) {
      return global.api.sendMessage(`[🎮] » You don't have enough money to create a game with a bet of ${betAmount}$.`, message.threadID, message.messageID);
    }

    global.boards.set(message.threadID, {
      board,
      players: [message.senderID],
      host: message.senderID,
      currentPlayer: message.senderID,
      betAmount,
      started: false,
    });

    return global.api.sendMessage(`[🎮] » A Tic-Tac-Toe game with a bet of ${betAmount}$ has been created. Use /t join to join the game.`, message.threadID);
  }

  if (args[0] === "join") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » There is no ongoing Tic-Tac-Toe game in this group. Use /t create to start one.", message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (room.started) {
      return global.api.sendMessage("[🎮] » The game has already started. You can't join now.", message.threadID, message.messageID);
    }

    if (room.players.length >= 2) {
      return global.api.sendMessage("[🎮] » The game is already full. You can't join now.", message.threadID, message.messageID);
    }

    if (room.players.includes(message.senderID)) {
      return global.api.sendMessage("[🎮] » You have already joined the game.", message.threadID, message.messageID);
    }

    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney < room.betAmount) {
      return global.api.sendMessage(`[🎮] » You don't have enough money to join the game. You need ${room.betAmount}$ to join.`, message.threadID, message.messageID);
    }

    const playerInfo = await global.controllers.Users.getInfo(message.senderID);
    const playerName = playerInfo?.name || message.senderID;
    room.players.push(message.senderID);
    global.boards.set(message.threadID, room);

    return global.api.sendMessage(`[🎮] » ${playerName} has joined the Tic-Tac-Toe game.`, message.threadID);
  }

  if (args[0] === "start") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » There is no ongoing Tic-Tac-Toe game in this group. Use /t create to start one.", message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (room.host !== message.senderID) {
      return global.api.sendMessage("[🎮] » Only the host can start the game.", message.threadID, message.messageID);
    }

    if (room.players.length !== 2) {
      return global.api.sendMessage("[🎮] » The game requires two players to start.", message.threadID, message.messageID);
    }

    if (room.started) {
      return global.api.sendMessage("[🎮] » The game has already started.", message.threadID, message.messageID);
    }

    // Randomly choose the player who makes the first move
    const firstPlayerIndex = Math.floor(Math.random() * 2);
    room.currentPlayer = room.players[firstPlayerIndex];
    room.started = true;

    global.boards.set(message.threadID, room);
    const firstPlayerInfo = await global.controllers.Users.getInfo(room.currentPlayer);
    const firstPlayerName = firstPlayerInfo?.name || room.currentPlayer;

    return global.api.sendMessage(`[🎮] » The Tic-Tac-Toe game has started! ${firstPlayerName} will make the first move.`, message.threadID);
  }

  if (args[0] === "play") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » There is no ongoing Tic-Tac-Toe game in this group. Use /t create to start one.", message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (!room.started) {
      return global.api.sendMessage("[🎮] » The game has not started yet.", message.threadID, message.messageID);
    }

    if (!room.players.includes(message.senderID)) {
      return global.api.sendMessage("[🎮] » You are not part of the game. Use /t join to join the game.", message.threadID, message.messageID);
    }

    if (message.senderID !== room.currentPlayer) {
      return global.api.sendMessage("[🎮] » It's not your turn to play.", message.threadID, message.messageID);
    }

    const currentPlayerSymbol = message.senderID === room.players[0] ? PLAYER_X : PLAYER_O;
    const row = parseInt(args[1]) - 1;
    const col = parseInt(args[2]) - 1;

    if (isNaN(row) || isNaN(col) || row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return global.api.sendMessage("[🎮] » Invalid move. Please enter a valid row and column number to make a move.", message.threadID, message.messageID);
    }

    if (room.board[row][col] !== EMPTY_CELL) {
      return global.api.sendMessage("[🎮] » The cell is already occupied. Choose an empty cell to make your move.", message.threadID, message.messageID);
    }

    room.board[row][col] = currentPlayerSymbol;
    const currentBoard = printBoard(room.board);
    global.api.sendMessage(currentBoard, message.threadID);

    if (checkWin(room.board, currentPlayerSymbol)) {
      const playerInfo = await global.controllers.Users.getInfo(message.senderID);
      const playerName = playerInfo?.name || message.senderID;

      // Calculate the amount won based on the bet amount
      const winnings = room.betAmount * 2; // You can adjust the calculation as needed

      // Inform the user about the win and the amount they received
      global.api.sendMessage(`[🎮 🏆] » ${playerName} has won the Tic-Tac-Toe game and received ${winnings}$!`, message.threadID);

      // Update the user's money balance
      await Users.increaseMoney(message.senderID, winnings);

      // Calculate the amount lost by the opponent
      const opponentID = room.players.find(playerID => playerID !== message.senderID);
      const lostAmount = room.betAmount;

      // Deduct the lost amount from the opponent's money
      await Users.decreaseMoney(opponentID, lostAmount);

      // Delete the game from the ongoing games list
      global.boards.delete(message.threadID);

    } else if (room.board.every(row => row.every(cell => cell !== EMPTY_CELL))) {
      global.api.sendMessage("[🎮 🤝] » The game ended in a draw!", message.threadID);
      global.boards.delete(message.threadID);

    } else {
      // Switch to the next player's turn
      const nextPlayerIndex = (room.players.indexOf(message.senderID) + 1) % 2;
      room.currentPlayer = room.players[nextPlayerIndex];
      global.boards.set(message.threadID, room);
    }

    return;
  }

  if (args[0] === "end") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » There is no ongoing Tic-Tac-Toe game in this group.", message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (room.host !== message.senderID) {
      return global.api.sendMessage("[🎮] » Only the host can end the game.", message.threadID, message.messageID);
    }

    global.api.sendMessage("[🎮] » The game has been ended by the host.", message.threadID);
    global.boards.delete(message.threadID);
    return;
  }

  if (!args[0]) {
    return global.api.sendMessage({
      body: "»〘𝐓𝐈𝐂-𝐓𝐀𝐂-𝐓𝐎𝐄〙«\n1. *t create <bet amount> => Create a new Tic-Tac-Toe game with a bet.\n2. *t join => Join an ongoing Tic-Tac-Toe game.\n3. *t start => Start the game (only the host can start).\n4. *t play <row> <column> => Make a move in the game.\n5. *t end => End the game (only the host can end).\nNote: The game can only be started by the host.",
      attachment: tictac,
    }, message.threadID);
  }
}

export default {
  config,
  onCall
}
