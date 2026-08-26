const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface AITutorRequest {
  message: string;
  context: {
    student: { name: string; targetRole: string };
    competencies: Record<string, number>;
    skillGaps: string[];
    currentTopic: string;
    currentLesson: string;
    recentPerformance: {
      quizScore: number;
      recentMistakes: string[];
    };
  };
  conversation: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemPrompt: string;
}

export interface AITutorResponse {
  message: string;
}

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return apiKey;
}

function extractTextFromResponse(data: Record<string, unknown>): string {
  const candidates = data.candidates as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error('Invalid response structure from Gemini API');
  }

  const firstCandidate = candidates[0];
  const content = firstCandidate?.content as Record<string, unknown> | undefined;
  const parts = content?.parts as Array<Record<string, unknown>> | undefined;

  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error('Empty response from Gemini API');
  }

  const textParts = parts
    .filter((p): p is Record<string, unknown> & { text: string } => typeof p.text === 'string')
    .map((p) => p.text);

  const result = textParts.join('').trim();
  if (!result) {
    throw new Error('Empty response from Gemini API');
  }
  return result;
}

export async function generateTutorResponse(request: AITutorRequest): Promise<AITutorResponse> {
  const { message, conversation, systemPrompt } = request;
  const apiKey = getApiKey();

  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  for (const msg of conversation) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const errorObj = (errorBody as Record<string, unknown>)?.error as Record<string, unknown> | undefined;
      const errorMsg = errorObj?.message
        ? String(errorObj.message)
        : `HTTP ${response.status}`;

      switch (response.status) {
        case 400:
          throw new Error(`AI service error: ${errorMsg}`);
        case 401:
        case 403:
          throw new Error('Invalid API key. Please check your GEMINI_API_KEY configuration.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        case 500:
        case 502:
        case 503:
          throw new Error('AI service is temporarily unavailable. Please try again.');
        default:
          throw new Error(`AI service error: ${errorMsg}`);
      }
    }

    const data = (await response.json()) as Record<string, unknown>;
    const content = extractTextFromResponse(data);

    return { message: content };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        throw error;
      }
      if (error.message.includes('Invalid API key')) {
        throw error;
      }
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      if (error.message.includes('AI service')) {
        throw error;
      }
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        throw new Error('Cannot connect to AI service. Please check your network connection.');
      }
      if (error.message.includes('ETIMEDOUT')) {
        throw new Error('AI service request timed out. Please try again.');
      }
      throw error;
    }

    throw new Error('An unexpected error occurred while contacting the AI service.');
  }
}
