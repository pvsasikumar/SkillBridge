import { useState, useCallback } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { allCompetencies } from '@/data/competencyFramework';
import type { LearningMaterial, BankQuestion } from '@/types';

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const mockMaterials: LearningMaterial[] = [
  { id: 'mat-1', title: 'Survey Sampling Methods - Comprehensive Guide', description: 'Detailed guide covering probability and non-probability sampling methods', file: null, fileName: 'survey-sampling-guide.pdf', fileType: 'application/pdf', fileSize: 2400000, competency: 'Sampling Techniques', topics: ['Random Sampling', 'Stratified Sampling', 'Cluster Sampling', 'Multi-stage Sampling'], uploadedBy: 'Dr. Priya Sharma', uploadedAt: '2026-08-24T10:00:00Z', status: 'ready', detectedTopics: ['Random Sampling', 'Stratified Sampling', 'Cluster Sampling'] },
  { id: 'mat-2', title: 'Data Quality Framework - NSO Standards', description: 'Official data quality assurance framework based on NSO guidelines', file: null, fileName: 'data-quality-nso.pdf', fileType: 'application/pdf', fileSize: 1800000, competency: 'Data Quality Assurance', topics: ['Data Validation', 'Error Detection', 'Quality Metrics'], uploadedBy: 'Dr. Priya Sharma', uploadedAt: '2026-08-23T14:00:00Z', status: 'ready', detectedTopics: ['Data Validation', 'Error Detection', 'Quality Metrics'] },
  { id: 'mat-3', title: 'Statistical Computing with R - Workshop Notes', description: 'Workshop notes on using R for statistical computing in official statistics', file: null, fileName: 'r-workshop-notes.docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileSize: 1500000, competency: 'R Programming', topics: ['R Basics', 'Data Manipulation', 'Statistical Tests', 'Visualization'], uploadedBy: 'Dr. Priya Sharma', uploadedAt: '2026-08-22T09:00:00Z', status: 'ready', detectedTopics: ['R Basics', 'Data Manipulation', 'Statistical Tests'] },
];

const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Mixed'] as const;
const questionCountOptions = [5, 10, 20, 30] as const;

export default function LearningMaterialStudio() {
  const [materials, setMaterials] = useState<LearningMaterial[]>(mockMaterials);
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCompetency, setUploadCompetency] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateMaterial, setGenerateMaterial] = useState<LearningMaterial | null>(null);
  const [generateCount, setGenerateCount] = useState(10);
  const [generateDifficulty, setGenerateDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<BankQuestion[]>([]);

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.competency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompetency = selectedCompetency === 'All' || m.competency === selectedCompetency;
    return matchesSearch && matchesCompetency;
  });

  const handleFileSelect = useCallback((file: File) => {
    setUploadError('');
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Unsupported file type. Please upload PDF, DOCX, PPT, PPTX, or TXT files.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size exceeds 20MB limit.');
      return;
    }
    setUploadFile(file);
    if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  }, [uploadTitle]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleUpload = useCallback(() => {
    if (!uploadFile || !uploadTitle || !uploadCompetency) return;

    const newMaterial: LearningMaterial = {
      id: `mat-${Date.now()}`,
      title: uploadTitle,
      description: uploadDescription,
      file: uploadFile,
      fileName: uploadFile.name,
      fileType: uploadFile.type,
      fileSize: uploadFile.size,
      competency: uploadCompetency,
      topics: [],
      uploadedBy: 'Current Trainer',
      uploadedAt: new Date().toISOString(),
      status: 'uploading',
    };

    setMaterials(prev => [...prev, newMaterial]);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadCompetency('');

    // Simulate processing
    setTimeout(() => {
      setMaterials(prev => prev.map(m =>
        m.id === newMaterial.id ? { ...m, status: 'processing' as const } : m
      ));
    }, 1000);

    setTimeout(() => {
      setMaterials(prev => prev.map(m =>
        m.id === newMaterial.id ? { ...m, status: 'ready' as const, detectedTopics: ['Extracted Topic 1', 'Extracted Topic 2', 'Extracted Topic 3'] } : m
      ));
    }, 3000);
  }, [uploadFile, uploadTitle, uploadDescription, uploadCompetency]);

  const handleDelete = useCallback((id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!generateMaterial) return;
    setGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockQuestions: BankQuestion[] = Array.from({ length: generateCount }, (_, i) => ({
      id: `gen-q-${Date.now()}-${i}`,
      question: `Question ${i + 1} about ${generateMaterial.competency} based on "${generateMaterial.title}"?`,
      options: [
        `Option A - ${generateMaterial.topics[0] || 'Topic A'}`,
        `Option B - ${generateMaterial.topics[1] || 'Topic B'}`,
        `Option C - ${generateMaterial.topics[2] || 'Topic C'}`,
        `Option D - Alternative approach`,
      ],
      correctIndex: i % 4,
      explanation: `This question tests understanding of ${generateMaterial.competency} concepts covered in the material.`,
      competency: generateMaterial.competency,
      topic: generateMaterial.topics[i % Math.max(1, generateMaterial.topics.length)] || 'General',
      difficulty: generateDifficulty === 'Mixed' ? (['Easy', 'Medium', 'Hard'] as const)[i % 3] : generateDifficulty,
      questionType: i % 3 === 0 ? 'scenario' : i % 5 === 0 ? 'true-false' : 'mcq',
      sourceMaterial: generateMaterial.title,
      createdBy: 'AI Generator',
      isAiGenerated: true,
      approvalStatus: 'pending' as const,
      createdAt: new Date().toISOString(),
    }));

    setGeneratedQuestions(mockQuestions);
    setGenerating(false);
  }, [generateMaterial, generateCount, generateDifficulty]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusIcon = (status: LearningMaterial['status']) => {
    switch (status) {
      case 'uploading':
        return <span className="material-symbols-outlined text-[16px] text-primary animate-spin">progress_activity</span>;
      case 'processing':
        return <span className="material-symbols-outlined text-[16px] text-warning-500 animate-spin">progress_activity</span>;
      case 'ready':
        return <span className="material-symbols-outlined text-[16px] text-success-500">check_circle</span>;
      case 'failed':
        return <span className="material-symbols-outlined text-[16px] text-danger-500">warning</span>;
    }
  };

  const getStatusBadge = (status: LearningMaterial['status']) => {
    switch (status) {
      case 'uploading':
        return <Badge variant="primary" size="sm">Uploading</Badge>;
      case 'processing':
        return <Badge variant="warning" size="sm">Processing</Badge>;
      case 'ready':
        return <Badge variant="success" size="sm">Ready</Badge>;
      case 'failed':
        return <Badge variant="danger" size="sm">Failed</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">AI Learning Material Studio</h1>
          <p className="text-sm text-on-surface-variant mt-1">Upload materials and generate AI-powered quizzes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            <span className="material-symbols-outlined text-[16px]">upload</span>
            Upload Material
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Materials', value: materials.length, color: 'text-primary', bg: 'bg-primary-50', iconName: 'description' },
          { label: 'Ready', value: materials.filter(m => m.status === 'ready').length, color: 'text-success-600', bg: 'bg-success-50', iconName: 'check_circle' },
          { label: 'Processing', value: materials.filter(m => m.status === 'processing' || m.status === 'uploading').length, color: 'text-warning-600', bg: 'bg-warning-50', iconName: 'progress_activity' },
          { label: 'Competencies', value: [...new Set(materials.map(m => m.competency))].length, color: 'text-secondary-600', bg: 'bg-secondary-50', iconName: 'lightbulb' },
        ].map(stat => (
          <Card key={stat.label} className="flex items-start gap-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <span className={cn('material-symbols-outlined text-[18px]', stat.color)}>{stat.iconName}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined text-[16px] absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-outline">filter_list</span>
          <select
            value={selectedCompetency}
            onChange={e => setSelectedCompetency(e.target.value)}
            className="px-3 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="All">All Competencies</option>
            {[...new Set(materials.map(m => m.competency))].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(material => (
          <Card key={material.id} className="flex flex-col">
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                </div>
                {getStatusBadge(material.status)}
              </div>
              <h3 className="text-sm font-semibold text-on-surface mb-1 line-clamp-2">{material.title}</h3>
              <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{material.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="primary" size="sm">{material.competency}</Badge>
                <Badge variant="default" size="sm">{formatFileSize(material.fileSize)}</Badge>
              </div>
              {material.detectedTopics && material.detectedTopics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {material.detectedTopics.slice(0, 3).map(topic => (
                    <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">{topic}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-outline-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(material.status)}
                <span className="text-xs text-on-surface-variant">{material.uploadedBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setGenerateMaterial(material); setShowGenerateModal(true); }}
                  disabled={material.status !== 'ready'}
                >
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  Generate
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(material.id)}>
                  <span className="material-symbols-outlined text-[14px] text-danger-500">delete</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card className="text-center py-12">
          <span className="material-symbols-outlined text-[32px] text-outline mx-auto mb-3 block">description</span>
          <p className="text-sm text-on-surface-variant">No learning materials found</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowUploadModal(true)}>Upload Material</Button>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal open={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Learning Material" size="lg">
        <div className="space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
              dragOver ? 'border-primary bg-primary-50' : uploadFile ? 'border-success-300 bg-success-50' : 'border-outline-light hover:border-outline'
            )}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.docx,.ppt,.pptx,.txt"
              onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            {uploadFile ? (
              <div className="flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-success-500">check_circle</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-on-surface">{uploadFile.name}</p>
                  <p className="text-xs text-on-surface-variant">{formatFileSize(uploadFile.size)}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setUploadFile(null); }} className="text-outline hover:text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-[24px] text-outline mx-auto mb-2 block">upload</span>
                <p className="text-sm font-medium text-on-surface">Drag & drop a file here, or click to browse</p>
                <p className="text-xs text-on-surface-variant mt-1">PDF, DOCX, PPT, PPTX, or TXT — max 20MB</p>
              </>
            )}
          </div>
          {uploadError && <p className="text-sm text-danger-600">{uploadError}</p>}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Title</label>
            <input
              type="text"
              value={uploadTitle}
              onChange={e => setUploadTitle(e.target.value)}
              placeholder="Enter material title"
              className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Description</label>
            <textarea
              value={uploadDescription}
              onChange={e => setUploadDescription(e.target.value)}
              placeholder="Brief description of the material"
              className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Competency</label>
            <select
              value={uploadCompetency}
              onChange={e => setUploadCompetency(e.target.value)}
              className="w-full px-3 py-2 border border-outline-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Select competency</option>
              {allCompetencies.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!uploadFile || !uploadTitle || !uploadCompetency}>
              <span className="material-symbols-outlined text-[16px]">upload</span>
              Upload & Process
            </Button>
          </div>
        </div>
      </Modal>

      {/* Generate Quiz Modal */}
      <Modal open={showGenerateModal} onClose={() => { setShowGenerateModal(false); setGeneratedQuestions([]); }} title="Generate Quiz from Material" size="lg">
        {generateMaterial && (
          <div className="space-y-4">
            <div className="p-3 bg-surface-container rounded-xl">
              <p className="text-sm font-medium text-on-surface">{generateMaterial.title}</p>
              <p className="text-xs text-on-surface-variant mt-1">Competency: {generateMaterial.competency}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Number of Questions</label>
                <div className="flex gap-2">
                  {questionCountOptions.map(count => (
                    <button
                      key={count}
                      onClick={() => setGenerateCount(count)}
                      className={cn(
                        'flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-colors',
                        generateCount === count
                          ? 'border-primary bg-primary-50 text-primary'
                          : 'border-outline-light text-on-surface-variant hover:border-outline'
                      )}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Difficulty</label>
                <div className="flex gap-2">
                  {difficultyOptions.map(diff => (
                    <button
                      key={diff}
                      onClick={() => setGenerateDifficulty(diff)}
                      className={cn(
                        'flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-colors',
                        generateDifficulty === diff
                          ? 'border-primary bg-primary-50 text-primary'
                          : 'border-outline-light text-on-surface-variant hover:border-outline'
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {generating && (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-[24px] text-primary animate-spin mx-auto mb-3 block">progress_activity</span>
                <p className="text-sm text-on-surface-variant">AI is generating questions from your material...</p>
                <Progress value={66} size="sm" className="mt-3 max-w-xs mx-auto" />
              </div>
            )}

            {generatedQuestions.length > 0 && !generating && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-on-surface">{generatedQuestions.length} Questions Generated</p>
                  <Badge variant="warning" size="sm">Pending Review</Badge>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {generatedQuestions.slice(0, 5).map((q, i) => (
                    <div key={q.id} className="p-3 bg-surface-container rounded-xl">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-primary-100 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm text-on-surface line-clamp-2">{q.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'danger'} size="sm">{q.difficulty}</Badge>
                            <span className="text-[10px] text-on-surface-variant">{q.topic}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {generatedQuestions.length > 5 && (
                    <p className="text-xs text-on-surface-variant text-center">...and {generatedQuestions.length - 5} more questions</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setShowGenerateModal(false); setGeneratedQuestions([]); }}>Cancel</Button>
              {generatedQuestions.length === 0 ? (
                <Button onClick={handleGenerate} disabled={generating}>
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  Generate Questions
                </Button>
              ) : (
                <Button onClick={() => { setShowGenerateModal(false); setGeneratedQuestions([]); }}>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Review & Publish
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
