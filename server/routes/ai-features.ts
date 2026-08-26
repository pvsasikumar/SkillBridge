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

// ── Skill Extraction ────────────────────────────────────────────

router.post('/api/ai/extract-skills', async (req, res) => {
  try {
    const { courseName, platform, skillsLearned } = req.body;

    if (!courseName || typeof courseName !== 'string') {
      res.status(400).json({ error: 'Course name is required.' });
      return;
    }

    const systemPrompt = `You are a skill extraction assistant for SkillBridge, an AI-enabled competency building platform for India's Official Statistical System.

Given a course name, platform, and any skills the official mentioned, extract the likely technical skills and topics covered by the course.

Return ONLY a JSON array of objects with this exact structure:
[{"name": "Skill Name", "confidence": 0.9, "category": "Category"}]

Categories should be one of: Statistical Methods, Survey Design, Data Analysis, Data Quality, Official Statistics, Digital Tools, Research Methods, Professional Skills

Confidence should be between 0.5 and 1.0 based on how likely the skill is to be covered in the course.

Include 6-12 relevant skills. Be specific (e.g., "Stratified Sampling" not just "Sampling").`;

    const userMessage = `Course: ${courseName}
Platform: ${platform}
Skills mentioned by official: ${skillsLearned.join(', ')}

Extract the likely skills from this course for the official.`;

    const result = await generateTutorResponse({
      message: userMessage,
      context: {
        student: { name: 'Official', targetRole: 'Statistical Officer' },
        competencies: {},
        skillGaps: [],
        currentTopic: 'Skill Extraction',
        currentLesson: '',
        recentPerformance: { quizScore: 0, recentMistakes: [] },
      },
      conversation: [],
      systemPrompt,
    });

    const jsonMatch = result.message.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const skills = JSON.parse(jsonMatch[0]) as Array<{ name: string; confidence: number; category: string }>;
      res.json({ skills });
    } else {
      res.json({
        skills: skillsLearned.map((s: string) => ({
          name: s,
          confidence: 0.7,
          category: 'General',
        })),
      });
    }
  } catch (error) {
    console.error('[Skill Extraction Error]', error);
    res.json({
      skills: (req.body.skillsLearned || []).map((s: string) => ({
        name: s,
        confidence: 0.7,
        category: 'General',
      })),
    });
  }
});

// ── Assessment Generation ───────────────────────────────────────

router.post('/api/ai/generate-assessment', async (req, res) => {
  try {
    const { skills, targetRole, competencyProfile, courseName } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
      res.status(400).json({ error: 'At least one skill is required.' });
      return;
    }

    const systemPrompt = `You are an assessment generator for SkillBridge, an AI-enabled competency building platform for India's Official Statistical System.

Generate competency assessment questions for the given skills. The assessment must include THREE levels:
- LEVEL 1 (Knowledge): MCQs and conceptual questions
- LEVEL 2 (Application): Scenario-based questions
- LEVEL 3 (Practical): Data analysis challenges, debugging, or practical tasks

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "id": "q_1",
      "question": "The question text",
      "type": "mcq" | "scenario" | "code" | "debug" | "short-answer",
      "level": "knowledge" | "application" | "practical",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "code": "optional code snippet or formula",
      "scenario": "optional scenario description",
      "rubric": ["optional", "grading", "criteria"],
      "explanation": "Why this is the correct answer",
      "topic": "specific topic within the skill",
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  ],
  "skillTopics": {
    "SkillName": ["Topic1", "Topic2"]
  }
}

Generate 15-25 questions total across all skills. Distribute across difficulty levels (Easy, Medium, Hard) and assessment levels.

For statistical skills: include MCQs, formula application, data interpretation, and analysis challenges.
For non-statistical skills: include MCQs, scenarios, case studies, and short-answer questions.

Do NOT include the correct answer in the question response to the client. Only include it server-side.`;

    const userMessage = `Skills to assess: ${skills.join(', ')}
Target role: ${targetRole}
Course: ${courseName || 'Not specified'}
Official competency levels: ${JSON.stringify(competencyProfile)}

Generate a comprehensive competency assessment.`;

    const result = await generateTutorResponse({
      message: userMessage,
      context: {
        student: { name: 'Official', targetRole },
        competencies: competencyProfile,
        skillGaps: skills,
        currentTopic: 'Assessment Generation',
        currentLesson: '',
        recentPerformance: { quizScore: 0, recentMistakes: [] },
      },
      conversation: [],
      systemPrompt,
    });

    const jsonMatch = result.message.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as {
        questions: Array<{
          id: string;
          question: string;
          type: string;
          level: string;
          options?: string[];
          correctIndex?: number;
          code?: string;
          scenario?: string;
          rubric?: string[];
          explanation: string;
          topic: string;
          difficulty: string;
        }>;
        skillTopics: Record<string, string[]>;
      };
      res.json(parsed);
    } else {
      res.status(500).json({ error: 'Failed to generate assessment questions.' });
    }
  } catch (error) {
    console.error('[Assessment Generation Error]', error);
    res.status(500).json({ error: 'Failed to generate assessment.' });
  }
});

// ── Answer Evaluation ───────────────────────────────────────────

router.post('/api/ai/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, skill } = req.body;

    const systemPrompt = `You are an assessment evaluator for SkillBridge. Evaluate the official's answer.

Return ONLY a JSON object:
{
  "correct": true/false,
  "explanation": "Detailed explanation of the correct answer",
  "competencyDelta": number (positive for correct, negative for wrong, range -5 to +5)
}

Be fair in evaluation. For partial credit, give a positive but smaller delta.`;

    const userMessage = `Skill: ${skill}
Question: ${question.question}
Type: ${question.type}
Correct Answer Index: ${question.correctIndex}
Official's Answer: ${typeof answer === 'number' ? `Option ${answer}` : answer}
Explanation: ${question.explanation}`;

    const result = await generateTutorResponse({
      message: userMessage,
      context: {
        student: { name: 'Official', targetRole: 'Statistical Officer' },
        competencies: {},
        skillGaps: [],
        currentTopic: skill,
        currentLesson: '',
        recentPerformance: { quizScore: 0, recentMistakes: [] },
      },
      conversation: [],
      systemPrompt,
    });

    const jsonMatch = result.message.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      const correct = typeof answer === 'number' && question.correctIndex !== undefined
        ? answer === question.correctIndex
        : false;
      res.json({
        correct,
        explanation: question.explanation,
        competencyDelta: correct ? 3 : -2,
      });
    }
  } catch (error) {
    console.error('[Answer Evaluation Error]', error);
    const correct = typeof req.body.answer === 'number' && req.body.question.correctIndex !== undefined
      ? req.body.answer === req.body.question.correctIndex
      : false;
    res.json({
      correct,
      explanation: req.body.question.explanation,
      competencyDelta: correct ? 3 : -2,
    });
  }
});

// ── Interview Questions ─────────────────────────────────────────

router.post('/api/ai/generate-interview', async (req, res) => {
  try {
    const { skill, targetRole, competencyLevel, skillGaps } = req.body;

    const systemPrompt = `You are an interview preparation assistant for SkillBridge.

Generate interview questions based on the official's verified competency and target role.

Return ONLY a JSON object:
{
  "questions": [
    {
      "id": "iq_1",
      "question": "The interview question",
      "category": "knowledge" | "practical" | "problem-solving" | "communication",
      "skill": "the competency being assessed",
      "difficulty": "Easy" | "Medium" | "Hard",
      "expectedAnswer": "brief expected answer outline"
    }
  ]
}

Generate 8-12 questions across all categories. Include a mix of technical knowledge, practical scenarios, problem-solving, and communication questions.`;

    const userMessage = `Skill: ${skill}
Target role: ${targetRole}
Competency level: ${competencyLevel}%
Skill gaps: ${skillGaps.join(', ') || 'None'}

Generate interview preparation questions.`;

    const result = await generateTutorResponse({
      message: userMessage,
      context: {
        student: { name: 'Official', targetRole },
        competencies: { [skill]: competencyLevel },
        skillGaps,
        currentTopic: 'Interview Preparation',
        currentLesson: '',
        recentPerformance: { quizScore: competencyLevel, recentMistakes: skillGaps },
      },
      conversation: [],
      systemPrompt,
    });

    const jsonMatch = result.message.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      res.json({ questions: [] });
    }
  } catch (error) {
    console.error('[Interview Generation Error]', error);
    res.json({ questions: [] });
  }
});

// ── Interview Evaluation ────────────────────────────────────────

router.post('/api/ai/evaluate-interview', async (req, res) => {
  try {
    const { question, answer, category, skill } = req.body;

    const systemPrompt = `You are an interview evaluator for SkillBridge.

Evaluate the official's interview response on these criteria:
- Technical Knowledge
- Concept Clarity
- Problem Solving
- Communication
- Answer Relevance

Return ONLY a JSON object:
{
  "score": number (0-100),
  "feedback": "Detailed feedback on the response",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"]
}`;

    const userMessage = `Skill: ${skill}
Category: ${category}
Interview Question: ${question}
Official Answer: ${answer}

Evaluate this interview response.`;

    const result = await generateTutorResponse({
      message: userMessage,
      context: {
        student: { name: 'Official', targetRole: 'Statistical Officer' },
        competencies: {},
        skillGaps: [],
        currentTopic: 'Interview Evaluation',
        currentLesson: '',
        recentPerformance: { quizScore: 0, recentMistakes: [] },
      },
      conversation: [],
      systemPrompt,
    });

    const jsonMatch = result.message.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      res.json({
        score: 70,
        feedback: 'Response evaluated.',
        strengths: [],
        improvements: [],
      });
    }
  } catch (error) {
    console.error('[Interview Evaluation Error]', error);
    res.json({
      score: 70,
      feedback: 'Response evaluated.',
      strengths: [],
      improvements: [],
    });
  }
});

// ── Resume Generation ───────────────────────────────────────────

router.post('/api/ai/generate-resume', async (req, res) => {
  try {
    const { verifiedSkills, targetRole, education, certifications } = req.body;

    const systemPrompt = `You are a resume content generator for SkillBridge. Generate professional resume content based ONLY on verified data. Never invent achievements, projects, or experience.

Return ONLY a JSON object:
{
  "summary": "Professional summary paragraph",
  "technicalSkills": ["React.js — SkillBridge Verified, 84%"],
  "highlights": ["highlight1", "highlight2"]
}`;

    const userMessage = `Target role: ${targetRole}
Education: ${education}
Verified skills: ${verifiedSkills.map((s: { skill: string; score: number; level: string }) => `${s.skill} (${s.score}%, ${s.level})`).join(', ')}
Certifications: ${certifications.map((c: { courseName: string; platform: string }) => `${c.courseName} - ${c.platform}`).join(', ')}

Generate resume content.`;

    const result = await generateTutorResponse({
      message: userMessage,
      context: {
        student: { name: 'Official', targetRole },
        competencies: Object.fromEntries(verifiedSkills.map((s: { skill: string; score: number }) => [s.skill, s.score])),
        skillGaps: [],
        currentTopic: 'Resume Generation',
        currentLesson: '',
        recentPerformance: { quizScore: 0, recentMistakes: [] },
      },
      conversation: [],
      systemPrompt,
    });

    const jsonMatch = result.message.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      res.json({
        summary: '',
        technicalSkills: [],
        highlights: [],
      });
    }
  } catch (error) {
    console.error('[Resume Generation Error]', error);
    res.json({ summary: '', technicalSkills: [], highlights: [] });
  }
});

// ── AI Quiz Generation from Learning Materials ──────────────────

router.post('/api/ai/generate-quiz-from-material', async (req, res) => {
  try {
    const { materialTitle, materialContent, questionCount, difficulty, topic } = req.body;

    if (!materialTitle || typeof materialTitle !== 'string') {
      res.status(400).json({ error: 'Material title is required.' });
      return;
    }

    const systemPrompt = `You are a quiz generator for SkillBridge, an AI-enabled competency building platform for India's Official Statistical System.

Given a learning material title and content, generate quiz questions (MCQs) that test understanding of the material.

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "id": "q_1",
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is the correct answer",
      "topic": "specific topic within the material",
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  ]
}

Generate ${questionCount || 10} questions across difficulty levels (Easy, Medium, Hard).
Focus on statistical concepts, methodology, and practical application relevant to India's Official Statistical System.
Do NOT include the correct answer in the response to the client. Only include it server-side.`;

    const userMessage = `Material: ${materialTitle}
Topic: ${topic || 'General'}
Content preview: ${(materialContent || '').substring(0, 2000)}

Generate quiz questions based on this material.`;

    const result = await generateTutorResponse({
      message: userMessage,
      context: {
        student: { name: 'Trainer', targetRole: 'Capacity Building Officer' },
        competencies: {},
        skillGaps: [],
        currentTopic: 'Quiz Generation',
        currentLesson: '',
        recentPerformance: { quizScore: 0, recentMistakes: [] },
      },
      conversation: [],
      systemPrompt,
    });

    const jsonMatch = result.message.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as {
        questions: Array<{
          id: string;
          question: string;
          options: string[];
          correctIndex: number;
          explanation: string;
          topic: string;
          difficulty: string;
        }>;
      };
      res.json(parsed);
    } else {
      res.status(500).json({ error: 'Failed to generate quiz questions.' });
    }
  } catch (error) {
    console.error('[Quiz Generation Error]', error);
    res.status(500).json({ error: 'Failed to generate quiz from material.' });
  }
});

export default router;
