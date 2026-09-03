# 🛡️ CyberShield Academy — Plataforma Interativa de Cibersegurança & Hacking Ético

> **Aprenda segurança digital, OWASP, Pentest, defesa cibernética e boas práticas para todas as idades — de crianças a profissionais de segurança.**

![Licença](https://img.shields.io/badge/licença-MIT-emerald.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-cyan.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-purple.svg)
![Deploy](https://img.shields.io/badge/GitHub_Pages-Compatível-brightgreen.svg)

---

## 📌 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Funcionalidades Principais](#-funcionalidades-principais)
3. [Módulos da Plataforma](#-módulos-da-plataforma)
4. [Como Executar Localmente](#-como-executar-localmente)
5. [Como Publicar no GitHub Pages](#-como-publicar-no-github-pages)
6. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
7. [Código de Ética & Isenção Legal](#-código-de-ética--isenção-legal)

---

## 📖 Sobre o Projeto

O **CyberShield Academy** foi desenvolvido com a missão de **democratizar o conhecimento em segurança da informação**. A plataforma combina conteúdo teórico aprofundado com simuladores e laboratórios 100% interativos que rodam diretamente no navegador (Client-Side), sem risco para sistemas reais e sem necessidade de infraestrutura complexa.

---

## 🚀 Funcionalidades Principais

* **📖 Glossário de Cibersegurança & Dicionário Hacker:**
  * Seção dedicada e **Pop-up Rápido** acessível de qualquer lugar da aplicação.
  * Analogias didáticas para iniciantes sem jargões (ex: "SQLi é como alterar o pedido no garçom"), definições técnicas aprofundadas, cenários reais de ataque e regras de mitigação/defesa.
  * Filtros dinâmicos por categoria (*Fundamentos, Web & OWASP, Pentest & Red Team, Criptografia, Ameaças, Redes*) e por nível de dificuldade (*Iniciante, Intermediário, Avançado*).
  * Função de cópia rápida para estudo e vinculação direta com as lições das trilhas.
* **🎯 Trilhas de Conhecimento Estruturadas:**
  * Fundamentos de Segurança da Informação (Tríade CIA, tipos de hackers, ameaças comuns).
  * Hacking Ético & Pentest (Ciclo PTES, reconhecimento, varreduras).
  * OWASP Top 10 & Segurança Web (SQL Injection, IDOR, Broken Authentication, XSS).
  * Defesa Pessoal & Familiar (Golpes no WhatsApp, Pix, senhas e 2FA).
* **⚡ Laboratório Interativo OWASP Top 10:**
  * Sandbox interativo com backend simulado em memória para explorar e entender vulnerabilidades reais (SQLi, IDOR, Autenticação Fraca) com visualização das consultas SQL geradas e a correção de código em tempo real.
* **🎯 Pentest Hub:**
  * As 6 fases do Pentest profissional (PTES & NIST) com checklist técnico.
  * Arsenal com as principais ferramentas do mercado (Nmap, Gobuster, SQLmap, Wireshark, Hashcat, Metasploit).
  * Gerador interativo de comandos CLI prontos para terminal.
  * Modelo completo de **Termo de Autorização e Regras de Engajamento (Rules of Engagement - RoE)**.
* **💻 Terminal Hacker & Missões CTF (Capture The Flag):**
  * Terminal virtual realista com suporte a comandos reais (`nmap`, `whois`, `dirb`, `cat`, `sqlmap`, `hashcat`, `decode base64`, etc.).
  * Missões gamificadas de CTF com pistas, validação de flags (`FLAG{...}`) e pontuação em tempo real.
* **🤖 Modo Menor ("Modenor" / Kids & Teens):**
  * Interface dedicada com o mascote **Byte Guardião**.
  * Dicas de proteção em jogos online (Roblox, Minecraft, Discord, TikTok).
  * Mini-jogo: **Criador de Super Senha Secreta Divertida** (frases-senha com palavras aleatórias).
  * Mini-jogo: **Detetive de Golpes & Phishing Infantil**.
* **🔐 Dicas de Ouro & Simuladores de Defesa:**
  * Testador de força de senha com cálculo de entropia (bits) e tempo de quebra por força bruta com GPUs.
  * Simulador de análise forense de e-mails/SMS de Phishing com identificação de *Red Flags*.
  * Checklist interativo de blindagem digital pessoal com progresso salvo.
* **🚨 Central de Emergência & Incidentes:**
  * Resposta a incidentes: WhatsApp clonado, celular roubado/furtado, golpe do Pix ou compras não autorizadas.
  * Guia de primeiros socorros nos primeiros 5 minutos e contatos oficiais de suporte.
* **🏆 Gamificação & Certificados:**
  * Sistema de XP, níveis e medalhas desbloqueáveis persistidos via `localStorage`.
  * Gerador de certificado de conclusão personalizável com impressão e exportação para PDF.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) versão **22 LTS** (ou a versão estável mais recente do Node)
* Gerenciador de pacotes `npm` (incluso no Node.js)

### Passo a passo
```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/cybershield-app.git

# 2. Acesse o diretório
cd cybershield-app

# 3. Certifique-se de estar usando o Node 22+
node -v # ex: v22.x.x

# 4. Instale as dependências
npm install

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Abra seu navegador em `http://localhost:3000` (ou na porta indicada no terminal).

---

## 🌐 Como Publicar no GitHub Pages

O projeto foi configurado com caminhos relativos (`base: './'`) no `vite.config.ts`, permitindo que o build estático seja hospedado em qualquer subdiretório do GitHub Pages.

### Opção 1: Deploy Automático com GitHub Actions (Recomendado)

O arquivo `.github/workflows/deploy.yml` já está criado na raiz do projeto com o Node.js v22 configurado:

```yaml
name: Deploy to GitHub Pages

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
      url: ${{ steps.deployment.outputs.page_url }}
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
```

2. No GitHub, acesse **Settings** > **Pages**.
3. Em **Build and deployment > Source**, selecione **GitHub Actions**.
4. Faça um `git push` na branch `main`. O site estará disponível em `https://seu-usuario.github.io/nome-do-repositorio/`.

---

### Opção 2: Deploy Manual via branch `gh-pages`

```bash
# Gere o build de produção
npm run build

# O conteúdo gerado estará na pasta /dist
# Você pode publicar a pasta dist na branch gh-pages usando ferramentas como gh-pages:
npx gh-pages -d dist
```

---

## 💻 Tecnologias Utilizadas

* **React 19** & **TypeScript**
* **Vite 6** (Bundler ultrarrápido com suporte a GitHub Pages)
* **Tailwind CSS v4** (Design moderno, responsivo e paleta dark mode de alta precisão)
* **Lucide React** (Ícones semânticos para cibersegurança)
* **Canvas Confetti** (Efeitos de celebração nas conquistas)
* **LocalStorage API** (Persistência segura sem necessidade de servidor externo)

---

## ⚖️ Código de Ética & Isenção Legal

> ⚠️ **Aviso de Conformidade Legal:**
> Este software foi construído exclusivamente para **fins educacionais e de conscientização**.
> O acesso a sistemas de informática sem autorização expressa do titular constitui infração penal prevista no **Art. 154-A do Código Penal Brasileiro (Lei Carolina Dieckmann nº 12.737/2012)** e normas correlatas internacionais.
> Utilize o conhecimento adquirido apenas em ambientes controlados ou mediante autorização formal por escrito (Rules of Engagement).

---

Feito com 💚 para tornar a internet um lugar mais seguro para todos!
