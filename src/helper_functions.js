const { gameObjects, elements } = require("./helper_objects");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const index = Math.floor(Math.random() * (i + 1));
    [array[i], array[index]] = [array[index], array[i]];
  }
}

function hideCongratulations() {
  elements.congratulationsMessage;
  elements.congratulationsMessage.style.display = gameObjects.none;
}

function showRestartButton() {
  elements.restartButton.style.display = gameObjects.block;
}

module.exports = {
  shuffle,
  hideCongratulations,
  showRestartButton,
};
