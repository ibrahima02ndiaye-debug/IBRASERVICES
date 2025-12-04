import { Router } from 'express';
import { handleChatStream } from '../controllers/ai';

const router = Router();

router.post('/chat-stream', handleChatStream);

export default router;
