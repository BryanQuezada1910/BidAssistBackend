import { Router } from 'express';
import { WebHookController } from '../controllers/webHookController.js';


export const webHookRouter = Router();

webHookRouter.post('/', WebHookController.getTickets);
