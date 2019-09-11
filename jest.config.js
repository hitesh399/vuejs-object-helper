module.exports = {
    
      "collectCoverage": true,
      "collectCoverageFrom": [
        "**/*.{js,vue}",
        "!**/node_modules/**"
      ],
      "coverageReporters": ["html", "text-summary"],
      "transform": {
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
      }

  }