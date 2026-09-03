import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Network, 
  Code, 
  Crosshair, 
  Server, 
  UserCheck, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  ChevronRight, 
  Award, 
  ArrowLeft,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BookOpen,
  Bot
} from 'lucide-react';
import { tracksData } from '../data/tracksData';
import { Track, Lesson, UserProgress } from '../types';
import { triggerConfetti } from '../utils/storage';
import { DailyChallengeCard } from './DailyChallengeCard';
import { CyberShieldAITutor } from './CyberShieldAITutor';
import { ProgressDashboardCard } from './ProgressDashboardCard';

interface TracksViewProps {
  progress: UserProgress;
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
  onOpenCertificate: (trackTitle: string) => void;
  onOpenGlossaryTerm?: (termName: string) => void;
  onCompleteDailyChallenge?: (challengeId: string, xpEarned: number) => void;
}

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  Network,
  Code,
  Crosshair,
  Server,
  UserCheck
};

export const TracksView: React.FC<TracksViewProps> = ({
  progress,
  onCompleteLesson,
  onOpenCertificate,
  onOpenGlossaryTerm,
  onCompleteDailyChallenge,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracksData[0].id);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  // Quiz state for active lesson
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const selectedTrack = tracksData.find(t => t.id === selectedTrackId) || tracksData[0];

  // Calculate track progress
  const allTrackLessons = selectedTrack.modules.flatMap(m => m.lessons);
  const completedTrackLessonsCount = allTrackLessons.filter(l => progress.completedLessons.includes(l.id)).length;
  const trackProgressPct = Math.round((completedTrackLessonsCount / Math.max(1, allTrackLessons.length)) * 100);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleAnswerOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = (lesson: Lesson) => {
    if (!lesson.quiz || lesson.quiz.length === 0) return;
    setQuizSubmitted(true);
    
    // Check if all answers are correct
    const allCorrect = lesson.quiz.every(q => selectedAnswers[q.id] === q.correctIndex);
    if (allCorrect) {
      if (!progress.completedLessons.includes(lesson.id)) {
        onCompleteLesson(lesson.id, lesson.xp);
        triggerConfetti();
      }
    }
  };

  const handleMarkCompleteWithoutQuiz = (lesson: Lesson) => {
    if (!progress.completedLessons.includes(lesson.id)) {
      onCompleteLesson(lesson.id, lesson.xp);
      triggerConfetti();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Top Header */}
      <div className="bg-[#15171E] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#00FF41] text-xs font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KNOWLEDGE TRAILS // SECURITY ACADEMY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trilhas de Conhecimento & Hacking Ético
          </h1>
          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm">
            Do básico de defesa cibernética diária ao Hacking Ético e segurança web avançada. Estude módulos práticos, realize laboratórios e conquiste certificações.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/40 border border-slate-800 p-4 rounded-xl shrink-0 font-mono text-xs">
          <div className="w-10 h-10 rounded-lg bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Status da Trilha</span>
            <span className="text-[#00FF41] font-bold text-sm">{trackProgressPct}% CONCLUÍDO</span>
          </div>
        </div>
      </div>

      {/* Progress Telemetry Dashboard Card (Recharts) */}
      <ProgressDashboardCard
        progress={progress}
        tracks={tracksData}
        onSelectTrack={(track) => {
          setSelectedTrackId(track.id);
          const firstLesson = track.modules[0]?.lessons[0] || null;
          setActiveLesson(firstLesson);
        }}
      />

      {/* Daily Challenge Bento Card */}
      <DailyChallengeCard
        progress={progress}
        onComplete={(id, xp) => {
          if (onCompleteDailyChallenge) {
            onCompleteDailyChallenge(id, xp);
          }
        }}
      />

      {/* Main Track Selection & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Track Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#00FF41] font-mono">
              TRILHAS DISPONÍVEIS ({tracksData.length})
            </h2>
            <span className="text-[10px] font-mono text-slate-500">[STATUS: 🟢 READY]</span>
          </div>

          <div className="space-y-2.5">
            {tracksData.map((track) => {
              const Icon = iconMap[track.iconName] || ShieldCheck;
              const isSelected = track.id === selectedTrackId;
              const trackLessons = track.modules.flatMap(m => m.lessons);
              const completedCount = trackLessons.filter(l => progress.completedLessons.includes(l.id)).length;
              const pct = Math.round((completedCount / Math.max(1, trackLessons.length)) * 100);

              return (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    setActiveLesson(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#15171E] border-[#00FF41]/50 shadow-lg shadow-[#00FF41]/10'
                      : 'bg-[#15171E]/60 hover:bg-[#15171E] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#00FF41]" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border ${
                      isSelected 
                        ? 'bg-[#00FF41]/10 border-[#00FF41]/30 text-[#00FF41]' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {track.title}
                        </h3>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-slate-800 shrink-0">
                          {track.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {track.shortDesc}
                      </p>
                      
                      {/* Mini Progress */}
                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{completedCount} / {trackLessons.length} Aulas</span>
                        <span className="text-[#00FF41] font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full mt-1 overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-[#00FF41] rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Track Content / Active Lesson Viewer */}
        <div className="lg:col-span-8">
          {activeLesson ? (
            /* Lesson Full View */
            <div className="bg-[#15171E] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
              {/* Back Button & Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <button
                  onClick={() => setActiveLesson(null)}
                  className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-[#00FF41] font-mono transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← VOLTAR AOS MÓDULOS</span>
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                  <a
                    href="#cybershield-ai-tutor"
                    className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 hover:bg-[#00FF41]/20 transition-all cursor-pointer"
                    title="Pedir ajuda ao CyberShield AI (Gemini)"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#00FF41]" />
                    <span className="hidden sm:inline">CyberShield AI</span>
                  </a>
                  <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {activeLesson.duration}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono font-bold text-black bg-[#00FF41] px-2.5 py-1 rounded-md shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    +{activeLesson.xp} XP
                  </span>
                </div>
              </div>

              {/* Lesson Title */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#00FF41] font-bold">
                  {selectedTrack.title}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {activeLesson.title}
                </h2>
              </div>

              {/* Lesson Markdown-like formatted content */}
              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                {activeLesson.content}
              </div>

              {/* Key terms if any */}
              {activeLesson.keyTerms && activeLesson.keyTerms.length > 0 && (
                <div className="bg-black/40 rounded-xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase font-bold text-[#00FF41] tracking-widest flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      GLOSSÁRIO & TERMOS TÉCNICOS
                    </h4>
                    {onOpenGlossaryTerm && (
                      <button
                        onClick={() => onOpenGlossaryTerm(activeLesson.keyTerms![0].term)}
                        className="text-[11px] font-mono text-[#00FF41] hover:underline flex items-center gap-1 transition-colors"
                      >
                        <span>Consultar no Glossário</span>
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.keyTerms.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => onOpenGlossaryTerm?.(term.term)}
                        className="text-left p-3 bg-[#15171E] hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-[#00FF41]/40 transition-all group/term"
                        title="Clique para ver detalhes e analogias no Glossário"
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-xs text-white group-hover/term:text-[#00FF41] font-mono transition-colors">
                            {term.term}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 group-hover/term:text-[#00FF41] transition-colors">
                            ↗
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 leading-relaxed block">{term.definition}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Example (Vulnerable vs Secure) */}
              {activeLesson.codeExample && (
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase font-bold text-[#00D1FF] tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#00D1FF]" />
                    LAB DE CÓDIGO // COMPARATIVO ({activeLesson.codeExample.language})
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {activeLesson.codeExample.vulnerable && (
                      <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl overflow-hidden">
                        <div className="bg-rose-950/60 px-4 py-2 text-xs font-bold text-rose-300 border-b border-rose-900/40 flex items-center gap-2 font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          EXEMPLO VULNERÁVEL (INSEGURO)
                        </div>
                        <pre className="p-4 text-xs font-mono text-rose-200 overflow-x-auto bg-black/40">
                          <code>{activeLesson.codeExample.vulnerable}</code>
                        </pre>
                      </div>
                    )}
                    {activeLesson.codeExample.secure && (
                      <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl overflow-hidden">
                        <div className="bg-emerald-950/60 px-4 py-2 text-xs font-bold text-emerald-300 border-b border-emerald-900/40 flex items-center gap-2 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF41]" />
                          EXEMPLO BLINDADO (SEGURO)
                        </div>
                        <pre className="p-4 text-xs font-mono text-emerald-200 overflow-x-auto bg-black/40">
                          <code>{activeLesson.codeExample.secure}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    💡 {activeLesson.codeExample.explanation}
                  </p>
                </div>
              )}

              {/* Summary Points */}
              <div className="bg-black/40 rounded-xl p-5 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono uppercase font-bold text-[#00FF41] tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF41]" />
                  TAKEAWAYS PRINCIPAIS
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {activeLesson.summary.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#00FF41] font-bold font-mono">›</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CyberShield AI Tutor (Gemini 3.8 Flash) */}
              <CyberShieldAITutor
                lesson={activeLesson}
                track={selectedTrack}
              />

              {/* Interactive Quiz or Completion Button */}
              {activeLesson.quiz && activeLesson.quiz.length > 0 ? (
                <div className="border-t border-slate-800 pt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                      <HelpCircle className="w-5 h-5 text-[#00D1FF]" />
                      DESAFIO DE FIXAÇÃO
                    </h3>
                    <span className="text-xs font-mono text-slate-400">Responda para validar</span>
                  </div>

                  <div className="space-y-6">
                    {activeLesson.quiz.map((q, qIndex) => {
                      const selectedOpt = selectedAnswers[q.id];
                      return (
                        <div key={q.id} className="bg-black/40 p-5 rounded-xl border border-slate-800 space-y-3">
                          <p className="font-semibold text-sm text-slate-100 font-mono">
                            [{qIndex + 1}] {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt, optIndex) => {
                              const isChosen = selectedOpt === optIndex;
                              const isCorrect = optIndex === q.correctIndex;
                              
                              let btnClass = 'bg-[#15171E] border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700';
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  btnClass = 'bg-emerald-950/60 border-[#00FF41] text-emerald-200 font-medium';
                                } else if (isChosen && !isCorrect) {
                                  btnClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
                                }
                              } else if (isChosen) {
                                btnClass = 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41] font-medium';
                              }

                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => handleAnswerOption(q.id, optIndex)}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnClass}`}
                                >
                                  <span className="w-5 h-5 rounded-md bg-black/40 border border-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-mono">
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className={`p-3 rounded-xl text-xs mt-3 border font-mono ${
                              selectedOpt === q.correctIndex 
                                ? 'bg-emerald-950/30 border-[#00FF41] text-emerald-300' 
                                : 'bg-rose-950/30 border-rose-800 text-rose-300'
                            }`}>
                              <span className="font-bold block mb-1">
                                {selectedOpt === q.correctIndex ? '✓ RESPOSTA CORRETA' : '✗ RESPOSTA INCORRETA'}
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex justify-end gap-3">
                      {!quizSubmitted ? (
                        <button
                          onClick={() => handleSubmitQuiz(activeLesson)}
                          disabled={Object.keys(selectedAnswers).length < activeLesson.quiz.length}
                          className="px-6 py-2.5 rounded-xl bg-[#00FF41] hover:bg-[#00FF41]/90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-md shadow-[#00FF41]/20 flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          VALIDAR & RECEBER XP
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setSelectedAnswers({});
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all font-mono"
                        >
                          Tentar Novamente
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Non-quiz lesson completion */
                <div className="border-t border-slate-800 pt-6 flex justify-end">
                  <button
                    onClick={() => handleMarkCompleteWithoutQuiz(activeLesson)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      progress.completedLessons.includes(activeLesson.id)
                        ? 'bg-slate-800 text-[#00FF41] border border-[#00FF41]/30 font-mono'
                        : 'bg-[#00FF41] hover:bg-[#00FF41]/90 text-black shadow-md shadow-[#00FF41]/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    {progress.completedLessons.includes(activeLesson.id) ? 'AULA CONCLUÍDA (+XP)' : 'MARCAR COMO CONCLUÍDA'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Track Overview and Module List */
            <div className="bg-[#15171E] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 uppercase">
                      NÍVEL: {selectedTrack.level}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {allTrackLessons.length} Aulas no Total
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {selectedTrack.title}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    {selectedTrack.shortDesc}
                  </p>
                </div>

                {/* Certificate button if completed */}
                {trackProgressPct === 100 && (
                  <button
                    onClick={() => onOpenCertificate(selectedTrack.title)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0 font-mono"
                  >
                    <Award className="w-4 h-4" />
                    EMITIR CERTIFICADO
                  </button>
                )}
              </div>

              {/* Modules & Lessons Accordion/Cards */}
              <div className="space-y-6">
                {selectedTrack.modules.map((module, mIndex) => (
                  <div key={module.id} className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-black/40 border border-slate-700 text-[#00FF41] font-mono text-xs font-bold flex items-center justify-center">
                        {mIndex + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-100">
                        {module.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 ml-8">
                      {module.description}
                    </p>

                    <div className="space-y-2 ml-8">
                      {module.lessons.map((lesson) => {
                        const isDone = progress.completedLessons.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)}
                            className="w-full text-left p-3.5 rounded-xl bg-black/30 hover:bg-black/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-slate-400" />
                              )}
                              <div>
                                <span className={`text-sm font-medium block ${isDone ? 'text-slate-300 line-through decoration-slate-600' : 'text-white'}`}>
                                  {lesson.title}
                                </span>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-mono">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.duration}
                                  </span>
                                  <span className="text-[#00FF41] font-semibold">
                                    +{lesson.xp} XP
                                  </span>
                                  {lesson.quiz && (
                                    <span className="text-[#00D1FF]">
                                      {lesson.quiz.length} Desafios
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isDone && (
                                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20">
                                  CONCLUÍDO
                                </span>
                              )}
                              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#00FF41] group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
