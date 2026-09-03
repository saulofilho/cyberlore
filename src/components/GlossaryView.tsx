import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Lightbulb, Cpu, ShieldCheck, 
  AlertTriangle, Copy, Check, Shuffle, Tag, 
  Filter, Layers, ArrowRight, X, Sparkles 
} from 'lucide-react';
import { glossaryTerms } from '../data/glossaryData';
import { GlossaryCategory, GlossaryTerm } from '../types';

interface GlossaryViewProps {
  onNavigateToTrack?: (trackId: string) => void;
  initialTermId?: string | null;
}

const CATEGORIES: { id: 'Todos' | GlossaryCategory; label: string; icon: any }[] = [
  { id: 'Todos', label: 'Todos os Termos', icon: Layers },
  { id: 'Fundamentos', label: 'Fundamentos', icon: ShieldCheck },
  { id: 'Web & OWASP', label: 'Web & OWASP', icon: Cpu },
  { id: 'Pentest & Red Team', label: 'Pentest & Red Team', icon: AlertTriangle },
  { id: 'Criptografia & Senhas', label: 'Criptografia & Senhas', icon: Sparkles },
  { id: 'Ameaças & Golpes', label: 'Ameaças & Golpes', icon: AlertTriangle },
  { id: 'Redes & Infra', label: 'Redes & Infra', icon: Tag },
];

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onNavigateToTrack, initialTermId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | GlossaryCategory>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<'Todos' | 'Iniciante' | 'Intermediário' | 'Avançado'>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Random featured term
  const [randomTermIndex, setRandomTermIndex] = useState(() => Math.floor(Math.random() * glossaryTerms.length));

  const handleShuffle = () => {
    let nextIndex = Math.floor(Math.random() * glossaryTerms.length);
    if (nextIndex === randomTermIndex && glossaryTerms.length > 1) {
      nextIndex = (nextIndex + 1) % glossaryTerms.length;
    }
    setRandomTermIndex(nextIndex);
  };

  const featuredTerm = glossaryTerms[randomTermIndex];

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Todos' && item.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'Todos' && item.level !== selectedLevel) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTerm = item.term.toLowerCase().includes(query);
        const inAcronym = item.acronym?.toLowerCase().includes(query) ?? false;
        const inSimple = item.simpleExplanation.toLowerCase().includes(query);
        const inTech = item.technicalDefinition.toLowerCase().includes(query);
        const inExample = item.realWorldExample.toLowerCase().includes(query);
        const inRelated = item.relatedTerms?.some((r) => r.toLowerCase().includes(query)) ?? false;

        return inTerm || inAcronym || inSimple || inTech || inExample || inRelated;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const handleCopy = (term: GlossaryTerm) => {
    const text = `${term.term} (${term.acronym || ''})\n\n💡 Analogia para Iniciantes:\n${term.simpleExplanation}\n\n🔬 Definição Técnica:\n${term.technicalDefinition}\n\n🛡️ Como Mitigar:\n${term.howToPreventOrMitigate}`;
    navigator.clipboard.writeText(text);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectRelated = (termName: string) => {
    setSearchQuery(termName);
    setSelectedCategory('Todos');
    setSelectedLevel('Todos');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Header */}
      <div className="bg-[#15171E] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#00FF41] text-xs font-mono font-bold uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>GLOSSÁRIO TÉCNICO // CIBERSEGURANÇA SEM COMPLICAÇÃO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dicionário de Conceitos & Termos Hacker
          </h1>
          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Explicações sem jargões para iniciantes, complementadas com analogias do dia a dia, 
            definições técnicas aprofundadas, exemplos práticos de ataques e regras de defesa.
          </p>
        </div>

        {/* Stats Bento Box */}
        <div className="flex items-center gap-4 bg-black/40 border border-slate-800 p-4 rounded-xl shrink-0 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total de Termos</span>
            <span className="text-[#00FF41] font-bold text-lg">{glossaryTerms.length}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Nível Iniciante</span>
            <span className="text-[#00D1FF] font-bold text-lg">
              {glossaryTerms.filter(t => t.level === 'Iniciante').length}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Categorias</span>
            <span className="text-amber-400 font-bold text-lg">6</span>
          </div>
        </div>
      </div>

      {/* Featured / Random Term Spotlight Bento Card */}
      {featuredTerm && (
        <div className="bg-gradient-to-r from-[#15171E] to-[#121622] rounded-2xl border border-[#00FF41]/30 p-6 relative overflow-hidden shadow-lg shadow-[#00FF41]/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20">
                <Lightbulb className="w-4 h-4 text-[#00FF41]" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00FF41]">
                TERMO EM DESTAQUE // CONCEITO DO DIA
              </span>
            </div>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 hover:bg-black/60 border border-slate-800 text-slate-300 hover:text-[#00FF41] text-xs font-mono transition-all w-fit"
              title="Sortear outro termo"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Sortear Outro</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-white">{featuredTerm.term}</h3>
                {featuredTerm.acronym && (
                  <span className="text-xs font-mono bg-black/50 text-[#00D1FF] px-2 py-0.5 rounded border border-slate-800">
                    {featuredTerm.acronym}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {featuredTerm.category}
                </span>
                <span className={`px-2 py-0.5 rounded font-semibold ${
                  featuredTerm.level === 'Iniciante' 
                    ? 'text-[#00FF41] bg-[#00FF41]/10' 
                    : featuredTerm.level === 'Intermediário'
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-rose-400 bg-rose-400/10'
                }`}>
                  {featuredTerm.level}
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 bg-black/40 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Analogia Descomplicada:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{featuredTerm.simpleExplanation}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-[#15171E] rounded-2xl border border-slate-800 p-5 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar termo, sigla ou conceito (ex: SQLi, Phishing, 2FA, Exploit, Hash, VPN)..."
            className="w-full bg-black/40 border border-slate-800 focus:border-[#00FF41] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/40 shadow-sm font-semibold'
                    : 'bg-black/30 hover:bg-black/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Nível:
          </span>
          {(['Todos', 'Iniciante', 'Intermediário', 'Avançado'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors border ${
                selectedLevel === lvl
                  ? 'bg-slate-800 text-white border-slate-600 font-bold'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}

          {(searchQuery || selectedCategory !== 'Todos' || selectedLevel !== 'Todos') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos');
                setSelectedLevel('Todos');
              }}
              className="ml-auto text-[11px] text-[#00FF41] hover:underline font-mono"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>Exibindo {filteredTerms.length} de {glossaryTerms.length} termos catalogados</span>
        {searchQuery && <span>Filtrado por: "{searchQuery}"</span>}
      </div>

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="bg-[#15171E] rounded-2xl border border-slate-800 p-12 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum termo encontrado</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Não encontramos termos correspondentes aos critérios de busca. Tente buscar por outros nomes ou limpar os filtros.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
              setSelectedLevel('Todos');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono"
          >
            Ver todos os termos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map((term) => {
            const isCopied = copiedId === term.id;
            return (
              <div
                key={term.id}
                id={`term-${term.id}`}
                className="bg-[#15171E] rounded-2xl border border-slate-800 hover:border-slate-700 p-6 flex flex-col justify-between transition-all duration-200 group relative"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#00FF41] transition-colors">
                          {term.term}
                        </h3>
                        {term.acronym && (
                          <span className="text-[11px] font-mono bg-black/40 text-[#00D1FF] px-2 py-0.5 rounded border border-slate-800">
                            {term.acronym}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                        <span className="text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                          {term.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          term.level === 'Iniciante'
                            ? 'text-[#00FF41] bg-[#00FF41]/10'
                            : term.level === 'Intermediário'
                            ? 'text-amber-400 bg-amber-400/10'
                            : 'text-rose-400 bg-rose-400/10'
                        }`}>
                          {term.level}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(term)}
                      className="p-2 rounded-xl bg-black/40 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all shrink-0"
                      title="Copiar explicação"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Beginner Analogy Highlight Box */}
                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                      <Lightbulb className="w-3.5 h-3.5 text-[#00FF41]" />
                      <span>ANALOGIA PARA INICIANTES:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {term.simpleExplanation}
                    </p>
                  </div>

                  {/* Technical Definition */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Definição Técnica:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {term.technicalDefinition}
                    </p>
                  </div>

                  {/* Real World Example */}
                  <div className="bg-black/40 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      Cenário Real / Exemplo Prático:
                    </span>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed">
                      {term.realWorldExample}
                    </p>
                  </div>

                  {/* Mitigation / Protection */}
                  <div className="bg-black/30 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#00FF41] uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#00FF41]" />
                      Como Mitigar / Se Proteger:
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {term.howToPreventOrMitigate}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Related Terms & Actions */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-500">Relacionados:</span>
                      {term.relatedTerms.map((rel, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => handleSelectRelated(rel)}
                          className="text-[10px] font-mono text-slate-400 hover:text-[#00D1FF] bg-black/40 px-2 py-0.5 rounded border border-slate-800 hover:border-[#00D1FF]/40 transition-colors"
                        >
                          #{rel}
                        </button>
                      ))}
                    </div>
                  )}

                  {term.trackId && onNavigateToTrack && (
                    <button
                      onClick={() => onNavigateToTrack(term.trackId!)}
                      className="text-xs font-mono font-bold text-[#00FF41] hover:underline flex items-center gap-1 shrink-0 ml-auto"
                    >
                      <span>Ver na Trilha</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
