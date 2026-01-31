# 🎯 Collab League

**Collab League** is a modern web platform that connects **influencers/creators** with **brands** for authentic collaborations. It streamlines the entire collaboration lifecycle—from discovery to campaign completion.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat&logo=tailwindcss)

---

## 📖 What Does This Application Do?

Collab League is a **two-sided marketplace** for brand-creator collaborations:

### For Creators (Influencers)
- ✅ Create a public profile showcasing your niche, platform, and follower count
- 🔍 Get discovered by brands looking for collaboration
- 📥 Receive and manage collaboration requests
- 📊 Track active campaigns with built-in notes and timeline
- 🌐 Share your public profile URL for self-promotion

### For Brands (Businesses)
- 🔎 Discover creators using advanced filters (niche, platform, followers, etc.)
- 📤 Send collaboration requests with campaign details
- 💼 Manage multiple campaigns and track progress
- 💬 Communicate with creators via campaign notes
- ✅ Mark campaigns as completed or cancelled

### For Admins
- 👥 User management (view all users, ban/activate accounts)
- 📈 Platform statistics (total users, creators, businesses, campaigns)
- 🛡️ Full access to all campaigns for monitoring and moderation

### Key Features
- 🔐 Secure authentication with Supabase Auth
- 🎨 Beautiful, modern UI with dark mode support
- ⚡ Fast, server-rendered pages with Next.js 16
- 🔒 Row-Level Security (RLS) for data protection
- 📱 Responsive design (works on all devices)
- 🚀 Optimized for production deployment on Vercel

---

## 🤖 AI Tools / Models Used

This project was **built with AI assistance** but does **not use runtime AI models**.

### Development Assistance
- **Google Gemini (AI Assistant)**: Used for:
  - Architecture design and planning
  - Code generation and debugging
  - Database schema design
  - Component development
  - Deployment configuration

### No Runtime AI
- The application itself does **not** call any AI APIs (OpenAI, Claude, etc.)
- All functionality is powered by traditional web technologies
- Future phases could integrate AI for:
  - Creator-brand matching recommendations
  - Content analysis
  - Automated moderation

---

## 🚀 How to Run the Project Locally

### Prerequisites

Ensure you have the following installed:
- **Node.js** 20.x or later ([Download](https://nodejs.org/))
- **npm** 10.x or later (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** (free tier works) ([Sign up](https://supabase.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/chandu33444/Collab-League.git
cd Collab-League/collab-league-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Click **New Project**
   - Choose a name and strong database password
   - Wait for the project to initialize (~2 minutes)

2. **Run Database Migrations**
   - Go to **SQL Editor** in your Supabase dashboard
   - Run the migration files in order:
     ```
     supabase/migrations/001_initial_setup.sql
     supabase/migrations/002_profile_tables.sql
     supabase/migrations/003_collaboration_requests.sql
     supabase/migrations/004_campaigns.sql
     supabase/migrations/005_discovery.sql
     supabase/migrations/006_public_profiles.sql
     supabase/migrations/007_admin_system.sql
     supabase/migrations/010_fix_admin_recursion_final.sql
     ```
   - Copy and paste each file's content, click **Run**

3. **Get Your Supabase Credentials**
   - Go to **Settings** → **API**
   - Copy:
     - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Run the Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### Step 6: Create Your First Account

1. Visit **http://localhost:3000/signup**
2. Choose either **Creator** or **Business** account type
3. Fill in your details and sign up
4. Complete the onboarding flow
5. Start exploring!

### Step 7 (Optional): Promote Yourself to Admin

If you want to access the admin panel:

1. Open Supabase **SQL Editor**
2. Run the following SQL (replace with your email):
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
   ```
3. Sign out and sign back in
4. Visit **http://localhost:3000/dashboard/admin**

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.4** (React 19) - Full-stack framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions (future use)

### Deployment
- **Vercel** - Hosting and CI/CD

---

## 📁 Project Structure

```
collab-league-app/
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── dashboard/         # Protected dashboard pages
│   │   ├── actions/           # Server actions
│   │   └── ...
│   ├── components/            # React components
│   │   ├── landing/          # Landing page components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── discovery/        # Discovery/search components
│   │   ├── campaigns/        # Campaign management
│   │   └── admin/            # Admin panel components
│   ├── utils/                # Utility functions
│   │   └── supabase/         # Supabase client setup
│   └── types/                # TypeScript type definitions
├── supabase/
│   └── migrations/           # Database schema migrations
├── public/                   # Static assets
└── ...
```

---

## 🎨 Features by User Type

| Feature | Creator | Brand | Admin |
|---------|---------|-------|-------|
| Public Profile | ✅ | ❌ | ❌ |
| Search/Discovery | ❌ | ✅ | ✅ |
| Send Requests | ❌ | ✅ | ❌ |
| Receive Requests | ✅ | ❌ | ❌ |
| Campaign Notes | ✅ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Platform Analytics | ❌ | ❌ | ✅ |

---

## 🧪 Testing

### Run Build Locally
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

---

## 🚢 Deployment

See the deployment guide in the `docs` folder for detailed Vercel deployment instructions.

**Quick Deploy:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

---

## 🤝 Contributing

This is a learning project built with AI assistance. Feel free to:
- Fork the repository
- Submit pull requests
- Report issues
- Suggest features

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with assistance from **Google Gemini AI**
- Powered by **Supabase** and **Vercel**
- UI inspired by modern SaaS platforms

---

## 📞 Support

For questions or issues:
- Open a [GitHub Issue](https://github.com/chandu33444/Collab-League/issues)

---

**Made with 💜 and AI**
