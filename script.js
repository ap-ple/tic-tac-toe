const SYMBOLS = ["X", "O"];
const BOARD_SIZE = 3;
const MINIMUM_BOARD_SIZE = 3;
const WINNING_LINE_LENGTH = 3;
const MINIMUM_WINNING_LINE_LENGTH = 2;

const Player = function(name, symbol) {
   return {name, symbol};
}

const Gameboard = function(rootElement, parentElement, boardSize, winningLineLength) {
   const boardElement = rootElement.createElement("div");
   parentElement.appendChild(boardElement);

   boardElement.classList.add("gameboard");
   boardElement.style.setProperty("--board-size", boardSize);

   const board = Array(boardSize ** 2);
   
   for (let i = 0; i < board.length; i++) {
      const spaceElement = rootElement.createElement("button");
      spaceElement.classList.add();
      board[i] = spaceElement;
      boardElement.appendChild(spaceElement);
   }

   const spaceAtCoordinate = (x, y) => board[x + y * boardSize];

   const setNextSymbol = (symbol) => {
      board.forEach(spaceElement => {
         spaceElement.setAttribute("data-next-symbol", symbol);
      });
   }

   const win = (spaceElement) => {
      const maxCoordinate = boardSize - 1;

      const symbol = spaceElement.innerText;
      const spaceIndex = board.indexOf(spaceElement);
      const x = Math.floor(spaceIndex % boardSize);
      const y = Math.floor(spaceIndex / boardSize);

      const diagonalXOffset = Math.max(0, y - x);
      const diagonalYOffset = Math.max(0, x - y);

      const reverseY = maxCoordinate - y;
      const diagonalReverseXOffset = Math.max(0, reverseY - x);
      const diagonalReverseYOffset = Math.max(0, x - reverseY);

      let columnLines = [[]];
      let rowLines = [[]];
      let diagonalLines = [[]];
      let diagonalReverseLines = [[]];
      
      const linesArray = [columnLines, rowLines, diagonalLines, diagonalReverseLines];

      for (let i = 0; i < boardSize; i++) {
         const columnElement = spaceAtCoordinate(x, i);
         const rowElement = spaceAtCoordinate(i, y);
         let diagonalElement = null;
         let diagonalReverseElement = null;
         
         let diagonalX = i - diagonalXOffset;
         let diagonalY = i - diagonalYOffset;
         
         if (diagonalX >= 0 && diagonalY >= 0) {
            diagonalElement = spaceAtCoordinate(diagonalX, diagonalY);
         }
         
         let diagonalReverseX = i - diagonalReverseXOffset;         
         let diagonalReverseY = maxCoordinate - i + diagonalReverseYOffset;
         
         if (diagonalReverseX >= 0 && diagonalReverseY <= maxCoordinate) {
            diagonalReverseElement = spaceAtCoordinate(diagonalReverseX, diagonalReverseY);
         }
         
         let elements = [columnElement, rowElement, diagonalElement, diagonalReverseElement];
         
         for (let j = 0; j < elements.length; j++) {
            const element = elements[j];
            const lines = linesArray[j];
            const lastLine = lines.at(-1);
            if (element !== null) {
               if (element.innerText === symbol) {
                  lastLine.push(element);
               }
               else if (lastLine.length > 0) {
                  lines.push([]);
               }
            }
         }
      }
      
      let winningLineFound = false;

      linesArray.forEach(lineElements => {
         lineElements
         .filter(line => line.length >= winningLineLength)
         .forEach(line => {
            winningLineFound = true;
            line.forEach(element => {
               element.classList.add("winning")
            });
         });
      });

      return winningLineFound;
   }

   const disableBoard = () => board.forEach(spaceElement => {
      spaceElement.disabled = true;
   });

   const resetBoard = () => board.forEach(spaceElement => {
      spaceElement.disabled = false;
      spaceElement.innerText = ""
      spaceElement.classList.remove("winning");
   });

   return {board, setNextSymbol, win, disableBoard, resetBoard};
};

const Game = function(rootElement, parentElement, gameboard, players) {
   let turn = 0;

   const messageElement = parentElement.querySelector(".message");

   messageElement.innerText = "...";

   const resetElement = rootElement.createElement("button");
   parentElement.appendChild(resetElement);

   resetElement.classList.add("reset");
   resetElement.innerText = "...";

   const playerThisTurn = () => players[turn % players.length];
   
   const startGame = () => {
      turn = 0;
      messageElement.innerText = `Your turn, ${playerThisTurn().name}.`;
      gameboard.resetBoard();
      gameboard.setNextSymbol(playerThisTurn().symbol);
      resetElement.innerText = "Reset Game";
   }

   resetElement.addEventListener("click", event => startGame());

   const play = (spaceElement) => {
      spaceElement.innerText = playerThisTurn().symbol;
      spaceElement.disabled = true;
      
      if (gameboard.win(spaceElement)) {
         messageElement.innerText = `${playerThisTurn().name} wins!`;
         gameboard.disableBoard();
         resetElement.innerText = "Play Again";
      }
      else if (++turn >= gameboard.board.length) {
         messageElement.innerText = "Tie!";
         resetElement.innerText = "Play Again";
      }
      else {
         messageElement.innerText = `Your turn, ${playerThisTurn().name}.`;
      }

      gameboard.setNextSymbol(playerThisTurn().symbol);
   }

   gameboard.board.forEach(spaceElement => {
      spaceElement.addEventListener("click", event => play(spaceElement));
   });

   return {startGame};
};

const main = document.body.querySelector("main");

const gameForm = (function(rootElement, parentElement, defaultSymbols, defaultBoardSize, minimumBoardSize, defaultWinningLineLength, minimumWinningLineLength) {
   const formElement = rootElement.createElement("form");
   parentElement.appendChild(formElement);

   const messageElement = parentElement.querySelector(".message");

   const messageWarning = (warning) => {
      messageElement.innerText = warning;
      messageElement.classList.add("warning");
   }

   const clearWarning = () => {
      messageElement.innerText = "";
      messageElement.classList.remove("warning");  
   }

   formElement.addEventListener("input", event => clearWarning());

   formElement.addEventListener("submit", event => {
      event.preventDefault();

      let symbols = [];
      let players = [];
      let boardSize = defaultBoardSize;
      let winningLineLength = defaultWinningLineLength;
      
      const formData = new FormData(event.target);

      let playerName = null; 
      
      for (const pair of formData) {
         const key = pair[0];
         const value = pair[1];

         if (key.match(/^player-\d-name$/)) {
            playerName = value;
         }
         if (key.match(/^player-\d-symbol$/)) {
            players.push(new Player(playerName, value));
            if (symbols.indexOf(value) > -1) {
               messageWarning("Symbols must be unique");
               return;
            }
            symbols.push(value);
            playerName = null;
         }
         if (key.match("board-size")) {
            boardSize = Number(value);
         }
         if (key.match("winning-line-length")) {
            winningLineLength = Number(value);
         }
      }

      if (winningLineLength > boardSize) {
         messageWarning("Winning line length cannot be greater than board size")
         return;
      }
      
      clearWarning();
      parentElement.removeChild(formElement);
      
      const mainGameboard = new Gameboard(rootElement, parentElement, boardSize, winningLineLength);
      const mainGame = new Game(rootElement, parentElement, mainGameboard, players);

      mainGame.startGame();
   });

   const playersElement = rootElement.createElement("div");
   formElement.appendChild(playersElement);

   playersElement.classList.add("players");

   let playerNumber = 0;

   const addPlayer = () => {
      const playerElement = rootElement.createElement("fieldset");
      playersElement.appendChild(playerElement);
      
      const legend = rootElement.createElement("legend");
      playerElement.appendChild(legend);
      
      legend.innerText = `Player ${++playerNumber}`
      legend.ariaRequired = true;
      
      const nameInput = rootElement.createElement("input");
      playerElement.appendChild(nameInput);
      
      const symbolInput = rootElement.createElement("input");
      playerElement.appendChild(symbolInput);
      
      nameInput.type = "text";
      nameInput.name = `player-${playerNumber}-name`;
      nameInput.placeholder = "Name";
      nameInput.required = true;
      nameInput.addEventListener("focus", event => event.target.select());
      
      symbolInput.type = "text";
      symbolInput.name = `player-${playerNumber}-symbol`;
      symbolInput.placeholder = "Symbol";
      symbolInput.maxLength = 1;
      symbolInput.required = true;
      symbolInput.addEventListener("focus", event => event.target.select());
      
      return {nameInput, symbolInput}
   }
   
   while (playerNumber < defaultSymbols.length) {
      const symbol = defaultSymbols[playerNumber];
      const player = addPlayer();
      
      player.nameInput.value = `Player ${symbol}`;
      player.symbolInput.value = symbol;
   }
   
   const playerButtons = rootElement.createElement("div");
   formElement.appendChild(playerButtons);

   playerButtons.classList.add("player-add-remove");
   
   const removePlayer = () => {
      playersElement.removeChild(playersElement.lastChild);
      playerNumber--;
   }
   
   const removePlayerElement = rootElement.createElement("button");
   playerButtons.appendChild(removePlayerElement);

   removePlayerElement.innerText = "Remove Player";
   removePlayerElement.type = "button";
   removePlayerElement.addEventListener("click", event => {
      removePlayer();
      if (playersElement.children.length === defaultSymbols.length) {
         event.target.disabled = true;
      }
   });
   removePlayerElement.disabled = true;   

   const addPlayerElement = rootElement.createElement("button");
   playerButtons.appendChild(addPlayerElement);
   
   addPlayerElement.innerText = "Add Player";
   addPlayerElement.type = "button";
   addPlayerElement.addEventListener("click", event => {
      addPlayer();
      removePlayerElement.disabled = false;
   });

   const settings = rootElement.createElement("div");
   formElement.appendChild(settings);

   settings.classList.add("settings");

   const boardSizeElement = rootElement.createElement("div");
   settings.appendChild(boardSizeElement);

   const boardSizeLabel = rootElement.createElement("label");
   boardSizeElement.appendChild(boardSizeLabel);

   boardSizeLabel.htmlFor = "board-size";
   boardSizeLabel.innerText = "Board Size";
   boardSizeLabel.ariaRequired = true;

   const boardSizeInput = rootElement.createElement("input");
   boardSizeElement.appendChild(boardSizeInput);

   boardSizeInput.type = "number";
   boardSizeInput.name = "board-size";
   boardSizeInput.id = "board-size";
   boardSizeInput.min = minimumBoardSize;
   boardSizeInput.value = defaultBoardSize;
   boardSizeInput.required = true;
   boardSizeInput.addEventListener("focus", event => event.target.select());

   const winningLineLengthElement = rootElement.createElement("div");
   settings.appendChild(winningLineLengthElement);

   const winningLineLengthLabel = rootElement.createElement("label");
   winningLineLengthElement.appendChild(winningLineLengthLabel);

   winningLineLengthLabel.htmlFor = "winning-line-length";
   winningLineLengthLabel.innerText = "Winning Line Length";
   winningLineLengthLabel.ariaRequired = true;

   const winningLineLengthInput = rootElement.createElement("input");
   winningLineLengthElement.appendChild(winningLineLengthInput);

   winningLineLengthInput.type = "number";
   winningLineLengthInput.name = "winning-line-length";
   winningLineLengthInput.id = "winning-line-length";
   winningLineLengthInput.min = minimumWinningLineLength;
   winningLineLengthInput.value = defaultWinningLineLength;
   winningLineLengthInput.required = true;
   winningLineLengthInput.addEventListener("focus", event => event.target.select());
   
   const startElement = rootElement.createElement("button");
   formElement.appendChild(startElement);

   startElement.innerText = "Start Game";
})(document, main, SYMBOLS, BOARD_SIZE, MINIMUM_BOARD_SIZE, WINNING_LINE_LENGTH, MINIMUM_WINNING_LINE_LENGTH);