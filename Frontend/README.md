# Log Query Interface (React)

## Overview

The **Log Query Interface** is the frontend component of the **Log Ingestion and Querying System**. It provides a clean, developer-focused UI for viewing and filtering log data retrieved from the backend API.

## Key Features

- Real-time log display with automatic updates
- Advanced filtering and search capabilities
- Color-coded severity levels for quick identification
- Responsive design for various screen sizes

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS** - Styling
- **Fetch** - API client

## Prerequisites

- Node.js (>= 20.x)
- npm (>= 8.x) or yarn (>= 1.22.x)
- Backend API running locally (default: `http://localhost:3000`)

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone the repository
   cd Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**

   ```bash
    npm run dev
   ```

   The app will run at: `http://localhost:5173`

   OR you can also run production

4. **Start Production Server**

   ```bash
    npm run build

    npm run preview
         ```
   The app will run at: `http://localhost:4173`

## Available Scripts

```bash
# Development mode
npm run dev

# Production build
npm run build

# Check linting
npm run lint

# Run production build
npm run preview

```

## Key Design Features and Approach

### 1. Filter Bar

- **Search**

  - Full-text search across log messages
  - Regular expression support
  - Case-sensitive toggle

- **Filters**
  - Log level selection (`error`, `warn`, `info`, `debug`)
  - Resource ID filtering
  - Trace ID filtering
  - Date/Time range selection
  - Commit hash search

### 2. Log Display

- **Visualization Options**

  - Table view
  - Each logs having color codes to distinguish
  - Multiple Filters can be appplied dynamically

### 3. State Management , Styling and Query design

- simple state management (useState) to keep the frontend fast and efficent
- fetch api inside useEffect used to do the fetch the logs
- CSS used for the styling the React components
- Extra debounce function also included which can be used to delay the api call further to make the search more efficient
  
- **Color Coding**

  | Level | Color |
  |-------|--------|
  | ERROR | Red |
  | WARN | Yellow |
  | INFO | Blue |
  | DEBUG | Green |

## Component Structure

```src/
├── components/
│   ├── FilterBar
│   ├── LogTable
│   ├── LogRow
│── api/
├── pages/
├── styles/
├── types/
└── utils/
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

- **API Connection Issues**: Verify backend URL in `.env`
- **Build Errors**: Clear `node_modules` and reinstall
- **Performance Issues**: Check browser console for warnings
