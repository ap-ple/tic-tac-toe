
const mainGameboard = (function(root) {
   let board = Array(9);
   
   let boardElement = root.querySelector("body>main>.gameboard");
   
   for (let i = 0; i < board.length; i++) {
      let spaceElement = root.createElement("button");
      board[i] = spaceElement;
      boardElement.appendChild(spaceElement);
   }

   const resetBoard = () => board.map(spaceElement => {
      spaceElement.innerText = ""
      spaceElement.disabled = false;
   });

   resetBoard();

   return {board, resetBoard};
})(document);

const mainGame = (function(root, gameboard) {
   const symbols = ["X", "O"]
   let turn = 0;

   const messageElement = root.querySelector("body>main>.message");

   const play = (spaceElement) => {
      if (spaceElement.innerText.length === 0) {
         spaceElement.innerText = symbols[turn % symbols.length];
         spaceElement.disabled = true;
         turn++;

         messageElement.innerText = `Your turn, Player ${symbols[turn % symbols.length]}.`;
      }
   };

   gameboard.board.forEach(spaceElement => {
      spaceElement.addEventListener("click", event => play(event.target));
   });

   return {};
})(document, mainGameboard);