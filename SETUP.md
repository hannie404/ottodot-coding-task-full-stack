# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google AI API key (from Google AI Studio)

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd math-problem-generator
npm install
```

## Step 2: Set Up Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up
3. Go to **SQL Editor** in the left sidebar
4. Copy the entire contents of `database.sql`
5. Paste and click **Run** to create all tables and policies

## Step 3: Get Your API Keys

### Supabase Keys
1. In Supabase, go to **Settings** → **API**
2. Copy your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

### Google AI Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the generated key

## Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_api_key
```

**Important:** Replace the placeholder values with your actual keys!

## Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Available

✅ **Core Features:**
- AI-generated Primary 5 math problems
- Real-time problem generation using Google Gemini
- Answer submission with instant feedback
- All data saved to Supabase

✅ **Enhanced Features:**
- **Difficulty Levels:** Easy, Medium, Hard
- **Problem Types:** Addition, Subtraction, Multiplication, Division, Mixed, General
- **Hints System:** AI-generated hints for each problem
- **Step-by-Step Solutions:** Detailed solution explanations
- **Score Tracking:** Points based on difficulty (Easy: 10, Medium: 20, Hard: 30)
- **Statistics Dashboard:** Track accuracy, streaks, and performance by difficulty
- **Problem History:** View your last 20 problems with results
- **Time Tracking:** Measures how long you take to solve each problem

## Troubleshooting

### "Failed to generate problem"
- Check that your `GOOGLE_API_KEY` is correctly set in `.env.local`
- Ensure you have internet connection
- Restart the dev server after changing `.env.local`

### "Failed to save to database"
- Verify your Supabase URL and Anon Key are correct
- Make sure you ran the `database.sql` script in Supabase
- Check that RLS policies are enabled in Supabase

### Tailwind styles not showing
- Clear your browser cache and hard refresh (Ctrl+Shift+R)
- Delete `.next` folder and restart: `rm -rf .next && npm run dev`

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-problem/  # Generate new math problems
│   │   ├── submit-answer/     # Submit and check answers
│   │   ├── history/           # Get problem history
│   │   └── stats/             # Get/update user statistics
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main application page
├── lib/
│   ├── gemini.ts              # Google AI integration
│   ├── supabaseClient.ts      # Supabase client setup
│   └── types.ts               # TypeScript type definitions
├── database.sql               # Complete database schema
└── README.md                  # Full documentation
```

## Development Tips

- Use the **Settings** panel to change difficulty and problem type
- Check **Stats** to see your performance breakdown
- View **History** to review past problems
- Hints cost you nothing - use them to learn!
- Solutions are revealed after submission to help you understand

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_API_KEY`
4. Deploy!

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Gemini 2.5 Flash
- **Deployment:** Vercel

---

Need help? Check the main [README.md](./README.md) for detailed documentation.
