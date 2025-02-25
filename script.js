
const gameboard = (function(root) {
   let board = Array(9);
   
   let boardElement = root.querySelector("body>main>.gameboard");
   
   for (let i = 0; i < board.length; i++) {
      let element = root.createElement("button");
      board[i] = element;
      boardElement.appendChild(element);
   }

   const resetBoard = () => board.map(element => element.innerText = "");

   resetBoard();

   return {resetBoard};
})(document);