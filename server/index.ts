import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import aiTutorRouter from './routes/ai-tutor.js';
import aiFeaturesRouter from './routes/ai-features.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.use(aiTutorRouter);
app.use(aiFeaturesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SkillBridge AI Tutor' });
});

app.listen(PORT, () => {
  console.log(`[SkillBridge] AI Tutor server running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[SkillBridge] WARNING: GEMINI_API_KEY is not set. AI Tutor will return errors.');
  }
});
