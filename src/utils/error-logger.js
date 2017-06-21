const chalk = require('chalk');

const errorLogger = (error) => {
  if (error.message && error.code) {
    // This is OneSky's error message format
    console.error(chalk.red(`${error.code}: ${error.message}`));
  } else {
    console.error(chalk.red(error));
  }
};

module.exports = errorLogger;
