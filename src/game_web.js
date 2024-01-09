const { gameObjects, elements } = require("./helper_objects");
const {
  shuffle,
  hideCongratulations,
  showRestartButton,
} = require("./helper_functions");

class MemoryGame {
  constructor(numberOfRows = 3, numberOfColumns = 4) {
    this.symbols = gameObjects.gameCards;
    this.timeoutId = null;
    this.turnCount = 0;
    this.numberOfRows = numberOfRows;
    this.numberOfColumns = numberOfColumns;
    this.totalPairs = (this.numberOfRows * this.numberOfColumns) / 2;
    this.totalCards = this.numberOfRows * this.numberOfColumns;
    this.board = elements.gameBoard;
    this.newGameButton = elements.newGame;
    this.okButton = elements.okButton;
    this.restartButton = elements.restartButton;
    this.timerElement = elements.timerElement;
    this.gridSizeRadioButtons = elements.gridSizeRadioButtons;
    this.completionTimeElement = elements.completionTimeElement;
    this.flippedCards = [];
    this.matchedCards = [];
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.hideRestartButton();
    this.initializeGame();
  }

  createCard(symbol) {
    const card = document.createElement("div");
    card.classList.add(gameObjects.card);
    card.dataset.symbol = symbol;
    card.addEventListener("click", () => {
      this.handleCardClick(card);
    });
    return card;
  }

  handleCardClick(card) {
    if (!this.startTime) {
      this.startTime = new Date();
      this.startTimer();
    }
    if (
      this.flippedCards.length < 2 &&
      !this.flippedCards.includes(card) &&
      !this.matchedCards.includes(card)
    ) {
      this.flippedCards.push(card);
      card.textContent = card.dataset.symbol;
      card.style.backgroundColor = gameObjects.whiteColor;
      this.turnCount++;
      this.updateTurnCount();
      if (this.flippedCards.length === 2) {
        if (
          this.flippedCards[0].textContent === this.flippedCards[1].textContent
        ) {
          this.matchedCards.push(this.flippedCards[0]);
          this.matchedCards.push(this.flippedCards[1]);
          this.flippedCards = [];
          if (this.matchedCards.length === 2) {
            showRestartButton();
          }
          this.checkGameCompletion();
        } else {
          setTimeout(() => {
            this.flippedCards[0].textContent = "";
            this.flippedCards[0].style.backgroundColor = gameObjects.greyColor;
            this.flippedCards[1].textContent = "";
            this.flippedCards[1].style.backgroundColor = gameObjects.greyColor;
            this.flippedCards = [];
          }, 1000);
        }
      }
    }

    if (this.matchedCards.length === 0) {
      this.hideRestartButton();
    }
  }

  handleGameCompletion() {
    clearTimeout(this.timeoutId);
    this.showCongratulations();
    this.showNewGameButton();
  }

  checkGameCompletion() {
    if (this.matchedCards.length === this.totalPairs * 2) {
      this.handleGameCompletion();
      this.endGame();
    }
  }

  restartGame(rows = this.numberOfRows, cols = this.numberOfColumns) {
    let cards = [];
    this.flippedCards = [];
    this.matchedCards = [];
    this.turnCount = 0;
    this.numberOfRows = rows;
    this.numberOfColumns = cols;
    this.totalPairs = (this.numberOfRows * this.numberOfColumns) / 2;
    this.totalCards = this.numberOfRows * this.numberOfColumns;
    this.updateTurnCount();
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.timerElement.textContent = "00:00:00";
    clearInterval(this.timerInterval);
    this.board.innerHTML = "";
    const shuffledSymbols = this.symbols.slice(0, this.totalPairs);
    cards = [...shuffledSymbols, ...shuffledSymbols];
    shuffle(cards);
    for (let i = 0; i < this.totalCards; i++) {
      const symbol = cards[i];
      const card = this.createCard(symbol);
      this.board.appendChild(card);
    }
    hideCongratulations();
    this.hideNewGameButton();
  }

  initializeGame() {
    this.restartButton.addEventListener("click", () => {
      this.restartGame();
      this.hideRestartButton();
    });
    this.newGameButton.addEventListener("click", () => {
      this.restartGame();
      this.startTime = null;
      this.completionTimeElement.textContent = "";
      this.startGame();
    });
    this.gridSizeRadioButtons.forEach((radioButton) => {
      radioButton.addEventListener("click", () => {
        const [rows, cols] = radioButton.value.split("x").map(Number);
        this.restartGame(rows, cols);
        this.startTime = null;
        this.completionTimeElement.textContent = "";
        this.startGame();
      });
    });
    this.restartGame();
  }

  showCongratulations() {
    elements.congratulationsMessage;
    elements.congratulationsMessage.style.display = gameObjects.grid;

    this.okButton.addEventListener("click", () => {
      hideCongratulations();
      this.hideRestartButton();
      this.showNewGameButton();
    });
    this.newGameButton.addEventListener("click", () => {
      this.restartGame();
    });
  }

  hideRestartButton() {
    this.restartButton.style.display = gameObjects.none;
  }

  showNewGameButton() {
    this.newGameButton.style.display = gameObjects.block;
  }

  hideNewGameButton() {
    this.newGameButton.style.display = gameObjects.none;
  }

  startGame() {
    const cards = this.board.querySelectorAll(`.${gameObjects.card}`);
    cards.forEach((card) => {
      card.addEventListener(
        "click",
        () => {
          if (!this.startTime) {
            this.startTime = new Date();
            this.startTimer();
          }
        },
        { once: true }
      );
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const now = new Date();
      const elapsedTime = now - (this.startTime || now);
      this.updateTimer(elapsedTime);
    }, 1000);
  }

  formatTime(timeInMilliseconds) {
    const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
    const minutes = Math.floor((timeInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((timeInMilliseconds / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  updateTimer(elapsedTime) {
    const formattedTime = this.formatTime(elapsedTime);
    this.timerElement.textContent = formattedTime;
  }

  endGame() {
    clearInterval(this.timerInterval);
    this.endTime = new Date();
    this.showElapsedTime();
  }

  showElapsedTime() {
    const elapsedTime = this.endTime - this.startTime;
    const formattedTime = this.formatTime(elapsedTime);

    const completionMessage = `Congratulations! You've completed the game in ${formattedTime} with ${this.turnCount} moves`;

    this.completionTimeElement.textContent = completionMessage;
  }

  updateTurnCount() {
    const turnCountElement = document.getElementById("turn-count");
    turnCountElement.textContent = `Turn-Count: ${this.turnCount}`;
  }
}

if (typeof window !== "undefined") {
  window.onload = function () {
    const game = new MemoryGame();
    game.startGame();
  };
}

module.exports = MemoryGame;
