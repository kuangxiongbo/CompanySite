<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1bomHyxz2dg7CRDYqtiptqdmBvBdRxJoE

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
   `npm run dev`

## Backend Server

The application now includes a Node.js + Express backend with MySQL.

### Prerequisites
- MySQL local instance (default port 3306)
- Create database `olym_db` (or set `DB_NAME` in .env)

### Installation
1. Go to `server/`: `cd server`
2. Install dependencies: `npm install`
3. Configure `.env`:
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```
4. Start server: `npm start` (or `npm run dev` for nodemon)

### API Endpoints
- `POST /api/auth/login`: Admin login
- `GET /api/news`: Get news
- `GET /api/products`: Get products

