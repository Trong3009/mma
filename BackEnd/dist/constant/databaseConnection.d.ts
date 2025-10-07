import oracledb, { Pool } from 'oracledb';
/**
 * Khởi tạo connection pool (chỉ gọi 1 lần khi start server)
 */
export declare function initPool(): Promise<Pool>;
/**
 * Lấy 1 connection từ pool
 */
export declare function getConnection(): Promise<oracledb.Connection>;
/**
 * Đóng pool (khi server tắt)
 */
export declare function closePool(): Promise<void>;
//# sourceMappingURL=databaseConnection.d.ts.map