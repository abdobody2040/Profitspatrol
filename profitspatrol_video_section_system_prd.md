# ProfitsPatrol — Video Section System PRD

## Overview
The Videos Section inside ProfitsPatrol should become one of the most addictive and educational parts of the app. The experience must feel like a premium mix between TikTok Kids + Duolingo + Roblox learning.

The video system should:
- Increase daily retention.
- Teach financial literacy visually.
- Encourage kids to complete lessons and gigs.
- Reward watch completion.
- Create viral/social moments.
- Support AI-generated educational content at scale.

Reference Brand DNA: energetic, playful, modern, gamified, bright, juicy UI. fileciteturn0file0

---

# 1. Core Video Categories

## A. Learning Shorts
Short-form vertical educational videos.

### Examples
- What is investing?
- Supply vs Demand
- How businesses make money
- Why saving matters
- Marketing tricks brands use
- How billionaires think
- Passive income explained for kids

### Specs
- Length: 15–60 seconds
- Format: 9:16 vertical
- Fast cuts
- Animated captions
- Sound effects
- XP reward on completion

### Rewards
- Watch full video = XP
- Quiz completion = PP Tokens
- Streak bonuses

---

## B. Challenge Videos
Interactive action-based content.

### Examples
- Sell lemonade challenge
- Save $5 this week
- Build a cardboard business sign
- Clean your room speedrun
- Family business challenge

### Gamification
Kids upload proof/photo.
Parents approve.
Users earn:
- XP
- PP Tokens
- Badges
- HQ upgrades

---

## C. Ollie Explains
Animated mascot-led educational content.

Ollie becomes the core AI personality of the platform.

### Video Style
- Pixar-inspired mascot animation
- Friendly voice
- Bright colorful background
- Floating charts and coins
- Gamified transitions

### Topics
- Inflation
- Stocks
- Entrepreneurship
- Negotiation
- Leadership
- Side hustles

---

## D. Parent Videos
Educational content aimed at parents.

### Topics
- Teaching kids money habits
- Allowance systems
- Entrepreneurship for children
- Screen time with educational value

### Goal
Increase trust and subscription conversion.

---

# 2. Video Feed Experience

## Layout
TikTok/Reels inspired feed.

### Features
- Infinite vertical scroll
- Auto-play
- Swipe up/down navigation
- Like/comment/share
- Save video
- Replay button
- Progress bar
- XP popup rewards
- Animated reactions

---

# 3. Gamification Layer

## Watch Rewards
### Example
Watch 90% of video:
- +10 XP
- +5 PP Tokens

Complete quiz:
- +20 XP
- +15 PP Tokens

Daily streak:
- Bonus multiplier

---

## Video Missions
Examples:
- Watch 3 finance videos
- Complete 2 quizzes
- Share a challenge video
- Finish a learning path

Rewards:
- Mystery boxes
- HQ furniture
- Avatar cosmetics
- Rare badges

---

# 4. AI Video Generation System

The app should support scalable AI-generated educational videos.

## Recommended AI Stack

### Script Generation
- OpenAI GPT-5.5
- Claude
- Gemini

### Video Generation
- Runway Gen-4
- OpenAI Sora
- Pika Labs
- Kling AI

### Voice Generation
- ElevenLabs
- PlayHT

### Captions & Editing
- CapCut API
- FFmpeg
- Remotion

---

# 5. Automated AI Video Pipeline

## Step 1 — Topic Selection
Admin selects:
- Category
- Difficulty
- Age group
- Duration

Example:
"Explain supply and demand to 10-year-olds in a funny way"

---

## Step 2 — AI Script Generation
AI generates:
- Hook
- Main explanation
- CTA
- Quiz questions
- Caption text

---

## Step 3 — Scene Breakdown
System auto-generates:
- Scene prompts
- Character actions
- Camera movement
- Backgrounds
- Animations

---

## Step 4 — Video Rendering
AI generates:
- Vertical video
- Voiceover
- Music
- Captions
- Motion graphics

---

## Step 5 — Upload to CDN
Store videos using:
- Cloudflare Stream
- AWS S3 + CloudFront
- Bunny CDN
- Mux

---

# 6. Content Recommendation Engine

The feed should adapt to:
- User age
- Interests
- Watch history
- Completion rate
- XP level
- Favorite topics

### Example
If a child watches:
- Entrepreneurship videos
- Lemonade stand content

Then recommend:
- Marketing lessons
- Negotiation content
- Sales challenge videos

---

# 7. Safety & Moderation

Critical because audience includes children.

## Requirements
- COPPA-safe
- AI moderation
- Parent controls
- Restricted comments
- No external links
- Safe uploads only
- Human moderation queue

### APIs
- OpenAI moderation
- AWS Rekognition
- Hive moderation

---

# 8. Video Quiz System

Every educational video can include quizzes.

## Quiz Types
- Multiple choice
- Tap correct answer
- Match terms
- Drag & drop
- True/false

### Rewards
Correct answer:
- XP
- PP Tokens
- Bonus streaks

---

# 9. Viral Growth Features

## Shareable Achievements
Users can share:
- XP milestones
- HQ upgrades
- Challenge wins
- Business pitches

Generate share cards automatically.

---

## Leaderboards
Track:
- Most videos watched
- Quiz accuracy
- Fastest learners
- Weekly XP

---

# 10. Monetization

## Subscription Features
Premium users unlock:
- Advanced lessons
- Exclusive challenges
- AI mentor videos
- Faster XP boosts
- Premium HQ items

---

## Sponsored Educational Content
Partner with:
- Banks
- STEM brands
- Educational companies

Must remain child-safe.

---

# 11. Admin Dashboard Features

Admins should be able to:
- Upload videos
- Auto-generate videos with AI
- Edit captions
- Manage rewards
- Schedule releases
- Track analytics
- Approve user submissions
- Moderate comments
- Create playlists
- Create learning paths

---

# 12. Analytics

Track:
- Watch time
- Completion rate
- Retention curves
- Most replayed moments
- Quiz accuracy
- Daily active users
- XP earned from videos
- Conversion to premium

---

# 13. UI/UX Requirements

## Design Style
- Bright gradients
- Rounded cards
- Smooth transitions
- Floating rewards
- Coin animations
- 3D iconography
- Large readable captions
- Ultra-responsive gestures

---

# 14. Content Themes

## Educational
- Saving
- Investing
- Entrepreneurship
- Leadership
- Productivity
- Communication
- Negotiation

---

## Fun Themes
- Meme finance
- Funny business skits
- Mini Shark Tank
- CEO roleplay
- Money myths
- Business experiments

---

# 15. Example AI Video Prompt

## Example Prompt

"Create a 35-second vertical educational video for children aged 9–12. Style should feel like Pixar mixed with TikTok. Explain supply and demand using umbrellas in a rainstorm. Include bright colors, fast-paced edits, funny sound effects, animated captions, and the ProfitsPatrol mascot Ollie. End with a quiz asking: 'What happens when demand goes up but supply stays low?'"

---

# 16. Future Features

## AI Personalized Tutor Videos
Generate custom videos based on:
- Child age
- Weak subjects
- XP level
- Attention span

---

## User Generated Videos
Kids can:
- Create business pitches
- Record challenge submissions
- Enter competitions
- Build mini brands

---

## Interactive Videos
Future version:
- Choose-your-own-business adventure
- Decision-based outcomes
- Interactive learning paths

---

# 17. MVP Priorities

## Phase 1
- Vertical video feed
- XP rewards
- Basic quizzes
- Admin upload panel
- Video analytics

## Phase 2
- AI-generated videos
- Personalized recommendations
- Challenges
- Social features

## Phase 3
- Interactive videos
- User-generated content
- AI tutor system
- Advanced monetization

---

# 18. Success Metrics

Target KPIs:
- 65%+ daily retention
- 30+ minutes average session
- 70% video completion
- 40% weekly streak retention
- 10% premium conversion

---

# Final Vision

The ProfitsPatrol video system should feel like:
- TikTok for financial education
- Roblox progression mechanics
- Duolingo-style rewards
- Disney/Pixar visual polish

The ultimate goal is to make children WANT to learn business, money, and entrepreneurship every day through entertainment-first educational content.

