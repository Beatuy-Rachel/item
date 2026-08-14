const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const { items, wishes } = req.body;
  const userId = req.user.id;

  if (!items && !wishes) {
    return res.status(400).json({ error: '没有可导入的数据' });
  }

  try {
    const db = req.db;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      let importedItems = 0;
      let importedWishes = 0;

      if (items && Array.isArray(items)) {
        await connection.query('DELETE FROM items WHERE user_id = ?', [userId]);

        for (const item of items) {
          const id = item.id && item.id.length === 36 ? item.id : uuidv4();
          await connection.query(
            `INSERT INTO items (id, user_id, name, brand, color, owner, category, price, purchase_date, image, notes, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              userId,
              item.name,
              item.brand || null,
              item.color || null,
              item.owner || 'both',
              item.category,
              item.price,
              item.purchaseDate,
              item.image || null,
              item.notes || null,
              item.status || 'active',
              item.createdAt ? new Date(item.createdAt) : new Date(),
              item.updatedAt ? new Date(item.updatedAt) : new Date(),
            ]
          );
          importedItems++;
        }
      }

      if (wishes && Array.isArray(wishes)) {
        await connection.query('DELETE FROM wishes WHERE user_id = ?', [userId]);

        for (const wish of wishes) {
          const id = wish.id && wish.id.length === 36 ? wish.id : uuidv4();
          await connection.query(
            `INSERT INTO wishes (id, user_id, name, target_price, current_saved, priority, target_date, image, notes, achieved, achieved_at, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              userId,
              wish.name,
              wish.targetPrice,
              wish.currentSaved || 0,
              wish.priority || 'medium',
              wish.targetDate || null,
              wish.image || null,
              wish.notes || null,
              wish.achieved ? 1 : 0,
              wish.achievedAt ? new Date(wish.achievedAt) : null,
              wish.createdAt ? new Date(wish.createdAt) : new Date(),
              wish.updatedAt ? new Date(wish.updatedAt) : new Date(),
            ]
          );
          importedWishes++;
        }
      }

      await connection.commit();

      res.json({
        message: '导入成功',
        importedItems,
        importedWishes,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('导入数据错误:', error);
    res.status(500).json({ error: '导入数据失败' });
  }
});

module.exports = router;
