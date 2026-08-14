require('dotenv').config();
const mysql = require('mysql2/promise');

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  console.log('开始初始化数据库...');

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`数据库 ${DB_NAME} 已创建或已存在`);

  await connection.query(`USE \`${DB_NAME}\``);

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nickname VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createItemsTable = `
    CREATE TABLE IF NOT EXISTS items (
      id VARCHAR(36) PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(100),
      color VARCHAR(50),
      owner ENUM('me', 'him', 'both') DEFAULT 'both',
      category ENUM('digital', 'home', 'clothing', 'pet', 'other') NOT NULL DEFAULT 'other',
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      purchase_date DATE NOT NULL,
      image TEXT,
      notes TEXT,
      status ENUM('active', 'idle', 'sold') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_category (category),
      INDEX idx_status (status),
      INDEX idx_purchase_date (purchase_date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createWishesTable = `
    CREATE TABLE IF NOT EXISTS wishes (
      id VARCHAR(36) PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      target_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      current_saved DECIMAL(10, 2) NOT NULL DEFAULT 0,
      priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
      target_date DATE,
      image TEXT,
      notes TEXT,
      achieved BOOLEAN DEFAULT FALSE,
      achieved_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_priority (priority),
      INDEX idx_achieved (achieved),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await connection.query(createUsersTable);
  console.log('users 表创建完成');

  await connection.query(createItemsTable);
  console.log('items 表创建完成');

  await connection.query(createWishesTable);
  console.log('wishes 表创建完成');

  await connection.end();
  console.log('数据库初始化完成！');
}

initDatabase().catch((err) => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});
