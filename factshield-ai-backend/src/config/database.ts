import { Pool, PoolConfig } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool;

const dbConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'factshield_ai',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'SATOSANb6...',
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

export const connectDatabase = async (): Promise<void> => {
  try {
    pool = new Pool(dbConfig);
    
    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    logger.info('✅ Database connected successfully');
    
    // Create tables if they don't exist
    await createTables();
    
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return pool;
};

export const query = async (text: string, params?: unknown[]): Promise<unknown> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

const createTables = async (): Promise<void> => {
  try {
    // Users table with roles support
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        roles TEXT[] DEFAULT ARRAY['user'],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        settings JSONB DEFAULT '{"theme": "light", "notifications": true, "privacyLevel": "standard"}'::jsonb
      )
    `);

    // Token blacklist table for logout functionality
    await query(`
      CREATE TABLE IF NOT EXISTS token_blacklist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token_jti VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Documents table
    await query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        path VARCHAR(500) NOT NULL
      )
    `);

    // Analyses table
    await query(`
      CREATE TABLE IF NOT EXISTS analyses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('url', 'text', 'document')),
        source_content TEXT,
        document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        results JSONB
      )
    `);

    // History table
    await query(`
      CREATE TABLE IF NOT EXISTS history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source VARCHAR(500) NOT NULL,
        summary TEXT
      )
    `);

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
      CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
      CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
      CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp);
    `);

    logger.info('✅ Database tables created/verified successfully');
  } catch (error) {
    logger.error('❌ Failed to create database tables:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    logger.info('Database connection closed');
  }
};