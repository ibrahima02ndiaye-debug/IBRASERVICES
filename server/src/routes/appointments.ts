import { Router } from 'express';
import { getAppointments, createAppointment, updateAppointment, updateAppointmentStatus, deleteAppointment } from '../controllers/appointments';

const router = Router();

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.patch('/:id/status', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

export default router;