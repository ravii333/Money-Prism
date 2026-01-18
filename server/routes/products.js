import express from 'express';
import { searchAndProcessProducts, getFeaturedProducts, getProductById } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/search', searchAndProcessProducts);

router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

export default router;