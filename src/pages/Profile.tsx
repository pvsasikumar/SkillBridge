import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { currentUser } from '@/data/mockData';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: 'person' },
    { id: 'career', label: 'Career Goal', icon: 'gps_fixed' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'privacy', label: 'Privacy', icon: 'shield' },
    { id: 'preferences', label: 'Preferences', icon: 'language' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-on-surface">Profile & Settings</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <div className="text-center py-4">
              <Avatar name={currentUser.name} size="xl" className="mx-auto" />
              <h3 className="text-base font-semibold text-on-surface mt-3">{currentUser.name}</h3>
              <p className="text-sm text-on-surface-variant">{currentUser.email}</p>
              <p className="text-xs text-primary mt-1">{currentUser.careerGoal}</p>
            </div>
            <nav className="space-y-1 mt-4 border-t border-surface-container-high pt-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] ${activeTab === tab.id ? 'text-primary-500' : 'text-outline'}`}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader title="Personal Information" subtitle="Manage your account details" />
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Full Name" defaultValue={currentUser.name} icon={<span className="material-symbols-outlined text-[16px]">person</span>} />
                <Input label="Email" defaultValue={currentUser.email} icon={<span className="material-symbols-outlined text-[16px]">mail</span>} />
                <Select
                  label="Education"
                  defaultValue="bachelors"
                  options={[
                    { value: 'bachelors', label: "Bachelor's Degree" },
                    { value: 'masters', label: "Master's Degree" },
                    { value: 'diploma', label: 'Diploma' },
                  ]}
                />
                <Input label="Course / Program" defaultValue={currentUser.course} icon={<span className="material-symbols-outlined text-[16px]">menu_book</span>} />
                <Select
                  label="Experience Level"
                  defaultValue="intermediate"
                  options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                />
                <Input label="Year" defaultValue={currentUser.year} />
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex justify-end">
                <Button><span className="material-symbols-outlined text-[16px] mr-1">save</span> Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'career' && (
            <Card>
              <CardHeader title="Career Goal" subtitle="Your target career path" />
              <Select
                label="Target Role"
                defaultValue="full-stack"
                options={[
                  { value: 'full-stack', label: 'Full Stack Developer' },
                  { value: 'data-analyst', label: 'Data Analyst' },
                  { value: 'ai-ml', label: 'AI/ML Engineer' },
                  { value: 'cybersecurity', label: 'Cybersecurity Engineer' },
                  { value: 'cloud', label: 'Cloud Engineer' },
                  { value: 'ui-ux', label: 'UI/UX Designer' },
                  { value: 'business', label: 'Business Analyst' },
                ]}
              />
              <div className="mt-6 pt-4 border-t border-surface-container-high flex justify-end">
                <Button><span className="material-symbols-outlined text-[16px] mr-1">save</span> Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader title="Notification Settings" subtitle="Choose what notifications you receive" />
              <div className="space-y-4">
                {[
                  { label: 'New assessment available', desc: 'When a new quiz or assessment is ready', defaultChecked: true },
                  { label: 'Learning plan updated', desc: 'When your roadmap changes', defaultChecked: true },
                  { label: 'Skill gap detected', desc: 'When AI identifies a new competency gap', defaultChecked: true },
                  { label: 'Quiz completed', desc: 'After completing an assessment', defaultChecked: true },
                  { label: 'Competency improved', desc: 'When your skills improve', defaultChecked: false },
                  { label: 'Faculty assignments', desc: 'New tasks from faculty', defaultChecked: true },
                ].map(item => (
                  <div key={item.label} className="flex items-start justify-between p-3 rounded-xl hover:bg-surface-container">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                      <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex justify-end">
                <Button><span className="material-symbols-outlined text-[16px] mr-1">save</span> Save Settings</Button>
              </div>
            </Card>
          )}

          {activeTab === 'privacy' && (
            <Card>
              <CardHeader title="Privacy Settings" subtitle="Control your data and visibility" />
              <div className="space-y-4">
                {[
                  { label: 'Show profile to faculty', desc: 'Allow faculty to view your competency profile', defaultChecked: true },
                  { label: 'Show skill passport publicly', desc: 'Make your skill passport visible to others', defaultChecked: false },
                  { label: 'Share assessment results', desc: 'Include results in class analytics', defaultChecked: true },
                ].map(item => (
                  <div key={item.label} className="flex items-start justify-between p-3 rounded-xl hover:bg-surface-container">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                      <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex justify-end">
                <Button><span className="material-symbols-outlined text-[16px] mr-1">save</span> Save Settings</Button>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader title="Learning Preferences" subtitle="Customize your learning experience" />
              <div className="grid sm:grid-cols-2 gap-5">
                <Select
                  label="Language"
                  defaultValue="en"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'hi', label: 'Hindi' },
                  ]}
                />
                <Select
                  label="Learning Style"
                  defaultValue="mixed"
                  options={[
                    { value: 'video', label: 'Video' },
                    { value: 'reading', label: 'Reading' },
                    { value: 'practice', label: 'Practice' },
                    { value: 'mixed', label: 'Mixed' },
                  ]}
                />
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex justify-end">
                <Button><span className="material-symbols-outlined text-[16px] mr-1">save</span> Save Preferences</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
