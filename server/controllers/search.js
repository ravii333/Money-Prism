import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeSearchResults = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(
      query,
    )}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    $("._1AtVbE").each((_, el) => {
      const title = $(el).find("._4rR01T, .s1Q9rs").text();
      const price = $(el).find("._30jeq3").first().text();
      const link = $(el).find("a").attr("href");
      const image = $(el).find("img").attr("src");

      if (title && price && link && image) {
        results.push({
          title,
          price,
          link: `https://www.flipkart.com${link}`,
          image,
        });
      }
    });

    res.json(results);
  } catch (error) {
    console.error("Scraping error:", error.message);
    res.status(500).json({ error: "Failed to scrape data" });
  }
};
