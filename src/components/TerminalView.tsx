import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Trophy, 
  Flag, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { ctfChallengesList } from '../data/ctfChallenges';
import { CTFChallenge, UserProgress } from '../types';
import { triggerConfetti } from '../utils/storage';

interface TerminalViewProps {
  progress: UserProgress;
  onCaptureFlag: (flagId: string, points: number) => void;
}

interface CommandLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  progress,
  onCaptureFlag
}) => {
  const [activeChallengeId, setActiveChallengeId] = useState<string>(ctfChallengesList[0].id);
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [flagInput, setFlagInput] = useState<string>('');

  const [logs, setLogs] = useState<CommandLog[]>([
    { id: '1', type: 'system', text: '⚡ CyberShield Virtual Sandbox OS v2.4 (Security Lab)' },
    { id: '2', type: 'system', text: 'Digite "help" para ver os comandos disponíveis ou "missions" para ver o status do CTF.' },
    { id: '3', type: 'system', text: 'Ambiente seguro e isolado para aprendizado ético. Boa caçada!' }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeChallenge = ctfChallengesList.find(c => c.id === activeChallengeId) || ctfChallengesList[0];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const appendLog = (type: CommandLog['type'], text: string) => {
    setLogs(prev => [...prev, { id: Math.random().toString(), type, text }]);
  };

  const handleCommandExecution = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to input history
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);
    appendLog('input', `user@cybershield:~$ ${trimmed}`);

    const parts = trimmed.split(' ');
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (mainCommand) {
      case 'clear':
      case 'cls':
        setLogs([]);
        break;

      case 'help':
        appendLog('output', `Comandos Disponíveis no Terminal Virtual:
- whois <dominio>          : Consulta dados de registro de domínio
- ping <host>              : Testa conectividade ICMP com o alvo
- nmap [-sS|-sV] <ip>      : Varredura de portas e detecção de serviços
- dirb <url>               : Enumeração de diretórios e arquivos web
- cat <arquivo>            : Exibe o conteúdo de um arquivo do sistema
- ls                       : Lista arquivos do diretório atual
- sqlmap <url>             : Analisa e simula exploração de SQLi no alvo
- hashcat <hash_md5>       : Recupera senha através de quebra de hash
- decode base64 <string>   : Decodifica texto em Base64
- encode base64 <texto>    : Codifica texto em Base64
- submit <FLAG{...}>       : Submete uma flag para pontuar no CTF
- missions                 : Lista todas as missões CTF
- whoami                   : Exibe informações da sessão atual
- clear                    : Limpa a tela do terminal`);
        break;

      case 'whoami':
        appendLog('output', 'UID=1000(ethical_hacker) GID=1000(whitehat) groups=1000(whitehat),4(adm),27(sudo)');
        break;

      case 'ls':
        appendLog('output', 'admin.conf  backup/  notes.txt  recon_report.md  tools/');
        break;

      case 'missions':
        const missionsSummary = ctfChallengesList.map(c => {
          const isDone = progress.capturedFlags.includes(c.id);
          return `[${isDone ? 'CONCLUÍDA' : 'PENDENTE'}] ${c.title} (${c.points} pts) - Categoria: ${c.category}`;
        }).join('\n');
        appendLog('output', `--- Missões CTF Disponíveis ---\n${missionsSummary}`);
        break;

      case 'ping':
        if (!args[0]) {
          appendLog('error', 'Uso: ping <host ou ip>');
        } else {
          appendLog('output', `PING ${args[0]} (192.168.1.10) 56(84) bytes of data.
64 bytes from 192.168.1.10: icmp_seq=1 ttl=64 time=0.42 ms
64 bytes from 192.168.1.10: icmp_seq=2 ttl=64 time=0.38 ms
--- ${args[0]} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1002ms`);
        }
        break;

      case 'whois':
        if (!args[0]) {
          appendLog('error', 'Uso: whois <dominio>');
        } else if (args[0].includes('lab-corp.local')) {
          appendLog('success', `[WHOIS DATA FOR lab-corp.local]
Domain: lab-corp.local
Registrar: CyberShield Registrar Inc.
Creation Date: 2026-01-15
IP Address: 192.168.1.10
Admin Contact: security-admin@lab-corp.local
Status: ACTIVE / INTERNAL_LAB
FLAG DESCOBERTA: FLAG{recon_whois_master_2026}
(Dica: copie e submeta com o comando: submit FLAG{recon_whois_master_2026})`);
        } else {
          appendLog('output', `Dominio ${args[0]} consultado: Servidor de DNS ativo em 8.8.8.8. Nenhum dado de laboratório encontrado para este host.`);
        }
        break;

      case 'nmap':
        if (!args[0]) {
          appendLog('error', 'Uso: nmap [-sS|-sV] <ip ou host>');
        } else {
          appendLog('output', `Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-28 12:00 BRT
Nmap scan report for target (192.168.1.10)
Host is up (0.00045s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu
80/tcp   open  http        Apache httpd 2.4.52 ((Ubuntu))
3306/tcp open  mysql       MySQL 8.0.35
8080/tcp open  http-proxy  NodeJS Express API

Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
FLAG DESCOBERTA: FLAG{nmap_port_scanner_pro}`);
        }
        break;

      case 'dirb':
        if (!args[0]) {
          appendLog('error', 'Uso: dirb <url>');
        } else {
          appendLog('output', `-----------------
DIRB v2.22    By The Dark Raver
-----------------
URL_BASE: ${args[0]}
WORDLIST_FILES: /usr/share/wordlists/dirb/common.txt

GENERATED WORDS: 4612

---- SCANNING: ${args[0]} ----
+ http://192.168.1.10/admin (CODE:301|SIZE:178)
+ http://192.168.1.10/admin/.env (CODE:200|SIZE:512) -> ARQUIVO CONFIDENCIAL
+ http://192.168.1.10/backup/secret.txt (CODE:200|SIZE:128)
+ http://192.168.1.10/api (CODE:200|SIZE:45)
+ http://192.168.1.10/login (CODE:200|SIZE:1420)

Use "cat /backup/secret.txt" ou "cat /admin/.env" para inspecionar!`);
        }
        break;

      case 'cat':
        if (!args[0]) {
          appendLog('error', 'Uso: cat <arquivo>');
        } else if (args[0].includes('secret.txt') || args[0].includes('.env')) {
          appendLog('success', `[CONTEÚDO DO ARQUIVO]
# Configurações confidenciais
DB_HOST=192.168.1.10
DB_USER=root
FLAG=FLAG{dirb_hidden_files_unlocked}
SECRET_KEY=super_secret_jwt_token_2026`);
        } else if (args[0].includes('notes.txt') || args[0].includes('admin.conf')) {
          appendLog('output', 'Lembrete: nunca deixe arquivos de backup expostos na pasta /var/www/html pública.');
        } else {
          appendLog('error', `cat: ${args[0]}: Arquivo não encontrado.`);
        }
        break;

      case 'decode':
        if (args[0] === 'base64' && args[1]) {
          try {
            const decoded = atob(args[1]);
            appendLog('success', `[BASE64 DECODED]: ${decoded}`);
          } catch {
            appendLog('error', 'Erro: String Base64 inválida fornecida.');
          }
        } else {
          appendLog('error', 'Uso: decode base64 <string>');
        }
        break;

      case 'encode':
        if (args[0] === 'base64' && args[1]) {
          const encoded = btoa(args.slice(1).join(' '));
          appendLog('output', `[BASE64 ENCODED]: ${encoded}`);
        } else {
          appendLog('error', 'Uso: encode base64 <texto>');
        }
        break;

      case 'sqlmap':
        if (!args[0]) {
          appendLog('error', 'Uso: sqlmap <url>');
        } else {
          appendLog('output', `[*] starting at 12:00:01
[INFO] testing connection to the target URL
[INFO] testing if the target URL content is stable
[INFO] target URL appears to be injectable (Boolean-based blind / Error-based SQLi)
[+] Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1' AND 7521=7521--
---
[INFO] fetching database tables...
Database: app_db
Table: admin_users
[1 entry]
+----+----------+----------------------------------+-----------------------------------------+
| id | username | password_hash                    | flag_column                             |
+----+----------+----------------------------------+-----------------------------------------+
| 1  | admin    | 5d41402abc4b2a76b9719d911017c592 | FLAG{sqli_database_dumped_successfully} |
+----+----------+----------------------------------+-----------------------------------------+`);
        }
        break;

      case 'hashcat':
        if (!args[0]) {
          appendLog('error', 'Uso: hashcat <hash_md5>');
        } else if (args[0].includes('5d41402abc4b2a76b9719d911017c592')) {
          appendLog('success', `hashcat (v6.2.6) starting...
Dictionary cache built: /usr/share/wordlists/rockyou.txt
5d41402abc4b2a76b9719d911017c592:hello

Session..........: hashcat
Status...........: Cracked
Hash.Name........: MD5
Target...........: 5d41402abc4b2a76b9719d911017c592
Recovered........: 1/1 (100.00%) Digests

FLAG DESCOBERTA: FLAG{hashcat_hello_cracked_md5}`);
        } else {
          appendLog('output', `Quebrando hash ${args[0]}... Concluído com sucesso: senha_recuperada_123.`);
        }
        break;

      case 'submit':
        if (!args[0]) {
          appendLog('error', 'Uso: submit <FLAG{...}>');
        } else {
          handleValidateFlag(args[0]);
        }
        break;

      default:
        appendLog('error', `Comando não reconhecido: "${mainCommand}". Digite "help" para ver a lista de comandos.`);
        break;
    }
  };

  const handleValidateFlag = (flagCandidate: string) => {
    const cleanFlag = flagCandidate.trim();
    const foundChallenge = ctfChallengesList.find(c => c.flag === cleanFlag);

    if (foundChallenge) {
      if (progress.capturedFlags.includes(foundChallenge.id)) {
        appendLog('output', `ℹ️ Flag válida, mas você já capturou esta flag anteriormente!`);
      } else {
        onCaptureFlag(foundChallenge.id, foundChallenge.points);
        appendLog('success', `🎉 PARABÉNS! FLAG VÁLIDA CAPTURADA: ${cleanFlag} (+${foundChallenge.points} XP e Pontos CTF)`);
        triggerConfetti();
      }
    } else {
      appendLog('error', `❌ Flag incorreta ou formato inválido: "${cleanFlag}". Verifique as pistas e tente novamente.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandExecution(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInputVal(history[prevIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const totalCtfPoints = progress.capturedFlags.reduce((acc, flagId) => {
    const ch = ctfChallengesList.find(c => c.id === flagId);
    return acc + (ch ? ch.points : 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Simulador de Terminal & Desafios CTF</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Terminal Hacker Ético & Missões CTF
          </h1>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm sm:text-base">
            Pratique comandos reais de reconhecimento, varredura de portas, enumeração web e criptografia em um ambiente virtual interativo.
          </p>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-mono text-slate-400 block">Pontuação CTF</span>
            <span className="text-base font-extrabold font-mono text-amber-400">{totalCtfPoints} pts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Terminal Screen */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono flex flex-col h-[560px]">
            {/* Terminal Header */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 ml-2">sandbox@cybershield: ~/ctf-lab</span>
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                title="Limpar terminal"
              >
                <RotateCcw className="w-3 h-3" />
                <span>limpar</span>
              </button>
            </div>

            {/* Terminal Content Body */}
            <div 
              className="flex-1 p-4 overflow-y-auto space-y-2 text-xs sm:text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              {logs.map((log) => (
                <div key={log.id} className="leading-relaxed whitespace-pre-wrap break-words">
                  {log.type === 'input' && (
                    <span className="text-emerald-400 font-bold">{log.text}</span>
                  )}
                  {log.type === 'system' && (
                    <span className="text-slate-500 italic">{log.text}</span>
                  )}
                  {log.type === 'output' && (
                    <span className="text-slate-300">{log.text}</span>
                  )}
                  {log.type === 'success' && (
                    <span className="text-emerald-300 font-semibold bg-emerald-950/40 p-2 rounded block border border-emerald-800/40">{log.text}</span>
                  )}
                  {log.type === 'error' && (
                    <span className="text-rose-400 font-medium">{log.text}</span>
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Bar */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-xs sm:text-sm shrink-0">user@cybershield:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="digite um comando (ex: help, whois lab-corp.local, nmap 192.168.1.10)..."
                className="flex-1 bg-transparent text-slate-100 text-xs sm:text-sm focus:outline-none placeholder:text-slate-600"
                autoFocus
              />
              <button
                onClick={() => {
                  handleCommandExecution(inputVal);
                  setInputVal('');
                }}
                className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick command buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Comandos rápidos:</span>
            <button
              onClick={() => handleCommandExecution('whois lab-corp.local')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-lg border border-slate-800 font-mono"
            >
              whois lab-corp.local
            </button>
            <button
              onClick={() => handleCommandExecution('nmap -sV 192.168.1.10')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg border border-slate-800 font-mono"
            >
              nmap -sV 192.168.1.10
            </button>
            <button
              onClick={() => handleCommandExecution('dirb http://192.168.1.10')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg border border-slate-800 font-mono"
            >
              dirb http://192.168.1.10
            </button>
            <button
              onClick={() => handleCommandExecution('decode base64 RkxBR3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb25fc2VjdXJlfQ==')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-purple-400 rounded-lg border border-slate-800 font-mono"
            >
              decode base64
            </button>
          </div>
        </div>

        {/* CTF Missions Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Flag className="w-4 h-4 text-emerald-400" />
                Missões CTF ({progress.capturedFlags.length}/{ctfChallengesList.length})
              </h3>
              <span className="text-xs text-slate-400">Capture as Flags</span>
            </div>

            {/* Mission Selector */}
            <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
              {ctfChallengesList.map((ch) => {
                const isCaptured = progress.capturedFlags.includes(ch.id);
                const isSelected = ch.id === activeChallengeId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChallengeId(ch.id);
                      setShowHint(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500/50 text-white'
                        : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isCaptured ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Flag className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-xs font-semibold block truncate">{ch.title}</span>
                        <span className="text-[10px] text-slate-400">{ch.category} • {ch.difficulty}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                      +{ch.points}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Challenge Details Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                  {activeChallenge.category}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Dificuldade: {activeChallenge.difficulty}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {activeChallenge.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeChallenge.description}
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-cyan-300 border border-slate-800">
                {activeChallenge.targetInfo}
              </div>

              {/* Hint toggle */}
              <div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {showHint ? 'Esconder Pista' : 'Ver Pista do Desafio'}
                </button>
                {showHint && (
                  <p className="text-xs text-amber-200 bg-amber-950/30 p-2 rounded mt-1.5 border border-amber-900/40 font-mono">
                    💡 {activeChallenge.hint}
                  </p>
                )}
              </div>

              {/* Flag Submit Input */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-[11px] font-mono text-slate-400">
                  Submeter Flag Capturada:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    placeholder="FLAG{...}"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      if (flagInput.trim()) {
                        handleValidateFlag(flagInput);
                        setFlagInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                  >
                    Validar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
