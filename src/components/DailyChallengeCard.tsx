import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Send, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Terminal, 
  Shuffle, 
  ChevronDown, 
  ChevronUp,
  Award,
  Zap
} from 'lucide-react';
import { DailyChallenge, UserProgress } from '../types';
import { 
  getDailyChallenge, 
  getTodayDateString, 
  getTimeUntilNextDailyChallenge, 
  dailyChallengesList 
} from '../data/dailyChallengesData';
import { triggerConfetti } from '../utils/storage';

interface DailyChallengeCardProps {
  progress: UserProgress;
  onComplete: (challengeId: string, xpPoints: number) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  progress,
  onComplete,
  isModal = false,
  onCloseModal
}) => {
  const todayStr = getTodayDateString();
  const todaysOfficialChallenge = getDailyChallenge(todayStr);

  // Active challenge state (defaults to today's, but allows training other challenges)
  const [activeChallenge, setActiveChallenge] = useState<DailyChallenge>(todaysOfficialChallenge);
  const [isTrainingMode, setIsTrainingMode] = useState<boolean>(false);

  // Countdown timer state
  const [countdown, setCountdown] = useState<string>(getTimeUntilNextDailyChallenge().formatted);

  // Input & solution states
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copiedData, setCopiedData] = useState<boolean>(false);

  // Check if today's official challenge was completed
  const isTodayOfficialCompleted = Boolean(
    progress.completedDailyDates && progress.completedDailyDates.includes(todayStr)
  );

  // Check if current active challenge has already been completed by user
  const isCurrentChallengeAlreadyDone = Boolean(
    progress.completedDailyChallengeIds && progress.completedDailyChallengeIds.includes(activeChallenge.id)
  );

  // Sync completion state when switching challenge
  useEffect(() => {
    if (activeChallenge.id === todaysOfficialChallenge.id && isTodayOfficialCompleted) {
      setIsCompleted(true);
    } else if (isCurrentChallengeAlreadyDone) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
      setUserAnswer('');
      setSelectedOptionId(null);
      setErrorMessage(null);
      setShowHint(false);
    }
  }, [activeChallenge.id, isTodayOfficialCompleted, isCurrentChallengeAlreadyDone, todaysOfficialChallenge.id]);

  // Real-time countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilNextDailyChallenge().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyTargetData = () => {
    if (!activeChallenge.targetData) return;
    navigator.clipboard.writeText(activeChallenge.targetData);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const cleanInput = userAnswer.trim();
    const correctTarget = activeChallenge.flagOrAnswer.trim();
    const acceptable = activeChallenge.acceptableAnswers || [];

    const isMatch = 
      cleanInput.toLowerCase() === correctTarget.toLowerCase() ||
      acceptable.some(ans => ans.toLowerCase() === cleanInput.toLowerCase());

    if (isMatch) {
      setErrorMessage(null);
      setIsCompleted(true);
      triggerConfetti();
      onComplete(activeChallenge.id, activeChallenge.xpReward);
    } else {
      setErrorMessage('Resposta incorreta. Verifique maiúsculas/minúsculas, tente decodificar novamente ou abra a dica!');
    }
  };

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isCompleted) return;
    setSelectedOptionId(optionId);
    if (isCorrect) {
      setErrorMessage(null);
      setIsCompleted(true);
      triggerConfetti();
      onComplete(activeChallenge.id, activeChallenge.xpReward);
    } else {
      setErrorMessage('Opção incorreta. Analise a dica e o cenário para encontrar a vulnerabilidade exata!');
    }
  };

  const handleRandomChallenge = () => {
    const remaining = dailyChallengesList.filter(c => c.id !== activeChallenge.id);
    const randomPick = remaining[Math.floor(Math.random() * remaining.length)];
    setActiveChallenge(randomPick);
    setIsTrainingMode(true);
  };

  const handleResetToToday = () => {
    setActiveChallenge(todaysOfficialChallenge);
    setIsTrainingMode(false);
  };

  const streakCount = progress.dailyStreak || (isTodayOfficialCompleted ? 1 : 0);

  const getCategoryColor = (cat: DailyChallenge['category']) => {
    switch (cat) {
      case 'Criptografia': return 'text-[#00D1FF] bg-[#00D1FF]/10 border-[#00D1FF]/30';
      case 'Web & OWASP': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'Forense & Logs': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'Engenharia Social': return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
      case 'Redes & Portas': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'Terminal & Linux': return 'text-[#00FF41] bg-[#00FF41]/10 border-[#00FF41]/30';
      default: return 'text-[#00FF41] bg-[#00FF41]/10 border-[#00FF41]/30';
    }
  };

  return (
    <div 
      id="daily-challenge-card"
      className={`bento-card overflow-hidden transition-all duration-300 ${
        isCompleted 
          ? 'border-[#00FF41]/40 shadow-lg shadow-[#00FF41]/5' 
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Banner / Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isCompleted 
              ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
          }`}>
            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {isTrainingMode ? 'MODO TREINO LIVRE' : 'DESAFIO DO DIA'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isCompleted 
                  ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30' 
                  : 'bg-amber-400/10 text-amber-400 border-amber-400/30'
              }`}>
                {isCompleted ? 'CONCLUÍDO' : 'PENDENTE'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {isTrainingMode 
                ? 'Praticando missões adicionais do banco de CTFs' 
                : 'Complete diariamente para manter sua ofensiva ativa'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Daily Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/50 border border-slate-800 font-mono text-xs text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold">{streakCount}</span>
            <span className="text-slate-400 text-[10px]">dias seguidos</span>
          </div>

          {/* Countdown until reset */}
          {!isTrainingMode && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/50 border border-slate-800 font-mono text-[11px] text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset em {countdown}</span>
            </div>
          )}

          {/* Extra XP Reward Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/30 font-mono text-xs font-bold text-[#00FF41]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{activeChallenge.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Title & Metadata Pills */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getCategoryColor(activeChallenge.category)}`}>
                {activeChallenge.category}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Nível: {activeChallenge.difficulty}
              </span>
              {isTrainingMode && (
                <button
                  onClick={handleResetToToday}
                  className="text-[10px] font-mono text-[#00D1FF] hover:underline"
                >
                  Voltar ao Desafio Oficial de Hoje
                </button>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {activeChallenge.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {activeChallenge.description}
            </p>
          </div>

          {/* Shuffle / Random Button for Training */}
          <button
            onClick={handleRandomChallenge}
            className="self-start px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0"
            title="Sortear outro desafio do acervo para praticar"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#00FF41]" />
            <span>Sortear Outro</span>
          </button>
        </div>

        {/* Scenario Box */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-400 space-y-1">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
            Cenário do Incidente // Contexto Técnico
          </span>
          <p className="text-slate-300 italic">
            "{activeChallenge.scenario}"
          </p>
        </div>

        {/* Target Data / Code / Cipher Monospace Container */}
        {activeChallenge.targetData && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-[11px] text-[#00D1FF] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                {activeChallenge.targetDataLabel || 'Evidência / Artefato Coletado:'}
              </span>
              <button
                onClick={handleCopyTargetData}
                className="hover:text-white flex items-center gap-1 text-[10px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                title="Copiar texto para área de transferência"
              >
                {copiedData ? (
                  <>
                    <Check className="w-3 h-3 text-[#00FF41]" />
                    <span className="text-[#00FF41]">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-black/70 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre selection:bg-[#00FF41] selection:text-black">
              <code>{activeChallenge.targetData}</code>
            </div>
          </div>
        )}

        {/* Interactive Task Area */}
        {!isCompleted ? (
          <div className="space-y-4 pt-2">
            {activeChallenge.taskType === 'flag_input' ? (
              <form onSubmit={handleFlagSubmit} className="space-y-3">
                <label className="block text-xs font-mono text-slate-300">
                  Submeta a Flag ou a Palavra decodificada:
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => {
                        setUserAnswer(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Ex: FLAG{...} ou palavra-chave"
                      className="w-full bg-black/60 border border-slate-700 focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-mono font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-[#00FF41]/20 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Validar Resposta</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2.5">
                <span className="block text-xs font-mono text-slate-300">
                  Selecione a resposta ou diagnóstico correto:
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeChallenge.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id, option.isCorrect)}
                      className={`w-full text-left p-3.5 rounded-xl border font-mono text-xs transition-all flex items-start justify-between gap-3 ${
                        selectedOptionId === option.id
                          ? option.isCorrect
                            ? 'bg-[#00FF41]/10 border-[#00FF41] text-white shadow-md shadow-[#00FF41]/10'
                            : 'bg-rose-500/10 border-rose-500 text-rose-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] shrink-0 text-slate-400">
                          {option.id.replace('opt-', '').toUpperCase()}
                        </span>
                        <span>{option.text}</span>
                      </div>
                      {selectedOptionId === option.id && (
                        <div className="shrink-0 pt-0.5">
                          {option.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-[#00FF41]" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono animate-fadeIn">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        ) : (
          /* Completed Success Banner */
          <div className="p-4 sm:p-5 rounded-2xl bg-[#00FF41]/10 border border-[#00FF41]/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5 text-[#00FF41]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-mono font-bold text-sm">
                  Desafio Concluído com Sucesso! (+{activeChallenge.xpReward} XP)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                <Award className="w-4 h-4" />
                <span>Ofensiva Diária Mantida!</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeChallenge.explanation}
            </p>

            {/* Real World Impact Insight */}
            <div className="p-3 rounded-xl bg-black/40 border border-[#00FF41]/20 text-[11px] text-slate-300 space-y-1">
              <span className="text-[#00FF41] font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Impacto Real na Indústria:
              </span>
              <p>{activeChallenge.realWorldImpact}</p>
            </div>
          </div>
        )}

        {/* Hint Section Toggle */}
        <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{showHint ? 'Ocultar Dica' : 'Precisa de uma Dica?'}</span>
            {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isCompleted && isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-colors"
            >
              Fechar Desafio
            </button>
          )}
        </div>

        {/* Hint Content */}
        {showHint && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono space-y-1 animate-fadeIn">
            <span className="font-bold flex items-center gap-1 text-[11px]">
              💡 DICA DO ESPECIALISTA:
            </span>
            <p className="text-slate-300 font-sans text-xs">
              {activeChallenge.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
