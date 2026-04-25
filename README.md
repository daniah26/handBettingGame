# handBettingGame

A web-based **Hand Betting Game** built with the **MEAN stack** using Mahjong tiles. The player bets whether the next hand will be **Higher** or **Lower**, while the game tracks score, dynamic special tile values, reshuffles, and leaderboard rankings.

## Tech Stack

### Frontend
- Angular
- TypeScript
- SCSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Project Overview

This project was built as a technical assessment focused on:
- state management
- UI polish
- scalability and extension readiness

The game includes:
- a landing page with **New Game**
- a **Top 5 leaderboard**
- a gameplay page with:
  - current hand display
  - previous hand history
  - higher/lower betting
  - draw pile and discard pile counts
  - special tile value tracking
- a game over screen with final score
- leaderboard persistence using MongoDB

---

## Features

- Landing page with a polished UI
- New Game flow with player name popup
- Top 5 leaderboard
- Current hand display with tile visuals
- Previous hand history section
- Higher/Lower betting controls
- Draw pile and discard pile tracking
- Reshuffle tracking
- Dynamic values for Winds and Dragons
- Game over screen with final score
- Backend persistence using MongoDB

---

## Project Structure

```text
handBettingGame/
├── frontend/        # Angular frontend
└── backend/         # Node/Express/MongoDB backend
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/daniah26/handBettingGame.git
cd handBettingGame
```

### 2. Backend setup

Go into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URL= mongodb_connection_string
```

Run the backend server:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

### 3. Frontend setup

Open a new terminal and go into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the Angular app:

```bash
ng serve
```

The frontend should run on:

```text
http://localhost:4200
```

### 4. Run the project

Make sure both frontend and backend are running at the same time:

- frontend on `http://localhost:4200`
- backend on `http://localhost:5000`

Then open the frontend in your browser and start a new game.

---

## API Endpoints

### Game Endpoints

#### `POST /api/game/start`
Starts a new game.

#### `POST /api/game/bet`
Submits a bet and plays the next round.

#### `GET /api/game/:id`
Returns the current state of a specific game.

### Leaderboard Endpoints

#### `GET /api/leaderboard`
Returns the top 5 completed game scores.

---

## Backend Architecture

The backend is organized using a simple layered structure:

- **Routes** define API endpoints
- **Controllers** handle request/response logic
- **Services** contain the main game logic
- **Models** define MongoDB schemas

### Main Backend Services

#### `deck.service.js`
Handles:
- creating a fresh Mahjong deck
- shuffling the deck
- drawing tiles from the draw pile

#### `hand.service.js`
Handles:
- calculating tile values
- calculating hand totals
- comparing two hands

#### `tile-value.service.js`
Handles:
- increasing values for special tiles in winning hands
- decreasing values for special tiles in losing hands
- checking if any special tile reached 0 or 10

#### `game-engine.service.js`
Handles the full game flow:
- starting a new game
- playing a round
- updating score
- reshuffling logic
- updating tile values
- checking game over conditions
- generating leaderboard results

---

## Frontend

The frontend uses Angular standalone components and service-based API calls.

The main frontend pieces include:
- **Home Page**
- **Game Page**
- **Game API Service**

---

## What Was Handwritten vs AI-Assisted

### Frontend
The frontend was initially written manually and then enhanced with AI assistance.

AI was mainly used to help with:
- refining UI ideas
- troubleshooting Angular issues

### Backend
The backend was also initially written manually and then improved with AI assistance.

Since this was my first time using **Express.js**, I also did additional research while building the backend to better understand:
- Express routing
- controllers and services structure
- API design and connection with Angular

### Overall
This project was built through a combination of:
- handwritten code
- AI-assisted improvements
- personal research and learning, especially on the backend side

---

## Author

Developed by **Daniah Altekreeti**
