import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { query } from '../db';

export const getClients = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const result = await query('SELECT * FROM clients ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getClientById = async (req: ExpressRequest, res: ExpressResponse) => {
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

export const createClient = async (req: ExpressRequest, res: ExpressResponse) => {
    const { name, email, phone, address } = req.body;
    
    // Basic validation
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const id = `cli-${Date.now()}`;
    
    try {
        const result = await query(
            'INSERT INTO clients (id, name, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, name, email, phone, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateClient = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    
    try {
        const result = await query(
            'UPDATE clients SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5 RETURNING *',
            [name, email, phone, address, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteClient = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM clients WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};