# 🌟 Roxana - Modern Social Media Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) social media application with modern UI/UX, real-time features, and enhanced security.

![Roxana Preview](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Core Features

- **User Authentication & Authorization** - Secure JWT-based authentication
- **Profile Management** - Complete user profiles with skills, experience, and education
- **Social Interactions** - Posts, comments, likes, and user connections
- **Real-time Updates** - Live notifications and updates
- **Image Upload** - Profile picture and media upload functionality
- **Responsive Design** - Beautiful UI that works on all devices

### 🎨 Modern UI/UX

- **Tailwind CSS** - Modern, utility-first CSS framework
- **Interactive Components** - Hover effects, animations, and smooth transitions
- **Dark/Light Theme Support** - Customizable appearance
- **Mobile-First Design** - Optimized for all screen sizes
- **Loading States** - Smooth user experience with proper feedback

### 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for user passwords
- **Input Validation** - Comprehensive form validation
- **CORS Protection** - Cross-origin resource sharing security
- **Environment Variables** - Secure configuration management

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/roxana.git
   cd roxana
   ```

2. **Install dependencies**

   ```bash
   # Install all dependencies (client + server)
   npm run install-all
   
   # Or install separately:
   # cd client && npm install
   # cd server && npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the template configuration
   cp server/config/config.template.json server/config/default.json
   
   # Edit the configuration file with your MongoDB credentials
   nano server/config/default.json
   ```

4. **Start the development servers**

   ```bash
   # Start both client and server
   npm run dev
   
   # Or start separately:
   # Client: npm run client
   # Server: npm run server
   ```

5. **Open your browser**
   - Frontend: <http://localhost:3000/roxana>
   - Backend API: <http://localhost:4000>

## 🔧 Configuration

### Environment Setup

Create a `.env` file in the server directory for production:

```env
NODE_ENV=production
PORT=4000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secure-jwt-secret
```

### Database Configuration

1. **MongoDB Atlas Setup**:
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Update `server/config/default.json`

2. **Local MongoDB** (Alternative):

   ```bash
   # Install MongoDB locally
   brew install mongodb-community  # macOS
   sudo apt-get install mongodb    # Ubuntu
   
   # Start MongoDB service
   sudo systemctl start mongod
   ```

### Security Configuration

⚠️ **Important Security Notes**:

- Never commit sensitive information to Git
- Use strong, unique JWT secrets
- Enable MongoDB Atlas security features
- Use environment variables in production

## 📁 Project Structure

```
roxana/
├── 📁 client/                    # React Frontend
│   ├── 📁 public/               # Static files
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   │   ├── 📁 Posts/        # Post-related components
│   │   │   ├── 📁 ProfileForms/ # Profile editing forms
│   │   │   ├── 📁 ProfileInfo/  # Profile display components
│   │   │   └── 📁 Users/        # User authentication components
│   │   ├── 📁 redux/            # Redux store and actions
│   │   │   └── 📁 modules/      # Redux modules
│   │   ├── 📁 utils/            # Utility functions
│   │   └── 📁 assets/           # Images and static assets
│   ├── package.json
│   └── tailwind.config.js       # Tailwind CSS configuration
├── 📁 server/                    # Node.js Backend
│   ├── 📁 config/               # Configuration files
│   ├── 📁 models/               # MongoDB models
│   ├── 📁 routes/               # API routes
│   ├── 📁 utils/                # Utility functions
│   ├── 📁 public/               # Static files and uploads
│   └── package.json
├── package.json                  # Root package.json
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🛠️ Available Scripts

### Root Level Commands

```bash
npm run install-all    # Install all dependencies
npm run dev           # Start both client and server
npm run build         # Build for production
npm start             # Start production server
```

### Client Commands

```bash
npm start             # Start React development server
npm run build         # Build for production
npm test              # Run tests
npm run eject         # Eject from Create React App
```

### Server Commands

```bash
npm start             # Start production server
npm run server        # Start development server with nodemon
npm run test          # Run server tests
```

## 🌐 API Endpoints

### Authentication

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users` - Get current user

### Profiles

- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/me` - Get current user profile
- `GET /api/profiles/user/:id` - Get profile by user ID
- `POST /api/profiles` - Create/update profile
- `PUT /api/profiles/experience` - Add experience
- `PUT /api/profiles/education` - Add education
- `DELETE /api/profiles/experience/:id` - Delete experience
- `DELETE /api/profiles/education/:id` - Delete education
- `POST /api/profiles/upload` - Upload profile image

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/like/:id` - Like post
- `PUT /api/posts/unlike/:id` - Unlike post
- `POST /api/posts/comment/:id` - Add comment
- `DELETE /api/posts/comment/:postId/:commentId` - Delete comment

## 🎨 Technologies Used

### Frontend

- **React 18.2.0** - Modern React with hooks
- **Redux 4.2.1** - State management
- **React Router DOM 6.20.1** - Client-side routing
- **Axios 1.6.2** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Toastify** - Toast notifications
- **Font Awesome** - Icons

### Backend

- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.0.3** - MongoDB ODM
- **JWT 9.0.2** - JSON Web Tokens
- **bcryptjs 2.4.3** - Password hashing
- **Multer 1.4.5** - File upload handling
- **Express Validator** - Input validation

### Development Tools

- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands
- **Cross-env** - Environment variables

## 🔒 Security Features

### Authentication & Authorization

- JWT-based authentication
- Secure password hashing with bcrypt
- Token expiration and refresh
- Protected routes and middleware

### Data Protection

- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)
- SQL injection prevention (MongoDB)

### File Upload Security

- File type validation
- File size limits
- Secure file storage
- Image processing and optimization

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build the React app
cd client
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### Backend Deployment (Heroku/Railway)

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy to Heroku
git push heroku main
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secure-jwt-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

6. **Push to the branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation if needed

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**

```bash
# Check your connection string
# Ensure MongoDB Atlas IP whitelist includes your IP
# Verify username and password
```

**2. Port Already in Use**

```bash
# Kill process using port 3000 or 4000
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

**3. Node Modules Issues**

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**4. Image Upload Not Working**

```bash
# Check file permissions
# Ensure upload directory exists
# Verify Multer configuration
```

### Getting Help

- Check the [Issues](https://github.com/yourusername/roxana/issues) page
- Search existing discussions
- Create a new issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sohayb El Bakali**

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Tailwind CSS for the styling framework
- All contributors and supporters


⭐ **Star this repository if you found it helpful!**
