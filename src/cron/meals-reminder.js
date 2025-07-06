const { getNutrients } = require('../../services/nutritionix');
const { db } = require('../../db/database');

module.exports = (bot) => {
  bot.onText(/\/add_meal (.+)/, (msg, match) => {
    const category = match[1]; // e.g., pre_workout, lunch, dinner, etc.
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, '🍽 Please describe your meal (e.g., 1 banana and peanut butter):');

    bot.once('message', async (mealMsg) => {
      const description = mealMsg.text;

      try {
        const nutrients = await getNutrients(description);

        db.run(`INSERT INTO meals (user_id, category, description, calories, protein, carbs, fat)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [chatId, category, description, nutrients.calories, nutrients.protein, nutrients.carbs, nutrients.fat]);

        bot.sendMessage(chatId,
          `✅ Meal logged!\n\n🍽 ${description}\n🔥 Calories: ${nutrients.calories}\n💪 Protein: ${nutrients.protein}g\n🥖 Carbs: ${nutrients.carbs}g\n🧈 Fat: ${nutrients.fat}g`);
      } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, '❌ Error retrieving nutrition info.');
      }
    });
  });
};
