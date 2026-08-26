import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AIInsight } from '@/components/ui/AIInsight';
import { SkillCard } from '@/components/ui/SkillIndicator';
import { CompetencyChart } from '@/components/charts/CompetencyChart';
import { studentSkills, skillCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function SkillGap() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...skillCategories];
  const filtered = activeCategory === 'All'
    ? studentSkills
    : studentSkills.filter(s => s.category === activeCategory);

  const gaps = studentSkills.filter(s => s.requiredLevel > s.currentLevel);
  const totalGap = gaps.reduce((a, s) => a + (s.requiredLevel - s.currentLevel), 0);

  const radarData = studentSkills.map(s => ({
    skill: s.name,
    current: s.currentLevel,
    required: s.requiredLevel,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Your Competency Profile</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {gaps.length} skills need improvement · Total gap to close: {totalGap}%
          </p>
        </div>
        <Link to="/roadmap">
          <Button variant="gradient">
            View Training Path
            <span className="material-symbols-outlined text-[16px]">gps_fixed</span>
          </Button>
        </Link>
      </div>

      {/* Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Competency Radar" subtitle="Current vs required competency" />
          <CompetencyChart data={radarData} height={320} />
        </Card>

        <div className="space-y-4">
          <AIInsight
            variant="info"
            message="Based on your baseline assessment, you have strong fundamentals but need improvement in Survey Methodology, Sampling Techniques, and Data Quality Assurance."
            actionLabel="View Training Recommendations"
            onAction={() => {}}
          />

          <Card>
            <CardHeader title="Gap Summary" />
            <div className="space-y-3">
              {gaps.sort((a, b) => (b.requiredLevel - b.currentLevel) - (a.requiredLevel - a.currentLevel)).slice(0, 5).map(skill => {
                const gap = skill.requiredLevel - skill.currentLevel;
                return (
                  <div key={skill.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-danger-50 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-danger-600">-{gap}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-on-surface">{skill.name}</span>
                        <span className="text-xs text-on-surface-variant">{skill.currentLevel}% → {skill.requiredLevel}%</span>
                      </div>
                      <div className="mt-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-danger-400 rounded-full" style={{ width: `${skill.currentLevel}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Category filter */}
      <div>
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <span className="material-symbols-outlined text-[16px] text-outline shrink-0">filter_list</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === cat ? 'gradient-btn text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}
