const { db } = require('../db/database');

module.exports = (bot) => {
  bot.onText(/\/add_water (\d+)/, (msg, match) => {
    const amount = parseInt(match[1]);
    const chatId = msg.chat.id;

    db.run(`INSERT INTO water_logs (user_id, amount_ml) VALUES (?, ?)`,
      [chatId, amount], (err) => {
        if (err) return bot.sendMessage(chatId, '❌ Failed to log water.');
        bot.sendMessage(chatId, `💧 Water logged: ${amount}ml`);
      });
  });
};
