import React from 'react';
import { Trophy, Award, Star, Zap, X, Shield, Lock, Flame } from 'lucide-react';
import { UserProgress } from '../types';
import { calculateLevel } from '../utils/storage';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

interface BadgeItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  isUnlocked: boolean;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  progress
}) => {
  if (!isOpen) return null;

  const allBadges: BadgeItem[] = [
    {
      id: 'first_lesson',
      name: 'Primeiro Passo Hacker',
      desc: 'Completou sua primeira aula prática de segurança.',
      icon: '🛡️',
      isUnlocked: progress.completedLessons.length > 0
    },
    {
      id: 'pentester_junior',
      name: 'Pentester Júnior',
      desc: 'Concluiu aulas e dominou ferramentas de varredura e enumeração.',
      icon: '🎯',
      isUnlocked: progress.completedLessons.length >= 3
    },
    {
      id: 'owasp_master',
      name: 'Guardião OWASP',
      desc: 'Explorou e neutralizou vulnerabilidades no laboratório interativo OWASP.',
      icon: '⚡',
      isUnlocked: progress.xp >= 150
    },
    {
      id: 'ctf_hunter',
      name: 'Caçador de Flags (CTF)',
      desc: 'Descobriu e submeteu ao menos uma flag no terminal virtual.',
      icon: '🚩',
      isUnlocked: progress.capturedFlags.length > 0
    },
    {
      id: 'cyber_guardian',
      name: 'Byte Guardião Pro',
      desc: 'Completou missões e mini-jogos no Modo Menor / Família.',
      icon: '🤖',
      isUnlocked: progress.kidsCompletedQuests.length > 0
    },
    {
      id: 'fortified_shield',
      name: 'Escudo Blindado',
      desc: 'Marcou 5 ou mais itens no Checklist de Proteção Pessoal.',
      icon: '🔒',
      isUnlocked: progress.completedChecklistItems.length >= 5
    },
    {
      id: 'daily_warrior',
      name: 'Guerreiro Diário',
      desc: 'Completou um Desafio do Dia e manteve o ritmo de ciberdefesa ativo.',
      icon: '🔥',
      isUnlocked: (progress.completedDailyDates && progress.completedDailyDates.length > 0) || (progress.dailyStreak !== undefined && progress.dailyStreak > 0)
    }
  ];

  const unlockedCount = allBadges.filter(b => b.isUnlocked).length;
  const currentLvl = calculateLevel(progress.xp).level;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Conquistas & Medalhas ({unlockedCount}/{allBadges.length})</h2>
              <p className="text-xs text-slate-400">Seu histórico de conquistas e evolução na cibersegurança</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Stats Bar */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono block">Nível Atual</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">{currentLvl}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono block">XP Total</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">{progress.xp} XP</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono block">Aulas Feitas</span>
            <span className="text-xl font-extrabold text-cyan-400 font-mono">{progress.completedLessons.length}</span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                badge.isUnlocked
                  ? 'bg-slate-950 border-amber-500/30 text-white shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60 text-slate-400'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                badge.isUnlocked ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'
              }`}>
                {badge.isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-600" />}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-bold truncate">{badge.name}</h4>
                  {badge.isUnlocked && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold shrink-0">
                      Desbloqueada
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-snug">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
