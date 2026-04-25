import express from 'express';
import * as userController from './user.controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.get('/', auth, userController.getAllUsers);

export default router;
