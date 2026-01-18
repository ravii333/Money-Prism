import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { searchProducts as scrapeAndSearch } from "../services/scrapeFlipcart.js";
import {
  normalizePrice,
  normalizeTitle,
  aiInferCategory,
} from "../utils/helpers.js";

export const searchAndProcessProducts = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ success: false, message: "..." });

  try {
    const scrapedListings = await scrapeAndSearch(query);
    console.log(
      `[Controller] Scraper found ${scrapedListings.length} listings.`,
    );

    if (scrapedListings.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No products found.", data: [] });
    }

    const processedProducts = [];

    for (const listing of scrapedListings) {
      try {
        const normalizedTitle = normalizeTitle(listing.title);
        const normalizedPrice = normalizePrice(listing.price);

        if (!normalizedTitle || !normalizedPrice || !listing.link) {
          console.warn(
            `[Skip] Missing data for: ${listing.title} (Price: ${normalizedPrice})`,
          );
          continue;
        }

        let product = await Product.findOne({
          normalizedName: normalizedTitle,
        });

        if (!product) {
          const category = await aiInferCategory(listing.title, query);

          const categoryDoc = await Category.findOneAndUpdate(
            { name: category },
            { name: category },
            { upsert: true, new: true },
          );

          product = new Product({
            name: listing.title,
            normalizedName: normalizedTitle,
            imageURL: listing.image,
            category: categoryDoc._id,
            sellers: [],
          });
        }

        //Seller Logic
        const existingSellerIndex = product.sellers.findIndex(
          (s) => s.productURL === listing.link,
        );
        const newSellerData = {
          name: "Flipkart",
          productURL: listing.link,
          price: normalizedPrice,
          lastUpdated: new Date(),
        };

        if (existingSellerIndex > -1) {
          // Update existing
          const existingSeller = product.sellers[existingSellerIndex];
          if (existingSeller.price !== normalizedPrice) {
            existingSeller.priceHistory.push({ price: normalizedPrice });
          }
          product.sellers.set(existingSellerIndex, {
            ...existingSeller.toObject(),
            ...newSellerData,
          });
        } else {
          // Add new
          newSellerData.priceHistory = [{ price: normalizedPrice }];
          product.sellers.push(newSellerData);
        }

        product.updateAggregatePrices();
        const savedProduct = await product.save();
        processedProducts.push(savedProduct);

        console.log(`[Success] Processed: ${normalizedTitle}`);
      } catch (itemError) {
        console.error(
          `[Error] Failed to process item: ${listing.title}`,
          itemError.message,
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully processed ${processedProducts.length} products.`,
      data: processedProducts,
    });
  } catch (err) {
    console.error("--- GLOBAL ERROR ---:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const categoryQuery = req.query.category; // e.g., "Mobile"
    let filter = {};

    if (categoryQuery && categoryQuery !== "All") {
      const categoryDoc = await Category.findOne({ name: categoryQuery });

      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        return res.status(200).json({
          success: true,
          message: `Category "${categoryQuery}" not found.`,
          data: [],
        });
      }
    }

    const featuredProducts = await Product.aggregate([
      { $match: filter },
      { $sample: { size: limit } },
    ]);

    res.status(200).json({
      success: true,
      message: `Fetched ${featuredProducts.length} products.`,
      data: featuredProducts,
    });
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products.",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product found", data: product });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product details" });
  }
};
