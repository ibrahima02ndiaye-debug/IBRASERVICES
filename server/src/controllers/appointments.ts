import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { query } from '../db';

const mapAppointment = (row: any) => ({
    id: row.id,
    clientId: row.client_id,
    vehicleId: row.vehicle_id,
    date: row.date,
    serviceType: row.service_type,
    mechanic: row.mechanic,
    status: row.status,
    notes: row.notes
});

export const getAppointments = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const result = await query('SELECT * FROM appointments ORDER BY date ASC');
        res.json(result.rows.map(mapAppointment));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createAppointment = async (req: ExpressRequest, res: ExpressResponse) => {
    const { clientId, vehicleId, date, serviceType, mechanic, status, notes } = req.body;
    const id = `apt-${Date.now()}`;
    try {
        const result = await query(
            'INSERT INTO appointments (id, client_id, vehicle_id, date, service_type, mechanic, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [id, clientId, vehicleId, date, serviceType, mechanic, status || 'Scheduled', notes]
        );
        res.status(201).json(mapAppointment(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateAppointment = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    const { clientId, vehicleId, date, serviceType, mechanic, status, notes } = req.body;
    try {
        const result = await query(
            'UPDATE appointments SET client_id=$1, vehicle_id=$2, date=$3, service_type=$4, mechanic=$5, status=$6, notes=$7 WHERE id=$8 RETURNING *',
            [clientId, vehicleId, date, serviceType, mechanic, status, notes, id]
        );
        if (result.rows.length === 0) {
             return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(mapAppointment(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateAppointmentStatus = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await query(
            'UPDATE appointments SET status=$1 WHERE id=$2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
             return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(mapAppointment(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteAppointment = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM appointments WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};