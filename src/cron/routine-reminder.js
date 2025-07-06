const cron = require('node-cron');
const { logEvent } = require('../db/database');

let botInstance = null; 

function setupWakeupReminder(bot) {
  botInstance = bot;

  cron.schedule('40 5 * * *', () => {
    sendWakeupPrompt();
  });
}

function sendWakeupPrompt() {
  const chatId = process.env.CHAT_ID; 
  if (!chatId) return;

  botInstance.sendMessage(chatId, '⏰ Did you wake up Bae?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Yes', callback_data: 'wake_yes' },
          { text: 'No', callback_data: 'wake_no' }
        ]
      ]
    }
  });
}

function handleWakeupResponse(bot) {
  bot.on('callback_query', async (query) => {
    const { data, message, from } = query;

    if (data === 'wake_yes') {
      const time = new Date().toISOString();
      logEvent(from.id, 'wake', time);
      bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Wake-up logged!' });
      bot.sendMessage(message.chat.id, `👏 Great! Logged your wake-up time: ${new Date().toLocaleTimeString()}`);
    }

    if (data === 'wake_no') {
      bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Will remind you again in 30 minutes!' });

      setTimeout(() => {
        sendWakeupPrompt();
      }, 30 * 60 * 1000);
    }
  });
}

module.exports = {
  setupWakeupReminder,
  handleWakeupResponse
};
