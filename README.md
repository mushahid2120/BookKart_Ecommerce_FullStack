# BookKart - Full-Stack E-commerce Platform for Used Books

A modern, full-stack e-commerce platform built with Next.js 16, React, TypeScript, and Express.js, designed specifically for buying and selling used books. Features include user authentication, product management, shopping cart, wishlist, order processing, payment integration, and cloud-based image storage.

<a href="https://bookkartecommerce.netlify.app">
  <h2 style="display: inline;">Live Demo  🚀</h2>
</a>

## 🚀 Features

### Frontend Features
- **Modern UI/UX**: Built with Next.js 16, React, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Authentication**: JWT-based user authentication with email verification
- **Product Management**: Browse, search, filter, and sort books
- **Shopping Cart**: Add/remove items, quantity management
- **Wishlist**: Save favorite books for later
- **Order Management**: Complete order lifecycle from checkout to delivery
- **User Dashboard**: Profile management, order history, selling products
- **Real-time Search**: Instant search with debounced input
- **Image Upload**: Cloudinary integration for book images
- **Payment Integration**: Razorpay payment gateway
- **Email Notifications**: Automated emails via Brevo SMTP

### Backend Features
- **RESTful API**: Well-structured Express.js API with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with refresh token mechanism
- **Security**: Password hashing with bcrypt, input validation
- **File Upload**: Cloudinary for image storage and optimization
- **Payment Processing**: Razorpay integration for secure payments
- **Email Service**: Brevo SMTP for transactional emails
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin resource sharing configuration

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Storage**: Cloudinary
- **Payment**: Razorpay
- **Email**: Brevo (Sendinblue) SMTP
- **Validation**: Custom middleware

## 📁 Project Structure

```
BookKart_Ecommerce_FullStack/
├── backend/
│   ├── src/
│   │   ├── Config/
│   │   │   ├── cloudinaryConfig.ts    # Cloudinary configuration
│   │   │   ├── db.ts                   # MongoDB connection
│   │   │   ├── emailConfig.ts          # Brevo email configuration
│   │   │   └── env.ts                  # Environment variables
│   │   ├── Controller/
│   │   │   ├── addressController.ts    # Address management
│   │   │   ├── authController.ts       # Authentication logic
│   │   │   ├── cartController.ts       # Shopping cart operations
│   │   │   ├── orderController.ts      # Order processing
│   │   │   ├── productController.ts    # Product CRUD operations
│   │   │   ├── userController.ts       # User management
│   │   │   └── wishListController.ts   # Wishlist operations
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts       # JWT authentication middleware
│   │   ├── Model/
│   │   │   ├── Address.ts              # Address schema
│   │   │   ├── Cart.ts                 # Cart schema
│   │   │   ├── Order.ts                # Order schema
│   │   │   ├── Product.ts              # Product schema
│   │   │   ├── User.ts                 # User schema
│   │   │   └── WishList.ts             # Wishlist schema
│   │   ├── Route/
│   │   │   ├── addressRoutes.ts        # Address API routes
│   │   │   ├── authRoutes.ts           # Authentication routes
│   │   │   ├── cartRoutes.ts           # Cart API routes
│   │   │   ├── orderRoutes.ts          # Order API routes
│   │   │   ├── productRoutes.ts        # Product API routes
│   │   │   ├── userRoutes.ts           # User API routes
│   │   │   └── wishListRoutes.ts       # Wishlist API routes
│   │   ├── Utility/
│   │   │   ├── generateTokens.ts       # JWT token generation
│   │   │   └── response.ts             # Response utility functions
│   │   └── index.ts                    # Main server file
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── app/
    │   ├── globals.css                # Global styles
    │   ├── layout.tsx                 # Root layout
    │   ├── page.tsx                   # Home page
    │   ├── about-us/page.tsx          # About us page
    │   ├── account/
    │   │   ├── layout.tsx             # Account layout
    │   │   ├── order/page.tsx         # Order history
    │   │   ├── profile/page.tsx       # User profile
    │   │   ├── selling-products/page.tsx # Selling products
    │   │   └── wishlist/page.tsx      # Wishlist page
    │   ├── book-sell/page.tsx         # Book selling page
    │   ├── books/
    │   │   ├── page.tsx               # Books listing
    │   │   └── [id]/page.tsx          # Book detail page
    │   ├── checkout/cart/page.tsx     # Cart checkout
    │   ├── privacy-policy/page.tsx    # Privacy policy
    │   ├── resetpassword/[token]/page.tsx # Password reset
    │   ├── term-of-use/page.tsx       # Terms of use
    │   └── verifyemail/[token]/page.tsx # Email verification
    ├── components/
    │   ├── AccordianFeild.tsx         # Accordion component
    │   ├── Address.tsx                # Address form
    │   ├── AuthCheckWrapper.tsx       # Auth wrapper
    │   ├── BlogCard.tsx               # Blog card
    │   ├── BookCrousal.tsx            # Book carousel
    │   ├── BookList.tsx               # Book list
    │   ├── DrawerMenu.tsx             # Mobile menu
    │   ├── DropDownMenu.tsx           # Dropdown menu
    │   ├── Footer.tsx                 # Footer component
    │   ├── FooterCard.tsx             # Footer card
    │   ├── FootItem.tsx               # Footer item
    │   ├── Header.tsx                 # Header component
    │   ├── Hero.tsx                   # Hero section
    │   ├── LayoutWrapper.tsx          # Layout wrapper
    │   ├── LoginSignupDialouge.tsx    # Auth dialog
    │   ├── MenuItem.tsx               # Menu item
    │   ├── RadioGroupFeild.tsx        # Radio group
    │   ├── SelectFeild.tsx            # Select field
    │   ├── StepCard.tsx               # Step card
    │   ├── UserCard.tsx               # User card
    │   └── ui/                        # Shadcn/ui components
    ├── lib/
    │   ├── BookData.ts                # Book data utilities
    │   ├── books.json                 # Static book data
    │   ├── bookUploadTime.ts          # Upload time utilities
    │   ├── utils.ts                   # Utility functions
    │   └── types/                     # TypeScript types
    ├── public/Image/                  # Static images
    ├── store/
    │   ├── api.ts                     # RTK Query API
    │   ├── store.ts                   # Redux store
    │   └── slice/                     # Redux slices
    ├── components.json
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Cloudinary account (for image storage)
- Razorpay account (for payments)
- Brevo account (for email notifications)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bookkart
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   BREVO_API_KEY=your_brevo_api_key
   BREVO_EMAIL_FROM=your_email@example.com
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env.local` file in the frontend root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend application will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh access token
- `POST /verify-email` - Email verification
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset confirmation

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /account` - Delete user account

### Product Routes (`/api/products`)
- `GET /` - Get all products (with filters)
- `GET /:id` - Get product by ID
- `POST /` - Create new product (seller only)
- `PUT /:id` - Update product (seller only)
- `DELETE /:id` - Delete product (seller only)
- `GET /seller/:sellerId` - Get products by seller

### Cart Routes (`/api/cart`)
- `GET /` - Get user's cart
- `POST /` - Add item to cart
- `PUT /:productId` - Update cart item quantity
- `DELETE /:productId` - Remove item from cart
- `DELETE /` - Clear cart

### Wishlist Routes (`/api/wishlist`)
- `GET /` - Get user's wishlist
- `POST /` - Add item to wishlist
- `DELETE /:productId` - Remove item from wishlist

### Order Routes (`/api/orders`)
- `GET /` - Get user's orders
- `GET /:id` - Get order by ID
- `POST /` - Create new order
- `PUT /:id/status` - Update order status (admin/seller)
- `PUT /:id/cancel` - Cancel order

### Address Routes (`/api/addresses`)
- `GET /` - Get user's addresses
- `POST /` - Add new address
- `PUT /:id` - Update address
- `DELETE /:id` - Delete address

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Users register with email and password
2. **Email Verification**: Verification email sent to confirm account
3. **Login**: Returns access and refresh tokens
4. **Token Refresh**: Automatic token renewal using refresh tokens
5. **Protected Routes**: Middleware validates JWT tokens

## 💳 Payment Integration

Integrated with Razorpay for secure payment processing:

- **Order Creation**: Generates Razorpay order ID
- **Payment Verification**: Validates payment completion
- **Webhook Handling**: Processes payment confirmations
- **Order Updates**: Updates order status after successful payment

## 📧 Email Notifications

Automated email notifications using Brevo SMTP:

- **Welcome Email**: Sent after successful registration
- **Email Verification**: Account activation link
- **Password Reset**: Secure password reset instructions
- **Order Confirmations**: Order details and tracking information
- **Payment Receipts**: Payment confirmation emails

## 🖼️ Image Management

Cloudinary integration for efficient image handling:

- **Upload**: Secure image upload with optimization
- **Transformation**: Automatic image resizing and formatting
- **CDN Delivery**: Fast global image delivery
- **Storage Management**: Organized image storage and retrieval

## 🛡️ Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with tokens
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Cross-origin resource sharing setup
- **Rate Limiting**: API rate limiting for security
- **Error Handling**: Secure error responses without data leakage

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts for tablets
- **Desktop Experience**: Full desktop functionality
- **Touch-Friendly**: Optimized touch interactions
- **Performance**: Fast loading across all devices

## 🔄 State Management

- **Redux Toolkit**: Predictable state management
- **RTK Query**: Efficient API data fetching and caching
- **Persistent Storage**: Redux Persist for state persistence
- **Optimistic Updates**: Immediate UI updates with rollback on errors

## 🎨 UI/UX Features

- **Shadcn/ui Components**: Modern, accessible UI components
- **Tailwind CSS**: Utility-first styling approach
- **Dark/Light Theme**: Theme support with CSS variables
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling
- **Toast Notifications**: User feedback messages
- **Form Validation**: Real-time form validation

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start production server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@bookkart.com or create an issue in the repository.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database
- Cloudinary for image management
- Razorpay for payment processing
- Brevo for email services