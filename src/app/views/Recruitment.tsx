import { useState } from 'react';
import { Plus, Briefcase, User, Calendar } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

interface RecruitmentProps {
  candidates: any[];
  onAddCandidate: (name: string, role: string, source: string) => void;
  onUpdateCandidateStage: (id: string, stage: string) => void;
}

export function Recruitment({ candidates, onAddCandidate, onUpdateCandidateStage }: RecruitmentProps) {
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateRole, setNewCandidateRole] = useState('');
  const [newCandidateSource, setNewCandidateSource] = useState('LinkedIn');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateRole) return;
    onAddCandidate(newCandidateName, newCandidateRole, newCandidateSource);
    setNewCandidateName('');
    setNewCandidateRole('');
  };

  const getStageVariant = (stage: string) => {
    switch (stage) {
      case 'Screening': return 'info';
      case 'Technical Assessment': return 'info';
      case 'Interview': return 'warning';
      case 'Offer Stage': return 'success';
      default: return 'neutral';
    }
  };

  const pipelineStats = [
    { stage: 'Screening', count: candidates.filter(c => c.stage === 'Screening').length },
    { stage: 'Assessment', count: candidates.filter(c => c.stage === 'Technical Assessment').length },
    { stage: 'Interview', count: candidates.filter(c => c.stage === 'Interview').length },
    { stage: 'Offer', count: candidates.filter(c => c.stage === 'Offer Stage').length },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Recruitment & Applicant Tracking (ATS)</h2>
          <p className="text-sm text-muted-foreground mt-1">Track open positions and candidate pipeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pipelineStats.map((stat, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-5">
            <p className="text-sm text-muted-foreground mb-1">{stat.stage}</p>
            <p className="text-2xl mt-2">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div id="candForm" className="bg-card border border-border rounded-lg p-5 h-fit">
          <h3 className="mb-4">Add New Candidate Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Full Name</label>
              <input
                type="text"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                placeholder="e.g. Liam Sterling"
                className="w-full text-sm border border-border rounded-lg p-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Target Role Title</label>
              <input
                type="text"
                value={newCandidateRole}
                onChange={(e) => setNewCandidateRole(e.target.value)}
                placeholder="e.g. Senior Backend Architect"
                className="w-full text-sm border border-border rounded-lg p-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Acquisition Source</label>
              <select
                value={newCandidateSource}
                onChange={(e) => setNewCandidateSource(e.target.value)}
                className="w-full text-sm border border-border rounded-lg p-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>LinkedIn</option>
                <option>Direct Referral</option>
                <option>Indeed</option>
                <option>Recruiter Direct</option>
              </select>
            </div>
            <button className="w-full py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity">
              Onboard to Stage: Applied
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <h3 className="mb-4">Pipeline Records Board</h3>
          <div className="space-y-4">
            {candidates.map(cand => {
              const stages = ['Applied', 'Screening', 'Technical Assessment', 'Interview', 'Offer Stage'];
              const currentIndex = stages.indexOf(cand.stage);

              return (
                <div key={cand.id} className="p-4 rounded-xl border border-border hover:border-border/80 bg-muted/30 hover:bg-card transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cand.name}</span>
                      <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{cand.id}</span>
                    </div>
                    <p className="text-xs text-primary mt-1">{cand.roleApplied} • <span className="text-muted-foreground">{cand.source}</span></p>
                    <span className="text-[10px] text-muted-foreground block mt-1">Applied: {cand.appliedDate}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <StatusBadge status={cand.stage} variant={getStageVariant(cand.stage)} />
                    {cand.stage !== 'Offer Stage' && (
                      <button
                        onClick={() => {
                          if (currentIndex < stages.length - 1) {
                            onUpdateCandidateStage(cand.id, stages[currentIndex + 1]);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-[10px] transition-colors"
                      >
                        Advance Stage →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
