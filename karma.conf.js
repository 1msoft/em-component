const path = require('path');
const webpackConf = {
  mode: "none",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: 'istanbul-instrumenter-loader',
            options: { esModules: true }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: { javascriptEnabled: true, sourceMap: false }
          }
        ],
      },
      {
        // for font
        test: /\.(ttf|otf|eot|woff(?:2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1000,
            },
          },
        ],
      },
      {
        // for svg
        test: /\.(svg?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1000,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ogg|mp3)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1000,
            },
          },
        ],
      },
    ],
  },
};

module.exports = function(config) {
  config.set({

    files: [
      './node_modules/@babel/polyfill/dist/polyfill.min.js',
      'components/**/*.test.js'
    ],

    frameworks: ['mocha'],

    preprocessors: {
      'components/**/*.test.js': ['webpack']
    },

    reporters: ['mocha', 'coverage-istanbul'],

    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      }
    },
    webpack: webpackConf,

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-chai"),
      require("karma-chrome-launcher"),
      require("karma-mocha-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("istanbul-instrumenter-loader"),
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
    ],
    browsers: ['PhantomJS_custom', 'ChromeHeadless'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      },

      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--disable-translate',
          '--headless',
          '--disable-gpu',
          '--disable-extensions',
          '--remote-debugging-port=9222',
        ],
      }
    },
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },
  });
};
