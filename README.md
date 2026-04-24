# YATHU PUBG STORE

A complete MERN stack website for selling PUBG accounts with a premium gaming theme.

## 🎮 Features

### Frontend
- **React.js** with modern hooks and context API
- **Framer Motion** for smooth animations
- **Responsive Design** with mobile-first approach
- **Premium Gaming Theme** with dark colors and gold accents
- **Component-Based Architecture** for maintainability

### Backend
- **Node.js & Express.js** for REST API
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for admin panel
- **Multer** for image uploads
- **Rate Limiting** and security middleware

### Key Features
- 🏠 Homepage with hero section and featured accounts
- 📱 Fully responsive design
- 🔍 Advanced search and filtering
- 📸 Image galleries for accounts
- 🛡️ Secure admin dashboard
- 💬 WhatsApp integration
- 📞 Contact form with inquiry management
- ⭐ Customer reviews section
- ❓ FAQ section
- 📊 Account statistics and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd yathu-pubg-store
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**
```bash
# Copy environment example
cd server
cp .env.example .env

# Edit .env with your configuration
nano .env
```

4. **Database Setup**
- Make sure MongoDB is running
- Update `MONGODB_URI` in `.env` file
- Default: `mongodb://localhost:27017/yathu-pubg-store`

5. **Start the application**
```bash
# From root directory
npm run dev
```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) simultaneously.

## 📁 Project Structure

```
yathu-pubg-store/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── middleware/         # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # Image uploads
│   ├── server.js          # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables (server/.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/yathu-pubg-store

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Admin Credentials
ADMIN_EMAIL=admin@yathupubg.com
ADMIN_PASSWORD=admin123
```

## 📱 API Endpoints

### Accounts
- `GET /api/accounts` - Get all accounts with filters
- `GET /api/accounts/featured` - Get featured accounts
- `GET /api/accounts/:id` - Get single account
- `POST /api/accounts` - Create account (admin only)
- `PUT /api/accounts/:id` - Update account (admin only)
- `DELETE /api/accounts/:id` - Delete account (admin only)
- `PATCH /api/accounts/:id/status` - Update account status (admin only)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile
- `PUT /api/admin/password` - Change password

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all inquiries (admin only)
- `PUT /api/contact/:id/respond` - Respond to inquiry (admin only)

## 🎨 Design System

### Colors
- **Primary Gold**: #FFD700
- **Secondary Gold**: #FFA500
- **Dark Background**: #000000
- **Card Background**: #1a1a1a
- **Border Color**: #333333

### Typography
- **Font Family**: Inter
- **Headings**: Bold weights
- **Body Text**: Regular weight

### Components
- **Buttons**: Primary and secondary variants
- **Cards**: Hover effects and transitions
- **Forms**: Modern input styling
- **Navigation**: Sticky with mobile menu

## 🔐 Admin Dashboard

### Default Login
- **Email**: admin@yathupubg.com
- **Password**: admin123

### Features
- 📊 Dashboard with statistics
- 📝 CRUD operations for accounts
- 💬 Contact inquiry management
- 📤 Image upload support
- 🔐 Secure authentication

## 📱 Contact Integration

The website integrates with multiple contact methods:

- **WhatsApp**: +94763442220
- **Telegram**: +94703374433
- **TikTok**: @yathupubgstore
- **Facebook**: YATHU PUBG STORE Page

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy the build/ folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
# Deploy with MongoDB Atlas
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This website is for educational purposes. Selling or transferring game accounts may violate the terms of service of some games. Please understand the platform rules before launching.

## 🛠️ Technologies Used

### Frontend
- React 18
- React Router DOM
- Framer Motion
- Axios
- Lucide React
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt.js
- Multer
- Helmet
- CORS

### Development
- Concurrently
- Nodemon
- React Scripts

## 📞 Support

For support or questions:
- 📧 Email: info@yathupubgstore.com
- 💬 WhatsApp: +94763442220
- 📱 Telegram: +94703374433

---

**YATHU PUBG STORE** - Your trusted destination for premium PUBG accounts! 🎮
