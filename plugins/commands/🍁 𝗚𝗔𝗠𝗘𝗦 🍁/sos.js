import axios from 'axios';

const config = {
  name: "sos",
  aliases: [],
  description: "Play S-O-S game with another player.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Dymyrius",
};

const BOARD_SIZE = 5; // Modified to a 5x5 grid
const EMPTY_CELL = ' ';
const PLAYER_X = '🆂'; // Updated symbol for player X (S)
const PLAYER_O = '🇴'; // Updated symbol for player O (O)

function createEmptyBoard() {
  return Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(EMPTY_CELL));
}

function printBoard(board) {
  let result = '';
  for (let i = 0; i < BOARD_SIZE; i++) {
    result += board[i].map(cell => cell === EMPTY_CELL ? '⬜' : cell).join(' | ') + '\n';
    if (i < BOARD_SIZE - 1) {
      result += '━━━━━━━━━━\n';
    }
  }
  return result;
}

  // Modify the checkWin function to handle 5x5 grid
function checkWin(board, player) {
  let count = 0;

  // Check rows, columns, and diagonals for SOS formations
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === player) {
        // Check horizontal
        if (j + 2 < BOARD_SIZE && board[i][j + 1] === player && board[i][j + 2] === player) {
          count++;
        }
        // Check vertical
        if (i + 2 < BOARD_SIZE && board[i + 1][j] === player && board[i + 2][j] === player) {
          count++;
        }
        // Check diagonal (bottom right)
        if (i + 2 < BOARD_SIZE && j + 2 < BOARD_SIZE && board[i + 1][j + 1] === player && board[i + 2][j + 2] === player) {
          count++;
        }
        // Check diagonal (bottom left)
        if (i + 2 < BOARD_SIZE && j - 2 >= 0 && board[i + 1][j - 1] === player && board[i + 2][j - 2] === player) {
          count++;
        }
      }
    }
  }

  return count;
}

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  global.boards || (global.boards = new Map());
  const tictac = (await axios.get("https://i.imgur.com/AdT0qyK.png", {
    responseType: "stream"
  })).data;
  const board = global.boards.get(message.threadID) || createEmptyBoard();

  if (args[0] === "create" || args[0] === "c") {
    if (global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » A game is already in progress in this group.", message.threadID, message.messageID);
    }

    const betAmount = parseInt(args[1]);
    if (!betAmount || isNaN(betAmount) || betAmount < 500) {
      return global.api.sendMessage("[🎮] » You need to enter a valid bet amount (minimum ₱500).", message.threadID, message.messageID);
    }

    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney < betAmount) {
      return global.api.sendMessage(`[🎮] » You don't have enough money to create a game with a bet of ₱${betAmount}.`, message.threadID, message.messageID);
    }

    global.boards.set(message.threadID, {
      board,
      players: [message.senderID],
      host: message.senderID,
      currentPlayer: message.senderID,
      betAmount,
      started: false,
    });

    return global.api.sendMessage(`[🎮] » An S-O-S game with a bet of ₱${betAmount} has been created. Use "join" to join the game.`, message.threadID);
  }

  if (args[0] === "join" || args[0] === "j") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage('[🎮] » There is no ongoing S-O-S game in this group. Use "create" to start one.', message.threadID, message.messageID);
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
      return global.api.sendMessage(`[🎮] » You don't have enough money to join the game. You need ₱${room.betAmount} to join.`, message.threadID, message.messageID);
    }

    const playerInfo = await global.controllers.Users.getInfo(message.senderID);
    const playerName = playerInfo?.name || message.senderID;
    room.players.push(message.senderID);
    global.boards.set(message.threadID, room);

    return global.api.sendMessage(`[🎮] » ${playerName} has joined the S-O-S game.`, message.threadID);
  }

  if (args[0] === "start" || args[0] === "s") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage('[🎮] » There is no ongoing S-O-S game in this group. Use "create" to start one.', message.threadID, message.messageID);
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

    return global.api.sendMessage(`[🎮] » The S-O-S game has started! ${firstPlayerName} will make the first move.`, message.threadID);
  }

  if (args[0] === "move" || args[0] === "m") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage('[🎮] » There is no ongoing S-O-S game in this group. Use "create" to start one.', message.threadID, message.messageID);
    }

    const room = global.boards.get(message.threadID);
    if (!room.started) {
      return global.api.sendMessage("[🎮] » The game has not started yet.", message.threadID, message.messageID);
    }

    if (!room.players.includes(message.senderID)) {
      return global.api.sendMessage('[🎮] » You are not part of the game. Use "join" to join the game.', message.threadID, message.messageID);
    }

    if (message.senderID !== room.currentPlayer) {
      return global.api.sendMessage("[🎮] » It's not your turn to play.", message.threadID, message.messageID);
    }

    const currentPlayerSymbol = args[1] === "s" ? PLAYER_X : PLAYER_O; // Updated player symbols
    const row = parseInt(args[2]) - 1;
    const col = parseInt(args[3]) - 1;

    if (isNaN(row) || isNaN(col) || row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return global.api.sendMessage("[🎮] » Invalid move. Please enter a valid row and column number to make a move. For example: -s move 1 2", message.threadID, message.messageID);
    }

    if (room.board[row][col] !== EMPTY_CELL) {
      return global.api.sendMessage("[🎮] » The cell is already occupied. Choose an empty cell to make your move.", message.threadID, message.messageID);
    }

    room.board[row][col] = currentPlayerSymbol;
    const currentBoard = printBoard(room.board);
    global.api.sendMessage(currentBoard, message.threadID);

    if (checkWin(room.board, currentPlayerSymbol) > checkWin(room.board, (currentPlayerSymbol === PLAYER_X) ? PLAYER_O : PLAYER_X)) {
      // Calculate the amount won based on the bet amount and SOS formations
      const sosFormations = checkWin(room.board, currentPlayerSymbol);
      const winnings = room.betAmount * sosFormations;
    
      const playerInfo = await global.controllers.Users.getInfo(message.senderID);
      const playerName = playerInfo?.name || message.senderID;
    
      let sosAnnouncement = `[🎮 🏆] » ${playerName} has won the SOS game with ${sosFormations} SOS formations and received ₱${winnings}!\n`;
    
      // Iterate through the board to find SOS formations and announce their positions
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (room.board[i][j] === currentPlayerSymbol) {
            // Check horizontal, vertical, and diagonal formations
            // If an SOS sequence is found, announce its position
            if (j + 2 < BOARD_SIZE && room.board[i][j + 1] === currentPlayerSymbol && room.board[i][j + 2] === currentPlayerSymbol) {
              sosAnnouncement += `SOS formed at (${i + 1},${j + 1}), (${i + 1},${j + 2}), (${i + 1},${j + 3})\n`;
            }
            if (i + 2 < BOARD_SIZE && board[i + 1][j] === currentPlayerSymbol && board[i + 2][j] === currentPlayerSymbol) {
              sosAnnouncement += `SOS formed at (${i + 1},${j + 1}), (${i + 2},${j + 1}), (${i + 3},${j + 1})\n`;
            }
            if (i + 2 < BOARD_SIZE && j + 2 < BOARD_SIZE && board[i + 1][j + 1] === currentPlayerSymbol && board[i + 2][j + 2] === currentPlayerSymbol) {
              sosAnnouncement += `SOS formed at (${i + 1},${j + 1}), (${i + 2},${j + 2}), (${i + 3},${j + 3})\n`;
            }
            if (i + 2 < BOARD_SIZE && j - 2 >= 0 && board[i + 1][j - 1] === currentPlayerSymbol && board[i + 2][j - 2] === currentPlayerSymbol) {
              sosAnnouncement += `SOS formed at (${i + 1},${j + 1}), (${i + 2},${j}), (${i + 3},${j - 1})\n`;
            }
          }
        }
      }

      global.api.sendMessage(sosAnnouncement, message.threadID);

      // Update the user's money balance
      await Users.increaseMoney(message.senderID, winnings);
    
      // Calculate the amount lost by the opponent
      const opponentPlayerSymbol = (currentPlayerSymbol === PLAYER_X) ? PLAYER_O : PLAYER_X;
      const lostAmount = room.betAmount * checkWin(room.board, opponentPlayerSymbol);
    
      // Deduct the lost amount from the opponent's money
      const opponentID = room.players.find(player => player !== message.senderID);
      await Users.decreaseMoney(opponentID, lostAmount);
    
      // Delete the game from the ongoing games list
      global.boards.delete(message.threadID);
    } else if (room.board.every(row => row.every(cell => cell !== EMPTY_CELL))) {
      global.api.sendMessage("[🎮 🤝] » The game ended in a draw!", message.threadID);
      global.boards.delete(message.threadID);
    } else {
      // Switch to the next player's turn
      room.currentPlayer = room.players.find(player => player !== room.currentPlayer);
      global.boards.set(message.threadID, room);
    }

    return;
  }

  if (args[0] === "end" || args[0] === "e") {
    if (!global.boards.has(message.threadID)) {
      return global.api.sendMessage("[🎮] » There is no ongoing S-O-S game in this group.", message.threadID, message.messageID);
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
      body: "»〘𝐒 - 𝐎 - 𝐒〙«\n1. create <bet amount> => Create a new S-O-S game with a bet.\n2. join => Join an ongoing S-O-S game.\n3. start => Start the game (only the host can start).\n4. move / m <row> <column> => Make a move in the game.\n5. end => End the game (only the host can end).\nNote: The game can only be started by the host.",
      attachment: tictac,
    }, message.threadID);
  }
}

export default {
  config,
  onCall
    }