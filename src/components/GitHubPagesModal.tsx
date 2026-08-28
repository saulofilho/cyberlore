import React, { useState } from 'react';
import { Github, Copy, Check, X, ExternalLink, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

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

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Publicar no GitHub Pages Gratuitamente</h2>
              <p className="text-xs text-slate-400">Guia de hospedagem estática e deploy contínuo em 3 minutos</p>
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
          {/* Note about 100% Client-Side Compatibility */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 font-bold block mb-0.5">Compatibilidade Total com GitHub Pages</strong>
              <span>
                Este aplicativo é um SPA (Single Page Application) moderno em React + Vite. Ele foi configurado com caminhos relativos (<code className="text-emerald-200 font-mono">base: './'</code>), e salva todo o progresso no <code className="text-emerald-200 font-mono">localStorage</code> do navegador.
              </span>
            </div>
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-mono text-xs flex items-center justify-center">1</span>
              Criar Repositório no GitHub
            </h3>
            <p className="text-slate-400">
              Acesse <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-1">github.com/new <ExternalLink className="w-3 h-3" /></a> e crie um repositório público (ex: <code className="text-slate-200 font-mono">cybershield-app</code>).
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-mono text-xs flex items-center justify-center">2</span>
                Criar Workflow de Deploy Automático (.github/workflows/deploy.yml)
              </h3>
              <button
                onClick={() => handleCopy(workflowYaml, 'yaml')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copiedSection === 'yaml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'yaml' ? 'Copiado!' : 'Copiar YAML'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto max-h-52">
              <code>{workflowYaml}</code>
            </pre>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-mono text-xs flex items-center justify-center">3</span>
              Ativar GitHub Pages no Repositório
            </h3>
            <p className="text-slate-400">
              No seu repositório no GitHub:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 ml-2">
              <li>Vá em <strong>Settings</strong> &gt; <strong>Pages</strong>.</li>
              <li>Em <strong>Build and deployment &gt; Source</strong>, selecione <strong>GitHub Actions</strong>.</li>
              <li>Pronto! A cada <code className="text-slate-200 font-mono">git push</code> na branch <code className="text-slate-200 font-mono">main</code>, seu site será publicado automaticamente no seu endereço <code className="text-emerald-400 font-mono">https://seu-usuario.github.io/seu-repositorio/</code>.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
