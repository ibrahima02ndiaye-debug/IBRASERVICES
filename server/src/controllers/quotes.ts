import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { query } from '../db';

const mapQuote = (row: any) => ({
    id: row.id,
    clientId: row.client_id,
    appointmentId: row.appointment_id,
    date: row.date,
    total: parseFloat(row.total),
    status: row.status,
    items: row.items // JSONB
});

export const getQuotes = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const result = await query('SELECT * FROM quotes ORDER BY date DESC');
        res.json(result.rows.map(mapQuote));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateQuoteStatus = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await query(
            'UPDATE quotes SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(mapQuote(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};