var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");

var dist = path.resolve(__dirname, "dist");

var commons = {
  
  devtool: "eval", // "source-map"

  performance: {
      hints: "warning"
  },
  
  entry: {
    "polyfills": "./src/polyfills.ts",
    "vendor": "./src/vendor.ts",
    "app": "./src/app.tsx"
  },

  output: {
    filename: "[name].[hash:6].dev.js",
    path: dist
  },
  
  resolve: {
    extensions: [
      ".ts", ".tsx", 
      ".js", ".jsx",
      ".css", ".scss", 
      ".html" ]
  },

  module: {
    rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [ "babel-loader", "awesome-typescript-loader", "source-map-loader" ]
        },
        { 
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [ "babel-loader", "source-map-loader" ]  
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: "style-loader!css-loader"
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [ "style-loader", "css-loader", "sass-loader" ]
        },
        {
          test: /\.html$/,
          use: "raw-loader"
        }
      
    ]
  },

  plugins: [

        new CleanWebpackPlugin(
            [
                "./assets/css",
                "./assets/favico",
                "./assets/fonts",
                "./assets/imgs",
                "./assets/js",
                "./assets",
                "./*",
            ],
            {
                root: dist,
                verbose: true
            }
        ),		

        new webpack.optimize.CommonsChunkPlugin(
            {
                name: [ "app" ]
            }
        ),

        new HtmlWebpackPlugin(
            {
                chunks: ["polyfills", "vendor", "app"],
                template: "./resources/razor/index.html",
                inject: true,
                filename: "./index.html",
            }
        ),

        new CopyWebpackPlugin([
            { from: "resources/css/*.*", to: "assets/css/", flatten: true },
            { from: "resources/fonts/*.*", to: "assets/fonts/", flatten: true },
            { from: "resources/imgs/*.*", to: "assets/imgs/", flatten: true },
            { from: "resources/js/*.*", to: "assets/js/", flatten: true },
            { from: "resources/favico/*", to: "assets/favico", flatten: true },
            // { from: "node_modules/jquery/dist/jquery.min.js", to: "assets/js/", flatten: true }, // because of datepicker
            // { from: "node_modules/bootstrap/dist/css/bootstrap.min.css.map", to: "assets/css/", flatten: true },
        ])
  ],
  
  devServer: {
    contentBase: dist,
    inline: true,
    port: 3000
  }
};

var environment = (process.env.NODE_ENV || "development").trim();
var merge = require('webpack-merge');

console.log("------------------------------------------------------");
console.log("Build: ", environment.toUpperCase());
console.log("------------------------------------------------------");

var configs = { };

if (environment === "development") {
  //configs = require("./webpack.config.dev.js");
} else {
  //configs = require("./webpack.config.prod.js");
}

module.exports = merge(commons, configs);