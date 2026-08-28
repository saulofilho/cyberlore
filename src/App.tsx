import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TracksView } from './components/TracksView';
import { OwaspLabView } from './components/OwaspLabView';
import { PentestView } from './components/PentestView';
import { TerminalView } from './components/TerminalView';
import { KidsModeView } from './components/KidsModeView';
import { TipsAndToolsView } from './components/TipsAndToolsView';
import { EmergencyView } from './components/EmergencyView';
import { GitHubPagesModal } from './components/GitHubPagesModal';
import { EthicsModal } from './components/EthicsModal';
import { CertificateModal } from './components/CertificateModal';
import { BadgesModal } from './components/BadgesModal';
import { 
  loadUserProgress, 
  saveUserProgress, 
  addCompletedLesson, 
  addCapturedFlag, 
  addKidsCompletedQuest, 
  toggleChecklistItem, 
  resetUserProgress,
  triggerConfetti
} from './utils/storage';
import { UserProgress } from './types';
import { Shield, Sparkles, AlertTriangle, Github, Award, HeartHandshake, Baby, Terminal, Crosshair, HelpCircle } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [activeView, setActiveView] = useState<string>('tracks');
  const [kidsModeActive, setKidsModeActive] = useState<boolean>(false);

  // Modals state
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);
  const [isEthicsModalOpen, setIsEthicsModalOpen] = useState<boolean>(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [certificateTrackTitle, setCertificateTrackTitle] = useState<string | null>(null);

  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // View switches
  const handleViewChange = (viewId: string) => {
    setActiveView(viewId);
    if (viewId === 'kids') {
      setKidsModeActive(true);
    } else {
      setKidsModeActive(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleKidsMode = () => {
    if (!kidsModeActive) {
      setKidsModeActive(true);
      setActiveView('kids');
    } else {
      setKidsModeActive(false);
      setActiveView('tracks');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for user learning progression
  const handleCompleteLesson = (lessonId: string, trackId: string, xpPoints: number) => {
    const updated = addCompletedLesson(lessonId, trackId, xpPoints);
    setProgress(updated);
  };

  const handleCaptureFlag = (flagId: string, points: number) => {
    const updated = addCapturedFlag(flagId, points);
    setProgress(updated);
  };

  const handleCompleteKidsQuest = (questId: string, badgeName: string) => {
    const updated = addKidsCompletedQuest(questId, badgeName);
    setProgress(updated);
  };

  const handleToggleChecklist = (itemId: string) => {
    const updated = toggleChecklistItem(itemId);
    setProgress(updated);
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-slate-100 flex flex-col selection:bg-[#00FF41] selection:text-black">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeView as any}
        setActiveTab={(tab) => handleViewChange(tab)}
        isKidsMode={kidsModeActive}
        setIsKidsMode={(val) => {
          if (val) {
            handleViewChange('kids');
          } else {
            handleViewChange('tracks');
          }
        }}
        progress={progress}
        onOpenGithubModal={() => setIsGithubModalOpen(true)}
        onOpenEthicsModal={() => setIsEthicsModalOpen(true)}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'tracks' && (
          <TracksView
            progress={progress}
            onCompleteLesson={(lessonId, xpEarned) => {
              const selectedTrk = progress.completedLessons;
              handleCompleteLesson(lessonId, 'track-general', xpEarned);
            }}
            onOpenCertificate={(title) => setCertificateTrackTitle(title)}
          />
        )}

        {activeView === 'owasp' && (
          <OwaspLabView />
        )}

        {activeView === 'pentest' && (
          <PentestView />
        )}

        {activeView === 'terminal' && (
          <TerminalView
            progress={progress}
            onCaptureFlag={handleCaptureFlag}
          />
        )}

        {activeView === 'kids' && (
          <KidsModeView
            progress={progress}
            onCompleteKidsQuest={handleCompleteKidsQuest}
          />
        )}

        {activeView === 'tips' && (
          <TipsAndToolsView
            progress={progress}
            onToggleChecklistItem={handleToggleChecklist}
          />
        )}

        {activeView === 'emergency' && (
          <EmergencyView />
        )}
      </main>

      {/* Bento-Styled Footer */}
      <footer className="bg-[#15171E] border-t border-slate-800 text-xs text-slate-400 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5 text-white font-mono font-bold text-base">
                <div className="w-6 h-6 bg-[#00FF41] rounded flex items-center justify-center">
                  <Shield className="w-4 h-4 text-black stroke-[2.5]" />
                </div>
                <span>CYBERLORE ACADEMY</span>
                <span className="text-[10px] font-mono text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/20">
                  v2.5_ACTIVE
                </span>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed text-xs">
                Plataforma educacional interativa de cibersegurança e ethical hacking. Do básico de conscientização familiar ao Pentest e auditoria OWASP.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsEthicsModalOpen(true)}
                  className="text-[#00FF41] hover:text-[#00FF41]/80 flex items-center gap-1 font-mono text-xs font-semibold transition-colors"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  White Hat Ethics
                </button>
                <span className="text-slate-700">•</span>
                <button
                  onClick={() => setIsGithubModalOpen(true)}
                  className="text-[#00D1FF] hover:text-[#00D1FF]/80 flex items-center gap-1 font-mono text-xs font-semibold transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Pages Guide
                </button>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-2">
              <span className="font-mono font-bold uppercase text-slate-300 block text-xs tracking-wider">
                Módulos de Defesa
              </span>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li>
                  <button onClick={() => handleViewChange('tracks')} className="hover:text-[#00FF41] transition-colors">
                    Trilhas de Aprendizado
                  </button>
                </li>
                <li>
                  <button onClick={() => handleViewChange('owasp')} className="hover:text-[#00FF41] transition-colors">
                    Laboratório OWASP Top 10
                  </button>
                </li>
                <li>
                  <button onClick={() => handleViewChange('pentest')} className="hover:text-[#00FF41] transition-colors">
                    Pentest Hub & Ferramentas
                  </button>
                </li>
                <li>
                  <button onClick={() => handleViewChange('terminal')} className="hover:text-[#00FF41] transition-colors">
                    Terminal Hacker & CTF
                  </button>
                </li>
              </ul>
            </div>

            {/* Community & Safety Column */}
            <div className="space-y-2">
              <span className="font-mono font-bold uppercase text-slate-300 block text-xs tracking-wider">
                Segurança & Família
              </span>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li>
                  <button onClick={() => handleViewChange('kids')} className="hover:text-amber-300 transition-colors text-amber-400/90 font-medium">
                    Modo Menor (Kids & Teens)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleViewChange('tips')} className="hover:text-[#00FF41] transition-colors">
                    Testador de Senhas & Dicas
                  </button>
                </li>
                <li>
                  <button onClick={() => handleViewChange('emergency')} className="hover:text-rose-400 transition-colors text-rose-400/90 font-medium">
                    Emergência / Checklist
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
            <span>© 2026 CYBERLORE. Software livre e educacional. Diretrizes LGPD & Lei 12.737/2012.</span>
            <span className="text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/20">GH-PAGES_OPERATIONAL</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GitHubPagesModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />

      <EthicsModal
        isOpen={isEthicsModalOpen}
        onClose={() => setIsEthicsModalOpen(false)}
      />

      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        progress={progress}
      />

      {certificateTrackTitle && (
        <CertificateModal
          isOpen={true}
          onClose={() => setCertificateTrackTitle(null)}
          trackTitle={certificateTrackTitle}
        />
      )}
    </div>
  );
}
