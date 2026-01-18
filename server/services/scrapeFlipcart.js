import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use the stealth plugin to make Puppeteer harder to detect
puppeteer.use(StealthPlugin());

/**
 * A helper function to scroll to the bottom of the page, 
 * ensuring all lazy-loaded content is loaded.
 * @param {import('puppeteer').Page} page
 */
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// Reusable browser launch configuration to keep code DRY
const launchConfig = {
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};

// =====================================================================
// FUNCTION 1: Scrapes a list of products from a search query page
// =====================================================================
export const searchProducts = async (searchQuery) => {
  let browser;
  let page;
  console.log(`🚀 Starting search scrape for: "${searchQuery}"`);

  try {
    browser = await puppeteer.launch(launchConfig);
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
    
    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    await autoScroll(page);
    console.log('Scrolling complete.');

    // This is a comprehensive list of all known selectors for a product "card".
    // It makes the scraper robust against different page layouts.
    const productContainerSelector = [
      'div.slAVV4',    // NEW: For grid views like headphones
      'div._4ddWXP',   // Another common grid view
      'div._1AtVbE',   // For list views (like mobile phones)
      'a.CGtC98',      // An old layout where the link itself is the container
      'div._2kHMtA',   // An old list view
    ].join(', ');

    console.log(`Waiting for product containers to appear...`);
    await page.waitForSelector(productContainerSelector, { timeout: 20000 });
    console.log('Product containers found! Extracting data...');

    const products = await page.evaluate((selector) => {
      const results = [];
      document.querySelectorAll(selector).forEach(card => {
        // Use a generalized list of selectors for the inner elements
        const titleEl = card.querySelector('a.wjcEIp, a.s1Q9rs, div.KzDlHZ, div._4rR01T, a.IRpwTa');
        const priceEl = card.querySelector('div.Nx9bqj, div._30jeq3');
        const imageEl = card.querySelector('img.DByuf4, img._396cs4, img._2r_T1I');
        
        let link = null;
        if (card.tagName === 'A') {
            link = card.href;
        } else {
            const linkTag = card.querySelector('a.VJA3rP, a._1fQZEK');
            if (linkTag) link = linkTag.href;
        }

        if (titleEl && priceEl && imageEl && link) {
          results.push({
            title: titleEl.title || titleEl.innerText.trim(), // Prefer the 'title' attribute for clean text
            price: priceEl.innerText.trim(),
            link,
            image: imageEl.src,
          });
        }
      });
      return results;
    }, productContainerSelector);

    console.log(`✅ Extracted ${products.length} products from search.`);
    return products;

  } catch (error) {
    console.error(`❌ Search scraper failed for "${searchQuery}": ${error.message}`);
    if (page) {
      await page.screenshot({ path: 'search_scraper_failure.png' });
      console.log('📸 Screenshot of failed page saved to search_scraper_failure.png');
    }
    return [];
  } finally {
    if (browser) await browser.close();
  }
};


// =====================================================================
// FUNCTION 2: Scrapes just the price from a single product detail page URL
// =====================================================================
export const getLivePrice = async (productUrl) => {
  if (!productUrl) return null;
  
  let browser;
  let page;
  console.log(`💡 Getting live price from: ${productUrl.substring(0, 70)}...`);

  try {
    browser = await puppeteer.launch(launchConfig);
    page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 20000 });

    // A list of all known price selectors on a product detail page
    const priceSelectors = [
      'div._30jeq3._16Jk6d', // The most common price selector
      'div.C7GNYd',         // A new possible selector
      'div.Nx9bqj._4b5DiR'  // A selector sometimes reused from search
    ];

    let priceString = null;
    for (const selector of priceSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 }); // Wait briefly for each selector
        priceString = await page.$eval(selector, el => el.innerText);
        if (priceString) {
          console.log(`[SCRAPER] Success! Found price using selector: "${selector}"`);
          break; // Exit loop once a price is found
        }
      } catch (e) {
        // This is expected if a selector isn't found, so we just continue
      }
    }

    if (!priceString) {
      throw new Error("Could not find any known price selector on the page.");
    }

    return Number(priceString.replace(/[^0-9]/g, ''));

  } catch (error) {
    console.error(`❌ Live price scraper failed for ${productUrl}:`, error.message);
    if (page) {
      await page.screenshot({ path: 'price_scraper_failure.png' });
      console.log('📸 Screenshot of failed page saved to price_scraper_failure.png');
    }
    return null;
  } finally {
    if (browser) await browser.close();
  }
};