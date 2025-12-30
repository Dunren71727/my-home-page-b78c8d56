import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;
let dbInitPromise: Promise<Database> | null = null;

const DB_STORAGE_KEY = 'dashboard_sqlite_db';

export async function initDatabase(): Promise<Database> {
  if (db) return db;
  
  if (dbInitPromise) return dbInitPromise;
  
  dbInitPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });
    
    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem(DB_STORAGE_KEY);
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
      // Create default tables
      db.run(`
        CREATE TABLE IF NOT EXISTS api_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          service_id TEXT NOT NULL,
          endpoint TEXT,
          status TEXT,
          response_data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS custom_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      saveDatabase();
    }
    
    return db;
  })();
  
  return dbInitPromise;
}

export function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const arr = Array.from(data);
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(arr));
}

export function getDatabase(): Database | null {
  return db;
}

// API-like functions for database operations
export interface QueryResult {
  columns: string[];
  values: unknown[][];
}

export async function executeQuery(sql: string, params?: unknown[]): Promise<QueryResult[]> {
  const database = await initDatabase();
  try {
    const results = database.exec(sql, params as never[]);
    saveDatabase();
    return results.map(r => ({
      columns: r.columns,
      values: r.values as unknown[][]
    }));
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
}

export async function runStatement(sql: string, params?: unknown[]): Promise<{ changes: number }> {
  const database = await initDatabase();
  try {
    database.run(sql, params as never[]);
    const changes = database.getRowsModified();
    saveDatabase();
    return { changes };
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
}

// Helper functions for common operations
export async function insertData(table: string, data: Record<string, unknown>): Promise<{ changes: number }> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  return runStatement(sql, values);
}

export async function selectData(table: string, where?: string, params?: unknown[]): Promise<QueryResult[]> {
  let sql = `SELECT * FROM ${table}`;
  if (where) sql += ` WHERE ${where}`;
  return executeQuery(sql, params);
}

export async function updateData(table: string, data: Record<string, unknown>, where: string, params?: unknown[]): Promise<{ changes: number }> {
  const setClause = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(data), ...(params || [])];
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
  return runStatement(sql, values);
}

export async function deleteData(table: string, where: string, params?: unknown[]): Promise<{ changes: number }> {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  return runStatement(sql, params);
}

// Get all tables
export async function getTables(): Promise<string[]> {
  const results = await executeQuery("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  if (results.length === 0) return [];
  return results[0].values.map(row => row[0] as string);
}

// Get table schema
export async function getTableSchema(tableName: string): Promise<{ name: string; type: string }[]> {
  const results = await executeQuery(`PRAGMA table_info(${tableName})`);
  if (results.length === 0) return [];
  return results[0].values.map(row => ({
    name: row[1] as string,
    type: row[2] as string
  }));
}
