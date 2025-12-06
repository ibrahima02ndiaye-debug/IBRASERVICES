import { Router } from 'express';
import { getFinancials, createFinancialRecord } from '../controllers/accounting';

const router = Router();
router.get('/', getFinancials);
router.post('/', createFinancialRecord);

export default router;