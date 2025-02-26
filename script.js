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

   const setNextSymbol = (symbol) => {
      board.forEach(spaceElement => {
         spaceElement.setAttribute("data-next-symbol", symbol);
      });
   }

   const win = (spaceElement) => {
      const symbol = spaceElement.innerText;
      const spaceIndex = board.indexOf(spaceElement);
      const x = Math.floor(spaceIndex % boardSize);
      const y = Math.floor(spaceIndex / boardSize);
      const reverseY = boardSize - 1 - y;

      let columnLines = [[]];
      let rowLines = [[]];
      let diagonalLines = [[]];
      let diagonalReverseLines = [[]];
      
      const lines = [columnLines, rowLines, diagonalLines, diagonalReverseLines];

      for (let i = 0; i < boardSize; i++) {
         const columnElement = board[x + i * boardSize];
         const rowElement = board[i + y * boardSize];
         let diagonalElement = null;
         let diagonalReverseElement = null;
         
         let diagonalX = i;
         if (y > x) {
            diagonalX -= y - x;
         }
         
         let diagonalY = i;
         if (x > y) {
            diagonalY -= x - y;
         }
         
         if (diagonalX >= 0 && diagonalY >= 0) {
            diagonalElement = board[diagonalX + diagonalY * boardSize];
         }
         
         let diagonalReverseX = i;
         if (reverseY > x) {
            diagonalReverseX -= reverseY - x;
         }
         
         let diagonalReverseY = boardSize - 1 - i;
         if (x > reverseY) {
            diagonalReverseY += x - reverseY;
         }
         
         if (diagonalReverseX >= 0 && diagonalReverseY <= boardSize - 1) {
            diagonalReverseElement = board[diagonalReverseX + diagonalReverseY * boardSize];
         }
         
         let elements = [columnElement, rowElement, diagonalElement, diagonalReverseElement];
         
         for (let j = 0; j < elements.length; j++) {
            const element = elements[j];
            const lineElements = lines[j];
            if (element !== null && element.innerText === symbol) {
               lineElements.at(-1).push(element);
            }
            else if (lineElements.at(-1).length > 0) {
               lineElements.push([]);
            }
         }
      }
      
      let winningLineFound = false;

      lines.forEach(lineElements => {
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