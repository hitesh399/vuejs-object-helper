module.exports = {
    
      "collectCoverage": true,
      "collectCoverageFrom": [
        "src/main.js",
        "!**/node_modules/**"
      ],
      "coverageReporters": ["html", "text-summary"],
      "transform": {
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
      }

  }