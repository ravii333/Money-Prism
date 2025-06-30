import express from 'express';
import Alert from '../models/Alert.js';
// import { protect } from '../middleware/authMiddleware.js'; // You'll need auth middleware

const router = express.Router();

router.post('/', /* protect, */ async (req, res) => {
  const { productId, targetPrice } = req.body;
  
  if (!productId || !targetPrice) {
    return res.status(400).json({ success: false, message: 'Product ID and target price are required.' });
  }

  const userId = req.user?._id || '60d21b4667d0d8992e610c85'; 

  try {
    const existingAlert = await Alert.findOne({ user: userId, product: productId });

    if (existingAlert) {
      existingAlert.targetPrice = targetPrice;
      existingAlert.isActive = true; 
      await existingAlert.save();
      res.status(200).json({ success: true, message: 'Price alert updated successfully!', data: existingAlert });
    } else {
      const newAlert = await Alert.create({
        user: userId,
        product: productId,
        targetPrice: Number(targetPrice),
      });
      res.status(201).json({ success: true, message: 'Price alert created successfully!', data: newAlert });
    }
  } catch (error) {
    console.error('Error creating/updating alert:', error);
    res.status(500).json({ success: false, message: 'Server error while setting alert.' });
  }
});

export default router;