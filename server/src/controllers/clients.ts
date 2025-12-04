// FIX: Replaced aliased types with direct imports from 'express' to resolve type conflicts.
import { Request, Response } from 'express';
import { query } from '../db';

// FIX: Using direct Express Request and Response types to fix errors
// with res.json, res.status, and other Express-specific properties.
export const getClients = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM clients');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// FIX: Using direct Express Request and Response types to fix errors
// with req.params and other Express-specific properties.
export const getClientById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM clients WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Implement create, update, delete functions similarly
