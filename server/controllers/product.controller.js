import Product from "../models/Product.js";
import scrapeFlipkart from "../services/scrapeFlipcart.js";
import { normalizePrice, normalizeTitle } from "../utils/helpers.js";

export const searchProducts = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'Query parameter "q" is required',
        data: [],
      });
  }

  try {
    const scrapedListings = await scrapeFlipkart(query);
    const normalizedTitles = [];

    for (const listing of scrapedListings) {
      const normalizedTitle = normalizeTitle(listing.title);
      const normalizedPrice = normalizePrice(listing.price);

      if (!normalizedTitle || !normalizedPrice) continue;
      normalizedTitles.push(normalizedTitle);

      let product = await Product.findOne({ normalizedName: normalizedTitle });
      if (!product) {
        product = new Product({
          name: listing.title,
          normalizedName: normalizedTitle,
          imageURL: listing.image,
          sellers: [],
        });
      }

      const existingSellerIndex = product.sellers.findIndex(
        (s) => s.productURL === listing.link
      );
      const newSellerData = {
        name: "Flipkart",
        productURL: listing.link,
        price: normalizedPrice,
        lastUpdated: new Date(),
      };

      if (existingSellerIndex > -1) {
        const existingSeller = product.sellers[existingSellerIndex];
        if (existingSeller.price !== normalizedPrice) {
          existingSeller.priceHistory.push({ price: normalizedPrice });
        }
        product.sellers[existingSellerIndex] = {
          ...existingSeller.toObject(),
          ...newSellerData,
        };
      } else {
        newSellerData.priceHistory = [{ price: normalizedPrice }];
        product.sellers.push(newSellerData);
      }

      product.updateAggregatePrices();
      await product.save();
    }

    const finalProducts = await Product.find({
      $or: [
        { normalizedName: { $in: normalizedTitles } },
        { name: new RegExp(query, "i") },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Found ${finalProducts.length} matching products.`,
      data: finalProducts,
    });
  } catch (err) {
    console.error("Error in searchProducts controller:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "An internal server error occurred during scraping.",
        data: [],
      });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const featuredProducts = await Product.find({})
      .sort({ updatedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      message: `Successfully fetched ${featuredProducts.length} featured products.`,
      data: featuredProducts,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products.",
      data: [],
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    }
    res
      .status(200)
      .json({ success: true, message: "Product found", data: product });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch product details",
        data: null,
      });
  }
};

export const getProductPriceHistory = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id,
      "sellers.name sellers.priceHistory"
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: [] });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Price history retrieved",
        data: product.sellers,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch price history",
        data: [],
      });
  }
};
