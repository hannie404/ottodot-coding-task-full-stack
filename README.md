# Math Problem Generator - Developer Assessment Starter Kit
<img width="1195" height="765" alt="image" src="https://github.com/user-attachments/assets/39655443-7d75-4d23-998e-05ac70aabaea" />
<img width="1379" height="839" alt="image" src="https://github.com/user-attachments/assets/e9134b5b-832b-4615-8642-594b40f62c42" />

## Overview

This is a starter kit for building an AI-powered math problem generator application. The goal is to create a standalone prototype that uses AI to generate math word problems suitable for Primary 5 students, saves the problems and user submissions to a database, and provides personalized feedback.

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI Integration**: Google Generative AI (Gemini)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd math-problem-generator
```

### 2. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API to find your:
   - Project URL (starts with `https://`)
   - Anon/Public Key

### 3. Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database.sql`
3. Click "Run" to create the tables and policies

### 4. Get Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini

### 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your actual keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   GOOGLE_API_KEY=your_actual_google_api_key
   ```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Your Task

### 1. Implement Frontend Logic (`app/page.tsx`)

Complete the TODO sections in the main page component:

- **generateProblem**: Call your API route to generate a new math problem
- **submitAnswer**: Submit the user's answer and get feedback

### 2. Create Backend API Route (`app/api/math-problem/route.ts`)

Create a new API route that handles:

#### POST /api/math-problem (Generate Problem)
- Use Google's Gemini AI to generate a math word problem
- The AI should return JSON with:
  ```json
  {
    "problem_text": "A bakery sold 45 cupcakes...",
    "final_answer": 15
  }
  ```
- Save the problem to `math_problem_sessions` table
- Return the problem and session ID to the frontend

#### POST /api/math-problem/submit (Submit Answer)
- Receive the session ID and user's answer
- Check if the answer is correct
- Use AI to generate personalized feedback based on:
  - The original problem
  - The correct answer
  - The user's answer
  - Whether they got it right or wrong
- Save the submission to `math_problem_submissions` table
- Return the feedback and correctness to the frontend

### 3. Requirements Checklist

- [x] AI generates appropriate Primary 5 level math problems
- [x] Problems and answers are saved to Supabase
- [x] User submissions are saved with feedback
- [x] AI generates helpful, personalized feedback
- [x] UI is clean and mobile-responsive
- [x] Error handling for API failures
- [x] Loading states during API calls

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Assessment Submission

### Live Demo & Credentials

- **GitHub Repository**: [https://github.com/hannie404/ottodot-coding-task-full-stack](https://github.com/hannie404/ottodot-coding-task-full-stack)
- **Live Demo URL**: [https://m4th-problem-generator.vercel.app/](https://m4th-problem-generator.vercel.app/)

### Supabase Credentials for Testing

Reviewers can use these credentials to test the database integration:

```env
NEXT_PUBLIC_SUPABASE_URL="https://ducgocwgjtomwrsmgbju.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Y2dvY3dnanRvbXdyc21nYmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDQ3OTIsImV4cCI6MjA3NjQ4MDc5Mn0.PpaSkytM_ZmppMhl4ML3SrCzog6t-4dTMcqwRJetYvA"
```

**Note:** These are public credentials protected by Row Level Security (RLS) policies. They allow anonymous access for demonstration purposes, which is safe for this assessment.

### How to Test

1. Visit the live demo URL
2. Click "Generate New Problem" to create a math problem
3. Submit an answer to see AI-generated feedback
4. Check the Stats panel to see score tracking
5. View History to see past problems
6. Try different difficulty levels and problem types

## Implementation Notes

### My Implementation:

#### Core Features (All Implemented ✅)
1. **AI-Powered Problem Generation**: Using Google's Gemini 2.5 Flash model to generate contextual Singapore Primary 5 math problems
2. **Database Persistence**: All problems and submissions saved to Supabase with proper schemas and RLS policies
<img width="1918" height="277" alt="image" src="https://github.com/user-attachments/assets/09c3de7c-c4da-4084-9e23-90d4571fd8cd" />
<img width="1918" height="266" alt="image" src="https://github.com/user-attachments/assets/4b61e148-7c74-4cc3-977a-7815f22e32dd" />
<img width="1918" height="266" alt="image" src="https://github.com/user-attachments/assets/65833e02-3ad8-4627-b9ef-e77dac8345ef" />

3. **Personalized Feedback**: AI-generated feedback tailored to whether the answer is correct or incorrect
4. **Responsive UI**: Clean, mobile-first design using Tailwind CSS with gradient backgrounds and smooth animations
5. **Error Handling**: Comprehensive try-catch blocks with user-friendly error messages
6. **Loading States**: Visual feedback during all async operations with spinners and disabled buttons

#### Optional Features (All Implemented ✅)
1. **Difficulty Levels**: Easy, Medium, and Hard modes with appropriate problem complexity
   - Easy: 1-2 step problems with small numbers (10 points)
   - Medium: Multi-step problems with moderate numbers (20 points)  
   - Hard: Complex problems with abstract concepts (30 points)

2. **Problem Types**: Six different problem categories
   - Addition, Subtraction, Multiplication, Division
   - Mixed Operations
   - General (covers all Primary 5 topics: fractions, decimals, percentages, geometry, ratios, etc.)

3. **Score Tracking System**:
   - Total score with points based on difficulty
   - Accuracy percentage
   - Current streak and best streak tracking
   - Breakdown by difficulty level
   - Problem type statistics

4. **Problem History View**:
   - Last 20 problems with results
   - Shows difficulty, type, and submission status
   - Searchable and filterable

5. **Hints System**:
   - AI-generated helpful hints for each problem
   - Tracks number of hints used per problem
   - Hints don't give away the answer

6. **Step-by-Step Solutions**:
   - AI-generated solution breakdowns
   - Shown after submission
   - Collapsible for better UX

#### Technical Highlights:
- **Database Schema**: Enhanced with `difficulty`, `problem_type`, `hint_text`, `solution_steps` fields
- **User Stats Table**: Comprehensive tracking of user performance with JSONB for flexible stats
- **API Routes**: RESTful endpoints for problems, submissions, stats, and history
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Performance**: Indexed database queries for fast retrieval
- **Singapore Context**: All problems use local currency (SGD), places (NTUC, MRT), and scenarios familiar to Singapore students

#### Design Decisions:
1. **User Experience First**: Simple, intuitive interface with clear visual feedback
2. **Gamification**: Score, streaks, and achievements to encourage continued practice
3. **Educational Value**: Hints and solutions help students learn, not just get answers
4. **Mobile Responsive**: Works seamlessly on all screen sizes
5. **Progressive Disclosure**: Advanced features (stats, history) hidden in expandable panels

#### Challenges Overcome:
1. **Tailwind CSS Configuration**: Resolved module resolution issues by updating tsconfig.json and using Tailwind v3
2. **Dark Mode Override**: Removed default dark mode styles that were hiding the UI
3. **AI Response Parsing**: Robust JSON extraction from Gemini responses with fallback handling
4. **Database Schema Evolution**: Added enhanced schema while maintaining backward compatibility

#### Future Enhancements (If Time Permits):
- Multi-user support with authentication
- Leaderboard for competitive learning
- Timed challenges
- Achievement badges
- Export progress reports
- Teacher dashboard for monitoring students 

## Additional Features (Optional)

If you have time, consider adding:

- [x] Difficulty levels (Easy/Medium/Hard)
- [x] Problem history view
- [x] Score tracking
- [x] Different problem types (addition, subtraction, multiplication, division)
- [x] Hints system
- [x] Step-by-step solution explanations

---

Good luck with your assessment! 🎯