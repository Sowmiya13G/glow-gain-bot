require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { setupDatabase } = require('./db/database');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Import modules
require('./bot/meals')(bot);
require('./bot/water')(bot);
require('./bot/workouts')(bot);
require('./bot/summary')(bot);
require('./bot/care')(bot);
require('./bot/reminders')(bot);

// Setup database
setupDatabase();

console.log("Bot is running...");
