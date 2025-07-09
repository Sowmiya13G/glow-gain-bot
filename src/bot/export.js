const { db } = require('../../db/database');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  bot.onText(/\/export/, async (msg) => {
    const chatId = msg.chat.id; // ✅ Use dynamic chat ID
    const timestamp = Date.now();

    try {
      const workbook = new ExcelJS.Workbook();
      const tables = ['meals', 'water_logs', 'workouts'];

      for (const table of tables) {
        const sheet = workbook.addWorksheet(table);

        // Get column names
        const columns = await new Promise((resolve, reject) => {
          db.all(`PRAGMA table_info(${table})`, (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(row => row.name));
          });
        });

        sheet.columns = columns.map(col => ({ header: col, key: col }));

        // Get table rows for this user
        const rows = await new Promise((resolve, reject) => {
          db.all(`SELECT * FROM ${table} WHERE user_id = ?`, [chatId], (err, data) => {
            if (err) return reject(err);
            resolve(data);
          });
        });

        sheet.addRows(rows);
      }

      // Save to temporary file
      const filename = `export_${chatId}_${timestamp}.xlsx`;
      const tmpDir = path.join(__dirname, '../../../tmp');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const filepath = path.join(tmpDir, filename);
      await workbook.xlsx.writeFile(filepath);

      // Send file via Telegram
      await bot.sendDocument(chatId, filepath, {
        caption: '📦 Here is your exported data.',
      });

      // Delete temp file
      fs.unlinkSync(filepath);

      // Clear user data
      for (const table of tables) {
        db.run(`DELETE FROM ${table} WHERE user_id = ?`, [chatId]);
      }

      bot.sendMessage(chatId, '✅ All your data has been cleared from the database.');
    } catch (err) {
      console.error('Export error:', err);
      bot.sendMessage(chatId, '❌ Failed to export data.');
    }
  });
};
