const { getNutrients } = require('../../services/nutritionix');
const { db } = require('../../db/database');

module.exports = (bot) => {
  bot.onText(/\/add_meal (.+)/, (msg, match) => {
    const category = match[1];
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, '🍽 Please describe your meal (e.g., 1 cup of rice + 1 boiled egg):');

    bot.once('message', async (mealMsg) => {
      const description = mealMsg.text;

      // Split input on newlines, commas, "and", plus signs — case-insensitive
      const items = description
        .split(/\s*(?:\+|,|and|\n)+\s*/i)
        .map(item => item.trim())
        .filter(Boolean); // Remove empty strings

      try {
        let total = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };

        for (const item of items) {
          const nutrients = await getNutrients(item);
          total.calories += nutrients.calories || 0;
          total.protein += nutrients.protein || 0;
          total.carbs += nutrients.carbs || 0;
          total.fat += nutrients.fat || 0;
        }

        db.run(`INSERT INTO meals (user_id, category, description, calories, protein, carbs, fat)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [chatId, category, description, total.calories, total.protein, total.carbs, total.fat]);

        bot.sendMessage(chatId,
          `✅ Meal logged!\n\n🍽 ${description}\n🔥 Calories: ${total.calories.toFixed(2)}\n💪 Protein: ${total.protein.toFixed(2)}g\n🥖 Carbs: ${total.carbs.toFixed(2)}g\n🧈 Fat: ${total.fat.toFixed(2)}g`);
      } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, '❌ Error retrieving nutrition info.');
      }
    });
  });
};
