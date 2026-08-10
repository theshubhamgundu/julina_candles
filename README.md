# Julina Candles & Melts 🕯️ — Artisanal Candles & Wax Products E-Commerce Platform

**Julina Candles & Melts** is a full-stack luxury e-commerce platform built for handcrafted artisanal candles, premium wax products, and scented home accessories. Built with the **MERN Stack + TypeScript**, it features an elegant bohemian-inspired visual design, real-time cart management, role-based admin dashboard, and Stripe payment processing.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Hero Image Carousel**: Smooth auto-rotating banner slider featuring lightweight compressed hero graphics with pause-on-hover and touch controls.
- **Animated Marquee Ticker**: Continuous horizontal ticker showcasing key product features (100% Soy Wax, Hand-Poured, Eco-Friendly, Long-Burning, Natural Scents).
- **Product Showcase & Card Grid**:
  - Elegant beige image containers (`#f3e9d4`) with product hover zoom effects.
  - Premium discount badges (`20% OFF`, `30% OFF`).
  - Scent type & size variant selector dropdowns (Small, Medium, Large).
  - Single-click **Add to Cart** with quantity controls (`−`, `qty`, `+`).
- **Candle Care & Scent Blog Section**: 3-column article grid sharing insights into candle care, scent selection, and home ambiance creation.
- **Elegant Footer**: Premium gold & cream (`#d4a574`) footer with custom candlelight wave decoration, quick links, newsletter subscription, and responsive mobile grid layout.
- **Typography & Theme**: Styled with modern Google Fonts (`Outfit` for headings, `Plus Jakarta Sans` for body) over a warm luxurious cream background (`#faf8f3`).

### 🔑 Authentication & Payments
- **Firebase Authentication**: Google Sign-In & Email/Password authentication.
- **Role-Based Access Control**: Dedicated Customer & Administrator privileges.
- **Stripe Payment Gateway**: Secure checkout experience with real-time payment processing.

### 📊 Admin Dashboard
- **Product Management**: CRUD operations for managing candles, wax products, scent types, sizes, and inventory.
- **Order Management**: Track customer orders, update delivery statuses (Pending, Shipped, Delivered).
- **Coupon & Discount Engine**: Create and apply custom promo codes during checkout.
- **Sales Analytics & Reports**: Real-time sales metrics, revenue overview, and customer demographics powered by Chart.js.

---

## 🔑 Demo Credentials

For quick local testing and evaluation, you can use the following pre-configured credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@julinacandles.in` | `admin123` | Full Admin Dashboard (`/admin/dashboard`), Product Management, Orders, Coupons |
| **Customer** | `customer@julinacandles.in` | `user123` | Customer Storefront, Cart, Checkout, Order History (`/orders`) |

> 💡 **Tip**: The Sign-In page contains 1-click **Quick Demo Login** buttons that automatically populate and authenticate these credentials!

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Typography**: Google Fonts (`Outfit`, `Plus Jakarta Sans`)
- **Icons**: React Icons (`FaFacebookF`, `FaInstagram`, `FaShoppingCart`, etc.)
- **Router**: React Router v6

### Backend
- **Runtime**: Node.js & Express with TypeScript
- **Database**: MongoDB with Mongoose ORM
- **Auth**: Firebase Admin SDK & JWT Tokens
- **File Storage**: Cloudinary API for high-resolution product media
- **Payments**: Stripe API SDK

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas instance)
- [Firebase Account](https://firebase.google.com/)
- [Cloudinary Account](https://cloudinary.com/)
- [Stripe Account](https://stripe.com/)

---

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/theshubhamgundu/vital_harvest.git
   cd vital_harvest
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

---

### Environment Configuration

#### Server Environment (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/vital_harvest
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_KEY=your_stripe_secret_key
```

#### Client Environment (`client/.env`)
Create a `.env` file in the `client` directory:

```env
VITE_SERVER=http://localhost:4000
VITE_STRIPE_KEY=your_stripe_publishable_key
```

---

### Running Locally

1. **Start Backend Server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend Client**:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to **`http://localhost:5173`**.

---

## 📜 License

This project is licensed under the MIT License.

---

**Julina Candles & Melts** — *Smarter Carbs for a Healthier Life.* 🌾

