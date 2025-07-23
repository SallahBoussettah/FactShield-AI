import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { logger } from '../utils/logger';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  roles: string[];
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  email_verified: boolean;
  is_active: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  roles?: string[];
  last_login?: Date;
  email_verified?: boolean;
  is_active?: boolean;
}

export class UserModel {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare a password with its hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Create a new user
   */
  static async create(userData: CreateUserData): Promise<User> {
    try {
      const { name, email, password, roles = ['user'] } = userData;
      
      // Hash the password
      const password_hash = await this.hashPassword(password);
      
      const result = await query(
        `INSERT INTO users (name, email, password_hash, roles, email_verified, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, name, email, roles, created_at, updated_at, last_login, email_verified, is_active`,
        [name, email, password_hash, roles, false, true]
      ) as any;

      if (!result.rows || result.rows.length === 0) {
        throw new Error('Failed to create user');
      }

      const user = result.rows[0];
      logger.info(`User created successfully: ${user.email}`);
      
      return {
        ...user,
        password_hash // Include for internal use, will be excluded in responses
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Find a user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await query(
        `SELECT id, name, email, password_hash, roles, created_at, updated_at, last_login, email_verified, is_active
         FROM users 
         WHERE email = $1 AND is_active = true`,
        [email]
      ) as any;

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find a user by ID
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const result = await query(
        `SELECT id, name, email, password_hash, roles, created_at, updated_at, last_login, email_verified, is_active
         FROM users 
         WHERE id = $1 AND is_active = true`,
        [id]
      ) as any;

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Update a user
   */
  static async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      // Build dynamic update query
      if (updateData.name !== undefined) {
        fields.push(`name = $${paramCount++}`);
        values.push(updateData.name);
      }
      
      if (updateData.email !== undefined) {
        fields.push(`email = $${paramCount++}`);
        values.push(updateData.email);
      }
      
      if (updateData.roles !== undefined) {
        fields.push(`roles = $${paramCount++}`);
        values.push(updateData.roles);
      }
      
      if (updateData.last_login !== undefined) {
        fields.push(`last_login = $${paramCount++}`);
        values.push(updateData.last_login);
      }
      
      if (updateData.email_verified !== undefined) {
        fields.push(`email_verified = $${paramCount++}`);
        values.push(updateData.email_verified);
      }
      
      if (updateData.is_active !== undefined) {
        fields.push(`is_active = $${paramCount++}`);
        values.push(updateData.is_active);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      // Always update the updated_at timestamp
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await query(
        `UPDATE users 
         SET ${fields.join(', ')}
         WHERE id = $${paramCount}
         RETURNING id, name, email, roles, created_at, updated_at, last_login, email_verified, is_active`,
        values
      ) as any;

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Update user's last login timestamp
   */
  static async updateLastLogin(id: string): Promise<void> {
    try {
      await query(
        `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );
    } catch (error) {
      logger.error('Error updating last login:', error);
      throw error;
    }
  }

  /**
   * Check if email already exists
   */
  static async emailExists(email: string, excludeId?: string): Promise<boolean> {
    try {
      let queryText = 'SELECT id FROM users WHERE email = $1';
      const params: any[] = [email];
      
      if (excludeId) {
        queryText += ' AND id != $2';
        params.push(excludeId);
      }

      const result = await query(queryText, params) as any;
      return result.rows && result.rows.length > 0;
    } catch (error) {
      logger.error('Error checking email existence:', error);
      throw error;
    }
  }

  /**
   * Get all users (for admin purposes)
   */
  static async findAll(limit = 50, offset = 0): Promise<User[]> {
    try {
      const result = await query(
        `SELECT id, name, email, roles, created_at, updated_at, last_login, email_verified, is_active
         FROM users 
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ) as any;

      return result.rows || [];
    } catch (error) {
      logger.error('Error finding all users:', error);
      throw error;
    }
  }

  /**
   * Count total users
   */
  static async count(): Promise<number> {
    try {
      const result = await query('SELECT COUNT(*) as count FROM users') as any;
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Error counting users:', error);
      throw error;
    }
  }

  /**
   * Soft delete a user (set is_active to false)
   */
  static async softDelete(id: string): Promise<boolean> {
    try {
      const result = await query(
        `UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      ) as any;

      return result.rowCount > 0;
    } catch (error) {
      logger.error('Error soft deleting user:', error);
      throw error;
    }
  }

  /**
   * Convert user object to safe format (without password hash)
   */
  static toSafeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}