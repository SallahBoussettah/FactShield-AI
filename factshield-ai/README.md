# FactShield AI

FactShield AI is a full-stack AI-powered web platform and browser extension designed to detect misinformation in real-time. The platform allows users to check content as they browse or upload documents, using cutting-edge NLP models to extract claims, assess credibility, highlight risky content, and provide trustworthy sources.

## Features

- Real-time misinformation detection
- Document and URL analysis
- Browser extension for on-the-fly fact-checking
- User history and analytics
- AI-powered fact-checking with credibility scores

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router
- **Backend**: Node.js with Express (planned)
- **Database**: PostgreSQL (planned)
- **AI**: Hugging Face Transformers API (planned)

## Tailwind CSS v4 Features

This project showcases several new features from Tailwind CSS v4:

- CSS-first configuration
- Dynamic utility values
- Container queries
- 3D transforms
- Expanded gradient APIs
- @starting-style support
- CSS theme variables

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/factshield-ai.git
   cd factshield-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
factshield-ai/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   ├── index.css        # Global styles with Tailwind CSS v4
│   └── main.tsx         # Entry point
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts       # Vite configuration with Tailwind CSS v4 plugin
```

## Browser Extension

The browser extension is currently in development. It will allow users to:

- Analyze web content in real-time
- Highlight potentially misleading information
- Provide credibility scores and alternative sources
- Sync with the user's dashboard

## License

[MIT](LICENSE)