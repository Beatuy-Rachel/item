const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const db = req.db;

    const [itemStats] = await db.query(
      `SELECT
        COUNT(*) as totalItems,
        SUM(price) as totalValue,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeItems
       FROM items WHERE user_id = ?`,
      [userId]
    );

    const [thisMonthStats] = await db.query(
      `SELECT COUNT(*) as thisMonthItems, SUM(price) as thisMonthValue
       FROM items WHERE user_id = ? AND MONTH(purchase_date) = MONTH(CURRENT_DATE) AND YEAR(purchase_date) = YEAR(CURRENT_DATE)`,
      [userId]
    );

    const [wishStats] = await db.query(
      `SELECT
        COUNT(*) as totalWishes,
        SUM(CASE WHEN achieved = 0 THEN 1 ELSE 0 END) as activeWishes,
        SUM(CASE WHEN achieved = 1 THEN 1 ELSE 0 END) as achievedWishes,
        SUM(target_price) as totalTargetPrice,
        SUM(current_saved) as totalSaved
       FROM wishes WHERE user_id = ?`,
      [userId]
    );

    res.json({
      items: {
        totalItems: itemStats[0].totalItems || 0,
        totalValue: parseFloat(itemStats[0].totalValue || 0),
        activeItems: itemStats[0].activeItems || 0,
        thisMonthItems: thisMonthStats[0].thisMonthItems || 0,
        thisMonthValue: parseFloat(thisMonthStats[0].thisMonthValue || 0),
      },
      wishes: {
        totalWishes: wishStats[0].totalWishes || 0,
        activeWishes: wishStats[0].activeWishes || 0,
        achievedWishes: wishStats[0].achievedWishes || 0,
        totalTargetPrice: parseFloat(wishStats[0].totalTargetPrice || 0),
        totalSaved: parseFloat(wishStats[0].totalSaved || 0),
      },
    });
  } catch (error) {
    console.error('获取统计概览错误:', error);
    res.status(500).json({ error: '获取统计概览失败' });
  }
});

router.get('/by-category', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const db = req.db;
    const [rows] = await db.query(
      `SELECT category, COUNT(*) as count, SUM(price) as value
       FROM items WHERE user_id = ? AND status = 'active'
       GROUP BY category ORDER BY value DESC`,
      [userId]
    );

    const totalValue = rows.reduce((sum, row) => sum + parseFloat(row.value), 0);

    const categoryStats = rows.map((row) => ({
      category: row.category,
      count: row.count,
      value: parseFloat(row.value),
      percentage: totalValue > 0 ? (parseFloat(row.value) / totalValue) * 100 : 0,
    }));

    res.json({ categoryStats, totalValue });
  } catch (error) {
    console.error('获取分类统计错误:', error);
    res.status(500).json({ error: '获取分类统计失败' });
  }
});

router.get('/monthly', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { months = 12 } = req.query;

  try {
    const db = req.db;
    const [rows] = await db.query(
      `SELECT
        DATE_FORMAT(purchase_date, '%Y-%m') as month,
        SUM(price) as value,
        COUNT(*) as count
       FROM items
       WHERE user_id = ? AND purchase_date >= DATE_SUB(CURRENT_DATE, INTERVAL ? MONTH)
       GROUP BY DATE_FORMAT(purchase_date, '%Y-%m')
       ORDER BY month ASC`,
      [userId, months]
    );

    const monthlyStats = rows.map((row) => ({
      month: row.month,
      value: parseFloat(row.value),
      count: row.count,
    }));

    res.json({ monthlyStats });
  } catch (error) {
    console.error('获取月度统计错误:', error);
    res.status(500).json({ error: '获取月度统计失败' });
  }
});

router.get('/yearly', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const db = req.db;
    const [rows] = await db.query(
      `SELECT
        YEAR(purchase_date) as year,
        SUM(price) as value,
        COUNT(*) as count
       FROM items
       WHERE user_id = ?
       GROUP BY YEAR(purchase_date)
       ORDER BY year DESC`,
      [userId]
    );

    const yearlyStats = rows.map((row) => ({
      year: row.year,
      value: parseFloat(row.value),
      count: row.count,
    }));

    res.json({ yearlyStats });
  } catch (error) {
    console.error('获取年度统计错误:', error);
    res.status(500).json({ error: '获取年度统计失败' });
  }
});

module.exports = router;
