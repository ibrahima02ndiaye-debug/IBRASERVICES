import { Router } from 'express';
import { getQuotes, updateQuoteStatus } from '../controllers/quotes';

const router = Router();
router.get('/', getQuotes);
router.put('/:id/status', updateQuoteStatus);

export default router;