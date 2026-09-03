import React from 'react';
import { X, Flame } from 'lucide-react';
import { UserProgress } from '../types';
import { DailyChallengeCard } from './DailyChallengeCard';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onComplete: (challengeId: string, xpPoints: number) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  progress,
  onComplete
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#15171E] rounded-3xl border border-slate-800 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#15171E]/95 backdrop-blur z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                DESAFIO DO DIA // DAILY CYBER CTF
              </h2>
              <p className="text-[11px] text-slate-400">
                Missão diária aleatória para turbinar seu XP e manter sua ofensiva ativa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with the Card */}
        <div className="p-4 sm:p-6">
          <DailyChallengeCard
            progress={progress}
            onComplete={onComplete}
            isModal={true}
            onCloseModal={onClose}
          />
        </div>
      </div>
    </div>
  );
};
