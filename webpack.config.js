// First remove .js from imports since Webpack will take care of file extension

// Set Entry and Output Configuration
// Use Node.js module to build an absolute path
const path = require("path");

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // Make sure you have the sourceMap: true in tsconfig
  // This tells Webpack that there will be generated sourcemaps already, which it should extract and basically wire up correctly to the bundle it generates
  devtool: "inline-source-map",
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
};
