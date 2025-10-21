# Multi-Language Translator

A modern web-based translation application built with Next.js and Express, featuring real-time translation using Azure Translator API.

```
+----------------+     +------------------+     +----------------------+
|                |     |                  |     |                      |
|   Next.js UI   | --> |  Express Server  | --> |   Azure Translator  |
|  (TypeScript)  |     |   (TypeScript)   |     |        API         |
|                |     |                  |     |                      |
+----------------+     +------------------+     +----------------------+
                             |
                             v
                      +-------------+
                      |             |
                      |  In-Memory  |
                      |    Cache    |
                      |             |
                      +-------------+
```

## Features

- 🌐 Supports Vietnamese (vi), English (en), and Japanese (ja)
- � Automatic language detection
- ⚡ Real-time translation with debouncing
- 🎨 Clean, modern UI inspired by Google Translate
- 🌙 Dark mode support
- � Secure design with server-side API key handling
- 💾 In-memory caching for better performance
- 📝 Character count and input validation
- 🔄 Language swap functionality
- 🗑️ Clear text functionality
- � Copy translation to clipboard
- 🚀 Rate limiting and CORS protection
- 🐳 Docker and Docker Compose support
- ✅ TypeScript throughout

## Tech Stack

- **Frontend**:
  - Next.js 14
  - React 18
  - TailwindCSS
  - TypeScript

- **Backend**:
  - Express
  - TypeScript
  - Azure Translator API
  - Memory Cache

## Prerequisites

1. Node.js 18+ and pnpm
2. Azure account with Translator API access
3. Azure Translator API key and region

## Environment Setup

1. Clone the repository
2. Set up environment variables:

```bash
# Server
cp server/.env.example server/.env

# Add to server/.env:
AZURE_TRANSLATOR_KEY=your_api_key
AZURE_TRANSLATOR_REGION=your_region
PORT=3001
CORS_ALLOW_ORIGIN=http://localhost:3000
CACHE_TTL_SECONDS=3600

# Frontend
cp nextjs-app/.env.example nextjs-app/.env.local
```

## Running Locally

1. Install dependencies and start the server:

```bash
cd server
pnpm install
pnpm dev
```

2. In another terminal, start the frontend:

```bash
cd nextjs-app
pnpm install
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Running with Docker Compose

```bash
docker-compose up --build
```

## Project Structure

```plaintext
.
├── nextjs-app/                # Frontend application
│   ├── app/                   # Next.js app directory
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main translation page
│   ├── components/           # React components
│   │   ├── LanguageSelector.tsx
│   │   └── TextArea.tsx
│   └── lib/                  # Shared utilities
│       ├── api.ts           # API client
│       ├── hooks.ts         # Custom React hooks
│       └── validators.ts    # Type definitions & validators
│
└── server/                    # Backend application
    ├── src/
    │   ├── config/          # Configuration
    │   ├── middlewares/     # Express middlewares
    │   ├── routes/          # API routes
    │   ├── services/        # Business logic
    │   └── utils/           # Utilities
    └── Dockerfile

## API Endpoints

### POST /api/translate
Translates text between supported languages.

**Request Body:**

```json
{
  "text": "string",
  "sourceLang": "auto" | "vi" | "en" | "ja",
  "targetLang": "vi" | "en" | "ja"
}
```

**Response:**

```json
{
  "translatedText": "string",
  "detectedLanguage": {
    "language": "string",
    "score": "number"
  },
  "cached": "boolean"
}
```

## Security Features

- Azure API keys securely stored server-side
- CORS protection with configurable origin
- Rate limiting to prevent abuse
- Input validation on both client and server
- Error handling with safe error messages

## Error Handling

The application includes comprehensive error handling:

- Invalid language pairs
- API rate limits
- Network errors
- Input validation
- Server errors

## License

MIT
