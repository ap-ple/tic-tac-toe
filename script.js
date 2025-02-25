
const mainGameboard = (function(root) {
   const boardSize = 3;

   const board = Array(boardSize ** 2);
   
   const boardElement = root.querySelector("body>main>.gameboard");
   
   for (let i = 0; i < board.length; i++) {
      const spaceElement = root.createElement("button");
      board[i] = spaceElement;
      boardElement.appendChild(spaceElement);
   }

   const checkWin = (spaceElement) => {
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

   return {board, boardSize, checkWin, disableBoard, resetBoard};
})(document);

const mainGame = (function(root, gameboard) {
   const symbols = ["X", "O"]
   let turn = 0;

   const symbolThisTurn = () => symbols[turn % symbols.length];

   const messageElement = root.querySelector("body>main>.message");

   const play = (spaceElement) => {
      spaceElement.innerText = symbolThisTurn();
      spaceElement.disabled = true;
      
      if (gameboard.checkWin(spaceElement)) {
         messageElement.innerText = `Player ${symbolThisTurn()} wins!`;
         gameboard.disableBoard();
      }
      else if (++turn >= gameboard.boardSize ** 2) {
         messageElement.innerText = "Tie!";
      }
      else {
         messageElement.innerText = `Your turn, Player ${symbolThisTurn()}.`;
      }
   }

   gameboard.board.forEach(spaceElement => {
      spaceElement.addEventListener("click", event => play(spaceElement));
   });

   return {};
})(document, mainGameboard);