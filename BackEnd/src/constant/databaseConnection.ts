import oracledb, { Pool } from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;

/**
 * Khởi tạo connection pool (chỉ gọi 1 lần khi start server)
 */
export async function initPool(): Promise<Pool> {
  if (pool) return pool; // Nếu đã tồn tại pool thì không tạo lại

  pool = await oracledb.createPool({
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  connectString: `${process.env.DB_HOST!}:${process.env.DB_PORT!}/${process.env.DB_SERVICE!}`,
  poolMin: Number(process.env.DB_POOL_MIN || 2),
  poolMax: Number(process.env.DB_POOL_MAX || 10),
  poolIncrement: Number(process.env.DB_POOL_INCREMENT || 1),
  poolTimeout: Number(process.env.DB_POOL_TIMEOUT || 60),
});
  return pool;
}

/**
 * Lấy 1 connection từ pool
 */
export async function getConnection() {
  if (!pool) await initPool();
  if (!pool) throw new Error('Oracle pool not initialized');
  return await pool.getConnection();
}

/**
 * Đóng pool (khi server tắt)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
}
