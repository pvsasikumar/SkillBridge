import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { AIInsight } from '@/components/ui/AIInsight';
import { practicalChallenge } from '@/data/mockData';
import { cn } from '@/lib/utils';

const evaluation = {
  technicalAccuracy: 78,
  problemSolving: 82,
  codeQuality: 70,
  overallCompetency: 77,
};

export default function PracticalAssessment() {
  const [code, setCode] = useState(`// Build a REST API
// Create a GET endpoint to retrieve all books
// Create a POST endpoint to add a new book

const express = require('express');
const app = express();

app.use(express.json());

const books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: '1984', author: 'George Orwell' },
];

// Your code here...

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{practicalChallenge.title}</h1>
          <p className="text-sm text-on-surface-variant mt-1">Practical Assessment · {practicalChallenge.difficulty}</p>
        </div>
        <Badge variant="primary">{practicalChallenge.skill}</Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Problem Statement" />
            <p className="text-sm text-on-surface-variant leading-relaxed">{practicalChallenge.description}</p>
          </Card>

          <Card>
            <CardHeader title="Requirements" />
            <div className="space-y-2.5">
              {practicalChallenge.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{req}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="none">
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-light">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-outline">terminal</span>
                <span className="text-sm font-medium text-gray-700">Submission</span>
              </div>
              <span className="text-xs text-outline">JavaScript / Node.js</span>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full h-80 p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
            />
            <div className="px-4 py-3 border-t border-outline-light flex justify-end">
              <Button onClick={() => setSubmitted(true)} disabled={submitted}>
                <span className="material-symbols-outlined text-[16px]">send</span>
                {submitted ? 'Submitted' : 'Submit for Evaluation'}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {submitted ? (
            <>
              <Card>
                <CardHeader title="AI Evaluation" subtitle="Automated code analysis" />
                <div className="space-y-5">
                  {[
                    { label: 'Technical Accuracy', value: evaluation.technicalAccuracy },
                    { label: 'Problem Solving', value: evaluation.problemSolving },
                    { label: 'Code Quality', value: evaluation.codeQuality },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className={cn(
                          'text-sm font-bold',
                          item.value >= 75 ? 'text-success-600' : item.value >= 50 ? 'text-warning-600' : 'text-danger-600'
                        )}>
                          {item.value}%
                        </span>
                      </div>
                      <Progress value={item.value} size="sm" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-outline-light">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-on-surface">Overall Competency</span>
                    <span className="text-2xl font-bold text-primary">{evaluation.overallCompetency}%</span>
                  </div>
                  <Progress value={evaluation.overallCompetency} size="md" className="mt-2" />
                </div>
              </Card>

              <AIInsight
                variant="success"
                message="Good problem-solving approach. Consider adding input validation and error handling middleware to improve code quality. Your REST API structure follows best practices."
                actionLabel="View Suggestions"
                onAction={() => {}}
              />

              <div className="flex gap-3">
                <Link to="/skills" className="flex-1">
                  <Button variant="outline" fullWidth>View Skills</Button>
                </Link>
                <Link to="/roadmap" className="flex-1">
                  <Button fullWidth>Continue Learning <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Button>
                </Link>
              </div>
            </>
          ) : (
            <Card>
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[20px] text-outline">code</span>
                </div>
                <h3 className="text-base font-semibold text-on-surface mb-1">Ready to evaluate</h3>
                <p className="text-sm text-on-surface-variant">Write your solution and submit for AI-powered evaluation</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
