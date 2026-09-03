import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Terminal, 
  Lightbulb, 
  ShieldCheck, 
  Code2,
  Zap
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Lesson, Track, CyberShieldAIMessage } from '../types';

interface CyberShieldAITutorProps {
  lesson: Lesson;
  track: Track;
}

export const CyberShieldAITutor: React.FC<CyberShieldAITutorProps> = ({
  lesson,
  track
}) => {
  const [messages, setMessages] = useState<CyberShieldAIMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Clear or reset messages when user switches lessons
  useEffect(() => {
    setMessages([]);
    setErrorMsg(null);
    setInputQuestion('');
  }, [lesson.id]);

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Dynamic quick questions based on lesson context
  const quickQuestions = [
    {
      id: 'analogy',
      label: '💡 Explicar com analogia simples',
      prompt: `Explique o conceito principal da lição "${lesson.title}" usando uma analogia simples e intuitiva do cotidiano, sem jargões complicados.`
    },
    {
      id: 'defense',
      label: '🛡️ Como aplicar na prática (Defesa)',
      prompt: `Quais são as ações práticas e mandatórias de ciberdefesa para proteger sistemas ou usuários contra as vulnerabilidades tratadas em "${lesson.title}"?`
    },
    {
      id: 'real_impact',
      label: '⚠️ Impacto de ataques no mundo real',
      prompt: `Como criminosos exploram o que foi ensinado em "${lesson.title}" e quais incidentes ou prejuízos reais isso costuma causar em empresas?`
    },
    ...(lesson.codeExample ? [{
      id: 'code_explanation',
      label: '💻 Explicar o código vulnerável vs seguro',
      prompt: `Analise o código da lição "${lesson.title}". Por que a versão vulnerável falha e por que a versão blindada resolve a brecha de segurança?`
    }] : []),
    ...(lesson.keyTerms && lesson.keyTerms.length > 0 ? [{
      id: 'terms_breakdown',
      label: '📖 Descomplicar os termos técnicos',
      prompt: `Descomplique os termos técnicos da lição "${lesson.title}" (${lesson.keyTerms.map(t => t.term).join(', ')}) conectando-os em uma história lógica.`
    }] : [])
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const questionToSend = (customPrompt || inputQuestion).trim();
    if (!questionToSend || isLoading) return;

    setErrorMsg(null);
    setInputQuestion('');

    const userMessage: CyberShieldAIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: questionToSend,
      timestamp: Date.now()
    };

    const newMessagesHistory = [...messages, userMessage];
    setMessages(newMessagesHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lessonTitle: lesson.title,
          trackTitle: track.title,
          lessonContent: lesson.content,
          keyTerms: lesson.keyTerms,
          codeExample: lesson.codeExample,
          userQuestion: questionToSend,
          conversationHistory: newMessagesHistory.slice(-4)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.isApiKeyMissing) {
          // Provide an intelligent offline contextual explanation
          const fallbackExplanation = generateContextualFallback(lesson, questionToSend);
          const aiMessage: CyberShieldAIMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: fallbackExplanation,
            timestamp: Date.now(),
            model: 'CyberShield Local Base (Configure GEMINI_API_KEY no painel de Secrets para ativar Gemini 3.8 Flash)'
          };
          setMessages(prev => [...prev, aiMessage]);
          return;
        }
        throw new Error(data.error || 'Erro ao consultar o CyberShield AI');
      }

      const aiMessage: CyberShieldAIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.explanation,
        timestamp: Date.now(),
        model: data.model || 'gemini-3.8-flash'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('CyberShield AI fetch error:', err);
      // Fallback gracefully so student always gets educational value
      const fallback = generateContextualFallback(lesson, questionToSend);
      const aiMessage: CyberShieldAIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `${fallback}\n\n*(Nota: O servidor reportou: ${err.message || 'Erro de conexão'}. Resposta gerada a partir do acervo contextual da aula).*`,
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    setErrorMsg(null);
  };

  return (
    <div 
      id="cybershield-ai-tutor"
      className="rounded-2xl border border-[#00FF41]/30 bg-gradient-to-b from-[#15171E] to-[#0D0F15] overflow-hidden shadow-xl shadow-black/40 transition-all duration-300"
    >
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00FF41]/20 to-[#00D1FF]/20 border border-[#00FF41]/40 flex items-center justify-center text-[#00FF41] shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-1.5">
                CYBERSHIELD AI // TUTOR DA LIÇÃO
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 text-[10px] font-mono text-[#00FF41]">
                <Sparkles className="w-3 h-3 animate-pulse" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Explicações personalizadas e contextualizadas para: <strong className="text-slate-200">{lesson.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Limpar histórico da conversa"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-mono">Reiniciar</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Recolher Tutor' : 'Expandir Tutor'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Expandable Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5">
          {/* Introductory Prompt Suggestions (when chat is empty) */}
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block mb-0.5">
                    Está com dúvidas ou achou o conceito abstrato?
                  </span>
                  Peça uma explicação ao <strong>CyberShield AI</strong>. Ele lê o conteúdo desta lição, seu código de exemplo e termos técnicos para te responder com analogias claras e defesas práticas.
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Perguntas rápidas sugeridas para esta lição:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickQuestions.map(q => (
                    <button
                      key={q.id}
                      onClick={() => handleSendMessage(q.prompt)}
                      disabled={isLoading}
                      className="text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-[#00FF41]/40 text-xs text-slate-200 transition-all flex items-center justify-between group disabled:opacity-50"
                    >
                      <span className="group-hover:text-[#00FF41] transition-colors">{q.label}</span>
                      <Zap className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00FF41] shrink-0 ml-1 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat Messages Timeline */
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-mono text-slate-400">
                    {msg.role === 'user' ? (
                      <span>Você</span>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-[#00FF41]" />
                        <span className="text-[#00FF41] font-semibold">CyberShield AI</span>
                        {msg.model && (
                          <span className="text-[9px] text-slate-500">({msg.model})</span>
                        )}
                      </>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl max-w-[95%] sm:max-w-[88%] text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#00FF41]/15 text-white border border-[#00FF41]/40 font-mono'
                        : 'bg-black/60 text-slate-200 border border-slate-800'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="space-y-3">
                        <div className="prose prose-invert prose-xs max-w-none text-slate-200 [&>p]:mb-2.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2.5 [&>ol]:list-decimal [&>ol]:pl-4 [&>h1]:text-sm [&>h1]:font-bold [&>h2]:text-xs [&>h2]:font-bold [&>h2]:text-[#00FF41] [&>h3]:text-xs [&>h3]:font-bold [&>h3]:text-[#00D1FF] [&>pre]:bg-black [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-slate-800 [&>code]:text-[#00FF41] [&>code]:bg-slate-900 [&>code]:px-1 [&>code]:rounded">
                          <Markdown>{msg.content}</Markdown>
                        </div>

                        {/* Action footer for assistant responses */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                            title="Copiar explicação"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#00FF41]" />
                                <span className="text-[#00FF41]">Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                          <span className="text-[10px] text-slate-500">
                            Contexto: {lesson.title}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 text-xs font-mono text-slate-400 p-3 rounded-xl bg-black/40 border border-slate-800 animate-pulse">
                  <Bot className="w-4 h-4 text-[#00FF41] animate-spin" />
                  <span>CyberShield AI está analisando o contexto da lição e elaborando a explicação...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick Follow-Up Chips (when there are already messages) */}
          {messages.length > 0 && !isLoading && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[10px] font-mono text-slate-500 shrink-0">Sugerir:</span>
              <button
                onClick={() => handleSendMessage('Dê outro exemplo prático disso')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#00FF41]/40 text-slate-300 text-[11px] font-mono whitespace-nowrap transition-colors"
              >
                + Outro exemplo prático
              </button>
              <button
                onClick={() => handleSendMessage('Como isso costuma cair em provas e certificações como CompTIA Security+ ou CEH?')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#00FF41]/40 text-slate-300 text-[11px] font-mono whitespace-nowrap transition-colors"
              >
                + Como cai em certificações?
              </button>
              <button
                onClick={() => handleSendMessage('Explique como se eu tivesse 10 anos')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#00FF41]/40 text-slate-300 text-[11px] font-mono whitespace-nowrap transition-colors"
              >
                + Explique ainda mais simples
              </button>
            </div>
          )}

          {/* User Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="space-y-2 pt-1"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder={`Pergunte algo sobre "${lesson.title}"...`}
                  disabled={isLoading}
                  className="w-full bg-black/60 border border-slate-700 focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={!inputQuestion.trim() || isLoading}
                className="px-4 py-2.5 bg-[#00FF41] hover:bg-[#00FF41]/90 disabled:bg-slate-800 disabled:text-slate-600 text-black font-mono font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 shadow-md shadow-[#00FF41]/20"
                title="Enviar pergunta ao CyberShield AI"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Perguntar</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

// Helper to provide helpful contextual explanations offline/fallback
function generateContextualFallback(lesson: Lesson, question: string): string {
  const title = lesson.title;
  const terms = lesson.keyTerms?.map(t => `**${t.term}**: ${t.definition}`).join('\n') || '';
  const takeaways = lesson.summary?.map(s => `- ${s}`).join('\n') || '';

  return `### 🛡️ Explicação Contextual: ${title}

Você perguntou: *"${question}"*

Aqui está uma análise sintetizada pelo **CyberShield AI** para fixação imediata:

#### 1. Analogia Intuitiva & O Conceito
Pense neste tópico como a segurança de uma agência bancária:
- Não adianta ter uma porta blindada se as chaves forem deixadas sob o tapete ou se o atendente entregar o dinheiro para qualquer um que disser *"sou o gerente"* sem checar o crachá.
- Na lição **${title}**, o objetivo central é garantir que as entradas de dados sejam validadas, as identidades verificadas e os canais criptografados antes de conceder qualquer permissão.

#### 2. Termos Vitais da Lição
${terms || '- Conceitos fundamentais de defesa em profundidade e princípio do menor privilégio.'}

#### 3. Regra de Ouro do Hacker Ético
${takeaways || '- Audite seu código antes que atacantes o façam.\n- Trate toda entrada vinda de fora como potencialmente hostil.'}

*(Dica: Conecte sua GEMINI_API_KEY no menu de segredos para ativar o motor dinâmico Gemini 3.8 Flash com suporte a perguntas livres ilimitadas!)*`;
}
