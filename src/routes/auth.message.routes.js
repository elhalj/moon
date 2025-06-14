import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessage, getUserForSideBar, sendMessage, handleTyping } from '../controller/User.message.controller.js';

export const authMessage = express.Router();

authMessage.get('/users', protectRoute, getUserForSideBar);
authMessage.get('/:id', protectRoute, getMessage);

authMessage.post('/send/:id', protectRoute, sendMessage);
authMessage.post('/typing/:id', protectRoute, handleTyping);