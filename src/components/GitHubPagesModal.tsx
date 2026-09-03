import React, { useState } from 'react';
import { Github, Copy, Check, X, ExternalLink, Terminal, Sparkles, CheckCircle2, Cpu, ArrowRight } from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'actions' | 'cli'>('actions');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const workflowYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js (Latest LTS - v22)
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: |
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install
          fi

      - name: Build Static Applet
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const gitCommands = `# 1. Certifique-se de estar usando o Node 22 (versão mais recente LTS):
node -v # deve retornar v22.x ou superior

# 2. Inicialize o repositório git local (se ainda não o fez):
git init
# O package-lock.json já está gerado na raiz e deve ser adicionado:
git add .
git commit -m "feat: CyberShield Academy com Glossário, Bento Hover e Node 22"

# 3. Vincule ao seu repositório no GitHub:
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 4. Envie o código para o GitHub:
git push -u origin main

# O GitHub Actions irá disparar automaticamente e publicar seu site em:
# https://SEU_USUARIO.github.io/SEU_REPOSITORIO/`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#15171E] rounded-3xl border border-slate-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#15171E]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/40 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5 text-[#00D1FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">Publicar no GitHub Pages</h2>
                <span className="text-[10px] font-mono text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/20">
                  NODE 22 LTS
                </span>
              </div>
              <p className="text-xs text-slate-400">Guia de hospedagem estática gratuita com deploy contínuo via GitHub Actions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Note about Node 22 & 100% Client-Side Compatibility */}
          <div className="p-4 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#00FF41] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white font-bold block">
                100% Compatível com GitHub Pages & Configurado para Node.js 22
              </strong>
              <span className="text-slate-300 text-xs block leading-relaxed">
                Este app é um SPA compilado com caminhos relativos (<code className="text-[#00FF41] font-mono">base: './'</code> no Vite). 
                O arquivo de workflow do GitHub Actions já foi gerado na raiz em <code className="text-[#00D1FF] font-mono">.github/workflows/deploy.yml</code> configurado com a versão LTS mais recente do Node.js (v22).
              </span>
            </div>
          </div>

          {/* Toggle between Actions Guide & Terminal Commands */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === 'actions'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. GitHub Actions (Recomendado)
            </button>
            <button
              onClick={() => setActiveTab('cli')}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === 'cli'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Comandos Git no Terminal
            </button>
          </div>

          {activeTab === 'actions' ? (
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2 font-mono">
                  <span className="w-6 h-6 rounded-lg bg-black/50 text-[#00FF41] font-mono text-xs flex items-center justify-center border border-slate-700">1</span>
                  Criar Repositório no GitHub
                </h3>
                <p className="text-slate-400 text-xs">
                  Acesse <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-[#00FF41] hover:underline inline-flex items-center gap-1 font-mono">github.com/new <ExternalLink className="w-3 h-3" /></a> e crie um novo repositório (público para hospedagem gratuita).
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2 font-mono">
                    <span className="w-6 h-6 rounded-lg bg-black/50 text-[#00FF41] font-mono text-xs flex items-center justify-center border border-slate-700">2</span>
                    Workflow .github/workflows/deploy.yml (Node 22)
                  </h3>
                  <button
                    onClick={() => handleCopy(workflowYaml, 'yaml')}
                    className="px-3 py-1 bg-black/40 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border border-slate-800"
                  >
                    {copiedSection === 'yaml' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSection === 'yaml' ? 'Copiado!' : 'Copiar YAML'}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  O arquivo já existe no seu projeto! Veja o conteúdo abaixo:
                </p>
                <pre className="p-4 bg-black/50 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto max-h-52">
                  <code>{workflowYaml}</code>
                </pre>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2 font-mono">
                  <span className="w-6 h-6 rounded-lg bg-black/50 text-[#00FF41] font-mono text-xs flex items-center justify-center border border-slate-700">3</span>
                  Habilitar o GitHub Pages com GitHub Actions
                </h3>
                <div className="bg-black/40 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <p className="font-bold text-white">No menu do seu repositório no GitHub:</p>
                  <ol className="list-decimal list-inside space-y-1.5 ml-1">
                    <li>Clique na aba <strong className="text-white">Settings</strong> &gt; no menu lateral esquerdo selecione <strong className="text-white">Pages</strong>.</li>
                    <li>Na seção <strong className="text-white">Build and deployment &gt; Source</strong>, altere de "Deploy from a branch" para <strong className="text-[#00FF41]">GitHub Actions</strong>.</li>
                    <li>Faça o push do código para a branch <code className="text-[#00D1FF] font-mono">main</code>.</li>
                  </ol>
                  <p className="pt-2 text-slate-400">
                    O deploy será executado automaticamente e seu site estará no ar no endereço <code className="text-[#00FF41] font-mono">https://seu-usuario.github.io/seu-repositorio/</code>!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2 font-mono">
                  <Terminal className="w-4 h-4 text-[#00FF41]" />
                  Comandos Prontos para Executar no Terminal
                </h3>
                <button
                  onClick={() => handleCopy(gitCommands, 'cli')}
                  className="px-3 py-1 bg-black/40 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border border-slate-800"
                >
                  {copiedSection === 'cli' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'cli' ? 'Copiado!' : 'Copiar Comandos'}
                </button>
              </div>

              <pre className="p-4 bg-black/60 rounded-xl font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto leading-relaxed">
                <code>{gitCommands}</code>
              </pre>

              <div className="p-4 bg-black/40 border border-slate-800 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                  <Cpu className="w-4 h-4 text-[#00D1FF]" />
                  Dica de Node.js no Computador:
                </span>
                <p className="text-slate-400">
                  Para instalar ou alternar para a versão mais recente do Node.js LTS (v22), você pode usar o NVM:
                  <code className="block mt-1 p-2 rounded bg-black/60 text-[#00FF41] font-mono">nvm install 22 && nvm use 22</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-black/40 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Configuração pronta para produção</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
