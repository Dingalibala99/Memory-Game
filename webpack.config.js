const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/game_web.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
