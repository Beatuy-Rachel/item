const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

function rowToWish(row) {
  return {
    id: row.id,
    name: row.name,
    targetPrice: parseFloat(row.target_price),
    currentSaved: parseFloat(row.current_saved),
    priority: row.priority,
    targetDate: row.target_date || undefined,
    image: row.image || undefined,
    notes: row.notes || undefined,
    achieved: !!row.achieved,
    achievedAt: row.achieved_at ? new Date(row.achieved_at).toISOString() : undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

router.get('/', authenticateToken, async (req, res) => {
  const { priority, achieved, search } = req.query;
  const userId = req.user.id;

  let query = 'SELECT * FROM wishes WHERE user_id = ?';
  const params = [userId];

  if (priority && priority !== 'all') {
    query += ' AND priority = ?';
    params.push(priority);
  }

  if (achieved !== undefined && achieved !== 'all') {
    query += ' AND achieved = ?';
    params.push(achieved === 'true' ? 1 : 0);
  }

  if (search) {
    query += ' AND (name LIKE ? OR notes LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ' ORDER BY achieved ASC, FIELD(priority, "high", "medium", "low"), created_at DESC';

  try {
    const db = req.db;
    const [rows] = await db.query(query, params);
    const wishes = rows.map(rowToWish);
    res.json({ wishes });
  } catch (error) {
    console.error('获取心愿清单错误:', error);
    res.status(500).json({ error: '获取心愿清单失败' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const db = req.db;
    const [rows] = await db.query('SELECT * FROM wishes WHERE id = ? AND user_id = ?', [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '心愿不存在' });
    }

    res.json({ wish: rowToWish(rows[0]) });
  } catch (error) {
    console.error('获取心愿详情错误:', error);
    res.status(500).json({ error: '获取心愿详情失败' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, targetPrice, currentSaved, priority, targetDate, image, notes } = req.body;
  const userId = req.user.id;

  if (!name || targetPrice === undefined) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  const id = uuidv4();

  try {
    const db = req.db;
    await db.query(
      `INSERT INTO wishes (id, user_id, name, target_price, current_saved, priority, target_date, image, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        name,
        targetPrice,
        currentSaved || 0,
        priority || 'medium',
        targetDate || null,
        image || null,
        notes || null,
      ]
    );

    const [rows] = await db.query('SELECT * FROM wishes WHERE id = ?', [id]);
    res.status(201).json({ wish: rowToWish(rows[0]) });
  } catch (error) {
    console.error('创建心愿错误:', error);
    res.status(500).json({ error: '创建心愿失败' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updates = req.body;

  const allowedFields = ['name', 'targetPrice', 'currentSaved', 'priority', 'targetDate', 'image', 'notes', 'achieved', 'achievedAt'];
  const setClauses = [];
  const params = [];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      const dbField = field === 'targetPrice' ? 'target_price'
        : field === 'currentSaved' ? 'current_saved'
        : field === 'targetDate' ? 'target_date'
        : field === 'achievedAt' ? 'achieved_at'
        : field;
      setClauses.push(`${dbField} = ?`);
      params.push(updates[field]);
    }
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ error: '没有有效的更新字段' });
  }

  params.push(id, userId);

  try {
    const db = req.db;
    const [result] = await db.query(
      `UPDATE wishes SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '心愿不存在' });
    }

    const [rows] = await db.query('SELECT * FROM wishes WHERE id = ?', [id]);
    res.json({ wish: rowToWish(rows[0]) });
  } catch (error) {
    console.error('更新心愿错误:', error);
    res.status(500).json({ error: '更新心愿失败' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const db = req.db;
    const [result] = await db.query('DELETE FROM wishes WHERE id = ? AND user_id = ?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '心愿不存在' });
    }

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除心愿错误:', error);
    res.status(500).json({ error: '删除心愿失败' });
  }
});

router.post('/:id/savings', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const userId = req.user.id;

  if (amount === undefined || isNaN(amount)) {
    return res.status(400).json({ error: '金额无效' });
  }

  try {
    const db = req.db;
    const [rows] = await db.query('SELECT * FROM wishes WHERE id = ? AND user_id = ?', [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '心愿不存在' });
    }

    const wish = rows[0];
    const newSaved = Math.min(parseFloat(wish.target_price), parseFloat(wish.current_saved) + parseFloat(amount));
    const achieved = newSaved >= parseFloat(wish.target_price);

    await db.query(
      'UPDATE wishes SET current_saved = ?, achieved = ?, achieved_at = ? WHERE id = ?',
      [newSaved, achieved ? 1 : 0, achieved ? new Date() : wish.achieved_at, id]
    );

    const [updatedRows] = await db.query('SELECT * FROM wishes WHERE id = ?', [id]);
    res.json({ wish: rowToWish(updatedRows[0]) });
  } catch (error) {
    console.error('添加存款错误:', error);
    res.status(500).json({ error: '添加存款失败' });
  }
});

router.post('/:id/achieve', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const db = req.db;
    const [rows] = await db.query('SELECT * FROM wishes WHERE id = ? AND user_id = ?', [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '心愿不存在' });
    }

    const wish = rows[0];

    await db.query(
      'UPDATE wishes SET achieved = 1, achieved_at = ?, current_saved = target_price WHERE id = ?',
      [new Date(), id]
    );

    const [updatedRows] = await db.query('SELECT * FROM wishes WHERE id = ?', [id]);
    res.json({ wish: rowToWish(updatedRows[0]) });
  } catch (error) {
    console.error('标记完成错误:', error);
    res.status(500).json({ error: '标记完成失败' });
  }
});

module.exports = router;
