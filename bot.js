require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { setupDatabase } = require('./db/database');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Import modules
require('./src/bot/meals')(bot);
require('./src/bot/water-log')(bot);
require('./src/bot/workouts')(bot);
require('./src/bot/summary')(bot);
require('./src/bot/care')(bot);
require('./src/bot/water-log')(bot);
require('./src/bot/export')(bot);

require('./src/cron/water-reminder')(bot);
// Setup database
setupDatabase();

console.log("Bot is running...");
