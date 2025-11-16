# 🎯 Roxana Connect

### Track. Collaborate. Succeed.

> **A community-powered internship platform where students discover opportunities, track applications, and share insights together.**

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-4.2-764ABC?style=flat-square&logo=redux&logoColor=white)

---

## 💡 The Idea

Finding internships shouldn't be a lonely journey. **Roxana Connect** transforms the internship search into a collaborative experience where students:
- **Discover** opportunities shared by their trusted network
- **Track** their application journey from saved to accepted
- **Share** insights, tips, and experiences with peers
- **Learn** from others' successes and advice

Think of it as your personal internship command center meets a supportive community.

---

## ✨ What Makes It Special

### 🎨 Beautiful, Intuitive Design
- Modern UI with smooth animations powered by **Framer Motion**
- Responsive design that works seamlessly on all devices
- Custom gradient designs and micro-interactions
- Professional color schemes and typography

### 🔍 Smart Internship Discovery
- Advanced filtering (company, location, type, tags, deadlines)
- Real-time search with instant results
- Deadline badges with countdown indicators
- Anonymous insights showing how many students are interested

### 📊 Visual Application Tracker
- Kanban-style board with drag-and-drop status updates
- Track applications: Saved → Applied → Interviewing → Offer
- Private notes for each internship
- Progress statistics and success rate calculation
- Quick actions and keyboard shortcuts

### 👥 Social & Collaborative
- Share posts about internship experiences
- Comment and react to others' insights
- Like and save valuable internships
- See community engagement on each opportunity

### 🔐 Secure & Professional
- JWT authentication with email verification
- Role-based access control (User/Admin)
- Password reset with secure tokens
- Rate limiting and security headers
- Protected routes and CORS configuration

---

## 🛠️ Technology Stack

### Frontend Architecture
```
React 18.2.0          →  Modern UI library with hooks
Redux + Redux Thunk   →  Centralized state management
React Router v6       →  Client-side routing
Tailwind CSS 3.4      →  Utility-first styling
Framer Motion         →  Smooth animations
Axios                 →  HTTP client with interceptors
React Toastify        →  Beautiful notifications
```

### Backend Architecture
```
Node.js 20+           →  JavaScript runtime
Express 4.18          →  Web application framework
MongoDB + Mongoose    →  NoSQL database & ODM
JWT                   →  Secure authentication
Bcrypt.js             →  Password hashing
Multer                →  File upload handling
Nodemailer            →  Email notifications
Helmet                →  Security headers
Express Rate Limit    →  API rate limiting
```

### Development Tools
```
Nodemon               →  Auto-restart on changes
Concurrently          →  Run multiple scripts
ESLint                →  Code quality
Git                   →  Version control
```

---

## 🎯 Core Features

### For Students
- **Internship Feed** - Browse opportunities with smart filters
- **Application Tracker** - Manage your entire application pipeline
- **Personal Profile** - Showcase skills, experience, and projects
- **Social Posts** - Share tips and learn from peers
- **Saved Internships** - Bookmark opportunities for later

### For Admins
- **Content Management** - Add/edit/delete internships
- **User Management** - Monitor and manage user accounts
- **Analytics Dashboard** - Track platform usage
- **Moderation Tools** - Manage posts and comments

### Technical Highlights
- **Real-time Updates** - Instant feedback on all actions
- **Optimistic UI** - Fast, responsive user experience
- **Smart Caching** - Efficient data loading and updates
- **Error Handling** - Graceful error messages
- **Form Validation** - Client & server-side validation
- **Image Optimization** - Efficient profile picture handling

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+), MongoDB Atlas account, Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/sohayb-elbakali/Roxana-connect.git
cd Roxana-connect

# 2. Install dependencies
npm run install-all

# 3. Configure MongoDB
cp server/config/config.template.json server/config/default.json
# Edit default.json with your MongoDB URI

# 4. Start development
npm run dev

# Access at http://localhost:3000
```

## 🔧 Configuration

### MongoDB Setup

1. Create MongoDB Atlas cluster
2. Get connection string
3. Update `server/config/default.json`:

```json
{
  "mongoURI": "your-mongodb-uri",
  "jwtSecret": "your-secret-key"
}
```

⚠️ Never commit credentials to Git

## 📁 Project Structure

```
roxana/
├── client/                 # React Frontend
│   └── src/
│       ├── components/     # UI Components
│       │   ├── Internships/  # Internship features
│       │   ├── Tracker/      # Application tracker
│       │   ├── Filters/      # Search & filters
│       │   └── Posts/        # Social feed
│       └── redux/          # State management
└── server/                 # Node.js Backend
    ├── models/             # MongoDB schemas
    ├── routes/             # API endpoints
    └── utils/              # Helper functions
```

## 🛠️ Scripts

```bash
npm run dev           # Start development (client + server)
npm run install-all   # Install all dependencies
npm run build         # Build for production
```

## 🌐 API Endpoints

- **Auth**: `/api/users/register`, `/api/users/login`, `/api/users/verify-email`
- **Internships**: `/api/internships` (CRUD, search, filter)
- **Tracking**: `/api/tracking` (create, update, delete applications)
- **Profiles**: `/api/profiles` (CRUD, experience, education)
- **Posts**: `/api/posts` (create, comment, like)
- **Admin**: `/api/admin` (user & internship management)

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth with refresh tokens
- **Email Verification** - Confirm user identity before access
- **Password Security** - Bcrypt hashing with salt rounds
- **Rate Limiting** - Prevent abuse with request throttling
- **Input Validation** - Express-validator for data sanitization
- **CORS Protection** - Controlled cross-origin requests
- **Security Headers** - Helmet.js for HTTP security
- **Protected Routes** - Server & client-side route guards
- **File Upload Security** - Multer with file type validation

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy**:
- Frontend: Vercel/Netlify
- Backend: Railway/Render
- Database: MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 🐛 Troubleshooting

- **MongoDB Error**: Check connection string and IP whitelist
- **Port in use**: Kill process on port 3000/4000
- **Module issues**: Run `npm cache clean --force && npm install`

## 👨‍💻 Author

**Sohayb El Bakali** - [GitHub](https://github.com/sohayb-elbakali)

## 📄 License

MIT License

---

⭐ Star this repo if you find it helpful!
