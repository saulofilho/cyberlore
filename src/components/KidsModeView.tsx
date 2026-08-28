import React, { useState } from 'react';
import { 
  Baby, 
  Sparkles, 
  ShieldCheck, 
  Gamepad2, 
  KeyRound, 
  ShieldAlert, 
  EyeOff, 
  CheckCircle2, 
  HelpCircle, 
  Trophy, 
  RefreshCw, 
  Copy, 
  Check, 
  Award,
  Star,
  Zap,
  MessageSquare
} from 'lucide-react';
import { kidsQuestsList } from '../data/kidsData';
import { KidsQuest, UserProgress } from '../types';
import { triggerConfetti } from '../utils/storage';

interface KidsModeViewProps {
  progress: UserProgress;
  onCompleteKidsQuest: (questId: string, badgeName: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  KeyRound,
  Gamepad2,
  ShieldAlert,
  EyeOff
};

export const KidsModeView: React.FC<KidsModeViewProps> = ({
  progress,
  onCompleteKidsQuest
}) => {
  const [selectedQuestId, setSelectedQuestId] = useState<string>(kidsQuestsList[0].id);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Super Password Generator for Kids
  const [word1, setWord1] = useState<string>('Dragao');
  const [word2, setWord2] = useState<string>('Pipoca');
  const [word3, setWord3] = useState<string>('Ninja');
  const [kidSymbol, setKidSymbol] = useState<string>('!');
  const [kidNumber, setKidNumber] = useState<string>('2026');
  const [copiedPass, setCopiedPass] = useState<boolean>(false);

  // Phishing Detective Mini Game
  const [detectiveStep, setDetectiveStep] = useState<number>(0);
  const [detectiveScore, setDetectiveScore] = useState<number>(0);
  const [detectiveFeedback, setDetectiveFeedback] = useState<string | null>(null);

  const detectiveScenarios = [
    {
      sender: 'Jogador_Misterioso_99 no Discord',
      message: 'Oi! Ganhei 5.000 Robux extras. Só preciso que você me passe seu login e senha do Roblox para eu enviar para sua conta agora!',
      isSafe: false,
      reason: '🚨 É UM GOLPE! Ninguém precisa da sua senha para te dar nada. Ele quer roubar sua conta!'
    },
    {
      sender: 'Notificação do Jogo Oficial',
      message: 'Seu amigo Pedro convidou você para jogar uma partida na ilha do Minecraft. Clique em Aceitar para entrar no mundo.',
      isSafe: true,
      reason: '✅ É SEGURO! Um convite normal de um amigo que você conhece na vida real, sem pedir senhas!'
    },
    {
      sender: 'Mensagem no WhatsApp de número desconhecido',
      message: 'URGENTE: Você foi sorteado para ganhar um iPhone 16 grátis! Clique no link: http://premio-facil-sorteio.xyz/ganhador e digite o CPF da sua mãe.',
      isSafe: false,
      reason: '🚨 É UM GOLPE! Prêmios mágicos que pedem CPF e dados dos seus pais são armadilhas perigosas.'
    }
  ];

  const selectedQuest = kidsQuestsList.find(q => q.id === selectedQuestId) || kidsQuestsList[0];
  const Icon = iconMap[selectedQuest.iconName] || ShieldCheck;

  const handleSuperPasswordCopy = () => {
    const generated = `${word1}${word2}${word3}${kidSymbol}${kidNumber}`;
    navigator.clipboard.writeText(generated);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleAnswerQuestQuiz = (optIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswer(optIndex);
    setQuizSubmitted(true);

    if (optIndex === selectedQuest.miniQuiz.correctIndex) {
      if (!progress.kidsCompletedQuests.includes(selectedQuest.id)) {
        onCompleteKidsQuest(selectedQuest.id, selectedQuest.rewardBadge);
        triggerConfetti();
      }
    }
  };

  const handleDetectiveChoice = (userSaidSafe: boolean) => {
    const scenario = detectiveScenarios[detectiveStep];
    const correct = userSaidSafe === scenario.isSafe;

    if (correct) {
      setDetectiveScore(prev => prev + 1);
      setDetectiveFeedback(`Parabéns! Você acertou: ${scenario.reason}`);
      triggerConfetti();
    } else {
      setDetectiveFeedback(`Cuidado! ${scenario.reason}`);
    }
  };

  const handleNextDetective = () => {
    setDetectiveFeedback(null);
    if (detectiveStep < detectiveScenarios.length - 1) {
      setDetectiveStep(prev => prev + 1);
    } else {
      setDetectiveStep(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Friendly Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl p-6 sm:p-10 border border-amber-400/30 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
              <Baby className="w-4 h-4" />
              <span>Modo Menor • Guardião da Internet</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Aprenda a Navegar e Jogar Online com Segurança! 🛡️
            </h1>
            <p className="text-amber-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              Olá, explorador digital! Eu sou o <strong>Byte Guardião</strong>. Aqui você vai aprender a proteger seus jogos favoritos (Roblox, Minecraft, Discord), criar super senhas secretas e vencer armadilhas na internet!
            </p>
          </div>

          {/* Byte Mascot Visual */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-amber-400 to-pink-500 p-1 shadow-xl shadow-pink-500/30 flex items-center justify-center shrink-0 animate-bounce duration-1000">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center text-center p-3">
              <span className="text-3xl sm:text-4xl">🤖</span>
              <span className="text-xs font-bold text-amber-300 mt-1">Byte Guardião</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quests Selector & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quests List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono px-1">
            Missões do Guardião ({kidsQuestsList.length})
          </h2>
          <div className="space-y-2.5">
            {kidsQuestsList.map((quest) => {
              const QIcon = iconMap[quest.iconName] || ShieldCheck;
              const isSelected = quest.id === selectedQuestId;
              const isDone = progress.kidsCompletedQuests.includes(quest.id);

              return (
                <button
                  key={quest.id}
                  onClick={() => {
                    setSelectedQuestId(quest.id);
                    setQuizAnswer(null);
                    setQuizSubmitted(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-amber-400/60 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border ${
                    isSelected ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    <QIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-pink-400">{quest.category}</span>
                      {isDone && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Medalha Ganha!
                        </span>
                      )}
                    </div>
                    <h3 className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {quest.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quest Reader and Quiz */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">
                  {selectedQuest.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {selectedQuest.title}
                </h2>
              </div>
            </div>

            {/* Story & Mission */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <p className="text-sm sm:text-base text-amber-100 leading-relaxed font-medium">
                📖 {selectedQuest.story}
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs sm:text-sm text-amber-300 font-bold">
                🎯 <strong>Sua Missão:</strong> {selectedQuest.mission}
              </div>
            </div>

            {/* Super Tips for Kids */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Super Dicas de Proteção do Byte
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedQuest.superTips.map((tip, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">⭐</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Quiz */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-pink-400" />
                  Desafio do Guardião (Ganhe sua Medalha!)
                </h4>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                {selectedQuest.miniQuiz.question}
              </p>

              <div className="space-y-2">
                {selectedQuest.miniQuiz.options.map((opt, oIdx) => {
                  const isChosen = quizAnswer === oIdx;
                  const isCorrect = oIdx === selectedQuest.miniQuiz.correctIndex;
                  
                  let btnClass = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700';
                  if (quizSubmitted) {
                    if (isCorrect) btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    else if (isChosen && !isCorrect) btnClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswerQuestQuiz(oIdx)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {oIdx + 1}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className={`p-4 rounded-xl border text-xs sm:text-sm ${
                  quizAnswer === selectedQuest.miniQuiz.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500 text-rose-200'
                }`}>
                  <span className="font-bold block mb-1">
                    {quizAnswer === selectedQuest.miniQuiz.correctIndex 
                      ? `🎉 Incrível! Você conquistou a medalha "${selectedQuest.rewardBadge}"!` 
                      : 'Ops! Quase lá!'}
                  </span>
                  {selectedQuest.miniQuiz.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Games Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Game 1: Secret Password Creator */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Mini-Jogo Interativo</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Criador de Super Senha Secreta</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300">
            Junte 3 palavras divertidas, um símbolo e um número. Nenhum monstro hacker consegue quebrar uma frase-senha assim!
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Palavra 1:</label>
              <input
                type="text"
                value={word1}
                onChange={(e) => setWord1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Palavra 2:</label>
              <input
                type="text"
                value={word2}
                onChange={(e) => setWord2(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-pink-300 text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Palavra 3:</label>
              <input
                type="text"
                value={word3}
                onChange={(e) => setWord3(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 text-center font-bold"
              />
            </div>
          </div>

          {/* Resulting Super Password */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
            <span className="font-mono text-sm sm:text-base font-bold text-emerald-400 truncate">
              {word1}{word2}{word3}{kidSymbol}{kidNumber}
            </span>
            <button
              onClick={handleSuperPasswordCopy}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPass ? 'Copiada!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Game 2: Detective of Fake Scams */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Mini-Jogo Interativo</span>
                <h3 className="text-lg sm:text-xl font-bold text-white">Detetive de Golpes Online</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Acertos: {detectiveScore}
            </span>
          </div>

          {/* Scenario Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MessageSquare className="w-4 h-4 text-pink-400" />
              <span>Remetente: <strong className="text-slate-200">{detectiveScenarios[detectiveStep].sender}</strong></span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 p-3 bg-slate-900 rounded-xl border border-slate-800/80 italic">
              "{detectiveScenarios[detectiveStep].message}"
            </p>

            {detectiveFeedback ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 font-medium">
                  {detectiveFeedback}
                </div>
                <button
                  onClick={handleNextDetective}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
                >
                  Próxima Mensagem Misteriosa →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleDetectiveChoice(false)}
                  className="py-2.5 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/40 transition-all flex items-center justify-center gap-2"
                >
                  🚨 É um Golpe!
                </button>
                <button
                  onClick={() => handleDetectiveChoice(true)}
                  className="py-2.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/40 transition-all flex items-center justify-center gap-2"
                >
                  ✅ É Seguro!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
