// First remove .js from imports since Webpack will take care of file extension

// Set Entry and Output Configuration
// Use Node.js module to build an absolute path
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

// NodeJS export syntax: Of a JS object which is the configuration object picked up by Webpack:
module.exports = {
  // This tells webpack that here we are building for production
  mode: "production",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // Make sure you have the sourceMap: true in tsconfig
  // This tells Webpack that we don't need sourcemaps for production code
  devtool: false,
  // Tell webpack how to work with the files it finds
  module: {
    // Rules to be applied to the files
    rules: [
      {
        // Test webpack will perform on any file to find out whether this rule here applies or not. It is a regular expression -> In this case we are telling that any file that ends with .ts should apply here
        test: /\.ts$/,
        // Tell what webpack should do with those files
        use: "ts-loader",
        // Ignore .ts files in node modules. It is a regular expression
        exclude: /node_modules/,
      },
    ],
  },
  // Tell Webpack which file extensions it adds to the imports finds
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
