import express from 'express';
import { createOrUpdateAlert, getUserAlerts, deleteAlert } from '../controllers/alert.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrUpdateAlert);
router.get('/', protect, getUserAlerts);
router.delete('/:id', protect, deleteAlert);

export default router;