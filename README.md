# MoneyPrism

MoneyPrism is a full-stack price comparison and alert web application that helps users find the best deals across e-commerce platforms. It scrapes live product listings from Flipkart, tracks price history, and notifies users via email when a product's price drops into their target range.

---

## Features

- **Product Search** — Search products on Flipkart in real time using headless browser scraping (Puppeteer + Stealth plugin)
- **Price History Tracking** — Stores per-seller price history and computes aggregate lowest/highest prices over time
- **Price History Chart** — Interactive chart (Recharts) on the product detail page visualizing price trends
- **Price Alerts** — Set a low/high target price range for any product; get an email when the live price falls within range
- **AI-Powered Category Inference** — Uses a zero-shot BART-large-MNLI model (via Xenova Transformers) to auto-classify products into categories; falls back to keyword matching
- **User Authentication** — JWT-based registration and login with bcrypt password hashing
- **Featured Products** — Home page displays randomly selected products, filterable by category
- **Email Notifications** — Rich HTML emails sent via Gmail (Nodemailer) when a price alert is triggered
- **Automated Price Checks** — Cron job runs every 4 hours to re-scrape prices and evaluate active alerts
- **Responsive UI** — Built with React 19, Tailwind CSS 4, and Vite; adapts to mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 6, Tailwind CSS 4, Recharts |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB with Mongoose |
| Scraping | Puppeteer 24, puppeteer-extra-plugin-stealth, Cheerio |
| AI/ML | Xenova Transformers (BART-large-MNLI, zero-shot classification) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Email | Nodemailer (Gmail) |
| Scheduling | node-cron |
| HTTP Client | Axios |

---

## Project Structure

```
Money-Prism/
├── server/
│   ├── index.js                 # Express app entry point
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── user.model.js        # User schema
│   │   ├── Product.js           # Product + price history schema
│   │   ├── Category.js          # Category schema
│   │   └── Alert.js             # Price alert schema
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── userController.js
│   │   └── alertController.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── alertRoutes.js
│   ├── services/
│   │   ├── scrapeFlipcart.js    # Puppeteer scraping logic
│   │   ├── emailService.js      # Nodemailer HTML email
│   │   └── cronService.js       # Scheduled price check job
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT protect middleware
│   └── utils/
│       ├── helpers.js           # normalizePrice, normalizeTitle, aiInferCategory
│       ├── generateToken.js     # JWT generation
│       └── authUtils.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Routes and layout
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       ├── ProductCard.jsx
│   │       ├── SearchBar.jsx
│   │       ├── PriceHistoryChart.jsx
│   │       ├── PriceGraph.jsx
│   │       ├── SkeletonLoader.jsx
│   │       ├── SectionHeading.jsx
│   │       └── ProtectedRoute.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json                 # Root scripts (dev, server, frontend)
└── .gitignore
```

---

## API Reference

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/search?q={query}` | No | Search and scrape products from Flipkart |
| GET | `/featured?limit=8&category={cat}` | No | Get featured products, optionally filtered by category |
| GET | `/:id` | No | Get product details by ID |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register with email + password |
| POST | `/login` | No | Login; returns JWT token |

### Alerts — `/api/alerts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | JWT | Create or update a price alert |
| GET | `/` | JWT | Get all alerts for the current user |
| DELETE | `/:id` | JWT | Delete a price alert |

---

## Database Models

### User
| Field | Type | Notes |
|---|---|---|
| email | String | Unique, lowercase |
| password | String | Hashed with bcryptjs |

### Product
| Field | Type | Notes |
|---|---|---|
| name | String | Original product title |
| normalizedName | String | Indexed, used for deduplication |
| imageURL | String | |
| category | ObjectId | Ref: Category |
| sellers | Array | Each entry has name, productURL, price, lastUpdated, priceHistory |
| currentLowestPrice | Number | Lowest price across all sellers |
| historicalLowestPrice | Number | All-time lowest |
| historicalHighestPrice | Number | All-time highest |

### Alert
| Field | Type | Notes |
|---|---|---|
| user | ObjectId | Ref: User |
| product | ObjectId | Ref: Product |
| targetPriceLow | Number | |
| targetPriceHigh | Number | |
| isActive | Boolean | Set to false after notification is sent |

### Category
| Field | Type | Notes |
|---|---|---|
| name | String | Unique |
| description | String | |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- A Gmail account with an app password for email notifications

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Money-Prism.git
cd Money-Prism

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/moneyprism
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Running the App

```bash
# Run both frontend and backend concurrently
npm run dev

# Run only the backend
npm run server

# Run only the frontend
npm run frontend
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

The Vite dev server proxies all `/api` requests to the backend automatically.

---

## How It Works

1. **Search** — Enter a product name; the backend launches a headless Chromium browser, scrolls through Flipkart search results, and extracts titles, prices, images, and links.
2. **Categorize** — The product title is passed to a zero-shot BART classifier to infer its category (e.g., Mobile, Laptop, Headphones).
3. **Store** — Products are saved to MongoDB. If a product already exists (matched by normalized name), its price history is updated.
4. **Alert** — Logged-in users can set a target price range on any product detail page.
5. **Check** — A cron job runs every 4 hours, re-scrapes live prices, and compares them against active alerts.
6. **Notify** — If the live price falls within the user's target range, an HTML email is sent and the alert is deactivated.

---

## Supported Categories

Mobile, Laptop, Tablet, Camera, Headphones, Smartwatch, Television, HomeAppliance, Electronics, Fashion, Footwear, Furniture, Books, Others

---

## License

MIT
