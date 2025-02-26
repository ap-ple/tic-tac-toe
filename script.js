const Player = function(name, symbol) {
   return {name, symbol};
}

const BOARD_SIZE = 3;

const SYMBOLS = ["X", "O"];
const PLAYERS = [];

SYMBOLS.forEach(symbol => {
   PLAYERS.push(new Player(`Player ${symbol}`, symbol));
});

const mainGameboard = (function(rootElement, boardSize) {
   const board = Array(boardSize ** 2);
   
   const boardElement = rootElement.querySelector("body>main>.gameboard");

   boardElement.style.setProperty("--board-size", boardSize);
   
   for (let i = 0; i < board.length; i++) {
      const spaceElement = rootElement.createElement("button");
      spaceElement.classList.add();
      board[i] = spaceElement;
      boardElement.appendChild(spaceElement);
   }

   const win = (spaceElement) => {
      const symbol = spaceElement.innerText;
      const spaceIndex = board.indexOf(spaceElement);
      const x = Math.floor(spaceIndex % boardSize);
      const y = Math.floor(spaceIndex / boardSize);

      let column = [];
      let row = [];
      let diagonal = [];
      let diagonalReverse = [];

      for (let i = 0; i < boardSize; i++) {
         const columnIndex = x + i * boardSize;
         const rowIndex = i + y * boardSize;
         const diagonalIndex = i + i * boardSize;
         const diagonalReverseIndex = i + (boardSize - i - 1) * boardSize;

         if (symbol === board[columnIndex].innerText) {
            column.push(columnIndex);
         }
         if (symbol === board[rowIndex].innerText) {
            row.push(rowIndex);
         }
         if (symbol === board[diagonalIndex].innerText) {
            diagonal.push(diagonalIndex);
         }
         if (symbol === board[diagonalReverseIndex].innerText) {
            diagonalReverse.push(diagonalReverseIndex);
         }
      }
      
      const lines = [column, row, diagonal, diagonalReverse];

      let winningLineFound = false;

      lines.forEach(line => {
         if (line.length === boardSize) {
            winningLineFound = true;
            line.forEach(index => {
               board[index].classList.add("winning")
            });
         }
      });

      return winningLineFound;
   }

   const disableBoard = () => board.map(spaceElement => {
      spaceElement.disabled = true;
   });

   const resetBoard = () => board.map(spaceElement => {
      spaceElement.disabled = false;
      spaceElement.innerText = ""
      spaceElement.classList.remove("winning");
   });

   return {board, boardSize, win, disableBoard, resetBoard};
})(document, BOARD_SIZE);

const mainGame = (function(rootElement, gameboard, players) {
   let turn = 0;

   const messageElement = rootElement.querySelector("body>main>.message");
   
   const playerThisTurn = () => players[turn % players.length];

   const startGame = () => {
      turn = 0;
      messageElement.innerText = `Your turn, ${playerThisTurn().name}.`;
      gameboard.resetBoard();
   }

   const play = (spaceElement) => {
      spaceElement.innerText = playerThisTurn().symbol;
      spaceElement.disabled = true;
      
      if (gameboard.win(spaceElement)) {
         messageElement.innerText = `${playerThisTurn().name} wins!`;
         gameboard.disableBoard();
      }
      else if (++turn >= gameboard.boardSize ** 2) {
         messageElement.innerText = "Tie!";
      }
      else {
         messageElement.innerText = `Your turn, ${playerThisTurn().name}.`;
      }
   }

   gameboard.board.forEach(spaceElement => {
      spaceElement.addEventListener("click", event => play(spaceElement));
   });

   const resetElement = rootElement.querySelector("body>main>button.reset");

   resetElement.addEventListener("click", event => startGame());

   return {startGame};
})(document, mainGameboard, PLAYERS);

mainGame.startGame();