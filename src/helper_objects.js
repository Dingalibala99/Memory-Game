const gameObjects = {
  grid: "grid",
  none: "none",
  block: "block",
  card: "card",
  gameCards: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
  greyColor: "#ccc",
  whiteColor: "#fff",
};

const elements = {
  congratulationsMessage: document.getElementById("congratulations-message"),
  okButton: document.getElementById("ok-button"),
  newGame: document.getElementById("new-game-button"),
  gameBoard: document.getElementById("board"),
  restartButton: document.getElementById("restart-button"),
  completionTimeElement: document.getElementById("completion-time"),
  timerElement: document.getElementById("timer"),
  gridSizeRadioButtons: document.querySelectorAll('input[name="grid-size"]'),
};

module.exports = { gameObjects, elements };
