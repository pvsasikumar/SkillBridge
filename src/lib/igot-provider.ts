import type { ExternalCourse, LearningProvider } from '@/types';
import { mockIGOTCourses, internalCourses } from '@/data/competencyFramework';

// ── iGOT Karmayogi Demo Provider ──────────────────────────────────

class IGOTKarmayogiProvider implements LearningProvider {
  type = 'igot' as const;
  name = 'iGOT Karmayogi (Demo)';

  async searchCourses(query: string, competencies: string[]): Promise<ExternalCourse[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const queryLower = query.toLowerCase();
    return mockIGOTCourses.filter(course => {
      const matchesQuery = !query || course.title.toLowerCase().includes(queryLower) || course.description.toLowerCase().includes(queryLower);
      const matchesCompetency = competencies.length === 0 || competencies.some(c => course.competencies.some(cc => cc.toLowerCase().includes(c.toLowerCase())));
      return matchesQuery && matchesCompetency;
    });
  }

  async getCourseDetails(courseId: string): Promise<ExternalCourse | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockIGOTCourses.find(c => c.id === courseId) || null;
  }
}

// ── Internal Learning Provider ────────────────────────────────────

class InternalLearningProvider implements LearningProvider {
  type = 'internal' as const;
  name = 'Internal Learning Library';

  async searchCourses(query: string, competencies: string[]): Promise<ExternalCourse[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const queryLower = query.toLowerCase();
    return internalCourses.filter(course => {
      const matchesQuery = !query || course.title.toLowerCase().includes(queryLower) || course.description.toLowerCase().includes(queryLower);
      const matchesCompetency = competencies.length === 0 || competencies.some(c => course.competencies.some(cc => cc.toLowerCase().includes(c.toLowerCase())));
      return matchesQuery && matchesCompetency;
    });
  }

  async getCourseDetails(courseId: string): Promise<ExternalCourse | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return internalCourses.find(c => c.id === courseId) || null;
  }
}

// ── Unified Course Search ─────────────────────────────────────────

export const learningProviders: LearningProvider[] = [
  new IGOTKarmayogiProvider(),
  new InternalLearningProvider(),
];

export async function searchAllCourses(query: string, competencies: string[]): Promise<ExternalCourse[]> {
  const results = await Promise.all(learningProviders.map(p => p.searchCourses(query, competencies)));
  return results.flat().sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

export async function getCourseRecommendations(competencyName: string, currentScore: number): Promise<ExternalCourse[]> {
  const allCourses = await searchAllCourses(competencyName, [competencyName]);

  return allCourses.map(course => {
    let relevanceScore = course.relevanceScore || 70;
    if (course.competencies.some(c => c.toLowerCase() === competencyName.toLowerCase())) {
      relevanceScore = Math.min(100, relevanceScore + 10);
    }
    if (currentScore < 40) {
      if (course.difficulty === 'Beginner') relevanceScore = Math.min(100, relevanceScore + 5);
    } else if (currentScore < 60) {
      if (course.difficulty === 'Intermediate') relevanceScore = Math.min(100, relevanceScore + 5);
    } else {
      if (course.difficulty === 'Advanced') relevanceScore = Math.min(100, relevanceScore + 5);
    }
    return { ...course, relevanceScore };
  }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}