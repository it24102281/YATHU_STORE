# Yathu PUBG Backend API

A complete REST API backend for the Yathu PUBG project built with Node.js, Express, MongoDB, and JWT authentication.

## Features

✅ **User Authentication**
- User registration and login
- Admin login system
- JWT token-based authentication
- Password hashing with bcryptjs

✅ **Product Management**
- Admin can create, read, update, and delete products
- Public view for available products
- Product filtering and search

✅ **Order Management**
- Users can place orders for products
- Track order status
- Admin can manage and update orders
- Automatic stock management

✅ **User Management**
- User profile management
- Password change functionality
- Admin can manage all users
- User activation/deactivation

✅ **Security**
- CORS enabled for frontend
- JWT authentication
- Password hashing
- Input validation
- Error handling middleware

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Setup Steps

1. **Clone or navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure .env file:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yathu-pubg
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

5. **Install MongoDB (if not already installed):**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

6. **Start the backend server:**
```bash
npm start          # Production mode
npm run dev        # Development mode (with nodemon)
```

The server should run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
Body: {
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phoneNumber": "+1234567890"
}
Response: { success: true, token: "...", user: {...} }
```

#### User Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: { success: true, token: "...", user: {...} }
```

#### Admin Login
```
POST /api/auth/admin-login
Body: {
  "email": "admin@example.com",
  "password": "password123"
}
Response: { success: true, token: "...", user: {...} }
```

#### Verify Token
```
GET /api/auth/verify
Headers: { "Authorization": "Bearer <token>" }
Response: { success: true, user: {...} }
```

### Product Routes (`/api/products`)

#### Get All Products
```
GET /api/products
Query Params: ?category=account&minPrice=100&maxPrice=500&search=keyword
Response: { success: true, count: 10, products: [...] }
```

#### Get Single Product
```
GET /api/products/:id
Response: { success: true, product: {...} }
```

#### Create Product (Admin Only)
```
POST /api/products
Headers: { "Authorization": "Bearer <admin_token>" }
Body: {
  "name": "PUBG Account",
  "description": "Level 50 account",
  "category": "account",
  "price": 299.99,
  "stock": 5,
  "specifications": { "level": 50, "rank": "Gold" },
  "features": ["High Level", "Good Stats"]
}
Response: { success: true, product: {...} }
```

#### Update Product (Admin Only)
```
PUT /api/products/:id
Headers: { "Authorization": "Bearer <admin_token>" }
Body: { "name": "Updated Name", "price": 399.99, ... }
Response: { success: true, product: {...} }
```

#### Delete Product (Admin Only)
```
DELETE /api/products/:id
Headers: { "Authorization": "Bearer <admin_token>" }
Response: { success: true, deletedProduct: {...} }
```

### Order Routes (`/api/orders`)

#### Create Order
```
POST /api/orders
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "productId": "product_id",
  "quantity": 1,
  "paymentMethod": "credit-card",
  "deliveryAddress": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "notes": "Special instructions"
}
Response: { success: true, order: {...} }
```

#### Get My Orders
```
GET /api/orders/my-orders
Headers: { "Authorization": "Bearer <token>" }
Response: { success: true, orders: [...] }
```

#### Get Order by ID
```
GET /api/orders/:id
Headers: { "Authorization": "Bearer <token>" }
Response: { success: true, order: {...} }
```

#### Cancel Order
```
PUT /api/orders/:id/cancel
Headers: { "Authorization": "Bearer <token>" }
Response: { success: true, order: {...} }
```

#### Get All Orders (Admin Only)
```
GET /api/orders
Headers: { "Authorization": "Bearer <admin_token>" }
Query Params: ?status=pending&paymentStatus=completed
Response: { success: true, orders: [...] }
```

#### Update Order Status (Admin Only)
```
PUT /api/orders/:id/status
Headers: { "Authorization": "Bearer <admin_token>" }
Body: {
  "status": "completed",
  "paymentStatus": "completed",
  "adminNotes": "Order shipped"
}
Response: { success: true, order: {...} }
```

### User Routes (`/api/users`)

#### Get User Profile
```
GET /api/users/profile
Headers: { "Authorization": "Bearer <token>" }
Response: { success: true, user: {...} }
```

#### Update User Profile
```
PUT /api/users/profile
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "username": "newusername",
  "phoneNumber": "+1234567890",
  "profileImage": "url_to_image"
}
Response: { success: true, user: {...} }
```

#### Change Password
```
PUT /api/users/change-password
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
Response: { success: true, message: "Password changed successfully" }
```

#### Get All Users (Admin Only)
```
GET /api/users
Headers: { "Authorization": "Bearer <admin_token>" }
Query Params: ?role=user&isActive=true
Response: { success: true, users: [...] }
```

#### Get User by ID (Admin Only)
```
GET /api/users/:id
Headers: { "Authorization": "Bearer <admin_token>" }
Response: { success: true, user: {...} }
```

#### Toggle User Status (Admin Only)
```
PUT /api/users/:id/toggle-status
Headers: { "Authorization": "Bearer <admin_token>" }
Response: { success: true, user: {...} }
```

#### Delete User (Admin Only)
```
DELETE /api/users/:id
Headers: { "Authorization": "Bearer <admin_token>" }
Response: { success: true, deletedUser: {...} }
```

### Health Check
```
GET /api/health
Response: { success: true, message: "Backend server is running", timestamp: "..." }
```

## MongoDB Connection Troubleshooting

If you encounter MongoDB connection errors:

1. **Make sure MongoDB is running:**
   - Local: Start MongoDB service
   - Cloud: Check MongoDB Atlas connection string

2. **Verify .env configuration:**
   - Check MONGODB_URI format
   - Local format: `mongodb://localhost:27017/yathu-pubg`
   - Atlas format: `mongodb+srv://username:password@cluster.mongodb.net/yathu-pubg`

3. **Check network connectivity:**
   - Ensure MongoDB server is accessible
   - For Atlas, add your IP to whitelist

4. **Create test admin user:**
   - Once connected, create an admin account for testing

## Frontend Integration

Connect your frontend to this backend:

```javascript
const API_URL = 'http://localhost:5000/api';

// Example: Register user
const response = await fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'user123',
    email: 'user@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token); // Store JWT token

// Example: Authenticated request
const userResponse = await fetch(`${API_URL}/users/profile`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── productController.js  # Product management
│   ├── orderController.js    # Order management
│   └── userController.js     # User management
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── errorMiddleware.js    # Error handling
├── models/
│   ├── User.js               # User schema
│   ├── Product.js            # Product schema
│   └── Order.js              # Order schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── productRoutes.js      # Product endpoints
│   ├── orderRoutes.js        # Order endpoints
│   └── userRoutes.js         # User endpoints
├── uploads/                  # File uploads directory
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── server.js                 # Main server file
├── package.json              # Dependencies
└── README.md                 # This file
```

## Testing the API

You can test the API using:
- **Postman:** https://www.postman.com/downloads/
- **Thunder Client:** VS Code extension
- **curl:** Command line tool
- **Frontend application:** The React frontend

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/yathu-pubg |
| JWT_SECRET | Secret key for JWT tokens | your_secret_key_here |
| JWT_EXPIRE | Token expiration time | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| NODE_ENV | Environment mode | development/production |

## Security Best Practices

1. **Change JWT_SECRET in production**
   - Use a strong, random string

2. **Use HTTPS in production**
   - Enable SSL/TLS certificates

3. **Enable MongoDB authentication**
   - Set username and password

4. **Rate limiting**
   - Consider adding rate limiting middleware

5. **Input validation**
   - All endpoints validate user input

6. **CORS configuration**
   - Configured for frontend URL only

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **multer**: File upload handling
- **validator**: Data validation

## Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests (if configured)
```

## Support

For issues or questions:
1. Check MongoDB connection
2. Verify .env configuration
3. Check console logs for error messages
4. Ensure all dependencies are installed

## License

MIT

---

**Happy coding! 🚀**
