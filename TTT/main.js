const X_CLASS = "X"
const CIRCLE_CLASS = "circle"
const WINNING_COMBINATIONS = [
  [0, 1, 2], //horizontal
  [3, 4, 5], //horizontal
  [6, 7, 8], //horizontal
  [0, 3, 6], //vertical
  [1, 4, 7], //vertical
  [2, 5, 8], //vertical
  [0, 4, 8], //diagonal
  [2, 4, 6] //diagonal
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn

startGame() //main function that executes when the game begins. All other functions written here are within this main function

restartButton.addEventListener('click', startGame) //restart button to reset the script back to basic form as though nothing has executed yet

function startGame() {
  circleTurn = false //allows "X" player to go first
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS) //remove all "X"s on the board
    cell.classList.remove(CIRCLE_CLASS) //remove all "O"s on the board
    cell.removeEventListener('click', handleClick) //remove ability for player to make their move multiple times
    cell.addEventListener('click', handleClick, { once: true }) //allow player to make their move only once (clicking on the box they want to position their symbol)
  })
  setBoardHoverClass() //implement the turn hover function
  winningMessageElement.classList.remove('show') //do not display the winning/ draw notification
}

//overarching function that allows for players to click on cells during their turn
function handleClick(event) {
  const cell = event.target //reading the target (grabbing a referecen to the cell)
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS //if circleTurn is true then return CIRCLE_CLASS, if circleTurn false then return X_CLASS
  placeMark(cell, currentClass) //another function embedded within here
  
  if (checkWin(currentClass)) { //if the current class/ symbol has won then continue the game
    endGame(false)
  } else if (isDraw()) { //if no one has won the game and the "draw" function is not satisfied then the game is over
    endGame(true)
  } else {
    swapTurns() //if neither player has won and if "draw" function is not satisfied then continue the game by swapping the turn of the players
    setBoardHoverClass() //implement the symbol hover function above the cell the player is on
  }
}

//either this "endGame"function or "isDraw" function will occur by the end of every game
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!' //notify players that the game has come to a draw
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!` //format strong that notifies the players who has won the game
  }
  winningMessageElement.classList.add('show') //show the text of the winner or if it is a draw
}

//function that executes only if none of the WINNING_COMBINATIONS are met
function isDraw() {
  return [...cellElements].every(cell => { //every "cellElement"
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS) //if every cell is filled with either X or O and none of winning conditions are met 
  })
}

//function that places the symbol of whoever's turn it is
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass) //places the symbol/marker of whoever turn it currently is
}

//function that swaps the player's turn
function swapTurns() {
  circleTurn = !circleTurn
}

//function that allows for user to view where they are placing their marker before actually placing it (want to be based on whose turn it currently is, not whose turn it used to be)
function setBoardHoverClass() {
  board.classList.remove(X_CLASS) //remove X_CLASS
  board.classList.remove(CIRCLE_CLASS) //remove CIRCLE_CLASS (both to ensure there are no classes on it)
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

//function that checks if either player has won the game
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => { //loop through all of the combinations
    return combination.every(index => { //ensuring the combination has the same symbol 
      return cellElements[index].classList.contains(currentClass)
    })
  })
}