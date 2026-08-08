import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import type { Item, Wish } from '@/types';

const DB_NAME = 'my-items-db';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;
let initPromise: Promise<void> | null = null;

const mockItems: Item[] = [
  {
    id: '8',
    name: '无线鼠标',
    brand: '罗技',
    color: '白色',
    owner: 'both',
    category: 'digital',
    price: 199,
    purchaseDate: '2024-01-02',
    notes: '办公用',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '9',
    name: '风暖浴霸排气照明一体',
    brand: '欧普',
    color: '白色',
    owner: 'both',
    category: 'home',
    price: 604.81,
    purchaseDate: '2025-10-24',
    notes: '卫生间用',
    status: 'active',
    createdAt: '2025-10-24T00:00:00Z',
    updatedAt: '2025-10-24T00:00:00Z',
  },
  {
    id: '10',
    name: '7系 Pro+ 剃须刀',
    brand: '博朗',
    color: '黑色',
    owner: 'him',
    category: 'digital',
    price: 844,
    purchaseDate: '2026-05-25',
    notes: '男朋友的',
    status: 'active',
    createdAt: '2026-05-25T00:00:00Z',
    updatedAt: '2026-05-25T00:00:00Z',
  },
  {
    id: '11',
    name: '烘干一体电动晾衣架',
    brand: '名至',
    color: '',
    owner: 'both',
    category: 'home',
    price: 1625.88,
    purchaseDate: '2026-02-21',
    notes: '',
    status: 'active',
    createdAt: '2026-02-21T00:00:00Z',
    updatedAt: '2026-02-21T00:00:00Z',
  },
  {
    id: '12',
    name: 'W7自动猫粮喂食器',
    brand: '派兮',
    color: '',
    owner: 'both',
    category: 'pet',
    price: 476.21,
    purchaseDate: '2025-12-22',
    notes: '',
    status: 'active',
    createdAt: '2025-12-22T00:00:00Z',
    updatedAt: '2025-12-22T00:00:00Z',
  },
  {
    id: '13',
    name: '自动语音饮水茶吧',
    brand: '',
    color: '',
    owner: 'both',
    category: 'home',
    price: 2551,
    purchaseDate: '2025-07-09',
    notes: '',
    status: 'active',
    createdAt: '2025-07-09T00:00:00Z',
    updatedAt: '2025-07-09T00:00:00Z',
  },
  {
    id: '14',
    name: '升降桌胡桃色',
    brand: '',
    color: '胡桃色',
    owner: 'me',
    category: 'home',
    price: 1686,
    purchaseDate: '2024-01-08',
    notes: '',
    status: 'active',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '15',
    name: '洗碗机白色',
    brand: '方太',
    color: '白色',
    owner: 'both',
    category: 'home',
    price: 4969.48,
    purchaseDate: '2023-11-22',
    notes: '',
    status: 'active',
    createdAt: '2023-11-22T00:00:00Z',
    updatedAt: '2023-11-22T00:00:00Z',
  },
  {
    id: '16',
    name: '魔铲自动猫砂盆',
    brand: '',
    color: '',
    owner: 'both',
    category: 'pet',
    price: 689,
    purchaseDate: '2025-12-27',
    notes: '',
    status: 'active',
    createdAt: '2025-12-27T00:00:00Z',
    updatedAt: '2025-12-27T00:00:00Z',
  },
  {
    id: '17',
    name: '升降桌胡桃色',
    brand: '',
    color: '胡桃色',
    owner: 'him',
    category: 'home',
    price: 564,
    purchaseDate: '2025-11-10',
    notes: '',
    status: 'active',
    createdAt: '2025-11-10T00:00:00Z',
    updatedAt: '2025-11-10T00:00:00Z',
  },
  {
    id: '18',
    name: '茶水柜',
    brand: '',
    color: '',
    owner: 'both',
    category: 'home',
    price: 774,
    purchaseDate: '2025-10-01',
    notes: '',
    status: 'active',
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-10-01T00:00:00Z',
  },
  {
    id: '19',
    name: 'Procket 4',
    brand: '',
    color: '',
    owner: 'both',
    category: 'digital',
    price: 3347,
    purchaseDate: '2026-08-02',
    notes: '',
    status: 'active',
    createdAt: '2026-08-02T00:00:00Z',
    updatedAt: '2026-08-02T00:00:00Z',
  },
  {
    id: '20',
    name: '空调扇',
    brand: '夏普',
    color: '',
    owner: 'both',
    category: 'home',
    price: 458.23,
    purchaseDate: '2025-08-10',
    notes: '',
    status: 'active',
    createdAt: '2025-08-10T00:00:00Z',
    updatedAt: '2025-08-10T00:00:00Z',
  },
  {
    id: '21',
    name: 'Z4 Pro+ 16G 私有云',
    brand: '极空间',
    color: '',
    owner: 'both',
    category: 'digital',
    price: 4399,
    purchaseDate: '2025-08-03',
    notes: '',
    status: 'active',
    createdAt: '2025-08-03T00:00:00Z',
    updatedAt: '2025-08-03T00:00:00Z',
  },
  {
    id: '22',
    name: '65X90L 电视',
    brand: '索尼',
    color: '',
    owner: 'both',
    category: 'home',
    price: 7149,
    purchaseDate: '2023-12-31',
    notes: '6799+350',
    status: 'active',
    createdAt: '2023-12-31T00:00:00Z',
    updatedAt: '2023-12-31T00:00:00Z',
  },
  {
    id: '23',
    name: '洗衣机',
    brand: '海信',
    color: '',
    owner: 'both',
    category: 'home',
    price: 3500,
    purchaseDate: '2023-11-10',
    notes: '',
    status: 'active',
    createdAt: '2023-11-10T00:00:00Z',
    updatedAt: '2023-11-10T00:00:00Z',
  },
  {
    id: '24',
    name: '冰箱',
    brand: '海信',
    color: '',
    owner: 'both',
    category: 'home',
    price: 4999,
    purchaseDate: '2023-11-10',
    notes: '',
    status: 'active',
    createdAt: '2023-11-10T00:00:00Z',
    updatedAt: '2023-11-10T00:00:00Z',
  },
  {
    id: '25',
    name: '空调（书房）',
    brand: '海尔',
    color: '',
    owner: 'both',
    category: 'home',
    price: 2599,
    purchaseDate: '2023-11-12',
    notes: '',
    status: 'active',
    createdAt: '2023-11-12T00:00:00Z',
    updatedAt: '2023-11-12T00:00:00Z',
  },
  {
    id: '26',
    name: '空调（卧室）',
    brand: '海尔',
    color: '',
    owner: 'both',
    category: 'home',
    price: 2599,
    purchaseDate: '2023-11-12',
    notes: '',
    status: 'active',
    createdAt: '2023-11-12T00:00:00Z',
    updatedAt: '2023-11-12T00:00:00Z',
  },
  {
    id: '27',
    name: '抽油烟机',
    brand: '华帝',
    color: '',
    owner: 'both',
    category: 'home',
    price: 4999,
    purchaseDate: '2023-09-03',
    notes: '',
    status: 'active',
    createdAt: '2023-09-03T00:00:00Z',
    updatedAt: '2023-09-03T00:00:00Z',
  },
  {
    id: '28',
    name: '燃气灶',
    brand: '华帝',
    color: '',
    owner: 'both',
    category: 'home',
    price: 2700,
    purchaseDate: '2023-09-03',
    notes: '',
    status: 'active',
    createdAt: '2023-09-03T00:00:00Z',
    updatedAt: '2023-09-03T00:00:00Z',
  },
  {
    id: '29',
    name: '热水器',
    brand: '华帝',
    color: '',
    owner: 'both',
    category: 'home',
    price: 2700,
    purchaseDate: '2023-09-03',
    notes: '',
    status: 'active',
    createdAt: '2023-09-03T00:00:00Z',
    updatedAt: '2023-09-03T00:00:00Z',
  },
];

const mockWishes: Wish[] = [
  {
    id: 'w1',
    name: 'Sony A7M4 相机',
    targetPrice: 16999,
    currentSaved: 8500,
    priority: 'high',
    targetDate: '2026-06-01',
    notes: '想学习摄影，记录生活',
    achieved: false,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'w2',
    name: 'iPad Pro 12.9',
    targetPrice: 9299,
    currentSaved: 3000,
    priority: 'medium',
    notes: '画画和看剧用',
    achieved: false,
    createdAt: '2025-02-20T00:00:00Z',
    updatedAt: '2025-02-20T00:00:00Z',
  },
  {
    id: 'w3',
    name: 'AirPods Max',
    targetPrice: 4399,
    currentSaved: 4399,
    priority: 'low',
    achieved: true,
    achievedAt: '2025-04-10T00:00:00Z',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-04-10T00:00:00Z',
  },
  {
    id: 'w4',
    name: 'Apple Watch Ultra 2',
    targetPrice: 6499,
    currentSaved: 2000,
    priority: 'medium',
    targetDate: '2026-12-31',
    achieved: false,
    createdAt: '2025-05-10T00:00:00Z',
    updatedAt: '2025-05-10T00:00:00Z',
  },
];

export async function initDB(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    const savedData = localStorage.getItem(DB_NAME);
    if (savedData) {
      const uint8Array = new Uint8Array(JSON.parse(savedData));
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
      createTables();
      seedData();
      saveToStorage();
    }
  })();

  return initPromise;
}

function createTables() {
  if (!db) return;

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT,
      color TEXT,
      owner TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      purchaseDate TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      targetPrice REAL NOT NULL,
      currentSaved REAL NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'medium',
      targetDate TEXT,
      image TEXT,
      notes TEXT,
      achieved INTEGER NOT NULL DEFAULT 0,
      achievedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
}

function seedData() {
  if (!db) return;

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO items (id, name, brand, color, owner, category, price, purchaseDate, notes, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  mockItems.forEach((item) => {
    stmt.run([
      item.id,
      item.name,
      item.brand || null,
      item.color || null,
      item.owner || null,
      item.category,
      item.price,
      item.purchaseDate,
      item.notes || null,
      item.status,
      item.createdAt,
      item.updatedAt,
    ]);
  });

  stmt.free();

  const wishStmt = db.prepare(`
    INSERT OR REPLACE INTO wishes (id, name, targetPrice, currentSaved, priority, targetDate, image, notes, achieved, achievedAt, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  mockWishes.forEach((wish) => {
    wishStmt.run([
      wish.id,
      wish.name,
      wish.targetPrice,
      wish.currentSaved,
      wish.priority,
      wish.targetDate || null,
      wish.image || null,
      wish.notes || null,
      wish.achieved ? 1 : 0,
      wish.achievedAt || null,
      wish.createdAt,
      wish.updatedAt,
    ]);
  });

  wishStmt.free();
}

function saveToStorage() {
  if (!db) return;
  const data = db.export();
  localStorage.setItem(DB_NAME, JSON.stringify(Array.from(data)));
}

export function getDB(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}

export function resetDB() {
  if (!db || !SQL) return;
  db.close();
  db = new SQL.Database();
  createTables();
  seedData();
  saveToStorage();
}

export function exportDB(): Uint8Array {
  if (!db) throw new Error('Database not initialized');
  return db.export();
}

export function importDB(data: Uint8Array) {
  if (!SQL) throw new Error('SQL not initialized');
  if (db) db.close();
  db = new SQL.Database(data);
  saveToStorage();
}

export function getItems(): Item[] {
  if (!db) return [];
  const results = db.exec('SELECT * FROM items ORDER BY purchaseDate DESC');
  if (results.length === 0) return [];
  return results[0].values.map((row: any[]) => ({
    id: row[0],
    name: row[1],
    brand: row[2] || undefined,
    color: row[3] || undefined,
    owner: row[4] || undefined,
    category: row[5],
    price: row[6],
    purchaseDate: row[7],
    notes: row[8] || undefined,
    status: row[9],
    createdAt: row[10],
    updatedAt: row[11],
  })) as Item[];
}

export function addItem(item: Partial<Item> & { name: string; category: Item['category']; price: number; purchaseDate: string; id?: string }) {
  if (!db) return;
  const now = new Date().toISOString();
  const id = item.id || Date.now().toString();
  const stmt = db.prepare(`
    INSERT INTO items (id, name, brand, color, owner, category, price, purchaseDate, notes, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run([
    id,
    item.name,
    item.brand || null,
    item.color || null,
    item.owner || null,
    item.category,
    item.price,
    item.purchaseDate,
    item.notes || null,
    item.status || 'active',
    now,
    now,
  ]);
  stmt.free();
  saveToStorage();
  return id;
}

export function updateItem(id: string, updates: Partial<Item>) {
  if (!db) return;
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  fields.push('updatedAt = ?');
  values.push(now);
  values.push(id);

  db.run(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
  saveToStorage();
}

export function deleteItem(id: string) {
  if (!db) return;
  db.run('DELETE FROM items WHERE id = ?', [id]);
  saveToStorage();
}

export function searchItems(query: string): Item[] {
  if (!db) return [];
  const results = db.exec(
    `SELECT * FROM items WHERE name LIKE '%${query}%' OR brand LIKE '%${query}%' OR notes LIKE '%${query}%' ORDER BY purchaseDate DESC`
  );
  if (results.length === 0) return [];
  return results[0].values.map((row: any[]) => ({
    id: row[0],
    name: row[1],
    brand: row[2] || undefined,
    color: row[3] || undefined,
    owner: row[4] || undefined,
    category: row[5],
    price: row[6],
    purchaseDate: row[7],
    notes: row[8] || undefined,
    status: row[9],
    createdAt: row[10],
    updatedAt: row[11],
  })) as Item[];
}

export function getWishes(): Wish[] {
  if (!db) return [];
  const results = db.exec('SELECT * FROM wishes ORDER BY createdAt DESC');
  if (results.length === 0) return [];
  return results[0].values.map((row: any[]) => ({
    id: row[0],
    name: row[1],
    targetPrice: row[2],
    currentSaved: row[3],
    priority: row[4],
    targetDate: row[5] || undefined,
    image: row[6] || undefined,
    notes: row[7] || undefined,
    achieved: row[8] === 1,
    achievedAt: row[9] || undefined,
    createdAt: row[10],
    updatedAt: row[11],
  })) as Wish[];
}

export function addWish(wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
  if (!db) return;
  const now = new Date().toISOString();
  const id = wish.id || Date.now().toString();
  const stmt = db.prepare(`
    INSERT INTO wishes (id, name, targetPrice, currentSaved, priority, targetDate, image, notes, achieved, achievedAt, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run([
    id,
    wish.name,
    wish.targetPrice,
    wish.currentSaved || 0,
    wish.priority || 'medium',
    wish.targetDate || null,
    wish.image || null,
    wish.notes || null,
    wish.achieved ? 1 : 0,
    wish.achievedAt || null,
    now,
    now,
  ]);
  stmt.free();
  saveToStorage();
  return id;
}

export function updateWish(id: string, updates: Partial<Wish>) {
  if (!db) return;
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id') {
      if (key === 'achieved') {
        fields.push(`${key} = ?`);
        values.push(value ? 1 : 0);
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
  });

  fields.push('updatedAt = ?');
  values.push(now);
  values.push(id);

  db.run(`UPDATE wishes SET ${fields.join(', ')} WHERE id = ?`, values);
  saveToStorage();
}

export function deleteWish(id: string) {
  if (!db) return;
  db.run('DELETE FROM wishes WHERE id = ?', [id]);
  saveToStorage();
}
