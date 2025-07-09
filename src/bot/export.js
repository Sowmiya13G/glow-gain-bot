const { db } = require('../../db/database');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  bot.onText(/\/export/, async (msg) => {
    const chatId = process.env.CHAT_ID
    const date = new Date().toISOString().split('T')[0];

    try {
      const workbook = new ExcelJS.Workbook();

      // List of tables to export
      const tables = ['meals', 'water_logs', 'workouts'];

      for (const table of tables) {
        const sheet = workbook.addWorksheet(table);

        // Get column headers dynamically
        const columns = await new Promise((resolve, reject) => {
          db.all(`PRAGMA table_info(${table})`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(row => row.name));
          });
        });

        // Set columns in Excel
        sheet.columns = columns.map(col => ({ header: col, key: col }));

        // Fetch data from table
        const rows = await new Promise((resolve, reject) => {
          db.all(`SELECT * FROM ${table} WHERE user_id = ?`, [chatId], (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });

        // Add rows
        sheet.addRows(rows);
      }

      // Save file
      const filename = `export_${chatId}_${Date.now()}.xlsx`;
      const filepath = path.join(__dirname, `../../../tmp/${filename}`);

      await workbook.xlsx.writeFile(filepath);

      // Send file
      await bot.sendDocument(chatId, filepath, {
        caption: '📦 Here is your exported data.',
      });

      // Delete file after sending
      fs.unlinkSync(filepath);

      // Wipe user data
      for (const table of tables) {
        db.run(`DELETE FROM ${table} WHERE user_id = ?`, [chatId]);
      }

      bot.sendMessage(chatId, '✅ All your data has been cleared from the database.');
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, '❌ Failed to export data.');
    }
  });
};
