import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('=== Gemini API Diagnostic ===');
console.log('GEMINI_API_KEY configured:', !!apiKey);
if (apiKey) {
  console.log('Key prefix:', apiKey.substring(0, 6) + '...');
  console.log('Key length:', apiKey.length);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'Say "hello" in one word.' }] }],
      generationConfig: { maxOutputTokens: 50 },
    }),
  });

  console.log('Status:', response.status, response.statusText);
  const bodyText = await response.text();
  console.log('Response body (first 500 chars):', bodyText.substring(0, 500));
} catch (err: unknown) {
  console.log('Fetch error:', err instanceof Error ? err.message : String(err));
}
