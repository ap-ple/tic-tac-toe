const Player = function(name, symbol) {
   return {name, symbol};
}

const BOARD_SIZE = 3;
const WINNING_LINE_LENGTH = 3;

const SYMBOLS = ["X", "O"];
const PLAYERS = [];

SYMBOLS.forEach(symbol => {
   PLAYERS.push(new Player(`Player ${symbol}`, symbol));
});

const mainGameboard = (function(rootElement, boardSize, winningLineLength) {
   const boardElement = rootElement.querySelector("body>main>.gameboard");
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
})(document, BOARD_SIZE, WINNING_LINE_LENGTH);

const mainGame = (function(rootElement, gameboard, players) {
   let turn = 0;

   const messageElement = rootElement.querySelector("body>main>.message");
   
   const playerThisTurn = () => players[turn % players.length];

   const startGame = () => {
      turn = 0;
      messageElement.innerText = `Your turn, ${playerThisTurn().name}.`;
      gameboard.resetBoard();
      gameboard.setNextSymbol(playerThisTurn().symbol);
   }

   const play = (spaceElement) => {
      spaceElement.innerText = playerThisTurn().symbol;
      spaceElement.disabled = true;
      
      if (gameboard.win(spaceElement)) {
         messageElement.innerText = `${playerThisTurn().name} wins!`;
         gameboard.disableBoard();
      }
      else if (++turn >= gameboard.board.length) {
         messageElement.innerText = "Tie!";
      }
      else {
         messageElement.innerText = `Your turn, ${playerThisTurn().name}.`;
      }

      gameboard.setNextSymbol(playerThisTurn().symbol);
   }

   gameboard.board.forEach(spaceElement => {
      spaceElement.addEventListener("click", event => play(spaceElement));
   });

   const resetElement = rootElement.querySelector("body>main>button.reset");

   resetElement.addEventListener("click", event => startGame());

   return {startGame};
})(document, mainGameboard, PLAYERS);

mainGame.startGame();