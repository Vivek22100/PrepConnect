# PrepConnect Frontend

This is the frontend for the PrepConnect platform, built with React and Vite.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher)

### Installation

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

To start the development server:
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production
To build the app for production:
```bash
npm run build
```

### Preview Production Build
To preview the production build locally:
```bash
npm run preview
```

## Project Structure
- `src/components/` - Reusable React components
- `src/pages/` - Page components for routing
- `src/context/` - React context providers
- `src/App.jsx` - Main app component and routes
- `src/main.jsx` - Entry point

## Proxy Setup
API requests to `/api` are proxied to the backend server at `http://localhost:5000` (see `vite.config.js`).

## License
MIT 