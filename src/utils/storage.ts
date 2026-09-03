import { UserProgress, UserLevel, XpHistoryEntry } from '../types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'cybershield_user_progress_v1';

export function generateDefaultXpHistory(targetXp: number): XpHistoryEntry[] {
  const result: XpHistoryEntry[] = [];
  const now = new Date();
  const distribution = [0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1.0];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayIndex = 6 - i;
    const ratio = distribution[dayIndex];
    const pointXp = Math.max(10, Math.round(targetXp * ratio));
    const prevPointXp = dayIndex === 0 ? 0 : Math.max(10, Math.round(targetXp * distribution[dayIndex - 1]));
    const gain = Math.max(0, pointXp - prevPointXp);

    const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const fullDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    result.push({
      date: dateStr,
      fullDate,
      xp: pointXp,
      gain,
      activity: i === 0 ? 'Progresso Atual' : 'Atividades & Treinamento'
    });
  }

  if (result.length > 0) {
    result[result.length - 1].xp = targetXp;
  }

  return result;
}

export function recordXpGain(
  current: UserProgress,
  xpGain: number,
  activity: string
): { updatedXp: number; updatedHistory: XpHistoryEntry[] } {
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const fullDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const history: XpHistoryEntry[] =
    current.xpHistory && current.xpHistory.length > 0
      ? [...current.xpHistory]
      : generateDefaultXpHistory(current.xp);

  const newXp = current.xp + xpGain;
  const lastEntry = history[history.length - 1];

  if (lastEntry && lastEntry.fullDate === fullDate) {
    lastEntry.xp = newXp;
    lastEntry.gain = (lastEntry.gain || 0) + xpGain;
    lastEntry.activity = activity;
  } else {
    history.push({
      date: dateStr,
      fullDate,
      xp: newXp,
      gain: xpGain,
      activity
    });
  }

  return { updatedXp: newXp, updatedHistory: history };
}

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
  completedDailyChallengeIds: [],
  xpHistory: generateDefaultXpHistory(150)
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProgress(initialProgress);
      return initialProgress;
    }
    const parsed = JSON.parse(raw);
    const xp = typeof parsed.xp === 'number' ? parsed.xp : initialProgress.xp;
    const history =
      parsed.xpHistory && Array.isArray(parsed.xpHistory) && parsed.xpHistory.length > 0
        ? parsed.xpHistory
        : generateDefaultXpHistory(xp);

    return {
      ...initialProgress,
      ...parsed,
      xp,
      xpHistory: history
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
  if (alreadyCompleted) return current;

  const { updatedXp, updatedHistory } = recordXpGain(current, xpGain, 'Lição concluída');
  const updated: UserProgress = {
    ...current,
    completedLessons: [...current.completedLessons, lessonId],
    xp: updatedXp,
    xpHistory: updatedHistory
  };
  saveUserProgress(updated);
  return updated;
}

export function addCapturedFlag(flagId: string, points: number = 100): UserProgress {
  const current = loadUserProgress();
  if (current.capturedFlags.includes(flagId)) return current;
  const { updatedXp, updatedHistory } = recordXpGain(current, points, 'Flag capturada');
  const updated: UserProgress = {
    ...current,
    capturedFlags: [...current.capturedFlags, flagId],
    xp: updatedXp,
    xpHistory: updatedHistory,
    badges: current.badges.includes('Caçador de Flags') ? current.badges : [...current.badges, 'Caçador de Flags']
  };
  saveUserProgress(updated);
  return updated;
}

export function addKidsCompletedQuest(questId: string, badgeName: string): UserProgress {
  const current = loadUserProgress();
  if (current.kidsCompletedQuests.includes(questId)) return current;
  const { updatedXp, updatedHistory } = recordXpGain(current, 40, 'Missão Kids');
  const updated: UserProgress = {
    ...current,
    kidsCompletedQuests: [...current.kidsCompletedQuests, questId],
    xp: updatedXp,
    xpHistory: updatedHistory,
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

  let newXp = current.xp;
  let newHistory = current.xpHistory || generateDefaultXpHistory(current.xp);
  if (isFirstToday) {
    const rec = recordXpGain(current, xpReward, 'Desafio Diário');
    newXp = rec.updatedXp;
    newHistory = rec.updatedHistory;
  }

  const updated: UserProgress = {
    ...current,
    xp: newXp,
    xpHistory: newHistory,
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
