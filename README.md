# 🌟 Roxana Connect - Internship Platform

A full-stack MERN platform for discovering, tracking, and managing internship applications with advanced filtering and application tracking.

![Roxana Preview](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Key Features

- **Internship Discovery** - Browse and search internships with advanced filters (location, company, tags, deadlines)
- **Application Tracker** - Track application status with kanban-style dashboard
- **User Profiles** - Student profiles with skills, experience, and internship preferences
- **Social Feed** - Share posts, comment, and interact with other users
- **Admin Dashboard** - Manage internships, users, and platform content
- **Email Notifications** - Automated alerts for deadlines and application updates
- **Secure Authentication** - JWT-based auth with email verification and password reset

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

## 🎨 Tech Stack

**Frontend**: React, Redux, Tailwind CSS, Axios  
**Backend**: Node.js, Express, MongoDB, Mongoose  
**Auth**: JWT, bcrypt  
**Email**: Nodemailer  
**Storage**: Multer (file uploads)

## 🔒 Security

- JWT authentication with email verification
- Password hashing (bcrypt)
- Input validation & sanitization
- Protected routes & CORS
- Secure file uploads

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
