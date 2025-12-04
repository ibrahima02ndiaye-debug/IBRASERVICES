import { Request, Response } from 'express';
import { query } from '../db';

export const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM vehicles');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getVehicleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
