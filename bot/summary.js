const { db } = require('../db/database');

module.exports = (bot) => {
  bot.onText(/\/summary/, (msg) => {
    const chatId = msg.chat.id;

    const date = new Date().toISOString().split('T')[0]; // today

    db.get(`
      SELECT 
        SUM(calories) as total_calories, 
        SUM(protein) as total_protein 
      FROM meals 
      WHERE user_id = ? AND DATE(created_at) = ?
    `, [chatId, date], (err, mealRow) => {
      if (err) return bot.sendMessage(chatId, '❌ Failed to fetch meals.');

      db.get(`
        SELECT SUM(amount_ml) as total_water 
        FROM water_logs 
        WHERE user_id = ? AND DATE(created_at) = ?
      `, [chatId, date], (err, waterRow) => {
        if (err) return bot.sendMessage(chatId, '❌ Failed to fetch water intake.');

        const cals = Math.round(mealRow.total_calories || 0);
        const protein = Math.round(mealRow.total_protein || 0);
        const water = waterRow.total_water || 0;

        const calGoal = cals >= 1450 && cals <= 1650 ? '✅' : '❌';
        const proteinGoal = protein >= 60 && protein <= 70 ? '✅' : '❌';
        const waterGoal = water >= 3000 ? '✅' : '❌';

        bot.sendMessage(chatId, 
          `📊 *Daily Summary*\n\n` +
          `🔥 Calories: ${cals} ${calGoal}\n` +
          `💪 Protein: ${protein}g ${proteinGoal}\n` +
          `💧 Water: ${water}ml ${waterGoal}\n\n` +
          `🎯 Goals:\nCalories: 1450–1650\nProtein: 60–70g\nWater: 3L`,
          { parse_mode: 'Markdown' });
      });
    });
  });
};
