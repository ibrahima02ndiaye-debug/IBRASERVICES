
import { Router } from 'express';
import { getClients, getClientById } from '../controllers/clients';

const router = Router();

router.get('/', getClients);
router.get('/:id', getClientById);
// router.post('/', createClient);
// router.put('/:id', updateClient);
// router.delete('/:id', deleteClient);

export default router;
