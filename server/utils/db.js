const chalk = require('chalk');
const mongoose = require('mongoose');

const setupDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`);
  } catch (error) {
    console.error(
      `${chalk.red('✗')} ${chalk.redBright('MongoDB Connection Failed!')}`
    );
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};

module.exports = setupDB;
