const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

function rowToItem(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand || undefined,
    color: row.color || undefined,
    owner: row.owner,
    category: row.category,
    price: parseFloat(row.price),
    purchaseDate: row.purchase_date,
    image: row.image || undefined,
    notes: row.notes || undefined,
    status: row.status,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

router.get('/', authenticateToken, async (req, res) => {
  const { category, status, owner, search, startDate, endDate, year } = req.query;
  const userId = req.user.id;

  let query = 'SELECT * FROM items WHERE user_id = ?';
  const params = [userId];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (owner && owner !== 'all') {
    query += ' AND owner = ?';
    params.push(owner);
  }

  if (search) {
    query += ' AND (name LIKE ? OR brand LIKE ? OR notes LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (startDate) {
    query += ' AND purchase_date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND purchase_date <= ?';
    params.push(endDate);
  }

  if (year) {
    query += ' AND YEAR(purchase_date) = ?';
    params.push(year);
  }

  query += ' ORDER BY purchase_date DESC, created_at DESC';

  try {
    const db = req.db;
    const [rows] = await db.query(query, params);
    const items = rows.map(rowToItem);
    res.json({ items });
  } catch (error) {
    console.error('获取物品列表错误:', error);
    res.status(500).json({ error: '获取物品列表失败' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const db = req.db;
    const [rows] = await db.query('SELECT * FROM items WHERE id = ? AND user_id = ?', [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '物品不存在' });
    }

    res.json({ item: rowToItem(rows[0]) });
  } catch (error) {
    console.error('获取物品详情错误:', error);
    res.status(500).json({ error: '获取物品详情失败' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, brand, color, owner, category, price, purchaseDate, image, notes, status } = req.body;
  const userId = req.user.id;

  if (!name || !category || price === undefined || !purchaseDate) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  const id = uuidv4();

  try {
    const db = req.db;
    await db.query(
      `INSERT INTO items (id, user_id, name, brand, color, owner, category, price, purchase_date, image, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        name,
        brand || null,
        color || null,
        owner || 'both',
        category,
        price,
        purchaseDate,
        image || null,
        notes || null,
        status || 'active',
      ]
    );

    const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    res.status(201).json({ item: rowToItem(rows[0]) });
  } catch (error) {
    console.error('创建物品错误:', error);
    res.status(500).json({ error: '创建物品失败' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updates = req.body;

  const allowedFields = ['name', 'brand', 'color', 'owner', 'category', 'price', 'purchaseDate', 'image', 'notes', 'status'];
  const setClauses = [];
  const params = [];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      const dbField = field === 'purchaseDate' ? 'purchase_date' : field;
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
      `UPDATE items SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '物品不存在' });
    }

    const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    res.json({ item: rowToItem(rows[0]) });
  } catch (error) {
    console.error('更新物品错误:', error);
    res.status(500).json({ error: '更新物品失败' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const db = req.db;
    const [result] = await db.query('DELETE FROM items WHERE id = ? AND user_id = ?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '物品不存在' });
    }

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除物品错误:', error);
    res.status(500).json({ error: '删除物品失败' });
  }
});

module.exports = router;
