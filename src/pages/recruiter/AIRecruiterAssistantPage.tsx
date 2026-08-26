import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRecruiter } from '@/context/RecruiterContext';
import { matchAllCandidates } from '@/data/recruiterData';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const suggestedPrompts = [
  'Show candidates who satisfy the Junior Full Stack Developer job requirements',
  'Which required skill eliminates the most candidates?',
  'Compare Karthik Menon and Divya Iyer',
  'Which candidates are near the threshold?',
  'Generate interview questions for the React skill',
];

export default function AIRecruiterAssistantPage() {
  const { jobs, getJobMatches, shortlisted, invitations } = useRecruiter();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI Recruiter Assistant. I can help you analyze candidates, compare skills, and generate interview questions. All my responses are based on verified SkillBridge competency data.\n\nHow can I help you today?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processQuery = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('satisfy') || q.includes('eligible') || q.includes('meet')) {
      const job = jobs[0];
      if (!job) return 'No jobs found. Create a job first.';
      const matches = matchAllCandidates(job);
      const eligible = matches.filter(m => m.category === 'eligible');
      if (eligible.length === 0) return 'No candidates currently satisfy all required criteria for this job.';
      const list = eligible.map(m => `- **${m.candidateName}** (${m.skillMatchScore}% match) — ${m.targetRole}`).join('\n');
      return `**Eligible candidates for ${job.title}:**\n\n${list}\n\nThese candidates satisfy ALL required competency thresholds. You can shortlist them from the Candidates page.`;
    }

    if (q.includes('eliminate') || q.includes('most') || q.includes('gap')) {
      const job = jobs[0];
      if (!job) return 'No jobs found.';
      const matches = matchAllCandidates(job);
      const skillElimination: Record<string, number> = {};
      for (const req of job.requiredSkills.filter(s => s.type === 'required')) {
        const eliminated = matches.filter(m => {
          const sm = m.skillMatches.find(s => s.skill === req.skill);
          return sm && !sm.meetsRequired;
        }).length;
        skillElimination[req.skill] = eliminated;
      }
      const sorted = Object.entries(skillElimination).sort((a, b) => b[1] - a[1]);
      if (sorted.length === 0) return 'All candidates satisfy the required skills.';
      const lines = sorted.map(([skill, count]) => `- **${skill}**: eliminates ${count} candidate${count !== 1 ? 's' : ''}`).join('\n');
      return `**Skill-based candidate elimination:**\n\n${lines}\n\nConsider lowering the threshold for "${sorted[0][0]}" or sourcing more candidates with that skill.`;
    }

    if (q.includes('compare')) {
      const names = shortlisted.length > 0 ? shortlisted : [];
      if (names.length < 2) return 'You need at least 2 shortlisted candidates to compare. Shortlist more candidates first.';
      const a = names[0];
      const b = names[1];
      return `**Candidate Comparison:**\n\n| Metric | ${a.candidateName} | ${b.candidateName} |\n|--------|---------|---------|\n| Skill Match | ${a.matchScore}% | ${b.matchScore}% |\n| Shortlisted | ${a.shortlistedAt} | ${b.shortlistedAt} |\n\nBoth candidates have been shortlisted. Visit the Candidates page for detailed skill-by-skill comparison.`;
    }

    if (q.includes('near') || q.includes('threshold') || q.includes('close')) {
      const job = jobs[0];
      if (!job) return 'No jobs found.';
      const matches = matchAllCandidates(job);
      const nearMatch = matches.filter(m => m.category === 'near-match');
      if (nearMatch.length === 0) return 'No near-match candidates found.';
      const list = nearMatch.map(m => {
        const gaps = m.failsRequired.map(f => `${f.skill} (gap: ${Math.abs(f.gap)} points)`).join(', ');
        return `- **${m.candidateName}** (${m.skillMatchScore}%) — Below threshold: ${gaps}`;
      }).join('\n');
      return `**Near-match candidates for ${job.title}:**\n\n${list}\n\nThese candidates are close to meeting all requirements. A small improvement in the flagged skill could make them eligible.`;
    }

    if (q.includes('interview question') || q.includes('generate question')) {
      return `**Sample Interview Questions for Full Stack Developer:**\n\n**React:**\n1. Explain the difference between useEffect and useLayoutEffect.\n2. How do you manage complex state in a React application?\n3. Describe your approach to optimizing React component re-renders.\n\n**Node.js:**\n1. How would you design a RESTful API with proper error handling?\n2. Explain middleware in Express.js and give examples.\n3. How do you handle authentication in a Node.js application?\n\n**SQL:**\n1. Explain the difference between INNER JOIN and LEFT JOIN.\n2. How would you optimize a slow database query?\n3. Describe database normalization.\n\n*These are suggestions based on job requirements. You can edit or remove any questions.*`;
    }

    if (q.includes('summary') || q.includes('summarize')) {
      const totalEligible = jobs.reduce((a, j) => a + matchAllCandidates(j).filter(m => m.category === 'eligible').length, 0);
      return `**Recruitment Summary:**\n\n- Active Jobs: ${jobs.filter(j => j.status === 'published').length}\n- Total Shortlisted: ${shortlisted.length}\n- Interviews Scheduled: ${invitations.filter(i => i.status === 'scheduled').length}\n- Total Eligible Candidates: ${totalEligible}\n\nVisit the Analytics page for detailed metrics.`;
    }

    return `I can help you with:\n\n- **Candidate matching**: "Show eligible candidates for a job"\n- **Skill analysis**: "Which skill eliminates the most candidates?"\n- **Candidate comparison**: "Compare shortlisted candidates"\n- **Near-match analysis**: "Show near-threshold candidates"\n- **Interview questions**: "Generate interview questions for React"\n- **Recruitment summary**: "Summarize recruitment status"\n\nAll responses are based on verified SkillBridge competency data.`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AIMessage = { id: `u_${Date.now()}`, role: 'user', content: input, timestamp: Date.now() };
    const response = processQuery(input);
    const aiMsg: AIMessage = { id: `a_${Date.now()}`, role: 'assistant', content: response, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">AI Recruiter Assistant</h1>
        <p className="text-sm text-on-surface-variant mt-1">Powered by verified SkillBridge competency data</p>
      </div>

      {/* Suggested Prompts */}
      <div className="mb-4 flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => { setInput(prompt); }}
            className="text-xs px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[12px]">lightbulb</span> {prompt}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <Card className="mb-4">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-primary">smart_toy</span>
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask about candidates, skills, or jobs..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={!input.trim()}>
          <span className="material-symbols-outlined text-[16px]">send</span>
        </Button>
      </div>
    </div>
  );
}
