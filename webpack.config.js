// First remove .js from imports since Webpack will take care of file extension

// Set Entry and Output Configuration
// Use Node.js module (path) to build an absolute path
const path = require("path");

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
