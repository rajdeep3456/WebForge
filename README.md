# WebForge 🛠️✨

WebForge is an AI-powered web development platform that empowers users to generate, modify, and preview modern UI designs and code snippets through a seamless conversational AI interface. Stop writing boilerplate—just ask WebForge to forge it for you.

## 🌟 Features

- **AI-Powered Code Generation:** Leverage Google Gemini AI to generate complete React components and UI layouts instantly.
- **Interactive Live Preview:** See your generated UI designs rendered in real-time.
- **Project & Frame Management:** Organize your workspace with dedicated projects and versioned design frames.
- **Credit System:** Built-in user credit management for AI generation tasks.
- **Authentication:** Secure, seamless user authentication and session management powered by Clerk.
- **Serverless & Edge Ready:** Built for speed with Next.js App Router and edge-optimized data fetching.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Database:** [Neon Serverless Postgres](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI Integration:** [Google Gemini API](https://deepmind.google/technologies/gemini/)
- **Media Management:** [ImageKit](https://imagekit.io/)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed (v20+ recommended) and a package manager like `npm`, `yarn`, or `pnpm`.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/webforge.git
cd webforge
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of your project and add the following keys. You will need to create accounts with Clerk, Neon, Google (for Gemini), and ImageKit to retrieve these:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Neon Database
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# ImageKit (if applicable)
NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

### 4. Setup the Database
Push the Drizzle schema to your Neon Postgres database:
```bash
npm run db:push
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action!

## 📜 Scripts

- `npm run dev` - Starts the Next.js development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint to catch errors and enforce code style.
- `npm run db:push` - Synchronizes your database schema with Drizzle ORM.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
