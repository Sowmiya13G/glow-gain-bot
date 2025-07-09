const { db } = require('../../db/database');

module.exports = (bot) => {
  bot.on('callback_query', (query) => {
    const userId = query.from.id;
    const chatId = query.message.chat.id;

    if (query.data === 'drink_75ml') {
      db.run(
        `INSERT INTO water_log (user_id, amount_ml) VALUES (?, ?)`,
        [userId, 75],
        (err) => {
          if (err) {
            console.error(err);
            bot.answerCallbackQuery(query.id, { text: '❌ Error logging water' });
          } else {
            bot.answerCallbackQuery(query.id, { text: '✅ Logged 75ml water!' });
            bot.sendMessage(chatId, '👍 Great! 75ml water logged.');
          }
        }
      );
    }
  });
};
