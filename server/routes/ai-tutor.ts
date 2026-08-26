import { Router } from 'express';
import { generateTutorResponse } from '../services/ai-provider.js';
import { buildSystemPrompt } from '../system-prompt.js';

const router = Router();

router.post('/api/ai/tutor', async (req, res) => {
  try {
    const { message, context, conversation } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    if (!context || typeof context !== 'object') {
      res.status(400).json({ error: 'Official context is required.' });
      return;
    }

    const systemPrompt = buildSystemPrompt({
      student: context.student || { name: 'Official', targetRole: 'Statistical Officer' },
      competencies: context.competencies || {},
      skillGaps: context.skillGaps || [],
      currentTopic: context.currentTopic || 'General',
      currentLesson: context.currentLesson || '',
      recentPerformance: context.recentPerformance || {
        quizScore: 0,
        recentMistakes: [],
      },
    });

    const result = await generateTutorResponse({
      message,
      context,
      conversation: Array.isArray(conversation) ? conversation : [],
      systemPrompt,
    });

    res.json({ message: result.message });
  } catch (error) {
    console.error('[AI Tutor Error]', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
