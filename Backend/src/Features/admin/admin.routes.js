import express from 'express';
import * as adminController from './admin.controller.js';
import auth from '../../middleware/auth.js';
import { isAdmin } from '../../middleware/admin.js';

const router = express.Router();

// Apply auth and isAdmin globally to all admin routes for defense in depth
router.use(auth, isAdmin);

// Admin dashboard statistics
router.get('/stats', adminController.getStats);

// User management endpoints
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Moderation endpoints
router.get('/gabays', adminController.getAllGabays);
router.post('/gabays', adminController.createGabay);
router.put('/gabays/:id', adminController.updateGabay);
router.delete('/gabays/:id', adminController.deleteGabay);

export default router;
