const { db } = require('../../db/database');

module.exports = (bot) => {
  bot.onText(/\/log_care (.+)/, (msg, match) => {
    const type = match[1]; // hair_spray, face_mask, hair_wash
    const chatId = msg.chat.id;

    db.run(`INSERT INTO care_logs (user_id, type, done) VALUES (?, ?, ?)`,
      [chatId, type, 1], (err) => {
        if (err) return bot.sendMessage(chatId, '❌ Could not log care routine.');
        bot.sendMessage(chatId, `✅ Logged care routine: ${type}`);
      });
  });
};
