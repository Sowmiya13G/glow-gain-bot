const cron = require('node-cron');

module.exports = (bot) => {
  // Every 40 minutes from 6AM–9PM
  cron.schedule('*/40 6-21 * * *', () => {
    // Replace with list of user IDs or broadcast storage later
    const userIds = [/* hardcode your chat ID for now */];

    for (const userId of userIds) {
      bot.sendMessage(userId, '💧 Reminder: Drink some water!');
    }
  });

  // Daily summary at 10PM
  cron.schedule('0 22 * * *', () => {
    const chatId = process.env.CHAT_ID; // Replace or fetch dynamically
    bot.sendMessage(chatId, '⏰ Time for your daily summary! Type /summary to see it.');
  });

  // Weekly summary on Sundays at 10PM
  cron.schedule('0 22 * * 0', () => {
    const chatId = process.env.CHAT_ID;
    bot.sendMessage(chatId, '📅 Weekly summary time! (Coming soon)');
  });

  // Hair/skin reminders (alternate days, Tue/Sat etc. — to be implemented later)
};
