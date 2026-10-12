# THE FITNESS STORE (TFS) — Full-Stack Fitness E-Commerce Website

A complete, production-ready, high-performance full-stack e-commerce catalogue and enquiry platform built for **THE FITNESS STORE (TFS)** — retailer and wholesaler of sports, fitness equipment, gym accessories, apparel, and supplements.

Inspired by the dark athletic aesthetic and editorial design language of premium performance brands (e.g. Rynox), TFS features high-contrast dark visual tones (`#080808`), bold Bebas Neue typography, vibrant brand red accents (`#E31E2F`), interactive animated micro-interactions, and a direct **"Order on WhatsApp"** conversion engine.

---

## 🏋️‍♂️ Business Model & WhatsApp Ordering Architecture

Unlike traditional web stores that force users through rigid payment gateways or high-friction multi-step checkouts, **THE FITNESS STORE** operates a streamlined **Catalogue & WhatsApp Order-to-Fulfillment** model:

1. **Browse & Select**: Customers explore authentic equipment, apparel, belts, shakers, and supplements.
2. **Variants & Specs**: Users select sizes (S, M, L, XL), weights (2.5kg up to 50kg, 11mm/13mm), colours, and quantities.
3. **Cart & Multi-Item Ordering**: Customers add multiple items to a slide-out cart drawer or click instant WhatsApp order on any single product.
4. **Automated WhatsApp Message**: Clicking **"Order on WhatsApp"** generates a clean, pre-filled WhatsApp enquiry message containing:
   - Unique order reference code (e.g., `#TFS-1728723490-A8F2`)
   - Customer name, phone, and optional delivery city
   - Itemized list with Product Name, SKU, selected variant, quantity, unit price, and subtotal
   - Grand Total in INR (₹)
   - Auto-generated `https://wa.me/<phone>?text=...` URI
5. **Admin Tracking**: Each enquiry is asynchronously logged to PostgreSQL with status tracking (`PENDING`, `CONFIRMED`, `SHIPPED`, `CANCELLED`).
6. **Wholesale & B2B Inquiries**: Dedicated wholesale portal at `/bulk-orders` for commercial gyms, fitness clubs, and bulk buyers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router with Turbopack), React 19, TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS v4, Lucide React icons, Custom CSS Glassmorphism & Cinema Overlays |
| **Animation** | Framer Motion & GSAP for hero reveals, marquee ticker, and drawer transitions |
| **Database & ORM** | PostgreSQL 16, Prisma ORM 6.4 with migrations and seed scripts |
| **Auth & Security**| Stateless HMAC JWT sessions (`jose`), Bcrypt password hashing, HTTP-Only secure cookies |
| **Validation** | Zod schemas on all API Route Handlers |
| **Local Dev** | Docker Compose for containerized PostgreSQL |
| **Testing** | Node.js native test runner with `tsx` (12 automated unit & integration tests) |

---

## 🚀 Quick Start & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v20.x or higher
- [Docker](https://www.docker.com/) & Docker Compose (or an external PostgreSQL instance)

### 1. Clone & Install Dependencies
```bash
cd the-fitness-store
npm install
```

### 2. Start PostgreSQL with Docker Compose
The project includes a ready-to-use Docker Compose configuration running PostgreSQL on port `5435` (to avoid conflicts with default `5432` ports):

```bash
docker compose up -d
```

Verify that the container is healthy:
```bash
docker ps --filter "name=tfs-postgres"
```

### 3. Environment Configuration
Create or inspect `.env`:
```env
# Database connection string (Port 5435 for local Docker instance)
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/tfs_db?schema=public"

# Admin Authentication Secret (min 32 characters)
JWT_SECRET="tfs_secure_super_secret_jwt_key_2026_at_least_32_characters_long"

# Default WhatsApp Business Number (country code + 10 digits without +)
NEXT_PUBLIC_DEFAULT_WHATSAPP="919876543210"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Prisma Migrations & Database Seed
Run the migration and populate the database with authentic fitness products, categories, store settings, promotional banners, and default admin credentials:

```bash
npx prisma migrate dev --name init
npm run seed
```

### 5. Run Automated Tests
Execute the comprehensive test suite verifying WhatsApp message generation, integer currency arithmetic, JWT authentication, and database integrity:

```bash
npm test
```
*Output: 12 tests passing.*

### 6. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Admin Dashboard & Credentials

TFS includes a complete dark-themed admin management suite inspired by professional sports brand portals.

- **Admin Login Route**: `/admin/login`
- **Dashboard Overview**: `/admin`
- **Default Admin Email**: `admin@thefitnessstore.com`
- **Default Admin Password**: `Admin@TFS2026Secure`

> **Convenience Feature**: On the login page, click **"Use Demo Admin Credentials"** to instantly fill the credentials.

### Admin Capabilities
1. **Catalog Management** (`/admin/products`):
   - Create, edit, and archive products.
   - Dynamic variant manager: sizes, weights, custom prices, and stock quantity per variant.
   - Multi-photo uploads via file selector (`/api/admin/upload`) or image URLs.
   - Badges: *Featured Product*, *New Arrival*, *Special Offer*, *Available/Draft*.
2. **Categories** (`/admin/categories`):
   - Add, rename, reorder, and activate/deactivate product categories.
3. **Order Enquiries Pipeline** (`/admin/orders`):
   - View all customer WhatsApp order enquiries with customer contact details, items list, and totals.
   - Update enquiry status: *Pending*, *Confirmed*, *Shipped*, *Cancelled*.
   - Direct button to chat with the customer on WhatsApp.
4. **Offers & Promotional Banners** (`/admin/offers`):
   - Manage sitewide promotional banners, coupon codes, and deal highlights.
5. **Store Configuration** (`/admin/settings`):
   - Change store name, phone numbers, contact email, and active WhatsApp number in real-time without restarting the server.

---

## 📁 Project Architecture & Directory Structure

```
the-fitness-store/
├── app/
│   ├── (public routes)
│   │   ├── page.tsx               # Cinematic Homepage (Hero, Trust Strip, Marquee, Categories, Featured, Deals)
│   │   ├── shop/                  # Product catalogue with live search, filters, and sorting
│   │   ├── shop/[category]/       # Category-specific filtered catalogue
│   │   ├── product/[slug]/        # Product details, gallery, reactive variant picker, schema.org JSON-LD
│   │   ├── search/                # Live dedicated search page
│   │   ├── offers/                # Special deals & promotional banners
│   │   ├── bulk-orders/           # B2B Wholesale enquiry portal with volume estimator
│   │   ├── about/                 # About THE FITNESS STORE
│   │   ├── contact/               # Contact details, interactive enquiry form & map placeholder
│   │   ├── privacy-policy/        # Legal privacy policy
│   │   ├── terms/                 # Terms of service
│   │   ├── shipping-policy/       # Shipping & logistics policy
│   │   └── returns-policy/        # Return & replacement guidelines
│   ├── admin/
│   │   ├── login/                 # Secure admin login
│   │   ├── layout.tsx             # Protected admin shell with top navigation
│   │   ├── page.tsx               # Analytics metrics & catalogue summary
│   │   ├── products/              # Products list, /new, /[id]/edit
│   │   ├── categories/            # Category management
│   │   ├── orders/                # WhatsApp enquiries pipeline
│   │   ├── offers/                # Promotional offers & banners
│   │   └── settings/              # Store & WhatsApp settings
│   └── api/
│       ├── admin/                 # Protected endpoints for products, categories, offers, settings, upload
│       ├── auth/                  # Admin JWT login and logout handlers
│       └── enquiries/create/      # Public order enquiry persistence
├── components/
│   ├── admin/                     # ProductForm, CategoryManager, EnquiriesManager, OffersManager, SettingsForm
│   ├── brand/                     # TFS vector logo, wordmark, badge components
│   ├── cart/                      # Slide-out Cart Drawer with reactive line items & totals
│   ├── layout/                    # Sticky Navbar, Footer with quick links & social icons, FloatingWhatsApp
│   └── product/                   # ProductCard, ProductDetailView
├── context/
│   └── cart-context.tsx           # React Context with localStorage persistence for cart items
├── lib/
│   ├── auth.ts                    # Bcrypt & Jose JWT signing, cookie verification, requireAdmin guard
│   ├── prisma.ts                  # Singleton Prisma Client
│   ├── utils.ts                   # Exact integer paise INR currency formatting, discount calculation
│   └── whatsapp.ts                # WhatsApp message templates & wa.me URL builder
├── prisma/
│   ├── schema.prisma              # Data schema (User, Category, Product, Variant, Image, Enquiry, Setting)
│   └── seed.ts                    # 38 authentic fitness products, 17 categories, admin user
├── public/
│   ├── images/brand/              # TFS logo, emblem, wordmark
│   └── images/products/           # Authentic equipment, belts, dumbbells, shakers, apparel photos
├── tests/                         # Node.js automated test suite
├── docker-compose.yml             # PostgreSQL 16 container definition
└── package.json
```

---

## 🏷️ Authentic Catalogue Data Included

The database seed (`prisma/seed.ts`) populates 17 authentic sports and fitness categories extracted from store inventory:

1. **Gym and Weightlifting Belts**: Repex Lever Belts (13mm / 11mm Imported), USI Quick-Lock Belts, USI Powerlifting Belts.
2. **Dumbbells**: Hex Dumbbells (2.5kg - 30kg), Rubber Bouncer Commercial Dumbbells.
3. **Weight Plates**: Rubber Encased Olympic Weight Plates (2.5kg - 25kg), Bumper Plates.
4. **Rods and Barbells**: 7ft Olympic 28mm Barbell, 5ft EZ Curl Olympic Rod, Trap Hex Bar.
5. **Gym Equipment**: Commercial Adjustable Bench, Heavy-Duty Power Squat Rack, Deadlift Platform with Heavy Rubber Tiles.
6. **Machine Handles & Cable Attachments**: Revolving Lat Pulldown Bar, Double D Cable Handle, Tricep Rope, D-Stirrup Cable Handle.
7. **Shakers & Sippers**: Shifter Insulated Stainless Steel Shaker (750ml), Cyclone 3-in-1 Shaker Bottle.
8. **Supplements & Nutrition**: Myfitness Chocolate Peanut Butter (1kg), MuscleBlaze Biozyme Performance Whey, Optimum Nutrition Gold Standard Whey, Creatine Monohydrate 250g.
9. **Men's Gym Wear**: Technosport Quick-Dry Gym T-Shirts, Technosport Performance Trackpants, Athletic Stringer Gym Vest.
10. **Women's Gym Wear**: High-Waist Seamless Compression Tights, Medium-Support Padded Sports Bra.
11. **Wrist Wraps & Supports**: Heavy-Duty Elastic Wrist Wraps (18"), 7mm Neoprene Knee Sleeves for Squats.
12. **Resistance Bands**: Heavy-Duty Pull-Up Assist Band Set (5 Resistance Levels), Loop Resistance Booty Bands.
13. **Gym Accessories**: Heavy-Duty Padded Weightlifting Straps, Olympic Barbell Quick-Release Clamp Collars, Gym Chalk Magnesium Block.
14. **Yoga & Mobility**: High-Density EVA Foam Roller (18"), Extra-Thick 10mm Non-Slip Yoga Mat.

---

## 💰 Integer Paise Currency Representation

To prevent floating-point inaccuracies common in e-commerce pricing (e.g. `0.1 + 0.2 === 0.30000000000000004`), all prices in TFS are stored as **exact integer paise** in the database:

- ₹4,200.00 is stored as integer `420000`.
- ₹750.00 is stored as integer `75000`.
- The helper `formatINR(priceInPaise)` in `lib/utils.ts` formats amounts to the standard Indian numbering format (e.g. `₹4,200`).

---

## 🚢 Production Deployment (Vercel & Neon PostgreSQL)

### 1. Database (Neon PostgreSQL)
1. Create a free serverless PostgreSQL database on [Neon](https://neon.tech/).
2. Copy the connection string with pooling enabled.
3. In your project `.env` or Vercel dashboard:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
4. Run migrations against production:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

### 2. Deploy to Vercel
1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_DEFAULT_WHATSAPP`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy! Next.js will build optimized static and dynamic routes.

---

## 🛡️ License & Copyright

© 2026 **THE FITNESS STORE (TFS)**. All rights reserved.
Built for high-performance athletic retail & wholesale commerce.
