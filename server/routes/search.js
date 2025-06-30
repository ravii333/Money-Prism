import express from "express";
import scrapeFlipkart from "../services/scrapeFlipcart.js";
import Product from "../models/Product.js";
import { normalizePrice, normalizeTitle } from "../utils/helpers.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const scrapedListings = await scrapeFlipkart(query);
    if (scrapedListings.length === 0) {
      return res
        .status(200)
        .json({ message: "No products found on Flipkart." });
    }

    for (const listing of scrapedListings) {
      const normalizedTitle = normalizeTitle(listing.title);
      const normalizedPrice = normalizePrice(listing.price);
      if (!normalizedTitle || !normalizedPrice) continue;

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

      if (existingSellerIndex > -1) {
        const existingSeller = product.sellers[existingSellerIndex];

        if (existingSeller.price !== normalizedPrice) {
          existingSeller.priceHistory.push({ price: normalizedPrice });
          console.log(
            `Price changed for "${listing.title}". New history point added.`
          );
        }

        existingSeller.price = normalizedPrice;
        existingSeller.lastUpdated = new Date();
      } else {
        product.sellers.push({
          name: "Flipkart",
          productURL: listing.link,
          price: normalizedPrice,
          lastUpdated: new Date(),
          priceHistory: [{ price: normalizedPrice }],
        });
        console.log(
          `New seller added for "${listing.title}" with initial price.`
        );
      }

      product.updateAggregatePrices();

      await product.save();
    }

    const finalProducts = await Product.find({
      normalizedName: {
        $in: scrapedListings.map((p) => normalizeTitle(p.title)),
      },
    });

    res.json({
      message: "Scraping and price history processing complete.",
      data: finalProducts,
    });
  } catch (error) {
    console.error("Error during scraping and processing:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

export default router;
