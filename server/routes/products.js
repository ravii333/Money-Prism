import express from "express";

import {
  searchProducts,
  getFeaturedProducts,
  getProductById,
  getProductPriceHistory,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/featured", getFeaturedProducts);

router.get("/search", searchProducts);

router.get("/:id", getProductById);

router.get("/:id/history", getProductPriceHistory);

export default router;
