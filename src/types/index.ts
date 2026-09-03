export type AppTab = 'tracks' | 'owasp' | 'pentest' | 'terminal' | 'kids' | 'tips' | 'checklist' | 'emergency' | 'glossary';

export type GlossaryCategory = 
  | 'Fundamentos' 
  | 'Web & OWASP' 
  | 'Pentest & Red Team' 
  | 'Criptografia & Senhas' 
  | 'Ameaças & Golpes' 
  | 'Redes & Infra';

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  category: GlossaryCategory;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  simpleExplanation: string; // Analogia sem jargão para iniciantes
  technicalDefinition: string; // Definição técnica formal
  realWorldExample: string; // Exemplo prático ou ataque real
  howToPreventOrMitigate: string; // Boas práticas e mitigação
  relatedTerms?: string[];
  trackId?: string;
}

export type UserLevel = 'Iniciante' | 'Explorador' | 'Analista Jr' | 'Pentester' | 'Especialista' | 'White Hat Elite';

export interface UserProgress {
  xp: number;
  completedLessons: string[]; // lesson ids
  completedQuizzes: Record<string, number>; // quizId -> score percentage
  capturedFlags: string[]; // flag ids
  completedChecklistItems: string[];
  badges: string[];
  kidsCompletedQuests: string[];
  dailyStreak?: number;
  lastCompletedDailyDate?: string;
  completedDailyDates?: string[];
  completedDailyChallengeIds?: string[];
}

export type DailyChallengeCategory = 
  | 'Criptografia' 
  | 'Web & OWASP' 
  | 'Forense & Logs' 
  | 'Engenharia Social' 
  | 'Redes & Portas' 
  | 'Terminal & Linux';

export interface DailyChallengeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  category: DailyChallengeCategory;
  difficulty: 'Fácil' | 'Médio' | 'Rápido';
  xpReward: number;
  description: string;
  scenario: string;
  taskType: 'flag_input' | 'multiple_choice';
  targetData?: string;
  targetDataLabel?: string;
  flagOrAnswer: string;
  acceptableAnswers?: string[];
  options?: DailyChallengeOption[];
  hint: string;
  explanation: string;
  realWorldImpact: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xp: number;
  content: string;
  summary: string[];
  keyTerms?: { term: string; definition: string }[];
  codeExample?: {
    language: string;
    vulnerable?: string;
    secure?: string;
    explanation: string;
  };
  quiz?: QuizQuestion[];
}

export interface TrackModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  badgeName: string;
  color: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Todos os Públicos';
  modules: TrackModule[];
}

export interface OwaspItem {
  id: string;
  code: string; // e.g. "A01:2021"
  title: string;
  englishTitle: string;
  severity: 'Crítica' | 'Alta' | 'Média';
  description: string;
  impact: string;
  howItWorks: string;
  prevention: string[];
  vulnerableSnippet: string;
  secureSnippet: string;
  language: string;
  labType?: 'sqli' | 'xss' | 'idor' | 'broken_auth' | 'misconfig';
}

export interface PentestPhase {
  id: string;
  phaseNumber: number;
  title: string;
  objective: string;
  description: string;
  actions: string[];
  recommendedTools: string[];
  deliverables: string;
}

export interface PentestTool {
  id: string;
  name: string;
  category: 'Reconhecimento' | 'Varredura & Portas' | 'Web & OWASP' | 'Senhas & Hashes' | 'Exploração' | 'Análise de Tráfego' | 'Engenharia Social';
  description: string;
  isLegalNotice: string;
  commonCommands: {
    command: string;
    description: string;
  }[];
}

export interface CTFChallenge {
  id: string;
  title: string;
  category: 'Recon' | 'Web' | 'Criptografia' | 'Forense' | 'Redes' | 'Engenharia Social';
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  points: number;
  description: string;
  hint: string;
  targetInfo: string;
  flag: string; // FLAG{...}
}

export interface SecurityTip {
  id: string;
  title: string;
  category: 'Senhas & 2FA' | 'Golpes & Phishing' | 'Redes & Wi-Fi' | 'Celular & Apps' | 'Navegação' | 'Empresas & Home Office';
  importance: 'Urgente' | 'Essencial' | 'Recomendada';
  summary: string;
  practicalSteps: string[];
  dos: string[];
  donts: string[];
}

export interface KidsQuest {
  id: string;
  title: string;
  iconName: string;
  category: 'Senhas Secretas' | 'Games Seguros' | 'Anti-Bullying' | 'Privacidade' | 'Detetive Fake News';
  story: string;
  mission: string;
  superTips: string[];
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  rewardBadge: string;
}

export interface EmergencyAction {
  id: string;
  threat: string;
  icon: string;
  urgency: 'Imediato' | 'Alta' | 'Moderada';
  firstActions: string[];
  detailedSteps: { step: number; title: string; desc: string }[];
  contactsToCall: string[];
}

export interface CyberShieldAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model?: string;
  isError?: boolean;
}
