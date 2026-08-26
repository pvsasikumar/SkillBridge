import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { AIMessage } from '@/types';
import { cn } from '@/lib/utils';
import { allFacultyStudents, skillGapData, interventions } from '@/data/facultyData';
import Markdown from 'react-markdown';

const suggestedPrompts = [
  'Which topics should I teach this week?',
  'Why are students struggling with DSA?',
  'Create a 7-day intervention plan for Trees',
  'Which students need support in SQL?',
  'Summarize this week\'s class performance',
  'Create 10 practice questions for Trees',
];

function buildFacultyContext(): string {
  const totalStudents = allFacultyStudents.length;
  const avgCompetency = Math.round(allFacultyStudents.reduce((a, s) => a + s.overallCompetency, 0) / totalStudents);
  const criticalGaps = skillGapData.filter(s => s.status === 'critical');
  const activeInterventions = interventions.filter(i => i.status === 'active');

  return `You are an AI Faculty Assistant for SkillBridge. You help faculty analyze class performance and create interventions.

CLASS DATA:
- Total students: ${totalStudents}
- Average competency: ${avgCompetency}%
- Class: BCA III-A, Computer Science, 3rd Year

CRITICAL SKILL GAPS:
${criticalGaps.map(g => `- ${g.skill}: ${g.averageScore}% avg, ${g.gap}% gap, ${g.studentsAssessed} students assessed`).join('\n')}

ACTIVE INTERVENTIONS:
${activeInterventions.map(i => `- ${i.title}: ${i.assignedStudents} students, ${i.completedStudents} completed, +${i.improvement} pts improvement`).join('\n')}

TOPIC WEAKNESSES:
${skillGapData.flatMap(s => s.topics.filter(t => t.averageScore < 50).map(t => `- ${s.skill} > ${t.topic}: ${t.averageScore}% avg, ${t.studentsBelowThreshold} students below`)).join('\n')}

RULES:
- Only use the data provided. Never invent student names, scores, or statistics.
- Be specific and actionable in your recommendations.
- When suggesting interventions, always mention that faculty must review before assigning.
- Keep responses concise and focused.
- If asked to create a plan, format it clearly with day-by-day breakdown.`;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your **AI Faculty Assistant**. I can help you analyze class performance, identify struggling students, create intervention plans, and generate learning recommendations.\n\nAsk me anything about your class data!`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setError(null);

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversation = messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;

    const systemPrompt = buildFacultyContext();

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          context: {
            student: { name: 'Faculty', targetRole: 'Faculty Assistant' },
            competencies: {},
            skillGaps: [],
            currentTopic: 'Faculty Dashboard Analysis',
            currentLesson: '',
            recentPerformance: { quizScore: 0, recentMistakes: [] },
          },
          conversation: [{ role: 'system', content: systemPrompt }, ...conversation],
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError('Could not connect to AI Assistant. Please try again.');
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/faculty" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">AI Faculty Assistant</h1>
          <p className="text-sm text-on-surface-variant mt-1">Ask questions about your class performance and get AI-powered insights</p>
        </div>
      </div>

      <Card className="flex flex-col h-[calc(100vh-12rem)]" padding="none">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[85%] px-4 py-3 rounded-2xl',
                msg.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-surface-container-high text-on-surface rounded-bl-md'
              )}>
                {msg.role === 'assistant' ? (
                  <div className="ai-markdown"><Markdown>{msg.content}</Markdown></div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface-container-high text-on-surface px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] animate-spin text-primary">progress_activity</span>
                  <span className="text-sm text-on-surface-variant">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-2xl rounded-bl-md max-w-[85%]">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0">error</span>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div className="px-4 pb-2 pt-1 shrink-0">
          <div className="flex gap-1.5 flex-wrap">
            {suggestedPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-surface-container border border-outline-light rounded-full text-xs text-on-surface-variant hover:bg-surface-container-high hover:border-outline transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-outline-light shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your class performance..."
              rows={1}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 bg-surface-container border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary resize-none disabled:opacity-50 min-h-[38px] max-h-24"
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 96) + 'px';
              }}
            />
            <Button size="sm" onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading} className="h-[38px] w-[38px] px-0 shrink-0">
              <span className="material-symbols-outlined text-[14px]">send</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
