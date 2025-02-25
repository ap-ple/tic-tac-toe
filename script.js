
const mainGameboard = (function(root) {
   let board = Array(9);
   
   let boardElement = root.querySelector("body>main>.gameboard");
   
   for (let i = 0; i < board.length; i++) {
      let slotElement = root.createElement("button");
      board[i] = slotElement;
      boardElement.appendChild(slotElement);
   }

   const resetBoard = () => board.map(element => {
      element.innerText = ""
      element.disabled = false;
   });

   resetBoard();

   return {board, resetBoard};
})(document);

const mainGame = (function(root, gameboard) {
   const symbols = ["X", "O"]
   let turn = 0;

   const messageElement = root.querySelector("body>main>.message");

   const play = (slotElement) => {
      if (slotElement.innerText.length === 0) {
         slotElement.innerText = symbols[turn % symbols.length];
         slotElement.disabled = true;
         turn++;

         messageElement.innerText = `Your turn, Player ${symbols[turn % symbols.length]}.`;
      }
   };

   gameboard.board.forEach(element => {
      element.addEventListener("click", event => play(event.target));
   });

   return {};
})(document, mainGameboard);