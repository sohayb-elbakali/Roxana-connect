# Roxana - Next.js Frontend

This is the Next.js migration of the Roxana frontend application.

## Quick Start

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
client-next/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Public auth routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── ...
│   ├── (protected)/       # Protected routes with layout
│   │   ├── home/
│   │   ├── posts/
│   │   ├── feed/
│   │   └── ...
│   ├── layout.tsx         # Root layout with Redux & Toast
│   └── page.tsx           # Landing page
├── components/            # All React components (from CRA)
├── lib/
│   ├── redux/            # Redux store and modules
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration
│   ├── styles/           # Theme and styles
│   ├── hooks/            # Custom hooks
│   └── providers/        # React providers
├── public/
│   └── assets/           # Static assets
└── middleware.ts         # Auth middleware

```

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Key Features

- ✅ Server-side rendering (SSR)
- ✅ Route-based authentication via middleware
- ✅ Redux state management
- ✅ Tailwind CSS styling
- ✅ TypeScript support
- ✅ All original components preserved


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Differences from CRA

1. **File-based routing** - No more React Router config
2. **Server components by default** - Add 'use client' when needed
3. **Middleware for auth** - Replaces Private route HOC
4. **Environment variables** - Must prefix with NEXT_PUBLIC_
5. **Image optimization** - Use next/image component

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
