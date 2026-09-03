import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Award,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Flame,
  Radar as RadarIcon
} from 'lucide-react';
import { Track, UserProgress } from '../types';
import { calculateLevel, generateDefaultXpHistory } from '../utils/storage';

interface ProgressDashboardCardProps {
  progress: UserProgress;
  tracks: Track[];
  onSelectTrack?: (track: Track) => void;
}

type ChartViewType = 'xp_timeline' | 'tracks_completion' | 'radar_skills';

const TRACK_COLORS = [
  '#00FF41', // Emerald - Cidadão Digital
  '#00D1FF', // Cyan - Redes & Linux
  '#F59E0B', // Amber - Web & OWASP
  '#EF4444', // Rose - Pentest & Red Team
  '#6366F1', // Indigo - Blue Team
  '#A855F7', // Purple - Engenharia Social
];

export const ProgressDashboardCard: React.FC<ProgressDashboardCardProps> = ({
  progress,
  tracks,
  onSelectTrack,
}) => {
  const [activeView, setActiveView] = useState<ChartViewType>('xp_timeline');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // 1. Level & XP stats
  const levelInfo = useMemo(() => calculateLevel(progress.xp), [progress.xp]);

  // 2. Prepare XP accumulation timeline data
  const timelineData = useMemo(() => {
    if (progress.xpHistory && progress.xpHistory.length > 0) {
      return progress.xpHistory.map(entry => ({
        date: entry.date,
        fullDate: entry.fullDate,
        xp: entry.xp,
        gain: entry.gain || 0,
        activity: entry.activity || 'Atividade de Treinamento'
      }));
    }
    return generateDefaultXpHistory(progress.xp).map(entry => ({
      date: entry.date,
      fullDate: entry.fullDate,
      xp: entry.xp,
      gain: entry.gain || 0,
      activity: entry.activity || 'Atividade de Treinamento'
    }));
  }, [progress.xp, progress.xpHistory]);

  // 3. Prepare tracks completion data
  const { trackStats, totalAllLessons, completedAllLessons, globalCompletionPct } = useMemo(() => {
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    const stats = tracks.map((track, idx) => {
      const trackLessons = track.modules.flatMap(m => m.lessons);
      const totalInTrack = trackLessons.length;
      const completedInTrack = trackLessons.filter(l =>
        progress.completedLessons.includes(l.id)
      ).length;

      const completionPct = totalInTrack > 0
        ? Math.round((completedInTrack / totalInTrack) * 100)
        : 0;

      totalLessonsCount += totalInTrack;
      completedLessonsCount += completedInTrack;

      // Clean short name for charts
      const shortTitle = track.title.split('&')[0].trim();

      return {
        trackId: track.id,
        track,
        name: shortTitle,
        fullName: track.title,
        completionPct,
        completed: completedInTrack,
        total: totalInTrack,
        color: TRACK_COLORS[idx % TRACK_COLORS.length]
      };
    });

    const globalPct = totalLessonsCount > 0
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
      : 0;

    return {
      trackStats: stats,
      totalAllLessons: totalLessonsCount,
      completedAllLessons: completedLessonsCount,
      globalCompletionPct: globalPct
    };
  }, [tracks, progress.completedLessons]);

  // 4. Prepare Radar chart data
  const radarData = useMemo(() => {
    return trackStats.map(stat => ({
      subject: stat.name,
      conclusao: stat.completionPct,
      fullMark: 100
    }));
  }, [trackStats]);

  return (
    <div
      id="progress-dashboard-card"
      className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#111319] to-[#0A0C10] shadow-xl overflow-hidden transition-all duration-300"
    >
      {/* Card Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF41]/20 to-[#00D1FF]/20 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41] shrink-0 shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
                Painel de Telemetria & Progresso
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[10px] font-mono text-[#00FF41]">
                LIVE RECHARTS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Acumulação de XP no tempo e taxa de conclusão das trilhas de cibersegurança
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-black/60 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => {
                setActiveView('xp_timeline');
                setIsExpanded(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeView === 'xp_timeline'
                  ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="Visualizar curva de XP acumulado no tempo"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Evolução XP</span>
            </button>

            <button
              onClick={() => {
                setActiveView('tracks_completion');
                setIsExpanded(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeView === 'tracks_completion'
                  ? 'bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="Visualizar porcentagem de conclusão por trilha"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Por Trilha</span>
            </button>

            <button
              onClick={() => {
                setActiveView('radar_skills');
                setIsExpanded(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeView === 'radar_skills'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="Radar de equilíbrio de competências"
            >
              <RadarIcon className="w-3.5 h-3.5" />
              <span>Radar</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isExpanded ? 'Recolher Painel' : 'Expandir Painel'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-5 border-b border-slate-800/50 bg-black/20">
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">XP Acumulado</span>
            <Zap className="w-3.5 h-3.5 text-[#00FF41]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{progress.xp}</span>
            <span className="text-xs text-[#00FF41] font-mono font-semibold">XP</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Nível: <strong className="text-slate-300">{levelInfo.level}</strong>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Conclusão Geral</span>
            <Target className="w-3.5 h-3.5 text-[#00D1FF]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{globalCompletionPct}%</span>
            <span className="text-xs text-[#00D1FF] font-mono">currículo</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {completedAllLessons} de {totalAllLessons} aulas feitas
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Ofensiva Diária</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{progress.dailyStreak || 0}</span>
            <span className="text-xs text-amber-400 font-mono">dias</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {progress.dailyStreak && progress.dailyStreak > 0 ? 'Sequência ativa!' : 'Inicie sua sequência hoje'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Distintivos</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{progress.badges.length}</span>
            <span className="text-xs text-purple-400 font-mono">badges</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {progress.capturedFlags.length} flags capturadas
          </div>
        </div>
      </div>

      {/* Expandable Chart Canvas Section */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* VIEW 1: XP ACCUMULATION OVER TIME (AREA CHART) */}
          {activeView === 'xp_timeline' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
                    Curva de Acumulação de Experiência (XP ao Longo do Tempo)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Evolução cumulativa de XP obtido em lições, quizzes e desafios resolvidos
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="inline-block w-3 h-1 bg-[#00FF41] rounded"></span>
                  <span>XP Acumulado</span>
                </div>
              </div>

              {/* AreaChart Container */}
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timelineData}
                    margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF41" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00FF41" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      fontFamily="monospace"
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      fontFamily="monospace"
                      tickLine={false}
                      domain={[0, 'auto']}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 bg-[#0A0C10] border border-[#00FF41]/40 rounded-xl shadow-2xl font-mono text-xs space-y-1">
                              <div className="text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                                DATA: {data.fullDate || data.date}
                              </div>
                              <div className="text-sm font-bold text-[#00FF41] flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" />
                                {data.xp} XP acumulados
                              </div>
                              {data.gain > 0 && (
                                <div className="text-slate-300 text-[11px]">
                                  Ganho no dia: <strong className="text-emerald-400">+{data.gain} XP</strong>
                                </div>
                              )}
                              <div className="text-[10px] text-slate-500">
                                {data.activity}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="xp"
                      stroke="#00FF41"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#xpGradient)"
                      activeDot={{ r: 6, stroke: '#00FF41', strokeWidth: 2, fill: '#0A0C10' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Progress Milestones Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                <div className="p-2 rounded-lg bg-black/40 border border-slate-800 text-[11px]">
                  <span className="text-slate-500 block text-[10px]">Próximo Nível:</span>
                  <span className="text-slate-200 font-semibold">{levelInfo.nextLevelXp} XP</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-slate-800 text-[11px]">
                  <span className="text-slate-500 block text-[10px]">Progresso Nível:</span>
                  <span className="text-[#00FF41] font-semibold">{Math.round(levelInfo.progressPct)}%</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-slate-800 text-[11px]">
                  <span className="text-slate-500 block text-[10px]">Aulas Feitas:</span>
                  <span className="text-[#00D1FF] font-semibold">{completedAllLessons} aulas</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-slate-800 text-[11px]">
                  <span className="text-slate-500 block text-[10px]">Quizzes Feitos:</span>
                  <span className="text-amber-400 font-semibold">{Object.keys(progress.completedQuizzes).length}</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: COMPLETION PERCENTAGE ACROSS DIFFERENT CYBERSECURITY TRACKS (BAR CHART) */}
          {activeView === 'tracks_completion' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D1FF]"></span>
                    Taxa de Conclusão por Trilha de Cibersegurança
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Percentual completado de 0% a 100% nas 6 trilhas especializadas
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Total de Trilhas: {tracks.length}
                </span>
              </div>

              {/* Horizontal BarChart */}
              <div className="h-72 sm:h-80 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trackStats}
                    layout="vertical"
                    margin={{ top: 5, right: 35, left: 15, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      stroke="#64748b"
                      fontSize={11}
                      fontFamily="monospace"
                      tickFormatter={(val) => `${val}%`}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#94a3b8"
                      fontSize={11}
                      fontFamily="monospace"
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 bg-[#0A0C10] border border-slate-700 rounded-xl shadow-2xl font-mono text-xs space-y-1.5">
                              <div className="text-white font-bold text-xs pb-1 border-b border-slate-800">
                                {data.fullName}
                              </div>
                              <div className="flex items-center justify-between gap-4 text-slate-300">
                                <span>Conclusão:</span>
                                <strong style={{ color: data.color }} className="text-sm">
                                  {data.completionPct}%
                                </strong>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Aulas concluídas: <strong className="text-white">{data.completed}</strong> de {data.total}
                              </div>
                              <div className="text-[10px] text-slate-500 italic">
                                {data.completionPct === 100
                                  ? '🏆 Trilha 100% Dominada!'
                                  : data.completionPct > 0
                                  ? 'Em andamento'
                                  : 'Não iniciada'}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="completionPct"
                      radius={[0, 6, 6, 0]}
                      barSize={18}
                    >
                      {trackStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Interactive Quick-Navigation Chips for each track */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Acessar trilhas diretamente:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {trackStats.map((st) => (
                    <button
                      key={st.trackId}
                      onClick={() => onSelectTrack && onSelectTrack(st.track)}
                      className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-semibold text-slate-200 block truncate group-hover:text-white">
                          {st.fullName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {st.completed}/{st.total} aulas ({st.completionPct}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${st.color}20`,
                            color: st.color,
                            border: `1px solid ${st.color}40`
                          }}
                        >
                          {st.completionPct}%
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: SKILLS RADAR (RADARCHART) */}
          {activeView === 'radar_skills' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    Radar de Competências & Equilíbrio de Especialidades
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Visão poligonal do seu domínio nas 6 frentes de segurança cibernética
                  </p>
                </div>
                <span className="text-[11px] font-mono text-purple-400">
                  Escala: 0% a 100%
                </span>
              </div>

              <div className="h-72 sm:h-80 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                      dataKey="subject"
                      stroke="#94a3b8"
                      fontSize={11}
                      fontFamily="monospace"
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke="#475569"
                      fontSize={9}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Radar
                      name="Conclusão"
                      dataKey="conclusao"
                      stroke="#A855F7"
                      fill="#A855F7"
                      fillOpacity={0.35}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-2.5 bg-[#0A0C10] border border-purple-500/40 rounded-xl shadow-xl font-mono text-xs">
                              <div className="text-purple-300 font-bold">{data.subject}</div>
                              <div className="text-white text-xs mt-1">
                                Domínio: <strong className="text-[#00FF41]">{data.conclusao}%</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2 font-mono">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  Para ser um <strong>White Hat Elite</strong> completo, busque equilibrar todas as 6 pontas do polígono completando as aulas de cada trilha!
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
