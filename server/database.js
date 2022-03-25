/**
 * Module handles database management
 *
 * The sample data is for a chat log with one table:
 * Messages: id + message text
 */

const fs = require("fs");
const dbFile = "./.data/visitors.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

//SQLite wrapper for async / await connections https://www.npmjs.com/package/sqlite
dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database,
  })
  .then(async (dBase) => {
    db = dBase;

    try {
      if (!exists) {
        await db.run(
          "CREATE TABLE Visitors (id INTEGER PRIMARY KEY AUTOINCREMENT, ip INT)"
        );
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

// Server script calls these methods to connect to the db
module.exports = {
  getFlowers: async () => {
    try {
      return await db.all("SELECT * from Visitors");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  getCount: async () => {
    try {
      return await db.each("SELECT COUNT(*) AS count FROM Visitors", (err, row) => {row.count});
    } catch (dbError) {
      console.error(dbError);
    }
  },

  addFlower: async (ip) => {
    let success = false;
    try {
      success = await db.run(
        "INSERT INTO Visitors (ip) VALUES (?)",
        [ip]
      );
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  },
};
