import Alert from "../models/Alert.js";
import Product from "../models/Product.js";

export const createOrUpdateAlert = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, targetPriceLow, targetPriceHigh } = req.body;
    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Authentication failed: User ID not found.",
        });
    }

    if (
      !productId ||
      targetPriceLow === undefined ||
      targetPriceHigh === undefined
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Product ID and a full price range are required.",
        });
    }

    const low = Number(targetPriceLow);
    const high = Number(targetPriceHigh);

    if (low > high) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "The low price target cannot be greater than the high price target.",
        });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "Product does not exist." });
    }

    const existingAlert = await Alert.findOne({
      user: userId,
      product: productId,
    });

    if (existingAlert) {
      existingAlert.targetPriceLow = low;
      existingAlert.targetPriceHigh = high;
      existingAlert.isActive = true;
      const updatedAlert = await existingAlert.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Price alert range updated!",
          data: updatedAlert,
        });
    } else {
      const newAlert = await Alert.create({
        user: userId,
        product: productId,
        targetPriceLow: low,
        targetPriceHigh: high,
      });
      return res
        .status(201)
        .json({
          success: true,
          message: "Price alert range created!",
          data: newAlert,
        });
    }
  } catch (error) {
    console.error("--- ERROR IN createOrUpdateAlert ---", error);
    return res
      .status(500)
      .json({ success: false, message: "A critical server error occurred." });
  }
};

export const getUserAlerts = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not signed in." });
    }

    const alerts = await Alert.find({ user: userId })
      .populate("product")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({
        success: true,
        message: `Found ${alerts.length} alerts.`,
        data: alerts,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch alerts." });
  }
};

export const deleteAlert = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not signed in." });
    }

    const alertId = req.params.id;
    const alert = await Alert.findOneAndDelete({ _id: alertId, user: userId });

    if (!alert) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Alert not found or you do not have permission.",
        });
    }
    res
      .status(200)
      .json({ success: true, message: "Alert removed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error while removing alert." });
  }
};
