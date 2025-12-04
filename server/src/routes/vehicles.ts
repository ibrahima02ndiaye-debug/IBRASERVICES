import { Router } from 'express';
import { getVehicles, getVehicleById } from '../controllers/vehicles';

const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);

export default router;
