import express from 'express';
import * as gabayController from './gabay.controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get('/', gabayController.getAllGabays);
router.get('/:id', gabayController.getGabayById);

router.post('/create', auth, gabayController.createGabay);
router.put('/:id', auth, gabayController.updateGabay);
router.delete('/:id', auth, gabayController.deleteGabay);

export default router;
