import mysql from 'mysql2/promise';

const db = mysql.createPool({
 host: '127.0.0.1',
 port: 3306,
 user: 'root',
 password: '1694',
 database: 'gastro-app_db'
});

async function initializeDatabase() {
 try {
  const connection = await db.getConnection();
  await connection.execute(`
  CREATE TABLE IF NOT EXISTS MenuCategories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
  )`);
  await connection.release();
 } catch (error) {
  console.error('DB initialization error:', error);
 }
}
initializeDatabase();
export { db };