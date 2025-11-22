# 🎯 Roxana Connect

### Track. Collaborate. Succeed.

> **A modern, community-powered internship platform where students discover opportunities, track applications, and share insights together.**

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-5.0-764ABC?style=flat-square&logo=redux&logoColor=white)

---

## 💡 The Vision

Finding internships shouldn't be a lonely, overwhelming journey. **Roxana Connect** transforms the internship search into a collaborative, organized experience where students can:

- 🔍 **Discover** opportunities shared by their trusted network
- 📊 **Track** their application journey from saved to accepted
- 💬 **Share** insights, tips, and experiences with peers
- 🎓 **Learn** from others' successes and advice
- 🤝 **Connect** with fellow students and professionals

Think of it as your **personal internship command center** meets a **supportive community**.

---

## ✨ What Makes It Special

### 🎨 **Beautiful, Modern Design**
- Clean, professional UI with smooth animations
- Fully responsive design that works on all devices
- Consistent design language across all pages
- Custom gradients, glassmorphism effects, and micro-interactions
- LinkedIn-inspired skeleton loaders for seamless UX

### 🔍 **Smart Internship Discovery**
- Advanced filtering (company, location, type, tags, deadlines)
- Real-time search with instant results
- Visual deadline indicators (green → yellow → red)
- Anonymous insights showing community interest
- Sortable by deadline, date posted, or popularity

### 📊 **Visual Application Tracker**
- Beautiful Kanban-style board with drag-and-drop
- Track status: Not Applied → Applied → Interviewing → Offer → Rejected/Accepted
- Private notes for each application (encrypted)
- Progress statistics and success rate
- Quick actions and status updates
- Deadline reminders and notifications

### 👥 **Social & Collaborative**
- Share posts about internship experiences
- Comment and react to others' insights
- Like and bookmark valuable opportunities
- See real-time community engagement
- Anonymous tracking counts (privacy-focused)

### 🔐 **Enterprise-Grade Security**
- **Account-based rate limiting** (not IP-based)
- Progressive delays to prevent brute-force attacks
- JWT authentication with refresh tokens
- Email verification system
- Password reset with secure tokens
- Device fingerprinting for suspicious activity
- Automatic account lockout after 5 failed attempts
- CORS protection and security headers

---

## 🛠️ Technology Stack

### **Frontend** (Next.js 14 + React 18)
```
Next.js 14            →  React framework with App Router
React 18.2            →  Modern UI library with hooks
Redux Toolkit 2.0     →  State management with RTK Query
Tailwind CSS 3.4      →  Utility-first styling
Axios                 →  HTTP client with interceptors
Font Awesome          →  Icon library
React Hot Toast       →  Beautiful notifications
```

### **Backend** (Node.js + Express)
```
Node.js 20+           →  JavaScript runtime
Express 4.18          →  Web application framework
MongoDB + Mongoose    →  NoSQL database & ODM
JWT                   →  Secure authentication
Bcrypt.js             →  Password hashing (10 rounds)
Cloudinary            →  Image hosting & optimization
Multer                →  File upload handling
Nodemailer            →  Email notifications
Helmet                →  Security headers
```

### **Security & Performance**
```
Account Rate Limiting →  Progressive delays (2s → 5s → 20s → 2min)
Device Fingerprinting →  Track suspicious devices
Auto-Lockout System   →  15-minute account lock after 5 failures
Image Caching         →  Client-side profile image cache
Lazy Loading          →  Optimized component loading
Error Boundaries      →  Graceful error handling
```

---

## 🎯 Core Features

### **For Students**

#### 📱 **Home Feed**
- Unified feed of posts and internship opportunities
- Filter by type (All, Posts, Internships)
- Real-time updates and engagement metrics
- Create posts to share experiences

#### 🔍 **Internship Discovery**
- Browse all available opportunities
- Advanced search and filtering
- Deadline badges with visual indicators
- Save internships for later
- Track community interest (anonymous)

#### 📊 **Application Tracker**
- Visual Kanban board with 7 status columns
- Drag-and-drop status updates
- Private notes for each application
- Progress statistics dashboard
- Quick actions (edit, delete, view details)

#### 👤 **Profile Management**
- Professional profile with avatar upload
- Skills, experience, and education sections
- Social media links integration
- Privacy controls

#### 💬 **Community Posts**
- Share internship tips and experiences
- Comment and engage with others
- Like and react to posts
- Rich text formatting

### **For Admins**

#### 🛡️ **Admin Dashboard**
- User management (view, edit, delete)
- Role assignment (User/Admin)
- Level system (1, 2, 3)
- Account verification status
- User statistics and analytics

#### 📝 **Content Management**
- Create, edit, delete internships
- Moderate posts and comments
- Monitor platform activity
- Analytics and insights

---

## 🚀 Quick Start

### **Prerequisites**

- **Node.js** v20+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account for images ([Sign up](https://cloudinary.com/))
- **Git** ([Download](https://git-scm.com/))

### **Installation**

```bash
# 1. Clone the repository
git clone https://github.com/sohayb-elbakali/Roxana-connect.git
cd Roxana-connect

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client-next
npm install

# 4. Configure environment variables (see below)

# 5. Start development servers
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client-next
npm run dev

# Access at http://localhost:3000
```

---

## 🔧 Environment Configuration

### **Server** (`server/.env`)

```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer - optional for email verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Server
PORT=5000
NODE_ENV=development
```

### **Client** (`client-next/.env.local`)

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: Analytics, etc.
```

⚠️ **Important**: Never commit `.env` files to Git!

---

## 📁 Project Structure

```
roxana-connect/
├── client-next/                # Next.js Frontend
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (protected)/       # Protected routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React Components
│   │   ├── Internships/       # Internship features
│   │   ├── Tracker/           # Application tracker
│   │   ├── Posts/             # Social feed
│   │   ├── Users/             # Auth components
│   │   └── Home/              # Home feed
│   ├── lib/                   # Utilities
│   │   ├── redux/             # Redux store & slices
│   │   └── utils/             # Helper functions
│   └── public/                # Static assets
│
└── server/                     # Node.js Backend
    ├── models/                 # MongoDB Schemas
    │   ├── User.js
    │   ├── Profile.js
    │   ├── Internship.js
    │   ├── Post.js
    │   ├── ApplicationTracking.js
    │   └── AccountLockout.js   # Rate limiting
    ├── routes/                 # API Endpoints
    │   ├── users.js            # Auth routes
    │   ├── profiles.js         # Profile CRUD
    │   ├── internships.js      # Internship CRUD
    │   ├── posts.js            # Social posts
    │   ├── tracking.js         # Application tracking
    │   └── admin.js            # Admin routes
    ├── middleware/             # Custom Middleware
    │   ├── auth.js             # JWT verification
    │   └── accountRateLimit.js # Account lockout
    ├── config/                 # Configuration
    │   ├── cloudinary.js       # Image upload
    │   └── multer.js           # File handling
    └── utils/                  # Helper Functions
        ├── email.js            # Email service
        └── index.js            # Auth utilities
```

---

## 🌐 API Endpoints

### **Authentication** (`/api/users`)
- `POST /register` - Create new account
- `POST /login` - Login with email/password
- `POST /logout` - Logout (clear refresh token)
- `POST /refresh-token` - Get new access token
- `GET /verify-email/:token` - Verify email address
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password

### **Profiles** (`/api/profiles`)
- `GET /me` - Get current user profile
- `GET /` - Get all profiles
- `GET /user/:user_id` - Get specific user profile
- `POST /` - Create/update profile
- `POST /upload` - Upload profile image
- `PUT /experience` - Add experience
- `PUT /education` - Add education
- `DELETE /` - Delete account

### **Internships** (`/api/internships`)
- `GET /` - Get all internships (with filters)
- `GET /:id` - Get single internship
- `POST /` - Create internship
- `PUT /:id` - Update internship
- `DELETE /:id` - Delete internship
- `POST /:id/comment` - Add comment
- `PUT /:id/like` - Like/unlike internship

### **Application Tracking** (`/api/tracking`)
- `GET /` - Get user's tracked applications
- `POST /` - Track new internship
- `PUT /:id` - Update tracking status
- `PUT /:id/notes` - Update private notes
- `DELETE /:id` - Untrack internship

### **Posts** (`/api/posts`)
- `GET /` - Get all posts
- `GET /:id` - Get single post
- `POST /` - Create post
- `DELETE /:id` - Delete post
- `POST /:id/comment` - Add comment
- `PUT /:id/like` - Like post
- `PUT /:id/unlike` - Unlike post

### **Admin** (`/api/admin`)
- `GET /stats` - Platform statistics
- `GET /users` - Get all users (paginated)
- `PUT /users/:id/role` - Update user role
- `PUT /users/:id/level` - Update user level
- `DELETE /users/:id` - Delete user

---

## 🔒 Security Features

### **Account-Based Rate Limiting**
- **Progressive Delays**: 2s → 5s → 20s → 2min
- **Account Lockout**: 15 minutes after 5 failed attempts
- **Device Fingerprinting**: Track suspicious devices
- **Auto-Recovery**: Records expire automatically
- **CAPTCHA Ready**: Integration flags for frontend

### **Authentication & Authorization**
- **JWT Tokens**: Access (15min) + Refresh (7 days)
- **Email Verification**: Required before full access
- **Password Security**: Bcrypt with 10 salt rounds
- **Role-Based Access**: User/Admin permissions
- **Protected Routes**: Server & client-side guards

### **Data Protection**
- **Input Validation**: Express-validator on all inputs
- **SQL Injection Prevention**: Mongoose ODM
- **XSS Protection**: Helmet.js security headers
- **CORS Configuration**: Controlled origins
- **File Upload Security**: Type and size validation

📖 **Full Documentation**: See [ACCOUNT_LOCKOUT_SYSTEM.md](./ACCOUNT_LOCKOUT_SYSTEM.md)

---

## 🎨 Design Philosophy

### **User Experience**
- **Consistency**: Unified design language across all pages
- **Simplicity**: Clean, intuitive interfaces
- **Feedback**: Immediate visual feedback on all actions
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized loading with skeleton screens

### **Visual Design**
- **Color Palette**: Blue (#2563EB) as primary, professional grays
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins
- **Icons**: Font Awesome for consistency
- **Animations**: Subtle, purposeful transitions

---

## 🚀 Deployment

### **Frontend** (Vercel/Netlify)
```bash
cd client-next
npm run build
# Deploy dist/ folder
```

### **Backend** (Railway/Render)
```bash
cd server
# Set environment variables in platform
# Deploy with auto-build
```

### **Database** (MongoDB Atlas)
- Already cloud-hosted
- Configure IP whitelist
- Set up backup schedule

📖 **Detailed Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🧪 Testing

### **Manual Testing**
```bash
# Test account lockout
1. Go to http://localhost:3000/login
2. Enter wrong password 5 times
3. Observe progressive delays
4. Account locks after 5th attempt
```

### **Database Verification**
```bash
# Check MongoDB collections
- users
- profiles
- internships
- posts
- applicationtrackings
- accountlockouts (rate limiting)
```

---

## 🐛 Troubleshooting

### **Common Issues**

**MongoDB Connection Error**
```bash
# Check connection string in .env
# Verify IP whitelist in MongoDB Atlas
# Ensure network access is configured
```

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Module Not Found**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Image Upload Fails**
```bash
# Verify Cloudinary credentials in .env
# Check file size (max 5MB)
# Ensure file type is image/*
```

---

## 📚 Additional Documentation

- [ACCOUNT_LOCKOUT_SYSTEM.md](./ACCOUNT_LOCKOUT_SYSTEM.md) - Security system details
- [SYSTEM_VERIFICATION.md](./SYSTEM_VERIFICATION.md) - Verification checklist
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide (if exists)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Contribution Guidelines**
- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

---

## 👨‍💻 Author

**Sohayb El Bakali**
- GitHub: [@sohayb-elbakali](https://github.com/sohayb-elbakali)
- LinkedIn: [Sohayb El Bakali](https://linkedin.com/in/sohayb-elbakali)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Hosting and deployment
- **MongoDB** - Flexible database solution
- **Cloudinary** - Image hosting service
- **Font Awesome** - Icon library
- **Tailwind CSS** - Utility-first CSS framework

---

## 📊 Project Stats

- **Total Lines of Code**: ~15,000+
- **Components**: 50+
- **API Endpoints**: 40+
- **Database Models**: 7
- **Security Features**: 10+

---

⭐ **Star this repo** if you find it helpful!  
🐛 **Report issues** on GitHub  
💡 **Suggest features** via Pull Requests

---

**Built with ❤️ by Sohayb El Bakali**
