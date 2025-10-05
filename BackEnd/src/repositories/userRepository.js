const oracledb = require('oracledb');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`
    });

    console.log("✅ Connected to Oracle Database");

    const result = await connection.execute(`SELECT * FROM NQT_USER.USERS`);
    console.log(result.rows);

    await connection.close();
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
}

testConnection();
