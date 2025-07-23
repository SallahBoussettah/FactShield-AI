# FactShield AI Backend

Backend API for FactShield AI - An AI-powered platform for detecting misinformation in real-time.

## Features

- **Express.js** with TypeScript
- **PostgreSQL** database with connection pooling
- **JWT Authentication** with refresh tokens
- **Rate Limiting** and security middleware
- **Comprehensive logging** with Winston
- **Error handling** middleware
- **Testing** with Jest and Supertest
- **ESLint** for code quality

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd factshield-ai-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- Database credentials
- JWT secrets
- API keys for external services

5. Start PostgreSQL and create the database:
```sql
CREATE DATABASE factshield_ai;
```

### Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001` by default.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### API Endpoints

#### Health Check
- `GET /health` - Server health status

#### API Info
- `GET /api` - API information and available endpoints

### Database Schema

The application automatically creates the following tables:

- **users** - User accounts and settings
- **documents** - Uploaded document metadata
- **analyses** - Content analysis results
- **history** - User analysis history

### Environment Variables

See `.env.example` for all available configuration options.

### Testing

Run the test suite:
```bash
npm test
```

Generate coverage report:
```bash
npm test -- --coverage
```

### Project Structure

```
src/
├── config/          # Configuration files
│   └── database.ts  # Database connection
├── middleware/      # Express middleware
│   ├── errorHandler.ts
│   └── notFound.ts
├── tests/          # Test files
│   ├── setup.ts
│   └── app.test.ts
├── utils/          # Utility functions
│   └── logger.ts
└── index.ts        # Main application file
```

### Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- JWT token authentication
- Password hashing with bcrypt

### Logging

The application uses Winston for structured logging:
- Console output in development
- File logging in production
- Error and combined log files
- Request logging with Morgan

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Run linting before committing

## License

MIT License