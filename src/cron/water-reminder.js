const cron = require('node-cron');

module.exports = (bot) => {
  const userIds = [process.env.CHAT_ID]; // Replace with DB lookup

  cron.schedule('*/40 6-22 * * *', () => {
    for (const userId of userIds) {
      bot.sendMessage(userId, '💧 Reminder: Drink some water!', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '✅ Done', callback_data: 'drink_75ml' }]
          ]
        }
      });
    }
  });

  // Daily summary
  cron.schedule('0 22 * * *', () => {
    for (const userId of userIds) {
      bot.sendMessage(userId, '⏰ Time for your daily summary! Type /summary to see it.');
    }
  });

  // Weekly summary
  cron.schedule('0 22 * * 0', () => {
    for (const userId of userIds) {
      bot.sendMessage(userId, '📅 Weekly summary time! (Coming soon)');
    }
  });
};
