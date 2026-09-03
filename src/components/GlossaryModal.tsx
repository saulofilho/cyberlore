import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, X, Lightbulb, ShieldCheck, 
  AlertTriangle, Copy, Check, Sparkles, ExternalLink 
} from 'lucide-react';
import { glossaryTerms } from '../data/glossaryData';
import { GlossaryTerm } from '../types';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchQuery?: string;
  onNavigateToFullGlossary?: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  initialSearchQuery = '',
  onNavigateToFullGlossary,
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(() => {
    if (initialSearchQuery) {
      const match = glossaryTerms.find(
        (t) => t.term.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
               t.acronym?.toLowerCase().includes(initialSearchQuery.toLowerCase())
      );
      return match || glossaryTerms[0];
    }
    return glossaryTerms[0];
  });
  const [copied, setCopied] = useState(false);

  // Sync when initialSearchQuery changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSearch(initialSearchQuery);
      if (initialSearchQuery) {
        const found = glossaryTerms.find(
          (t) => t.term.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
                 t.acronym?.toLowerCase().includes(initialSearchQuery.toLowerCase())
        );
        if (found) setSelectedTerm(found);
      }
    }
  }, [isOpen, initialSearchQuery]);

  const filtered = useMemo(() => {
    if (!search.trim()) return glossaryTerms;
    const q = search.toLowerCase();
    return glossaryTerms.filter(
      (t) => t.term.toLowerCase().includes(q) ||
             t.acronym?.toLowerCase().includes(q) ||
             t.simpleExplanation.toLowerCase().includes(q) ||
             t.category.toLowerCase().includes(q)
    );
  }, [search]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!selectedTerm) return;
    const text = `${selectedTerm.term} (${selectedTerm.acronym || ''})\n\n💡 Analogia:\n${selectedTerm.simpleExplanation}\n\n🔬 Definição:\n${selectedTerm.technicalDefinition}\n\n🛡️ Prevenção:\n${selectedTerm.howToPreventOrMitigate}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#15171E] rounded-3xl border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#15171E] z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">Glossário Rápido de Cibersegurança</h2>
                <span className="text-[10px] font-mono text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/20">
                  POP-UP
                </span>
              </div>
              <p className="text-xs text-slate-400">Consulte termos técnicos e analogias descomplicadas em tempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToFullGlossary && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFullGlossary();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-slate-800 text-xs font-mono text-[#00FF41] hover:underline"
              >
                <span>Abrir Seção Completa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view (Terms list on left, detailed explanation on right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Search & List */}
          <div className="md:col-span-5 border-r border-slate-800 flex flex-col p-4 space-y-3 bg-black/20 overflow-hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar termo..."
                className="w-full bg-black/40 border border-slate-800 focus:border-[#00FF41] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[50vh] md:max-h-[60vh]">
              {filtered.map((t) => {
                const isSelected = selectedTerm?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTerm(t)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-white'
                        : 'bg-black/30 hover:bg-black/50 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs">{t.term}</span>
                      {t.acronym && (
                        <span className="text-[10px] font-mono text-[#00D1FF] bg-black/40 px-1.5 py-0.5 rounded">
                          {t.acronym}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>{t.category}</span>
                      <span>•</span>
                      <span className={t.level === 'Iniciante' ? 'text-[#00FF41]' : 'text-amber-400'}>
                        {t.level}
                      </span>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">Nenhum termo encontrado.</p>
              )}
            </div>
          </div>

          {/* Right Column: Selected Term Details */}
          <div className="md:col-span-7 p-6 overflow-y-auto max-h-[65vh] space-y-5">
            {selectedTerm ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-extrabold text-white">{selectedTerm.term}</h3>
                      {selectedTerm.acronym && (
                        <span className="text-xs font-mono text-[#00D1FF] bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                          {selectedTerm.acronym}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs font-mono">
                      <span className="text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                        {selectedTerm.category}
                      </span>
                      <span className="text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/20 font-bold">
                        {selectedTerm.level}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-black/40 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all shrink-0"
                    title="Copiar explicação"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#00FF41]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Beginner Analogy */}
                <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00FF41] font-mono">
                    <Lightbulb className="w-4 h-4" />
                    <span>ANALOGIA PARA INICIANTES</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{selectedTerm.simpleExplanation}"
                  </p>
                </div>

                {/* Technical Definition */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Definição Técnica:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedTerm.technicalDefinition}
                  </p>
                </div>

                {/* Real-world Example */}
                <div className="bg-black/40 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Exemplo no Mundo Real:
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {selectedTerm.realWorldExample}
                  </p>
                </div>

                {/* Mitigation */}
                <div className="bg-black/30 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-[#00FF41] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00FF41]" />
                    Como se Proteger:
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedTerm.howToPreventOrMitigate}
                  </p>
                </div>

                {/* Related Terms */}
                {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-mono text-slate-500">Termos Relacionados:</span>
                    {selectedTerm.relatedTerms.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearch(r);
                          const found = glossaryTerms.find(t => t.term.toLowerCase().includes(r.toLowerCase()));
                          if (found) setSelectedTerm(found);
                        }}
                        className="text-[10px] font-mono text-slate-300 hover:text-[#00FF41] bg-black/40 px-2 py-0.5 rounded border border-slate-800 hover:border-[#00FF41]/40 transition-colors"
                      >
                        #{r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Selecione um termo na lista ao lado.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-black/40 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{glossaryTerms.length} termos catalogados</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
