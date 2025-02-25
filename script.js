
const Player = function(name, symbol) {
   return {name, symbol};
}

const defaultSymbols = ["X", "O"];
const defaultPlayers = [];

defaultSymbols.forEach(symbol => {
   defaultPlayers.push(new Player(`Player ${symbol}`, symbol));
});

const mainGameboard = (function(rootElement) {
   const boardSize = 3;

   const board = Array(boardSize ** 2);
   
   const boardElement = rootElement.querySelector("body>main>.gameboard");
   
   for (let i = 0; i < board.length; i++) {
      const spaceElement = rootElement.createElement("button");
      board[i] = spaceElement;
      boardElement.appendChild(spaceElement);
   }

   const win = (spaceElement) => {
      const symbol = spaceElement.innerText;
      const spaceIndex = board.indexOf(spaceElement);
      const x = Math.floor(spaceIndex % boardSize);
      const y = Math.floor(spaceIndex / boardSize);

      let column = row = diagonal = diagonalReverse = 0;

      for (let i = 0; i < boardSize; i++) {
         if (symbol === board[x + i * boardSize].innerText) column++;
         if (symbol === board[i + y * boardSize].innerText) row++;
         if (symbol === board[i + i * boardSize].innerText) diagonal++;
         if (symbol === board[i + (boardSize - i - 1) * boardSize].innerText) diagonalReverse++;
      }

      return [column, row, diagonal, diagonalReverse].indexOf(boardSize) > -1;
   }

   const disableBoard = () => board.map(spaceElement => {
      spaceElement.disabled = true;
   });

   const resetBoard = () => board.map(spaceElement => {
      spaceElement.disabled = false;
      spaceElement.innerText = ""
   });

   return {board, boardSize, win, disableBoard, resetBoard};
})(document);

const mainGame = (function(rootElement, gameboard, players) {
   let turn = 0;

   const playerThisTurn = () => players[turn % players.length];

   const messageElement = rootElement.querySelector("body>main>.message");

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

   resetElement.addEventListener("click", event => {
      turn = 0;
      messageElement.innerText = `Your turn, ${playerThisTurn().name}.`;
      gameboard.resetBoard();
   });

   return {playerThisTurn};
})(document, mainGameboard, defaultPlayers);