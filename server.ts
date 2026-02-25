import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import geminiHandler from './api/gemini';
import notionHandler from './api/notion';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock Vercel Request/Response objects for compatibility
const createVercelHandler = (handler: any) => {
    return async (req: express.Request, res: express.Response) => {
        try {
            // Vercel handlers expect (req, res) where res has status().json()
            // Express res object is compatible enough for our usage
            await handler(req, res);
        } catch (error) {
            console.error('API Handler Error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    };
};

// Register API routes
app.post('/api/gemini', createVercelHandler(geminiHandler));
app.post('/api/notion', createVercelHandler(notionHandler));

app.listen(PORT, () => {
    console.log(`
  🚀 Local API Server running at http://localhost:${PORT}
  - POST /api/gemini
  - POST /api/notion
  `);
});
