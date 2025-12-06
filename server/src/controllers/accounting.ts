import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { query } from '../db';

const mapFinancial = (row: any) => ({
    id: row.id,
    date: row.date,
    description: row.description,
    amount: parseFloat(row.amount),
    type: row.type,
    clientId: row.client_id,
    invoiceId: row.invoice_id
});

export const getFinancials = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const result = await query('SELECT * FROM financial_records ORDER BY date DESC');
        res.json(result.rows.map(mapFinancial));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createFinancialRecord = async (req: ExpressRequest, res: ExpressResponse) => {
    const { date, description, amount, type, clientId, invoiceId } = req.body;
    const id = `fin-${Date.now()}`;
    try {
        const result = await query(
            'INSERT INTO financial_records (id, date, description, amount, type, client_id, invoice_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id, date, description, amount, type, clientId, invoiceId]
        );
        res.status(201).json(mapFinancial(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};