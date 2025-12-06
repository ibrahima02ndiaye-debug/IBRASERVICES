import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { query } from '../db';

// Helper to map DB row to Vehicle type
const mapVehicle = (row: any) => ({
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    vin: row.vin,
    licensePlate: row.license_plate,
    mileage: row.mileage,
    ownerId: row.owner_id,
    status: row.status
});

export const getVehicles = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const result = await query('SELECT * FROM vehicles ORDER BY make, model');
        res.json(result.rows.map(mapVehicle));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getVehicleById = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(mapVehicle(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createVehicle = async (req: ExpressRequest, res: ExpressResponse) => {
    const { make, model, year, vin, licensePlate, mileage, ownerId, status } = req.body;
    const id = `veh-${Date.now()}`;
    
    try {
        const result = await query(
            'INSERT INTO vehicles (id, make, model, year, vin, license_plate, mileage, owner_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [id, make, model, year, vin, licensePlate, mileage, ownerId, status || 'Available']
        );
        res.status(201).json(mapVehicle(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateVehicle = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    const { make, model, year, vin, licensePlate, mileage, ownerId, status } = req.body;

    try {
        const result = await query(
            'UPDATE vehicles SET make=$1, model=$2, year=$3, vin=$4, license_plate=$5, mileage=$6, owner_id=$7, status=$8 WHERE id=$9 RETURNING *',
            [make, model, year, vin, licensePlate, mileage, ownerId, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(mapVehicle(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteVehicle = async (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM vehicles WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};