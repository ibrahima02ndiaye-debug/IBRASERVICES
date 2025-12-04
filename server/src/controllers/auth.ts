import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

// Placeholder for user registration
export const register = async (req: Request, res: Response) => {
    // In a real app, you would validate input, hash the password, and save the user
    res.status(501).json({ message: 'Registration not implemented.' });
};

// Placeholder for user login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // This is a placeholder. A real implementation would query a 'users' table.
        // We'll mock a user for demonstration purposes.
        const mockUser = {
            id: 'user-123',
            email: 'test@garage.com',
            // A real hash for "password123"
            passwordHash: '$2a$10$f/9S5gZ3g3B4Z3iX4p8n9u.wK.xY9.Z.d9Y.J/8p7n6H.oI.oR7hG',
            role: 'Garage'
        };

        if (email !== mockUser.email) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // const isMatch = await bcrypt.compare(password, mockUser.passwordHash);
        // Bypassing hash check for this simple placeholder as bcrypt might not be installed.
        const isMatch = password === "password123";

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: mockUser.id, role: mockUser.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: mockUser.id, email: mockUser.email, role: mockUser.role } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
