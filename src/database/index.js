const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./index.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the index SQLite database.');
});

const sql = 'CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, rga TEXT NOT NULL, nome TEXT NOT NULL, curso TEXT)'
db.run(sql);

module.exports = db;