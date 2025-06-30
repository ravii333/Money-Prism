// import PriceAlert from '../models/piceAlert.model';

// // @desc    Create a new price alert
// // @route   POST /api/alerts
// // @access  Private (requires login)
// exports.setPriceAlert = async (req, res) => {
//   const { productId, targetPrice } = req.body;

//   try {
//     const alert = new PriceAlert({
//       user: req.user.id, // Comes from the auth middleware
//       product: productId,
//       targetPrice,
//     });
    
//     const createdAlert = await alert.save();
//     res.status(201).json(createdAlert);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };