// src/types/oracledb.d.ts

declare module 'oracledb' {
  // Các kiểu dữ liệu cơ bản
  export interface ExecuteResult<T = any> {
    rows?: T[];
    metaData?: { name: string }[];
    outBinds?: Record<string, any>;
    rowsAffected?: number;
  }

  export interface ExecuteOptions {
    autoCommit?: boolean;
    outFormat?: number;
  }

  export interface Connection {
    execute<T = any>(sql: string, bindParams?: any, options?: ExecuteOptions): Promise<ExecuteResult<T>>;
    close(): Promise<void>;
    commit?(): Promise<void>;
    rollback?(): Promise<void>;
  }

  export interface Pool {
    getConnection(): Promise<Connection>;
    close(timeout?: number): Promise<void>;
  }

  export interface PoolOptions {
    user: string;
    password: string;
    connectString: string;
    poolMin?: number;
    poolMax?: number;
    poolIncrement?: number;
    poolTimeout?: number;
  }

  const oracledb: {
    createPool(options: PoolOptions): Promise<Pool>;
    getConnection(): Promise<Connection>;
  };

  export = oracledb;
}
