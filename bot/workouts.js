const { db } = require('../db/database');

module.exports = (bot) => {
  bot.onText(/\/add_workout/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🏋️‍♂️ Enter your workout description (e.g., 30 mins cardio):');

    bot.once('message', (workoutMsg) => {
      const description = workoutMsg.text;

      db.run(`INSERT INTO workouts (user_id, description) VALUES (?, ?)`,
        [chatId, description], (err) => {
          if (err) return bot.sendMessage(chatId, '❌ Failed to log workout.');
          bot.sendMessage(chatId, `✅ Workout logged: ${description}`);
        });
    });
  });
};
