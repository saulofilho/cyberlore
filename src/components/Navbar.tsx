import React from 'react';
import { 
  Shield, 
  BookOpen, 
  Terminal, 
  Crosshair, 
  Code2, 
  Sparkles, 
  HelpCircle, 
  AlertOctagon, 
  Award, 
  Github, 
  Baby, 
  Trophy,
  CheckSquare
} from 'lucide-react';
import { AppTab, UserProgress } from '../types';
import { calculateLevel } from '../utils/storage';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  progress: UserProgress;
  isKidsMode: boolean;
  setIsKidsMode: (val: boolean) => void;
  onOpenGithubModal: () => void;
  onOpenEthicsModal: () => void;
  onOpenBadgesModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  progress,
  isKidsMode,
  setIsKidsMode,
  onOpenGithubModal,
  onOpenEthicsModal,
  onOpenBadgesModal
}) => {
  const { level, progressPct, currentLevelXp, nextLevelXp } = calculateLevel(progress.xp);

  const mainTabs = [
    { id: 'tracks' as AppTab, label: 'Trilhas', icon: BookOpen },
    { id: 'owasp' as AppTab, label: 'OWASP Lab', icon: Code2 },
    { id: 'pentest' as AppTab, label: 'Pentest Hub', icon: Crosshair },
    { id: 'terminal' as AppTab, label: 'Terminal CTF', icon: Terminal },
    { id: 'tips' as AppTab, label: 'Dicas & Ferramentas', icon: Sparkles },
    { id: 'emergency' as AppTab, label: 'Emergência & Checklist', icon: AlertOctagon },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0B10]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Banner / Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (isKidsMode) setIsKidsMode(false);
                setActiveTab('tracks');
              }}
              className="flex items-center gap-3 text-left group transition-all"
            >
              <div className="w-9 h-9 bg-[#00FF41] rounded-lg flex items-center justify-center shadow-lg shadow-[#00FF41]/20 group-hover:scale-105 transition-all">
                <Shield className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white font-mono">CYBERLORE</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20">
                    ACADEMY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Security Command Center & Ethical Lab</p>
              </div>
            </button>
          </div>

          {/* User Level, XP & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Modo Menor / Kids Toggle */}
            <button
              onClick={() => {
                const nextState = !isKidsMode;
                setIsKidsMode(nextState);
                if (nextState) {
                  setActiveTab('kids');
                } else if (activeTab === 'kids') {
                  setActiveTab('tracks');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isKidsMode
                  ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white border-amber-300/40 shadow-lg shadow-pink-500/20'
                  : 'bg-[#15171E] hover:bg-slate-800 text-amber-300 border-amber-500/30 hover:border-amber-500/60'
              }`}
              title="Ativar modo especial para crianças, jovens e famílias"
            >
              <Baby className="w-4 h-4" />
              <span className="hidden xs:inline">{isKidsMode ? 'Modo Menor Ativo' : 'Modo Menor (Kids)'}</span>
            </button>

            {/* Hacker Status Box */}
            <button
              onClick={onOpenBadgesModal}
              className="flex items-center gap-2.5 bg-[#15171E] hover:bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-[#00FF41]/30 transition-all text-left"
              title="Ver conquistas, medalhas e nível"
            >
              <div className="w-7 h-7 rounded-lg bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">RANK: {level}</span>
                  <span className="text-[#00FF41] font-bold">{progress.xp} XP</span>
                </div>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-[#00FF41] rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Ethics Code */}
            <button
              onClick={onOpenEthicsModal}
              className="p-2 rounded-xl bg-[#15171E] text-slate-400 hover:text-[#00FF41] hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Código de Ética do Hacker Ético"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* GitHub Pages Deploy Helper */}
            <button
              onClick={onOpenGithubModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#15171E] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-mono font-medium transition-all"
              title="Como publicar no GitHub Pages e ver o código"
            >
              <Github className="w-4 h-4 text-[#00D1FF]" />
              <span className="hidden sm:inline">GH-PAGES</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        {!isKidsMode && (
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60 text-xs sm:text-sm">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 shadow-sm shadow-[#00FF41]/10 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#15171E]/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00FF41]' : 'text-slate-400 opacity-70'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
