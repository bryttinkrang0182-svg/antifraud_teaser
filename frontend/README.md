# Antifraud Teaser - React Frontend

This is the React (Vite) frontend for the Antifraud Teaser application, converted from the original PHP frontend.

## Prerequisites

- Node.js 18+ 
- PHP 7.4+ with PDO MySQL extension
- MySQL database

## Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Start the PHP Backend

In a separate terminal, start the PHP built-in server from the project root:

```bash
cd /path/to/antifraud_teaser
php -S localhost:8000
```

### 3. Start the React Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
frontend/
├── public/
│   └── images/              # Static images
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Loader.jsx       # Loading spinner overlay
│   │   ├── Navigation.jsx   # Top navigation bar
│   │   ├── NoticeOverlay.jsx # Animated notice messages
│   │   └── VictimTiles.jsx  # Flip counter tiles
│   ├── pages/
│   │   ├── HomePage.jsx     # Form page (page 1)
│   │   └── VictimCountPage.jsx # Victim count page (page 2)
│   ├── services/
│   │   └── api.js           # API service for backend calls
│   ├── App.jsx              # Main app with routing
│   ├── App.css              # App-level styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## API Endpoints

The React frontend communicates with the PHP backend through a Vite proxy:

- `POST /api/submit.php` - Submit form data
- `GET /api/submit.php?action=count` - Get current victim count

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.
