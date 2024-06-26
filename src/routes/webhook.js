import { Router } from 'express';
import { webhookController } from '../controllers/webhook.js';


export const webhookRouter = Router();

webhookRouter.post('/', webhookController.getTickets);
