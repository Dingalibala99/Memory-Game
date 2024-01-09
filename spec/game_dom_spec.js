const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("./index.html", "utf-8");
const { document } = new JSDOM(html).window;
global.document = document;
const MemoryGame = require("../src/game_web");
const {
  hideCongratulations,
  showRestartButton,
} = require("../src/helper_functions");
const { gameObjects, elements } = require("../src/helper_objects");

describe("Memory Game Web Tests", () => {
  let game;
  beforeEach(() => {
    game = new MemoryGame(4, 3);
  });
  describe("createCard method", function () {
    let testSymbol;
    let card;
    beforeEach(function () {
      testSymbol = "TestSymbol";
      card = game.createCard(testSymbol);
    });

    it("should create a div element with the class 'card'", function () {
      expect(card.classList.contains(gameObjects.card)).toBe(true);
    });

    it("should set the 'dataset.symbol' property to the provided symbol", function () {
      expect(card.dataset.symbol).toEqual(testSymbol);
    });

    it("should add a click event listener to the card", function () {
      let eventTriggered = false;
      card.addEventListener("click", function () {
        eventTriggered = true;
      });
      card.click();
      expect(eventTriggered).toBe(true);
    });
  });

  describe("Restart method", () => {
    it("should reset flippedCards and matchedCards when restartGame is called", () => {
      game.matchedCards.push(document.createElement("div"));
      game.flippedCards.push(document.createElement("div"));
      expect(game.matchedCards.length).toBe(1);
      expect(game.flippedCards.length).toBe(1);
      game.restartGame();
      expect(game.matchedCards.length).toBe(0);
      expect(game.flippedCards.length).toBe(0);
    });

    it("should hide congratulations message and new game button after restarting the game", () => {
      game.showCongratulations();
      game.showNewGameButton();
      expect(elements.congratulationsMessage.style.display).toBe(
        gameObjects.grid
      );
      expect(elements.newGame.style.display).toBe(gameObjects.block);
      game.restartGame();
      expect(elements.congratulationsMessage.style.display).toBe(
        gameObjects.none
      );

      expect(elements.newGame.style.display).toBe(gameObjects.none);
    });
  });

  describe("Reveal methods", () => {
    it("should show the congratulations message", () => {
      expect(elements.congratulationsMessage.style.display).toBe(
        gameObjects.none
      );
      game.showCongratulations();

      expect(elements.congratulationsMessage.style.display).toBe(
        gameObjects.grid
      );
    });

    it("should hide the congratulations message", () => {
      game.showCongratulations();
      expect(elements.congratulationsMessage.style.display).toBe(
        gameObjects.grid
      );
      hideCongratulations();

      expect(elements.congratulationsMessage.style.display).toBe(
        gameObjects.none
      );
    });

    it("should show the new game button", () => {
      expect(game.newGameButton.style.display).toBe(gameObjects.none);
      game.showNewGameButton();
      expect(game.newGameButton.style.display).toBe(gameObjects.block);
    });

    it("should hide the new game button", () => {
      game.showNewGameButton();
      game.hideNewGameButton();
      expect(game.newGameButton.style.display).toBe(gameObjects.none);
    });

    it("should show the restart button", () => {
      expect(game.restartButton.style.display).toBe(gameObjects.none);
      showRestartButton();
      expect(game.restartButton.style.display).toBe(gameObjects.block);
    });

    it("should hide the restart button", () => {
      showRestartButton();
      expect(game.restartButton.style.display).toBe(gameObjects.block);
      game.hideRestartButton();
      expect(game.restartButton.style.display).toBe(gameObjects.none);
    });
  });

  describe("Card flipping", function () {
    let flippedCard;

    beforeEach(function () {
      flippedCard = game.createCard("A");
      game.board.appendChild(flippedCard);
    });

    it("should change the text content when the card is flipped", function () {
      let originalTextContent = flippedCard.textContent;
      expect(flippedCard.textContent).toEqual(originalTextContent);
      flippedCard.click();
      expect(flippedCard.textContent).not.toEqual(originalTextContent);
    });
  });

  describe("Turn count and Timer", () => {
    let card1, card2;

    beforeEach(function () {
      card1 = game.createCard("A");
      card2 = game.createCard("B");
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it("should keep track the number of turn counts", function () {
      expect(game.turnCount).toBe(0);
      card1.click();
      card2.click();
      game.updateTurnCount();
      expect(game.turnCount).toBe(2);

      game.restartGame();
      expect(game.turnCount).toBe(0);
    });

    it("should not increment the number of turn counts when clicking the same card", function () {
      expect(game.turnCount).toBe(0);
      card1.click();
      card1.click();
      card1.click(); 
      game.updateTurnCount();
      expect(game.turnCount).toBe(1); 
    });

    it("should call the updateTimer method every second", function () {
      spyOn(game, "updateTimer");
      game.startTimer();
      jasmine.clock().tick(1000);
      expect(game.updateTimer).toHaveBeenCalledTimes(1);
      jasmine.clock().tick(1000);
      expect(game.updateTimer).toHaveBeenCalledTimes(2);
    });

    it("should display the correct time and number of moves in the congratulations message", () => {
      game.totalPairs = 2;
      game.matchedCards = [{}, {}];
      game.turnCount = 30;
      game.showCongratulations();
      game.startTime = new Date();
      game.endTime = new Date(
        game.startTime.getTime() +
          1000 * 60 * 60 * 2 +
          1000 * 60 * 30 +
          1000 * 45
      );
      game.showElapsedTime();
      expect(elements.congratulationsMessage.style.display).toBe(
        gameObjects.grid
      );

      expect(game.completionTimeElement.textContent).toContain(
        `Congratulations! You've completed the game in 2h 30m 45s with ${game.turnCount} moves`
      );
    });
  });

  describe("Change Grid Size", () => {
    let game2, game3;

    beforeEach(() => {
      game2 = new MemoryGame(4, 4);
      game3 = new MemoryGame(5, 4);
    });
    afterEach(() => {
      game.restartGame();
    });

    it("should initialize with default grid size", () => {
      const gridSizeInput = document.getElementById("grid-4x3");
      gridSizeInput.click();

      expect(game.board.children.length).toBe(4 * 3);
    });

    it("should update the grid size when a radio button is clicked", () => {
      const gridSizeInput = document.getElementById("grid-4x4");
      gridSizeInput.click();

      expect(game2.board.children.length).toBe(4 * 4);
    });

    it("should update the grid size when a radio button is clicked", () => {
      const gridSizeInput = document.getElementById("grid-5x4");
      gridSizeInput.click();

      expect(game3.board.children.length).toBe(5 * 4);
    });
  });
});
