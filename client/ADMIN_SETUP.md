# Admin Dashboard Setup Guide

## 🎯 Overview

Your PUBG store now has a complete admin dashboard with inventory management, order tracking, finance analytics, and promotional offers.

## 📊 Admin Dashboard Features

### 1. **Dashboard** (`/admin`)
- Overview of key metrics:
  - Total Users
  - Total Products
  - Total Orders
  - Total Revenue
  - Completed vs Pending Orders
- Recent orders and product lists
- Quick action buttons

### 2. **Inventory Management** (`/admin/inventory`)
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ View all products in table format
- ✅ Search by product name
- ✅ Filter by category (Account, Service, Boost, Weapon)
- ✅ Manage stock levels

**Product Fields:**
- Product Name
- Category
- Price ($)
- Stock Quantity
- Description
- Level (optional)
- Rank (optional)
- Features (comma-separated)

### 3. **Orders Management** (`/admin/orders`)
- 📦 View all orders
- 🔄 Update order status (Pending → Processing → Completed/Cancelled)
- 👁️ View order details
- 💳 Track payment status
- 🔍 Filter by order status
- 📋 Order information display

**Order Statuses:**
- Pending (new orders)
- Processing (in progress)
- Completed (fulfilled)
- Cancelled (rejected/refunded)

### 4. **Finance Dashboard** (`/admin/finance`)
- 💰 Total Revenue
- 📊 Total Orders Count
- ✔️ Completed Orders
- 📈 Average Order Value
- 🏆 Top Products by Revenue
- 📅 Filter by period (All Time, Today, Week, Month)
- 💳 Recent Transactions Table

### 5. **Offers & Discounts** (`/admin/offers`)
- 🎁 Create promotional offers
- 💯 Percentage discounts
- 💵 Fixed amount discounts
- 📱 Apply to specific product categories
- ⏰ Set start and end dates
- ✍️ Offer descriptions
- ⚙️ Activate/Deactivate offers

**Offer Types:**
- Percentage-based (e.g., 15% OFF)
- Fixed amount (e.g., $50 OFF)
- Applicable to: All Products, Accounts, UC Packages, Boosters

## 🔐 Admin Access

### First-Time Admin Setup

1. **Create Admin User** (Backend):
   Make a POST request to `/api/auth/register`:
   ```json
   {
     "username": "admin",
     "email": "admin@example.com",
     "password": "secure_password",
     "confirmPassword": "secure_password",
     "role": "admin"
   }
   ```

2. **Admin Login**:
   - Go to `/admin/login`
   - Enter admin email and password
   - Click "Admin Login"
   - You'll be redirected to dashboard

3. **Access Dashboard**:
   - Once logged in, access `/admin` to see main dashboard
   - Use sidebar to navigate to different sections

## 🔗 Product Workflow

### How Admin Adds Products:

1. Go to **Inventory** section
2. Click **"Add Product"** button
3. Fill in product details:
   - Name (e.g., "Level 50 PUBG Account")
   - Category (Account/Service/Boost/Weapon)
   - Price
   - Stock quantity
   - Description
   - Optional: Level, Rank, Features
4. Click **"Add Product"**
5. Product appears in your Products list AND on public `/accounts` page

### Products Display:

✅ **Admin adds product** → **Products visible on public store** → **Users can purchase** → **Orders show up in Orders section** → **Finance tracks revenue**

## 📱 Database Connection

All admin data is stored in MongoDB:

**Collections Used:**
- `products` - Product inventory
- `orders` - Customer orders
- `users` - User accounts
- `offers` - Promotional offers (stored in browser localStorage)

## 🎨 UI Features

### Responsive Design
- ✅ Works on desktop, tablet, mobile
- ✅ Collapsible sidebar on mobile
- ✅ Touch-friendly buttons

### Dark Theme
- Professional dark gray/purple theme
- Purple accent colors matching your brand
- Easy on the eyes for long admin sessions

### Real-time Updates
- Click buttons to add/edit/delete
- Tables update immediately
- Charts show live data

## 🚀 Getting Started

### 1. Start Your Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

### 2. Start Your Frontend (Port 3000)
```bash
cd client
npm install
npm start
```

### 3. Access Admin Panel
```
http://localhost:3000/admin/login
```

### 4. Login with your admin credentials
- Email: `admin@example.com`
- Password: `secure_password`

## 📝 Common Tasks

### Add a New PUBG Account for Sale
1. Go to Inventory
2. Click "Add Product"
3. Fill form:
   - Name: "Level 50 Glacier M416"
   - Category: "account"
   - Price: "299.99"
   - Stock: "5"
   - Description: "High rank account with rare glacier M416 skin"
   - Level: "50"
   - Rank: "Gold"
   - Features: "Rare Skin, Lab Weapons, BC Heroes"
4. Click "Add Product"

### View Today's Sales
1. Go to Finance
2. Click "Today" filter
3. See revenue and transactions from today only

### Create a Discount Offer
1. Go to Offers
2. Click "New Offer"
3. Title: "25% OFF All Accounts"
4. Discount Type: "Percentage"
5. Discount Value: "25"
6. Applicable To: "All Products"
7. Set dates
8. Click "Create Offer"

### Update Order Status
1. Go to Orders
2. Click "Details" on an order
3. Click the new status button (e.g., "Completed")
4. Order updates in real-time

## ⚠️ Important Notes

1. **JWT Authentication**: All admin operations require valid JWT token
2. **Role-Based Access**: Only users with `role: admin` can access admin panel
3. **Data Validation**: All inputs are validated before saving
4. **Error Handling**: Clear error messages if something fails
5. **Responsive**: Mobile-friendly interface

## 🔧 Troubleshooting

### Can't login?
- Verify admin account exists in database
- Check email/password is correct
- Ensure backend is running on port 5000

### Products not showing on store?
- Check if product `isActive` is true
- Verify stock is > 0
- Refresh page

### Orders not displaying?
- Make sure backend `/api/orders` endpoint is working
- Check MongoDB connection

### Offers not saving?
- Offers use browser localStorage
- Clear browser cache and try again
- Refresh page after creating offer

## 📞 Support

For issues, check:
1. Backend console for API errors
2. Browser console for frontend errors
3. Verify MongoDB connection
4. Check environment variables in `.env`

---

**Your PUBG admin panel is ready! 🎮**

Start managing products, orders, and finances like a pro!
