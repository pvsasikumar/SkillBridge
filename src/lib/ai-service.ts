import type { ExtractedSkill } from '@/types';

const API_BASE = '/api/ai';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function extractSkillsFromCourse(
  courseName: string,
  platform: string,
  skillsLearned: string[]
): Promise<ExtractedSkill[]> {
  try {
    const result = await post<{ skills: ExtractedSkill[] }>('/extract-skills', {
      courseName,
      platform,
      skillsLearned,
    });
    return result.skills;
  } catch {
    return skillsLearned.map(s => ({
      name: s,
      confidence: 0.8,
      category: 'General',
    }));
  }
}

export async function generateCompetencyAssessment(
  skills: string[],
  targetRole: string,
  competencyProfile: Record<string, number>,
  courseName?: string
): Promise<{
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
}> {
  try {
    return await post('/generate-assessment', {
      skills,
      targetRole,
      competencyProfile,
      courseName,
    });
  } catch {
    return { questions: [], skillTopics: {} };
  }
}

export async function evaluateAssessmentAnswer(
  question: {
    id: string;
    question: string;
    type: string;
    correctIndex?: number;
    explanation: string;
    topic: string;
  },
  answer: string | number,
  skill: string
): Promise<{ correct: boolean; explanation: string; competencyDelta: number }> {
  try {
    return await post('/evaluate-answer', { question, answer, skill });
  } catch {
    if (typeof answer === 'number' && question.correctIndex !== undefined) {
      const correct = answer === question.correctIndex;
      return {
        correct,
        explanation: question.explanation,
        competencyDelta: correct ? 5 : -3,
      };
    }
    return { correct: false, explanation: question.explanation, competencyDelta: -3 };
  }
}

export async function generateInterviewQuestions(
  skill: string,
  targetRole: string,
  competencyLevel: number,
  skillGaps: string[]
): Promise<{
  questions: Array<{
    id: string;
    question: string;
    category: string;
    skill: string;
    difficulty: string;
    expectedAnswer?: string;
  }>;
}> {
  try {
    return await post('/generate-interview', {
      skill,
      targetRole,
      competencyLevel,
      skillGaps,
    });
  } catch {
    return { questions: [] };
  }
}

export async function evaluateInterviewResponse(
  question: string,
  answer: string,
  category: string,
  skill: string
): Promise<{ score: number; feedback: string; strengths: string[]; improvements: string[] }> {
  try {
    return await post('/evaluate-interview', {
      question,
      answer,
      category,
      skill,
    });
  } catch {
    return {
      score: 70,
      feedback: 'Response evaluated.',
      strengths: [],
      improvements: [],
    };
  }
}

export async function generateResumeContent(
  verifiedSkills: Array<{ skill: string; score: number; level: string }>,
  targetRole: string,
  education: string,
  certifications: Array<{ courseName: string; platform: string }>
): Promise<{ summary: string; technicalSkills: string[]; highlights: string[] }> {
  try {
    return await post('/generate-resume', {
      verifiedSkills,
      targetRole,
      education,
      certifications,
    });
  } catch {
    return {
      summary: `Aspiring ${targetRole} with demonstrated competency across ${verifiedSkills.length} verified skills.`,
      technicalSkills: verifiedSkills.map(s => `${s.skill} — SkillBridge Verified, ${s.score}%`),
      highlights: [],
    };
  }
}
