const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("./index.html", "utf-8");
const { document } = new JSDOM(html).window;
global.document = document;
const MemoryGame = require("../src/game_web");
const { shuffle } = require("../src/helper_functions");

describe("game", function () {
  let game;
  beforeEach(function () {
    game = new MemoryGame();
  });

  describe("shuffle function", function () {
    let array;
    let originalArray;
    beforeEach(function () {
      array = [1, 2, 3, 4, 5];
      originalArray = array.slice();
    });

    it("should shuffle the elements in the array", function () {
      expect(shuffle(array)).not.toEqual(array);
    });

    it("should not change the length of the array", function () {
      const originalLength = array.length;
      shuffle(array);
      expect(array.length).toEqual(originalLength);
    });

    it("should contain the same elements as the original array", function () {
      shuffle(array);
      array.forEach((element) => {
        expect(originalArray).toContain(element);
      });
    });
  });

  describe("handleCardClick method", function () {
    let card1, card2, card3, card4;
    beforeEach(function () {
      card1 = game.createCard("A");
      card2 = game.createCard("A");
      card3 = game.createCard("B");
      card4 = game.createCard("C");

      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it("should add the clicked card to the flippedCards array", function () {
      expect(game.flippedCards).not.toContain(card1);
      expect(game.flippedCards).not.toContain(card4);
      game.handleCardClick(card1);
      game.handleCardClick(card4);
      expect(game.flippedCards).toContain(card1);
      expect(game.flippedCards).toContain(card4);
    });

    it("should check for a match if two cards are flipped", function () {
      expect(game.matchedCards.length).toBe(0);

      game.handleCardClick(card1);
      game.handleCardClick(card2);
      expect(game.matchedCards).toContain(card1);
      expect(game.matchedCards).toContain(card2);

      expect(game.matchedCards.length).toBe(2);
    });

    it("should reset flippedCards if there is no match", function () {
      const initialFlippedCardsLength = game.flippedCards.length;
      expect(initialFlippedCardsLength).toBe(0);

      game.handleCardClick(card4);
      const updatedFlippedCardsLengthAfterFirstClick = game.flippedCards.length;
      expect(updatedFlippedCardsLengthAfterFirstClick).toBe(
        initialFlippedCardsLength + 1
      );

      game.handleCardClick(card3);
      const updatedFlippedCardsLengthAfterSecondClick =
        game.flippedCards.length;
      expect(updatedFlippedCardsLengthAfterSecondClick).toBe(2);
      jasmine.clock().tick(1000);
      expect(game.flippedCards.length).toBe(0);
    });

    it("should not add the card to flippedCards if it is already matched", function () {
      expect(game.flippedCards).not.toContain(card1);
      game.handleCardClick(card1);
      game.handleCardClick(card2);
      game.handleCardClick(card1);
      expect(game.flippedCards).not.toContain(card1);
    });
  });

  describe("Completion methods", function () {
    let congratulationsMessageSpy;
    let newGameButtonSpy;

    beforeEach(function () {
      congratulationsMessageSpy = spyOn(game, "showCongratulations");
      newGameButtonSpy = spyOn(game, "showNewGameButton");
    });

    it("should call showCongratulations and showNewGameButton when the game is completed", function () {
      game.totalPairs = 2;
      game.matchedCards = [{}, {}];

      expect(congratulationsMessageSpy).not.toHaveBeenCalled();
      expect(newGameButtonSpy).not.toHaveBeenCalled();

      game.showCongratulations();
      game.showNewGameButton();

      expect(congratulationsMessageSpy).toHaveBeenCalled();
      expect(newGameButtonSpy).toHaveBeenCalled();
    });

    it("should call handleGameCompletion when the game is completed", function () {
      game.totalPairs = 2;
      game.matchedCards = [{}, {}];

      expect(congratulationsMessageSpy).not.toHaveBeenCalled();

      game.handleGameCompletion();

      expect(congratulationsMessageSpy).toHaveBeenCalled();
    });
  });
});
