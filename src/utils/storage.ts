import { UserProgress, UserLevel } from '../types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'cybershield_user_progress_v1';

export const initialProgress: UserProgress = {
  xp: 150,
  completedLessons: ['les-pass-1'],
  completedQuizzes: { 'q-pass-1': 100 },
  capturedFlags: [],
  completedChecklistItems: ['chk-1', 'chk-2'],
  badges: ['Iniciado no CyberShield'],
  kidsCompletedQuests: [],
  dailyStreak: 0,
  lastCompletedDailyDate: '',
  completedDailyDates: [],
  completedDailyChallengeIds: []
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    const parsed = JSON.parse(raw);
    return {
      ...initialProgress,
      ...parsed
    };
  } catch {
    return initialProgress;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

export function calculateLevel(xp: number): { level: UserLevel; progressPct: number; currentLevelXp: number; nextLevelXp: number } {
  if (xp < 300) {
    return { level: 'Iniciante', progressPct: Math.min(100, (xp / 300) * 100), currentLevelXp: xp, nextLevelXp: 300 };
  } else if (xp < 700) {
    return { level: 'Explorador', progressPct: Math.min(100, ((xp - 300) / 400) * 100), currentLevelXp: xp - 300, nextLevelXp: 400 };
  } else if (xp < 1400) {
    return { level: 'Analista Jr', progressPct: Math.min(100, ((xp - 700) / 700) * 100), currentLevelXp: xp - 700, nextLevelXp: 700 };
  } else if (xp < 2500) {
    return { level: 'Pentester', progressPct: Math.min(100, ((xp - 1400) / 1100) * 100), currentLevelXp: xp - 1400, nextLevelXp: 1100 };
  } else if (xp < 4000) {
    return { level: 'Especialista', progressPct: Math.min(100, ((xp - 2500) / 1500) * 100), currentLevelXp: xp - 2500, nextLevelXp: 1500 };
  } else {
    return { level: 'White Hat Elite', progressPct: 100, currentLevelXp: xp, nextLevelXp: xp };
  }
}

export function addCompletedLesson(lessonId: string, trackId: string, xpGain: number = 50): UserProgress {
  const current = loadUserProgress();
  const alreadyCompleted = current.completedLessons.includes(lessonId);
  const updated: UserProgress = {
    ...current,
    completedLessons: alreadyCompleted ? current.completedLessons : [...current.completedLessons, lessonId],
    xp: alreadyCompleted ? current.xp : current.xp + xpGain
  };
  saveUserProgress(updated);
  return updated;
}

export function addCapturedFlag(flagId: string, points: number = 100): UserProgress {
  const current = loadUserProgress();
  if (current.capturedFlags.includes(flagId)) return current;
  const updated: UserProgress = {
    ...current,
    capturedFlags: [...current.capturedFlags, flagId],
    xp: current.xp + points,
    badges: current.badges.includes('Caçador de Flags') ? current.badges : [...current.badges, 'Caçador de Flags']
  };
  saveUserProgress(updated);
  return updated;
}

export function addKidsCompletedQuest(questId: string, badgeName: string): UserProgress {
  const current = loadUserProgress();
  if (current.kidsCompletedQuests.includes(questId)) return current;
  const updated: UserProgress = {
    ...current,
    kidsCompletedQuests: [...current.kidsCompletedQuests, questId],
    xp: current.xp + 40,
    badges: current.badges.includes(badgeName) ? current.badges : [...current.badges, badgeName]
  };
  saveUserProgress(updated);
  return updated;
}

export function toggleChecklistItem(itemId: string): UserProgress {
  const current = loadUserProgress();
  const isChecked = current.completedChecklistItems.includes(itemId);
  const updated: UserProgress = {
    ...current,
    completedChecklistItems: isChecked 
      ? current.completedChecklistItems.filter(id => id !== itemId)
      : [...current.completedChecklistItems, itemId]
  };
  saveUserProgress(updated);
  return updated;
}

export function resetUserProgress(): UserProgress {
  saveUserProgress(initialProgress);
  return initialProgress;
}

export function completeDailyChallenge(challengeId: string, xpReward: number = 100): { updated: UserProgress; isFirstToday: boolean; streak: number } {
  const current = loadUserProgress();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const completedDates = current.completedDailyDates || [];
  const completedIds = current.completedDailyChallengeIds || [];
  const isFirstToday = !completedDates.includes(todayStr);

  let newStreak = current.dailyStreak || 0;
  if (isFirstToday) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    
    if (current.lastCompletedDailyDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  const alreadyHasBadge = current.badges.includes('Guerreiro Diário');
  const updatedBadges = (!alreadyHasBadge) ? [...current.badges, 'Guerreiro Diário'] : current.badges;

  const updated: UserProgress = {
    ...current,
    xp: isFirstToday ? current.xp + xpReward : current.xp,
    dailyStreak: newStreak,
    lastCompletedDailyDate: todayStr,
    completedDailyDates: isFirstToday ? [...completedDates, todayStr] : completedDates,
    completedDailyChallengeIds: completedIds.includes(challengeId) ? completedIds : [...completedIds, challengeId],
    badges: updatedBadges
  };

  saveUserProgress(updated);
  return { updated, isFirstToday, streak: newStreak };
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6']
    });
  } catch (e) {
    console.log('Confetti trigger', e);
  }
}
