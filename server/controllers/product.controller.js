import Product from "../models/Product.js";
import { searchProducts as scrapeAndSearch } from "../services/scrapeFlipcart.js";
import {
  normalizePrice,
  normalizeTitle,
  aiInferCategory,
} from "../utils/helpers.js";

export const searchAndProcessProducts = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter "q" is required' });
  }

  try {
    const scrapedListings = await scrapeAndSearch(query);
    if (scrapedListings.length === 0) {
      return res
        .status(200)
        .json({
          success: true,
          message: "No products found matching your query.",
          data: [],
        });
    }

    // Process each scraped listing to find or create a product in the DB
    const processingPromises = scrapedListings.map(async (listing) => {
      const normalizedTitle = normalizeTitle(listing.title);
      const normalizedPrice = normalizePrice(listing.price);

      // Skip if essential data is missing after normalization
      if (!normalizedTitle || !normalizedPrice || !listing.link) return null;

      // Find an existing product based on its normalized name
      let product = await Product.findOne({ normalizedName: normalizedTitle });

      if (!product) {
        // --- PRODUCT DOES NOT EXIST, CREATE IT ---
        // Infer the category using the AI helper
        const category = await aiInferCategory(listing.title);

        // Create a new product instance in memory (not yet saved)
        product = new Product({
          name: listing.title,
          normalizedName: normalizedTitle,
          imageURL: listing.image,
          category: category, // ✅ Assign the AI-detected category
          sellers: [], // Sellers will be added next
        });
      }

      // --- ADD OR UPDATE SELLER INFORMATION ---
      const existingSellerIndex = product.sellers.findIndex(
        (s) => s.productURL === listing.link,
      );

      const newSellerData = {
        name: "Flipkart", // Or dynamically determine this
        productURL: listing.link,
        price: normalizedPrice,
        lastUpdated: new Date(),
      };

      if (existingSellerIndex > -1) {
        const existingSeller = product.sellers[existingSellerIndex];
        if (existingSeller.price !== normalizedPrice) {
          existingSeller.priceHistory.push({ price: normalizedPrice });
        }
        product.sellers.set(existingSellerIndex, {
          ...existingSeller.toObject(),
          ...newSellerData,
        });
      } else {
        newSellerData.priceHistory = [{ price: normalizedPrice }];
        product.sellers.push(newSellerData);
      }

      product.updateAggregatePrices();
      return product.save();
    });

    const processedProducts = (await Promise.all(processingPromises)).filter(
      Boolean,
    ); // .filter(Boolean) removes nulls

    res
      .status(200)
      .json({
        success: true,
        message: `Successfully processed ${processedProducts.length} products.`,
        data: processedProducts,
      });
  } catch (err) {
    console.error("--- ERROR in searchAndProcessProducts ---:", err);
    res
      .status(500)
      .json({ success: false, message: "An internal server error occurred." });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const categoryQuery = req.query.category;
    const filter = {};
    if (categoryQuery && categoryQuery !== "All") {
      filter.category = categoryQuery;
    }
    const featuredProducts = await Product.aggregate([
      { $match: filter },
      { $sample: { size: limit } },
    ]);
    res
      .status(200)
      .json({
        success: true,
        message: `Fetched ${featuredProducts.length} products.`,
        data: featuredProducts,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch featured products." });
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
