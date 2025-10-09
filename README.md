# Secure Multi-Language Translator

A secure, production-ready translator application supporting Vietnamese, English, and Japanese translations using Google Cloud Translation API v3.

```
+----------------+     +------------------+     +----------------------+
|                |     |                  |     |                      |
|   Next.js UI   | --> |  Express Server  | --> |  Google Translation  |
|  (TypeScript)  |     |   (TypeScript)   |     |        API v3       |
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
- 🔒 Secure design: no API keys exposed client-side
- 🚀 Rate limiting and CORS protection
- 💾 In-memory caching with Redis support
- 📝 Batch translation for multi-sentence input
- 📚 Optional glossary support
- 🐳 Docker and Docker Compose support
- ✅ TypeScript throughout
- 🧪 Unit tests included

## Prerequisites

1. Node.js 18+ and pnpm
2. Google Cloud project with Translation API v3 enabled
3. Service Account with Translation API access

## Setup

1. Clone the repository
2. Set up environment variables:

   ```bash
   # Server
   cp server/.env.example server/.env
   # Edit server/.env with your project details

   # Frontend
   cp nextjs-app/.env.local.example nextjs-app/.env.local
   ```

3. Create service account key:
   
   ```bash
   # In Google Cloud Console:
   # 1. IAM & Admin > Service Accounts > Create Service Account
   # 2. Grant "Cloud Translation API User" role
   # 3. Create JSON key
   # 4. Save as server/keys/service_account.json
   ```

4. Install dependencies:

   ```bash
   # Server
   cd server
   pnpm install

   # Frontend
   cd ../nextjs-app
   pnpm install
   ```

## Running Locally

1. Start the server:
   ```bash
   cd server
   pnpm dev
   ```

2. In another terminal, start the frontend:
   ```bash
   cd nextjs-app
   pnpm dev
   ```

3. Visit http://localhost:3000

## Running with Docker Compose

```bash
docker-compose up --build
```

## Optional: Setting up a Glossary

1. Create a CSV file at `server/keys/glossary.csv`:
   ```csv
   source,target
   example,例
   test,テスト
   ```

2. Create the glossary in Google Cloud:
   ```bash
   gcloud translate glossaries create my-glossary \
     --languages=en,ja \
     --data-format=csv \
     --data-store-path=./server/keys/glossary.csv
   ```

3. Enable glossary in `server/.env`:
   ```
   USE_GLOSSARY=true
   GLOSSARY_ID=projects/your-project-id/locations/global/glossaries/my-glossary
   ```

## Security Notes

- API keys and credentials stay server-side
- CORS limits requests to configured origin
- Rate limiting prevents abuse
- Input validation on both client and server
- Error messages don't leak implementation details in production

## Troubleshooting

1. 403 Errors
   - Check service account permissions
   - Verify key file path in GOOGLE_APPLICATION_CREDENTIALS

2. Network Issues
   - Confirm CORS_ALLOW_ORIGIN matches frontend URL
   - Check if corporate firewall blocks Google APIs

3. Translation Failed
   - Verify Google Cloud project has billing enabled
   - Check API quotas in Google Cloud Console

## License

MIT