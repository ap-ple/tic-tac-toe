
const mainGameboard = (function(root) {
   const board = Array(9);
   
   const boardElement = root.querySelector("body>main>.gameboard");
   
   for (let i = 0; i < board.length; i++) {
      const spaceElement = root.createElement("button");
      board[i] = spaceElement;
      boardElement.appendChild(spaceElement);
   }

   const checkWin = symbol => {
      // TODO: implement
   }

   const disableBoard = () => board.map(spaceElement => {
      spaceElement.disabled = true;
   });

   const resetBoard = () => board.map(spaceElement => {
      spaceElement.innerText = ""
      spaceElement.disabled = false;
   });

   resetBoard();

   return {board, resetBoard, checkWin, disableBoard};
})(document);

const mainGame = (function(root, gameboard) {
   const symbols = ["X", "O"]
   let turn = 0;

   const symbolThisTurn = () => symbols[turn % symbols.length];

   const messageElement = root.querySelector("body>main>.message");

   const play = (spaceElement) => {
      spaceElement.innerText = symbolThisTurn();
      spaceElement.disabled = true;
      
      if (gameboard.checkWin(symbolThisTurn())) {
         messageElement.innerText = `Player ${symbolThisTurn()} wins!`;
         gameboard.disableBoard();
      }
      else if (++turn >= 9) {
         messageElement.innerText = "Tie!";
      }
      else {
         messageElement.innerText = `Your turn, Player ${symbolThisTurn()}.`;
      }
   }

   gameboard.board.forEach(spaceElement => {
      spaceElement.addEventListener("click", event => play(event.target));
   });

   return {};
})(document, mainGameboard);