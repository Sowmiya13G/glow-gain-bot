const cron = require('node-cron');

// Every 40 minutes from 6 AM to 10 PM (6-22)
module.exports = (bot) => {
  const userIds = [process.env.CHAT_ID]; // Replace with DB lookup in production

  // 💧 Water Reminder Every 40 Minutes (6 AM – 10 PM)
  cron.schedule('*/40 6-22 * * *', () => {
    for (const userId of userIds) {
      bot.sendMessage(userId, '💧 Reminder: Drink some water!');
    }
  });

  // ⏰ Daily Summary at 10 PM
  cron.schedule('0 22 * * *', () => {
    for (const userId of userIds) {
      bot.sendMessage(userId, '⏰ Time for your daily summary! Type /summary to see it.');
    }
  });

  // 📅 Weekly Summary on Sundays at 10 PM
  cron.schedule('0 22 * * 0', () => {
    for (const userId of userIds) {
      bot.sendMessage(userId, '📅 Weekly summary time! (Coming soon)');
    }
  });
};
