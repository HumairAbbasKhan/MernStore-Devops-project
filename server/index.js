require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');

const keys = require('./config/keys');
const routes = require('./routes');
const socket = require('./socket');
const setupDB = require('./utils/db');

const { port } = keys;
const app = express();

// Basic middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);
app.use(cors());

// Database setup
setupDB();

// Warn if critical environment variables are missing
if (!process.env.JWT_SECRET) {
  console.log(chalk.red.bold('⚠ WARNING: JWT_SECRET is missing from .env'));
}
if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
  console.log(chalk.red.bold('⚠ WARNING: Mailgun keys are missing from .env'));
}

// Only load passport if JWT secret is present
try {
  require('./config/passport')(app);
} catch (err) {
  console.log(
    chalk.red('Passport initialization skipped due to missing keys.')
  );
}

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 MERN E-commerce Server Running</h1>
    <p>Status: ${
      process.env.JWT_SECRET && process.env.MAILGUN_API_KEY
        ? '<span style="color:green;">All keys set</span>'
        : '<span style="color:red;">Missing environment variables</span>'
    }</p>
  `);
});

// Other routes
app.use(routes);

// Start server
const server = app.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});

socket(server);
