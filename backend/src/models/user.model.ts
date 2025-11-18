import pool from '../config/db';
import { QueryResult } from 'pg';

export type UserRole = 'Owner' | 'Employee' | 'Delivery' | 'Accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

interface NewUser {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}

export const createUser = async (userData: NewUser): Promise<User> => {
    const { name, email, passwordHash, role } = userData;
    const query = 'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at';
    const values = [name, email, passwordHash, role];
    
    const result: QueryResult<User> = await pool.query(query, values);
    return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<UserWithPassword | null> => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    
    const result: QueryResult<UserWithPassword> = await pool.query(query, values);
    return result.rows[0] || null;
};
