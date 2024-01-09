/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game_web.js":
/*!*************************!*\
  !*** ./src/game_web.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { gameObjects, elements } = __webpack_require__(/*! ./helper_objects */ \"./src/helper_objects.js\");\nconst {\n  shuffle,\n  hideCongratulations,\n  showRestartButton,\n} = __webpack_require__(/*! ./helper_functions */ \"./src/helper_functions.js\");\n\nclass MemoryGame {\n  constructor(numberOfRows = 3, numberOfColumns = 4) {\n    this.symbols = gameObjects.gameCards;\n    this.timeoutId = null;\n    this.turnCount = 0;\n    this.numberOfRows = numberOfRows;\n    this.numberOfColumns = numberOfColumns;\n    this.totalPairs = (this.numberOfRows * this.numberOfColumns) / 2;\n    this.totalCards = this.numberOfRows * this.numberOfColumns;\n    this.board = elements.gameBoard;\n    this.newGameButton = elements.newGame;\n    this.okButton = elements.okButton;\n    this.restartButton = elements.restartButton;\n    this.timerElement = elements.timerElement;\n    this.gridSizeRadioButtons = elements.gridSizeRadioButtons;\n    this.completionTimeElement = elements.completionTimeElement;\n    this.flippedCards = [];\n    this.matchedCards = [];\n    this.startTime = null;\n    this.endTime = null;\n    this.timerInterval = null;\n    this.hideRestartButton();\n    this.initializeGame();\n  }\n\n  createCard(symbol) {\n    const card = document.createElement(\"div\");\n    card.classList.add(gameObjects.card);\n    card.dataset.symbol = symbol;\n    card.addEventListener(\"click\", () => {\n      this.handleCardClick(card);\n    });\n    return card;\n  }\n\n  handleCardClick(card) {\n    if (!this.startTime) {\n      this.startTime = new Date();\n      this.startTimer();\n    }\n    if (\n      this.flippedCards.length < 2 &&\n      !this.flippedCards.includes(card) &&\n      !this.matchedCards.includes(card)\n    ) {\n      this.flippedCards.push(card);\n      card.textContent = card.dataset.symbol;\n      card.style.backgroundColor = gameObjects.whiteColor;\n      this.turnCount++;\n      this.updateTurnCount();\n      if (this.flippedCards.length === 2) {\n        if (\n          this.flippedCards[0].textContent === this.flippedCards[1].textContent\n        ) {\n          this.matchedCards.push(this.flippedCards[0]);\n          this.matchedCards.push(this.flippedCards[1]);\n          this.flippedCards = [];\n          if (this.matchedCards.length === 2) {\n            showRestartButton();\n          }\n          this.checkGameCompletion();\n        } else {\n          setTimeout(() => {\n            this.flippedCards[0].textContent = \"\";\n            this.flippedCards[0].style.backgroundColor = gameObjects.greyColor;\n            this.flippedCards[1].textContent = \"\";\n            this.flippedCards[1].style.backgroundColor = gameObjects.greyColor;\n            this.flippedCards = [];\n          }, 1000);\n        }\n      }\n    }\n\n    if (this.matchedCards.length === 0) {\n      this.hideRestartButton();\n    }\n  }\n\n  handleGameCompletion() {\n    clearTimeout(this.timeoutId);\n    this.showCongratulations();\n    this.showNewGameButton();\n  }\n\n  checkGameCompletion() {\n    if (this.matchedCards.length === this.totalPairs * 2) {\n      this.handleGameCompletion();\n      this.endGame();\n    }\n  }\n\n  restartGame(rows = this.numberOfRows, cols = this.numberOfColumns) {\n    let cards = [];\n    this.flippedCards = [];\n    this.matchedCards = [];\n    this.turnCount = 0;\n    this.numberOfRows = rows;\n    this.numberOfColumns = cols;\n    this.totalPairs = (this.numberOfRows * this.numberOfColumns) / 2;\n    this.totalCards = this.numberOfRows * this.numberOfColumns;\n    this.updateTurnCount();\n    clearTimeout(this.timeoutId);\n    this.timeoutId = null;\n    this.startTime = null;\n    this.endTime = null;\n    this.timerInterval = null;\n    this.timerElement.textContent = \"00:00:00\";\n    clearInterval(this.timerInterval);\n    this.board.innerHTML = \"\";\n    const shuffledSymbols = this.symbols.slice(0, this.totalPairs);\n    cards = [...shuffledSymbols, ...shuffledSymbols];\n    shuffle(cards);\n    for (let i = 0; i < this.totalCards; i++) {\n      const symbol = cards[i];\n      const card = this.createCard(symbol);\n      this.board.appendChild(card);\n    }\n    hideCongratulations();\n    this.hideNewGameButton();\n  }\n\n  initializeGame() {\n    this.restartButton.addEventListener(\"click\", () => {\n      this.restartGame();\n      this.hideRestartButton();\n    });\n    this.newGameButton.addEventListener(\"click\", () => {\n      this.restartGame();\n      this.startTime = null;\n      this.completionTimeElement.textContent = \"\";\n      this.startGame();\n    });\n    this.gridSizeRadioButtons.forEach((radioButton) => {\n      radioButton.addEventListener(\"click\", () => {\n        const [rows, cols] = radioButton.value.split(\"x\").map(Number);\n        this.restartGame(rows, cols);\n        this.startTime = null;\n        this.completionTimeElement.textContent = \"\";\n        this.startGame();\n      });\n    });\n    this.restartGame();\n  }\n\n  showCongratulations() {\n    elements.congratulationsMessage;\n    elements.congratulationsMessage.style.display = gameObjects.grid;\n\n    this.okButton.addEventListener(\"click\", () => {\n      hideCongratulations();\n      this.hideRestartButton();\n      this.showNewGameButton();\n    });\n    this.newGameButton.addEventListener(\"click\", () => {\n      this.restartGame();\n    });\n  }\n\n  hideRestartButton() {\n    this.restartButton.style.display = gameObjects.none;\n  }\n\n  showNewGameButton() {\n    this.newGameButton.style.display = gameObjects.block;\n  }\n\n  hideNewGameButton() {\n    this.newGameButton.style.display = gameObjects.none;\n  }\n\n  startGame() {\n    const cards = this.board.querySelectorAll(`.${gameObjects.card}`);\n    cards.forEach((card) => {\n      card.addEventListener(\n        \"click\",\n        () => {\n          if (!this.startTime) {\n            this.startTime = new Date();\n            this.startTimer();\n          }\n        },\n        { once: true }\n      );\n    });\n  }\n\n  startTimer() {\n    this.timerInterval = setInterval(() => {\n      const now = new Date();\n      const elapsedTime = now - (this.startTime || now);\n      this.updateTimer(elapsedTime);\n    }, 1000);\n  }\n\n  formatTime(timeInMilliseconds) {\n    const seconds = Math.floor((timeInMilliseconds / 1000) % 60);\n    const minutes = Math.floor((timeInMilliseconds / (1000 * 60)) % 60);\n    const hours = Math.floor((timeInMilliseconds / (1000 * 60 * 60)) % 24);\n\n    return `${hours}h ${minutes}m ${seconds}s`;\n  }\n\n  updateTimer(elapsedTime) {\n    const formattedTime = this.formatTime(elapsedTime);\n    this.timerElement.textContent = formattedTime;\n  }\n\n  endGame() {\n    clearInterval(this.timerInterval);\n    this.endTime = new Date();\n    this.showElapsedTime();\n  }\n\n  showElapsedTime() {\n    const elapsedTime = this.endTime - this.startTime;\n    const formattedTime = this.formatTime(elapsedTime);\n\n    const completionMessage = `Congratulations! You've completed the game in ${formattedTime} with ${this.turnCount} moves`;\n\n    this.completionTimeElement.textContent = completionMessage;\n  }\n\n  updateTurnCount() {\n    const turnCountElement = document.getElementById(\"turn-count\");\n    turnCountElement.textContent = `Turn-Count: ${this.turnCount}`;\n  }\n}\n\nif (typeof window !== \"undefined\") {\n  window.onload = function () {\n    const game = new MemoryGame();\n    game.startGame();\n  };\n}\n\nmodule.exports = MemoryGame;\n\n\n//# sourceURL=webpack://makadunyiswe-dingalibala-222-memory-game-in-vanilla-js-javascript/./src/game_web.js?");

/***/ }),

/***/ "./src/helper_functions.js":
/*!*********************************!*\
  !*** ./src/helper_functions.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { gameObjects, elements } = __webpack_require__(/*! ./helper_objects */ \"./src/helper_objects.js\");\n\nfunction shuffle(array) {\n  for (let i = array.length - 1; i > 0; i--) {\n    const index = Math.floor(Math.random() * (i + 1));\n    [array[i], array[index]] = [array[index], array[i]];\n  }\n}\n\nfunction hideCongratulations() {\n  elements.congratulationsMessage;\n  elements.congratulationsMessage.style.display = gameObjects.none;\n}\n\nfunction showRestartButton() {\n  elements.restartButton.style.display = gameObjects.block;\n}\n\nmodule.exports = {\n  shuffle,\n  hideCongratulations,\n  showRestartButton,\n};\n\n\n//# sourceURL=webpack://makadunyiswe-dingalibala-222-memory-game-in-vanilla-js-javascript/./src/helper_functions.js?");

/***/ }),

/***/ "./src/helper_objects.js":
/*!*******************************!*\
  !*** ./src/helper_objects.js ***!
  \*******************************/
/***/ ((module) => {

eval("const gameObjects = {\n  grid: \"grid\",\n  none: \"none\",\n  block: \"block\",\n  card: \"card\",\n  gameCards: [\"A\", \"B\", \"C\", \"D\", \"E\", \"F\", \"G\", \"H\", \"I\", \"J\"],\n  greyColor: \"#ccc\",\n  whiteColor: \"#fff\",\n};\n\nconst elements = {\n  congratulationsMessage: document.getElementById(\"congratulations-message\"),\n  okButton: document.getElementById(\"ok-button\"),\n  newGame: document.getElementById(\"new-game-button\"),\n  gameBoard: document.getElementById(\"board\"),\n  restartButton: document.getElementById(\"restart-button\"),\n  completionTimeElement: document.getElementById(\"completion-time\"),\n  timerElement: document.getElementById(\"timer\"),\n  gridSizeRadioButtons: document.querySelectorAll('input[name=\"grid-size\"]'),\n};\n\nmodule.exports = { gameObjects, elements };\n\n\n//# sourceURL=webpack://makadunyiswe-dingalibala-222-memory-game-in-vanilla-js-javascript/./src/helper_objects.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/game_web.js");
/******/ 	
/******/ })()
;
