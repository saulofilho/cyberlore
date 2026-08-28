import React, { useState } from 'react';
import { 
  Sparkles, 
  Key, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  Cpu, 
  Eye, 
  EyeOff, 
  FileText,
  Mail,
  Smartphone,
  Wifi,
  ExternalLink
} from 'lucide-react';
import { securityTipsList, securityChecklist } from '../data/tipsData';
import { SecurityTip, UserProgress } from '../types';
import { triggerConfetti } from '../utils/storage';

interface TipsAndToolsProps {
  progress: UserProgress;
  onToggleChecklistItem: (itemId: string) => void;
}

export const TipsAndToolsView: React.FC<TipsAndToolsProps> = ({
  progress,
  onToggleChecklistItem
}) => {
  const [activeTab, setActiveTab] = useState<'password' | 'phishing' | 'tips' | 'checklist'>('password');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Password Strength Tester State
  const [testPassword, setTestPassword] = useState<string>('MinhaSenhaSecreta!2026');
  const [showPassword, setShowPassword] = useState<boolean>(true);

  // Phishing Analyzer State
  const [phishingStep, setPhishingStep] = useState<number>(0);
  const [inspectedElement, setInspectedElement] = useState<string | null>(null);

  const phishingEmails = [
    {
      id: 'phish-1',
      title: 'E-mail Falso do Banco: "Atualização de Token Urgente"',
      sender: 'Banco Oficial <atendimento@notificacoes-banco-seguro.xyz>',
      replyTo: 'contato@hacker-server.net',
      subject: 'URGENTE: Sua conta será suspensa em 2 horas caso não atualize seu dispositivo',
      body: `Prezado cliente,
Identificamos uma tentativa de acesso suspeita ao seu Internet Banking. Por motivos de segurança, você deve validar seus dados cadastrais e chave de segurança imediatamente.

Clique no botão abaixo para desbloquear seu acesso:`,
      buttonLabel: 'ATUALIZAR MEU TOKEN AGORA',
      buttonUrl: 'https://banco.com.br.suporte-autorizado-validacao.xyz/login.php',
      redFlags: [
        { label: 'Domínio do Remetente (.xyz)', detail: 'O e-mail vem de "notificacoes-banco-seguro.xyz", e não do domínio oficial do banco (.com.br).' },
        { label: 'Gatilho de Pânico/Urgência', detail: 'Ameaça suspender a conta em "2 horas" para impedir que você pense com calma.' },
        { label: 'URL Falsa de Destino', detail: 'O link direciona para "suporte-autorizado-validacao.xyz", um site clonado controlado por golpistas.' }
      ]
    },
    {
      id: 'phish-2',
      title: 'SMS / Notificação dos Correios: "Taxa de Encomenda Retida"',
      sender: '+55 11 98765-4321 (Remetente Desconhecido)',
      replyTo: '',
      subject: 'Objeto retido na alfândega de Curitiba',
      body: `CORREIOS: Seu pacote internacional cód. BR987412356 está retido na alfândega por falta de pagamento da taxa de importação (R$ 29,90). Evite a devolução do produto regularizando hoje:`,
      buttonLabel: 'PAGAR TAXA VIA PIX',
      buttonUrl: 'https://correios-rastreamento-taxa.online/pix',
      redFlags: [
        { label: 'Número de celular comum', detail: 'Os Correios utilizam números curtos oficiais (shortcodes) e não celulares comuns.' },
        { label: 'Domínio pirata (.online)', detail: 'O único site oficial dos Correios é "correios.com.br".' },
        { label: 'Cobrança exclusiva por Pix em link', detail: 'Taxas alfandegárias são recolhidas exclusivamente dentro do portal "Minhas Importações" oficial.' }
      ]
    }
  ];

  // Calculate Password Strength
  const analyzePassword = (pwd: string) => {
    let score = 0;
    const length = pwd.length;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    if (length >= 8) score += 1;
    if (length >= 12) score += 2;
    if (length >= 16) score += 2;
    if (hasLower) score += 1;
    if (hasUpper) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 2;

    // Common weak patterns
    const isCommon = ['123456', 'password', 'senha', 'admin', 'qwerty', '12345678'].includes(pwd.toLowerCase());
    if (isCommon) score = 0;

    let strengthLabel = 'Muito Fraca';
    let color = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    let crackTime = 'Menos de 1 segundo';

    if (isCommon) {
      crackTime = 'Instantâneo (já está em todas as listas públicas de vazamentos)';
    } else if (score >= 9) {
      strengthLabel = 'Excelente (Nível Militar)';
      color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      crackTime = 'Vários bilhões de anos (impossível por força bruta com GPUs atuais)';
    } else if (score >= 6) {
      strengthLabel = 'Boa / Forte';
      color = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      crackTime = 'Aproximadamente 300 a 5.000 anos';
    } else if (score >= 4) {
      strengthLabel = 'Média / Razoável';
      color = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      crackTime = 'Alguns dias a semanas com cluster de GPUs RTX';
    } else {
      crackTime = 'Alguns minutos a poucas horas';
    }

    // Entropy calculation approximation
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSpecial) poolSize += 33;
    const entropy = poolSize > 0 ? Math.round(length * (Math.log(poolSize) / Math.log(2))) : 0;

    return { score, strengthLabel, color, crackTime, entropy, length, hasLower, hasUpper, hasNumber, hasSpecial, isCommon };
  };

  const pwdAnalysis = analyzePassword(testPassword);

  const categories = ['Todos', 'Senhas & 2FA', 'Golpes & Phishing', 'Redes & Wi-Fi', 'Celular & Apps'];
  const filteredTips = selectedCategory === 'Todos'
    ? securityTipsList
    : securityTipsList.filter(t => t.category === selectedCategory);

  const checklistProgress = Math.round(
    (progress.completedChecklistItems.length / Math.max(1, securityChecklist.length)) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ferramentas Práticas & Guias Defensivos</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dicas de Ouro & Simuladores de Segurança
        </h1>
        <p className="text-slate-400 mt-1 max-w-3xl text-sm sm:text-base">
          Teste a robustez da sua senha em tempo real, aprenda a inspecionar cabeçalhos de phishing e audite seu checklist de privacidade pessoal.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'password'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          Testador de Força de Senha
        </button>
        <button
          onClick={() => setActiveTab('phishing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'phishing'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Simulador de Detecção de Phishing
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tips'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Catálogo de Dicas de Segurança
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Checklist de Proteção ({checklistProgress}%)
        </button>
      </div>

      {/* Tab 1: Password Strength Analyzer */}
      {activeTab === 'password' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Auditor de Entropia & Força de Senhas
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Digite qualquer senha para analisar o tempo de quebra estimado por ataques de dicionário e placas de vídeo modernas (GPUs).
              </p>
            </div>

            {/* Input Box */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">Digite uma senha para testar:</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 pr-12"
                  placeholder="Digite sua senha..."
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-mono">Testar exemplos:</span>
              {[
                { label: '123456 (Fraca)', pwd: '123456' },
                { label: 'carlos2024 (Comum)', pwd: 'carlos2024' },
                { label: 'P@ssw0rd! (Curta)', pwd: 'P@ssw0rd!' },
                { label: 'Cavalo-Nuvem-Azul-99! (Passphrase)', pwd: 'Cavalo-Nuvem-Azul-99!' }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestPassword(p.pwd)}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 font-mono"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Strength meter metrics */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Classificação:</span>
                <span className={`text-xs font-bold font-mono px-3 py-1 rounded-lg border ${pwdAnalysis.color}`}>
                  {pwdAnalysis.strengthLabel}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    pwdAnalysis.score >= 8 ? 'bg-emerald-500' : pwdAnalysis.score >= 5 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (pwdAnalysis.score / 9) * 100)}%` }}
                />
              </div>

              {/* Time to Crack */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Tempo Estimado para Quebrar por Força Bruta:
                </span>
                <p className="text-sm font-bold text-white font-mono">
                  {pwdAnalysis.crackTime}
                </p>
              </div>

              {/* Detailed metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className={`p-2.5 rounded-lg border text-center ${pwdAnalysis.length >= 12 ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  {pwdAnalysis.length} caracteres
                </div>
                <div className={`p-2.5 rounded-lg border text-center ${pwdAnalysis.hasUpper ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  {pwdAnalysis.hasUpper ? '✓ Maiúsculas' : '✗ Maiúsculas'}
                </div>
                <div className={`p-2.5 rounded-lg border text-center ${pwdAnalysis.hasNumber ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  {pwdAnalysis.hasNumber ? '✓ Números' : '✗ Números'}
                </div>
                <div className={`p-2.5 rounded-lg border text-center ${pwdAnalysis.hasSpecial ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  {pwdAnalysis.hasSpecial ? '✓ Símbolos (!@#)' : '✗ Símbolos'}
                </div>
              </div>
            </div>
          </div>

          {/* Educational Sidebar on Passphrases */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              O Segredo das Frases-Senha (Passphrases)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tentamos decorar senhas curtas cheias de caracteres difíceis como <code className="text-rose-300 font-mono">Tr0ub4dor&3</code>, mas elas são difíceis para humanos e fáceis para computadores!
            </p>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 block">
                A Fórmula de Ouro:
              </span>
              <p className="text-xs text-slate-300">
                Junte <strong>4 palavras aleatórias comuns</strong> separadas por traço + 1 número e símbolo.
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300 border border-slate-800">
                ex: Abacaxi-Tigre-Guitarra-Saturno!2026
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                <li>• Mais de 35 caracteres de comprimento.</li>
                <li>• Extremamente fácil de lembrar na mente.</li>
                <li>• Entropia &gt; 90 bits (inquebrável por supercomputadores).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Phishing Detective Lab */}
      {activeTab === 'phishing' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-400" />
                Laboratório de Análise Forense de Phishing
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Inspecione mensagens reais de engenharia social. Clique nos elementos destacados para identificar as armadilhas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {phishingEmails.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPhishingStep(idx);
                    setInspectedElement(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    phishingStep === idx
                      ? 'bg-rose-500 text-slate-950'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  Cenário #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Email Simulator Window */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            {/* Header bar */}
            <div className="bg-slate-900/90 p-4 border-b border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assunto: <strong className="text-white">{phishingEmails[phishingStep].subject}</strong></span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  Ameaça Detectada
                </span>
              </div>
              <div className="text-slate-300">
                De: <span className="text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">{phishingEmails[phishingStep].sender}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-200">
              <div className="whitespace-pre-line leading-relaxed">
                {phishingEmails[phishingStep].body}
              </div>

              <div className="pt-4 pb-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 inline-block space-y-1">
                  <div className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-center cursor-pointer text-xs transition-all">
                    {phishingEmails[phishingStep].buttonLabel}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    🔗 Destino real do link: <code className="text-rose-300">{phishingEmails[phishingStep].buttonUrl}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Red Flags Explained */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Sinais de Alerta Descobertos Nesta Mensagem (Red Flags)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {phishingEmails[phishingStep].redFlags.map((flag, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="font-bold text-xs text-rose-300 block">⚠️ {flag.label}</span>
                  <span className="text-xs text-slate-400">{flag.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security Tips Catalog */}
      {activeTab === 'tips' && (
        <div className="space-y-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tips Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTips.map((tip) => (
              <div key={tip.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tip.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    tip.importance === 'Urgente'
                      ? 'bg-rose-950/50 text-rose-300 border-rose-800'
                      : 'bg-amber-950/50 text-amber-300 border-amber-800'
                  }`}>
                    {tip.importance}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {tip.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {tip.summary}
                </p>

                {/* Practical steps */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono uppercase font-bold text-cyan-400 block">
                    Como Implementar Passo a Passo:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {tip.practicalSteps.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Protection Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Checklist de Blindagem Pessoal & Familiar
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Marque os itens que você já configurou. O progresso é salvo automaticamente no seu navegador.
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold font-mono text-emerald-400">{checklistProgress}%</span>
              <span className="text-xs text-slate-400 block">Blindagem Completa</span>
            </div>
          </div>

          <div className="space-y-3">
            {securityChecklist.map((item) => {
              const isChecked = progress.completedChecklistItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onToggleChecklistItem(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                    isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through decoration-emerald-600 text-slate-300' : 'text-white'}`}>
                      {item.text}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-1">
                      Categoria: {item.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
