import React, { useState } from 'react';
import { 
  Code2, 
  AlertTriangle, 
  ShieldCheck, 
  Terminal, 
  Play, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Layers, 
  Database, 
  Search,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { owaspTop10List } from '../data/owaspData';
import { OwaspItem } from '../types';
import { triggerConfetti } from '../utils/storage';

export const OwaspLabView: React.FC = () => {
  const [selectedOwaspId, setSelectedOwaspId] = useState<string>(owaspTop10List[0].id);
  const [activeTab, setActiveTab] = useState<'details' | 'lab'>('details');

  // SQLi Lab State
  const [sqliInputUser, setSqliInputUser] = useState<string>("admin' OR '1'='1");
  const [sqliInputPass, setSqliInputPass] = useState<string>('qualquer_coisa');
  const [sqliMode, setSqliMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [sqliResult, setSqliResult] = useState<any>(null);

  // XSS Lab State
  const [xssInput, setXssInput] = useState<string>("<script>alert('Cookie de Sessão Roubado: session_token=xyz123')</script>");
  const [xssMode, setXssMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [xssComments, setXssComments] = useState<string[]>([
    'Excelente artigo sobre cibersegurança!',
    'Adorei as dicas de proteção.'
  ]);
  const [xssAlertTriggered, setXssAlertTriggered] = useState<string | null>(null);

  // IDOR Lab State
  const [idorRequestedId, setIdorRequestedId] = useState<number>(105);
  const [idorLoggedUserId] = useState<number>(101);
  const [idorMode, setIdorMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [idorResponse, setIdorResponse] = useState<any>(null);

  // Broken Auth Lab State
  const [authAttempts, setAuthAttempts] = useState<number>(0);
  const [authIsBlocked, setAuthIsBlocked] = useState<boolean>(false);
  const [authLog, setAuthLog] = useState<string[]>([]);
  const [authWithRateLimit, setAuthWithRateLimit] = useState<boolean>(false);

  const selectedItem = owaspTop10List.find(item => item.id === selectedOwaspId) || owaspTop10List[0];

  // Run SQLi Simulation
  const handleExecuteSqli = () => {
    if (sqliMode === 'vulnerable') {
      const isBypass = sqliInputUser.includes("' OR '1'='1") || sqliInputUser.includes("' OR 1=1");
      if (isBypass) {
        setSqliResult({
          status: 'HACKED',
          message: 'Bypass de Autenticação Concluído com Sucesso!',
          authenticatedUser: { id: 1, username: 'admin_master', role: 'SUPER_ADMIN', email: 'root@empresa.com.br', balance: 'R$ 1.500.000,00' },
          rawQuery: `SELECT * FROM users WHERE username = '${sqliInputUser}' AND password = '${sqliInputPass}';`
        });
        triggerConfetti();
      } else {
        setSqliResult({
          status: 'FAILED',
          message: 'Usuário ou senha incorretos na consulta concatenada.',
          rawQuery: `SELECT * FROM users WHERE username = '${sqliInputUser}' AND password = '${sqliInputPass}';`
        });
      }
    } else {
      // Secure mode
      setSqliResult({
        status: 'SECURE_BLOCKED',
        message: 'Ataque Bloqueado! A aplicação usou Prepared Statement ($1, $2). O payload foi tratado como texto puro literal.',
        rawQuery: `SELECT * FROM users WHERE username = $1 AND password = $2; -- Parâmetros: ["${sqliInputUser}", "${sqliInputPass}"]`
      });
    }
  };

  // Run XSS Simulation
  const handleAddXssComment = () => {
    if (!xssInput.trim()) return;
    
    if (xssMode === 'vulnerable') {
      if (xssInput.includes('<script>') || xssInput.includes('alert(') || xssInput.includes('onerror=')) {
        setXssAlertTriggered(xssInput);
        triggerConfetti();
      }
      setXssComments(prev => [...prev, xssInput]);
    } else {
      // Sanitized
      const sanitized = xssInput
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      setXssAlertTriggered(null);
      setXssComments(prev => [...prev, sanitized]);
    }
  };

  // Run IDOR Simulation
  const handleFetchIdorInvoice = () => {
    const mockInvoices: Record<number, any> = {
      101: { id: 101, owner: 'Carlos Silva (Você)', total: 'R$ 350,00', items: ['Plano Básico'], cardLast4: '4123' },
      102: { id: 102, owner: 'Mariana Souza (Outro Usuário)', total: 'R$ 4.200,00', items: ['Consultoria VIP'], cardLast4: '8891' },
      105: { id: 105, owner: 'Diretoria Financeira (Confidencial)', total: 'R$ 890.000,00', items: ['Aquisição de Servidores'], cardLast4: '9900' }
    };

    if (idorMode === 'vulnerable') {
      const data = mockInvoices[idorRequestedId] || { error: 'Fatura não encontrada' };
      setIdorResponse({
        status: idorRequestedId !== idorLoggedUserId ? 'EXPOSED_IDOR' : 'NORMAL',
        data
      });
      if (idorRequestedId !== idorLoggedUserId) triggerConfetti();
    } else {
      if (idorRequestedId !== idorLoggedUserId) {
        setIdorResponse({
          status: 'BLOCKED_403',
          data: { error: 'HTTP 403 Forbidden: Você não tem permissão para visualizar faturas de outros clientes.' }
        });
      } else {
        setIdorResponse({
          status: 'NORMAL',
          data: mockInvoices[101]
        });
      }
    }
  };

  // Run Broken Auth Brute Force Step
  const handleSimulateBruteForceAttempt = (passwordGuess: string) => {
    if (authIsBlocked) return;
    const newCount = authAttempts + 1;
    setAuthAttempts(newCount);

    if (authWithRateLimit && newCount >= 4) {
      setAuthIsBlocked(true);
      setAuthLog(prev => [`[RATE LIMIT 429] IP bloqueado por 15 minutos após 4 tentativas suspeitas consecutivas!`, ...prev]);
      return;
    }

    if (passwordGuess === 'admin2026!') {
      setAuthLog(prev => [`[SUCESSO] Senha correta descoberta: 'admin2026!' na tentativa #${newCount}`, ...prev]);
      triggerConfetti();
    } else {
      setAuthLog(prev => [`[FALHA] Tentativa #${newCount} com senha: '${passwordGuess}' -> 401 Unauthorized`, ...prev]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          <Code2 className="w-3.5 h-3.5" />
          <span>OWASP Top 10 Web Application Security Standard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Laboratório Prático OWASP Top 10
        </h1>
        <p className="text-slate-400 mt-1 max-w-3xl text-sm sm:text-base">
          Explore as 10 vulnerabilidades mais críticas da web. Teste falhas reais em ambientes controlados, compreenda a mecânica dos ataques e aprenda como corrigi-las no código.
        </p>
      </div>

      {/* Top 10 Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-8">
        {owaspTop10List.map((item) => {
          const isSelected = item.id === selectedOwaspId;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedOwaspId(item.id);
                setActiveTab('details');
              }}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-mono text-xs font-bold block">{item.code.split(':')[0]}</span>
              <span className="text-[10px] line-clamp-1 mt-0.5">{item.englishTitle.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Item Details and Lab View */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Header with Switcher */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {selectedItem.code}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                selectedItem.severity === 'Crítica'
                  ? 'bg-rose-950/50 text-rose-300 border-rose-800'
                  : 'bg-amber-950/50 text-amber-300 border-amber-800'
              }`}>
                Severidade {selectedItem.severity}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {selectedItem.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedItem.englishTitle}
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'details'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Teoria & Correção
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'lab'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Simulador Sandbox
            </button>
          </div>
        </div>

        {/* Tab 1: Theory, Vulnerability and Code Comparison */}
        {activeTab === 'details' && (
          <div className="p-6 sm:p-8 space-y-8">
            {/* Description & Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  O que é e Como Funciona?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>
                <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  {selectedItem.howItWorks}
                </p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Impacto Potencial no Negócio
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedItem.impact}
                </p>
              </div>
            </div>

            {/* Code Comparison */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase font-bold text-slate-200 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Comparativo de Implementação: Vulnerável vs Seguro ({selectedItem.language})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vulnerable */}
                <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl overflow-hidden">
                  <div className="bg-rose-950/60 px-4 py-2 text-xs font-bold text-rose-300 border-b border-rose-900/40 flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-rose-400" />
                    Código Vulnerável (Não Fazer)
                  </div>
                  <pre className="p-4 text-xs font-mono text-rose-200 overflow-x-auto leading-relaxed">
                    <code>{selectedItem.vulnerableSnippet}</code>
                  </pre>
                </div>

                {/* Secure */}
                <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl overflow-hidden">
                  <div className="bg-emerald-950/60 px-4 py-2 text-xs font-bold text-emerald-300 border-b border-emerald-900/40 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Código Corrigido e Seguro (Padrão OWASP)
                  </div>
                  <pre className="p-4 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed">
                    <code>{selectedItem.secureSnippet}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Prevention Checklist */}
            <div className="bg-slate-950/60 rounded-xl p-6 border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Diretrizes de Mitigação e Defesa
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                {selectedItem.prevention.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Sandbox Labs */}
        {activeTab === 'lab' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Lab 1: SQL Injection */}
            {selectedItem.labType === 'sqli' || selectedItem.id === 'a03-injection' ? (
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-amber-400" />
                        Simulador de Autenticação & SQL Injection
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Experimente payloads clássicos de bypass de login (ex: <code className="text-amber-300 font-mono">admin' OR '1'='1</code>) e alterne para o modo protegido com Prepared Statements.
                      </p>
                    </div>

                    {/* Protection Mode Toggle */}
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
                      <button
                        onClick={() => setSqliMode('vulnerable')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          sqliMode === 'vulnerable'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Modo Vulnerável (Concat)
                      </button>
                      <button
                        onClick={() => setSqliMode('secure')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          sqliMode === 'secure'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Modo Seguro (Prepared)
                      </button>
                    </div>
                  </div>

                  {/* Input Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Campo Usuário / E-mail:</label>
                      <input
                        type="text"
                        value={sqliInputUser}
                        onChange={(e) => setSqliInputUser(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                        placeholder="Ex: admin' OR '1'='1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Campo Senha:</label>
                      <input
                        type="text"
                        value={sqliInputPass}
                        onChange={(e) => setSqliInputPass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                        placeholder="Senha qualquer..."
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Atalhos rápidos:</span>
                      <button
                        onClick={() => {
                          setSqliInputUser("admin' OR '1'='1");
                          setSqliInputPass("x");
                        }}
                        className="text-xs font-mono px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded border border-slate-800"
                      >
                        admin' OR '1'='1
                      </button>
                      <button
                        onClick={() => {
                          setSqliInputUser("admin' --");
                          setSqliInputPass("");
                        }}
                        className="text-xs font-mono px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded border border-slate-800"
                      >
                        admin' --
                      </button>
                    </div>

                    <button
                      onClick={handleExecuteSqli}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Executar Consulta SQL
                    </button>
                  </div>

                  {/* SQL Result Console */}
                  {sqliResult && (
                    <div className="mt-6 space-y-3 pt-4 border-t border-slate-800">
                      <div>
                        <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                          Query SQL Gerada no Servidor:
                        </span>
                        <pre className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-cyan-300 border border-slate-800 overflow-x-auto">
                          <code>{sqliResult.rawQuery}</code>
                        </pre>
                      </div>

                      <div className={`p-4 rounded-xl border text-xs sm:text-sm ${
                        sqliResult.status === 'HACKED'
                          ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                          : sqliResult.status === 'SECURE_BLOCKED'
                          ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}>
                        <span className="font-bold block mb-1">{sqliResult.message}</span>
                        {sqliResult.authenticatedUser && (
                          <div className="mt-2 p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
                            <p className="text-emerald-400 font-bold">👑 Sessão do Administrador Conquistada:</p>
                            <p>Nome: {sqliResult.authenticatedUser.username} | Role: {sqliResult.authenticatedUser.role}</p>
                            <p>E-mail: {sqliResult.authenticatedUser.email} | Saldo: {sqliResult.authenticatedUser.balance}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedItem.labType === 'idor' || selectedItem.id === 'a01-broken-access-control' ? (
              /* Lab 2: IDOR */
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        Simulador de IDOR (Insecure Direct Object Reference)
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Você está autenticado como <strong>Usuário ID: 101</strong> (Carlos). Altere o ID na URL para testar se a API expõe dados alheios.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
                      <button
                        onClick={() => setIdorMode('vulnerable')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          idorMode === 'vulnerable'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        API Sem Validação (Vulnerável)
                      </button>
                      <button
                        onClick={() => setIdorMode('secure')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          idorMode === 'secure'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        API com RBAC (Segura)
                      </button>
                    </div>
                  </div>

                  {/* Request Bar */}
                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      GET
                    </span>
                    <span className="text-xs font-mono text-slate-400">/api/v1/invoices/</span>
                    <input
                      type="number"
                      value={idorRequestedId}
                      onChange={(e) => setIdorRequestedId(Number(e.target.value))}
                      className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-amber-300 text-center"
                    />
                    <button
                      onClick={handleFetchIdorInvoice}
                      className="ml-auto px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                    >
                      Enviar Requisição
                    </button>
                  </div>

                  {/* IDOR Response */}
                  {idorResponse && (
                    <div className="mt-4 p-4 rounded-xl border bg-slate-900 border-slate-800 space-y-2">
                      <span className="text-xs font-mono uppercase text-slate-400 block">Resposta do Servidor JSON:</span>
                      <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto">
                        <code>{JSON.stringify(idorResponse.data, null, 2)}</code>
                      </pre>
                      {idorResponse.status === 'EXPOSED_IDOR' && (
                        <div className="p-3 bg-rose-950/50 border border-rose-600 rounded-lg text-xs text-rose-200">
                          🚨 <strong>Vulnerabilidade IDOR Explorada!</strong> O usuário 101 conseguiu ler a fatura confidencial do ID {idorRequestedId} sem autorização prévia!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : selectedItem.labType === 'broken_auth' || selectedItem.id === 'a07-auth-failures' ? (
              /* Lab 3: Broken Auth & Rate Limiter */
              <div className="space-y-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cyan-400" />
                        Simulador de Password Spraying & Força Bruta
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Teste ataques automatizados de dicionário contra um endpoint de login e observe a diferença com Rate Limiter ativado.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-300 font-semibold flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={authWithRateLimit}
                          onChange={(e) => {
                            setAuthWithRateLimit(e.target.checked);
                            setAuthAttempts(0);
                            setAuthIsBlocked(false);
                            setAuthLog([]);
                          }}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-400"
                        />
                        Ativar Rate Limiter (Max 4 tentativas)
                      </label>
                    </div>
                  </div>

                  {/* Wordlist buttons */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-slate-400">Clique para testar senhas do dicionário:</span>
                    <div className="flex flex-wrap gap-2">
                      {['123456', 'password', 'admin', 'qwerty', 'empresa2026', 'admin2026!'].map((pwd) => (
                        <button
                          key={pwd}
                          onClick={() => handleSimulateBruteForceAttempt(pwd)}
                          disabled={authIsBlocked}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono text-slate-200 rounded-lg border border-slate-800 transition-all"
                        >
                          testar: "{pwd}"
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setAuthAttempts(0);
                          setAuthIsBlocked(false);
                          setAuthLog([]);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg ml-auto flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resetar Testes
                      </button>
                    </div>
                  </div>

                  {/* Log Console */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-44 overflow-y-auto font-mono text-xs space-y-1">
                    <div className="text-slate-500">--- Log de Auditoria do Servidor (/api/login) ---</div>
                    {authLog.map((line, idx) => (
                      <div key={idx} className={line.includes('SUCESSO') ? 'text-emerald-400 font-bold' : line.includes('RATE LIMIT') ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {line}
                      </div>
                    ))}
                    {authLog.length === 0 && (
                      <div className="text-slate-600 italic">Nenhuma tentativa executada ainda. Clique em uma das senhas acima.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Generic Sandbox Explanation for other OWASP items */
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Laboratório Dedicado no Terminal Hacker Ético
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Você também pode explorar vulnerabilidades relacionadas a {selectedItem.title} através de comandos de varredura e exploração no nosso Terminal CTF.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      // Navigate or select SQLi / IDOR lab
                      setSelectedOwaspId('a03-injection');
                      setActiveTab('lab');
                    }}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2"
                  >
                    Testar Laboratório de SQL Injection
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
