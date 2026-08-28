import { Track } from '../types';

export const tracksData: Track[] = [
  {
    id: 'digital-citizen',
    title: 'Cidadão Digital & Defesa Pessoal',
    shortDesc: 'Aprenda os princípios fundamentais de segurança para proteger você, sua família, contas bancárias e dados no dia a dia.',
    iconName: 'ShieldCheck',
    badgeName: 'Defensor Digital',
    color: 'emerald',
    level: 'Iniciante',
    modules: [
      {
        id: 'mod-passwords-2fa',
        title: 'Módulo 1: Senhas Blindadas e 2FA',
        description: 'Domine a arte de criar senhas inquebráveis e configurar autenticação de dois fatores corretamente.',
        lessons: [
          {
            id: 'les-pass-1',
            title: 'Por que "123456" e nomes de pets são um perigo?',
            duration: '5 min',
            xp: 50,
            content: `A maioria das invasões de contas não ocorre por hackers mágicos digitando em salas escuras, mas sim por ataques de dicionário, vazamentos de bases de dados (data breaches) e senhas reutilizadas.

Quando você usa a mesma senha no e-mail e em um site de compras qualquer, se esse site for invadido, sua senha vazada será testada em centenas de outros serviços (técnica chamada de Credential Stuffing).

**O conceito de Entropia:** Uma senha de 8 caracteres simples é quebrada em segundos por uma placa de vídeo moderna. Já uma frase-senha (passphrase) com 4 palavras aleatórias e caracteres especiais pode levar bilhões de anos para ser decifrada por força bruta.`,
            summary: [
              'Nunca reutilize senhas entre serviços diferentes.',
              'Prefira frases-senha longas (14+ caracteres) a palavras curtas cheias de símbolos difíceis de lembrar.',
              'Utilize um Gerenciador de Senhas confiável (Bitwarden, 1Password, KeePass) para gerar e guardar senhas únicas.',
            ],
            keyTerms: [
              { term: 'Credential Stuffing', definition: 'Ataque automatizado que testa combinações de login/senha vazadas em diversos outros sites.' },
              { term: 'Força Bruta', definition: 'Tentativa exaustiva de todas as combinações possíveis de caracteres até encontrar a correta.' },
              { term: 'Passphrase', definition: 'Sequência de palavras longas e fáceis de memorizar para o humano, mas com entropia altíssima para máquinas.' }
            ],
            quiz: [
              {
                id: 'q-pass-1',
                question: 'Qual é a melhor estratégia para gerenciar dezenas de senhas seguras no cotidiano?',
                options: [
                  'Anotar tudo em um arquivo chamado senhas.txt na área de trabalho',
                  'Usar uma única senha muito complexa em todos os sites',
                  'Utilizar um gerenciador de senhas com cofre criptografado e senha mestra forte',
                  'Variar apenas o último número da senha a cada novo cadastro'
                ],
                correctIndex: 2,
                explanation: 'Gerenciadores de senhas geram senhas aleatórias e únicas para cada serviço, criptografando tudo com chaves robustas (AES-256).'
              }
            ]
          },
          {
            id: 'les-pass-2',
            title: 'Autenticação em Dois Fatores (2FA/MFA) sem Segredos',
            duration: '7 min',
            xp: 60,
            content: `A autenticação em dois fatores adiciona uma camada indispensável: mesmo que um invasor descubra sua senha, ele ainda precisará do segundo fator para acessar sua conta.

**Os 3 fatores de autenticação:**
1. Algo que você **SABE** (Senha, PIN, pergunta de segurança)
2. Algo que você **TEM** (Aplicativo autenticador TOTP, chave física YubiKey, SMS)
3. Algo que você **É** (Biometria: impressão digital, FaceID, reconhecimento de íris)

**Atenção com SMS:** O 2FA via SMS é vulnerável ao golpe do *SIM Swap* (clonagem de chip na operadora). Sempre que possível, utilize aplicativos autenticadores (Google Authenticator, Aegis, Authy) ou chaves FIDO2 de hardware.`,
            summary: [
              'Ative 2FA em TODAS as suas contas críticas: e-mail principal, WhatsApp, bancos e redes sociais.',
              'Prefira aplicativos de código TOTP em vez de mensagens SMS.',
              'Guarde os Códigos de Backup (Recovery Codes) impressos ou em cofre offline seguro.'
            ],
            keyTerms: [
              { term: 'TOTP', definition: 'Time-based One-Time Password: token numérico temporário gerado a cada 30 segundos baseado em segredo criptográfico compartilhado.' },
              { term: 'SIM Swap', definition: 'Golpe em que o criminoso transfere o número da vítima para um chip sob seu controle na operadora telefônica.' }
            ],
            quiz: [
              {
                id: 'q-pass-2',
                question: 'Por que o 2FA via aplicativo autenticador (TOTP) é mais seguro que o 2FA via SMS?',
                options: [
                  'Porque o SMS não funciona sem internet',
                  'Porque o SMS pode ser interceptado através de clonagem de chip (SIM Swap) e falhas em redes de telefonia',
                  'Porque aplicativos autenticadores enviam a senha diretamente para a polícia',
                  'Não há diferença, ambos têm exatamente o mesmo nível de risco'
                ],
                correctIndex: 1,
                explanation: 'O SIM Swap permite que criminosos recebam o SMS da vítima. Já o TOTP gera tokens localmente no dispositivo sem trafegar pela rede celular.'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-phishing-scams',
        title: 'Módulo 2: Engenharia Social e Golpes no Brasil',
        description: 'Aprenda a identificar golpes no WhatsApp, Pix falso, e-mails fraudulentos e faturas adulteradas.',
        lessons: [
          {
            id: 'les-phish-1',
            title: 'Anatomia de um Phishing: Como os criminosos manipulam a mente',
            duration: '6 min',
            xp: 55,
            content: `A engenharia social explora vulnerabilidades psicológicas, e não falhas de software. Os criminosos utilizam gatilhos como:

- **Urgência e Medo:** "Sua conta será cancelada em 2 horas!", "Mandado de prisão emitido!"
- **Curiosidade e Ganância:** "Veja quem visitou seu perfil", "Você recebeu R$ 1.500 via Pix!"
- **Autoridade e Confiança:** "Mensagem oficial do suporte bancário", "Diretoria da empresa solicitando transferência urgente".

**Checklist visual anti-phishing:**
1. Verifique o domínio exato do remetente (ex: \`suporte@banco-seguro-aviso.com\` vs \`suporte@banco.com.br\`).
2. Passe o mouse sobre os links antes de clicar para conferir a URL real de destino.
3. Desconfie de solicitações de dados sigilosos ou códigos recebidos por SMS.`,
            summary: [
              'Nenhum banco ou serviço sério solicita sua senha ou token de segurança por mensagem ou telefone.',
              'Antes de clicar, leia a URL com atenção redobrada a caracteres parecidos (Typosquatting).',
              'Em caso de dúvida, entre em contato direto pelo aplicativo oficial do banco.'
            ],
            keyTerms: [
              { term: 'Phishing', definition: 'Tentativa de obter informações confidenciais se passando por uma entidade confiável.' },
              { term: 'Typosquatting', definition: 'Registro de domínios com erros de digitação intencionais (ex: netflx.com ou g00gle.com) para enganar usuários.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'networking-linux',
    title: 'Fundamentos de Redes & Linux para Hackers',
    shortDesc: 'Compreenda a espinha dorsal da internet: protocolos TCP/IP, portas, DNS, cabeçalhos HTTP e comandos essenciais de terminal.',
    iconName: 'Network',
    badgeName: 'Arquiteto de Redes',
    color: 'sky',
    level: 'Intermediário',
    modules: [
      {
        id: 'mod-tcp-ports',
        title: 'Módulo 1: Modelo OSI, TCP/IP e Portas de Rede',
        description: 'Como os pacotes viajam e por que o reconhecimento de portas abertas é o primeiro passo de qualquer análise.',
        lessons: [
          {
            id: 'les-net-1',
            title: 'O aperto de mão de 3 vias (Three-Way Handshake)',
            duration: '8 min',
            xp: 70,
            content: `O protocolo TCP garante a entrega confiável e ordenada de dados. Toda conexão TCP começa com o processo de sincronização chamado Three-Way Handshake:

1. **SYN (Synchronize):** O cliente envia um pacote com a flag SYN para o servidor na porta desejada (ex: porta 80).
2. **SYN-ACK (Synchronize-Acknowledge):** Se a porta estiver aberta, o servidor responde aceitando a conexão.
3. **ACK (Acknowledge):** O cliente confirma o recebimento. A conexão está estabelecida!

Se a porta estiver fechada, o servidor responde com um pacote **RST (Reset)**. Ferramentas como o Nmap exploram exatamente essas respostas (como no SYN Scan \`nmap -sS\`) para descobrir serviços ativos sem completar a conexão inteira.`,
            summary: [
              'Portas conhecidas essenciais: 21 (FTP), 22 (SSH), 25 (SMTP), 53 (DNS), 80 (HTTP), 443 (HTTPS), 3306 (MySQL).',
              'O handshake SYN -> SYN-ACK -> ACK é a base da comunicação orientada à conexão.',
              'Firewalls podem filtrar pacotes silenciosamente (DROP/FILTERED) sem responder RST.'
            ],
            keyTerms: [
              { term: 'TCP SYN Scan', definition: 'Varredura furtiva que envia SYN e analisa a resposta sem concluir o handshake completo (half-open scan).' },
              { term: 'Porta Lógica', definition: 'Ponto final de comunicação virtual identificado por um número de 0 a 65535.' }
            ],
            quiz: [
              {
                id: 'q-net-1',
                question: 'Qual é a sequência correta de flags enviadas no TCP Three-Way Handshake?',
                options: [
                  'ACK -> SYN -> RST',
                  'SYN -> SYN-ACK -> ACK',
                  'PING -> PONG -> OK',
                  'FIN -> SYN -> ACK'
                ],
                correctIndex: 1,
                explanation: 'A sequência padrão é SYN (iniciação), SYN-ACK (resposta do servidor) e ACK (confirmação do cliente).'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-linux-basics',
        title: 'Módulo 2: Linha de Comando Linux Essencial',
        description: 'Navegação no sistema de arquivos, permissões (chmod/chown), manipulação de processos e análise de rede.',
        lessons: [
          {
            id: 'les-lin-1',
            title: 'Permissões e Comandos que todo Analista de Segurança deve saber',
            duration: '10 min',
            xp: 75,
            content: `No Linux, quase tudo é representado como arquivo. As permissões são divididas em 3 grupos: Usuário Proprietário (u), Grupo (g) e Outros (o).

- **r (read = 4)**: Permissão de leitura.
- **w (write = 2)**: Permissão de escrita e alteração.
- **x (execute = 1)**: Permissão de execução.

Exemplo: \`chmod 755 script.sh\` concede rwx (4+2+1=7) ao dono, r-x (4+1=5) ao grupo e r-x aos outros.

**Comandos indispensáveis:**
- \`netstat -tulnp\` ou \`ss -tulnp\`: Lista portas abertas e serviços escutando.
- \`ps aux | grep [processo]\`: Monitora processos em execução.
- \`grep -rnwi "password" /var/log/\`: Procura por textos e credenciais em logs.
- \`curl -v https://alvo.com\`: Inspeciona cabeçalhos HTTP brutos.`,
            summary: [
              'Conhecer permissões numéricas (777, 644, 755) é vital para evitar brechas de segurança de arquivos expostos.',
              'Pipes (\`|\`) e redirecionamentos (\`>\`, \`>>\`) permitem encadear comandos poderosos de filtragem e triagem.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'owasp-web-security',
    title: 'OWASP Top 10 & Segurança Web',
    shortDesc: 'Aprofunde-se nas vulnerabilidades web mais críticas da atualidade: SQL Injection, XSS, IDOR, SSRF e como blindar aplicações.',
    iconName: 'Code',
    badgeName: 'Especialista OWASP',
    color: 'amber',
    level: 'Intermediário',
    modules: [
      {
        id: 'mod-owasp-injections',
        title: 'Módulo 1: Injeções de Código (SQLi & Command Injection)',
        description: 'Entenda como entradas de usuário não tratadas podem permitir execução arbitrária de comandos e roubo total de dados.',
        lessons: [
          {
            id: 'les-owasp-sqli',
            title: 'SQL Injection (SQLi) em Profundidade',
            duration: '12 min',
            xp: 90,
            content: `A Injeção de SQL ocorre quando dados fornecidos pelo usuário são concatenados diretamente em consultas ao banco de dados sem sanitização ou uso de consultas preparadas (Prepared Statements).

**Cenário clássico de bypass de login:**
Consulta vulnerável:
\`SELECT * FROM users WHERE email = '\` + input_email + \`' AND password = '\` + input_pass + \`'\`

Se o invasor digitar como e-mail:
\`admin@site.com' OR '1'='1\` e comentar o resto com \`--\`

A consulta executada se torna:
\`SELECT * FROM users WHERE email = 'admin@site.com' OR '1'='1' --' AND password = '...'\`

Como \`'1'='1'\` é sempre verdadeiro, a consulta retorna o primeiro usuário (geralmente o administrador), autenticando o invasor sem precisar da senha!

**Como mitigar de forma definitiva:**
Utilize SEMPRE **Parameterized Queries (Prepared Statements)** ou ORMs seguros. Nunca concatene strings em comandos SQL.`,
            summary: [
              'Nunca confie em input de usuário (Never trust user input).',
              'Prepared Statements separam o código SQL dos parâmetros de dados.',
              'Princípio do menor privilégio: o usuário da aplicação no banco não deve ser root/dba.'
            ],
            keyTerms: [
              { term: 'SQL Injection', definition: 'Técnica de exploração onde comandos SQL maliciosos são inseridos em campos de entrada.' },
              { term: 'Prepared Statement', definition: 'Mecanismo em que a consulta SQL é pré-compilada no banco antes de receber os valores, impedindo injeção.' }
            ],
            codeExample: {
              language: 'typescript',
              vulnerable: `// ❌ VULNERÁVEL: Concatenação direta de strings
const query = "SELECT * FROM users WHERE username = '" + req.body.user + "' AND pass = '" + req.body.pass + "'";
const user = await db.query(query);`,
              secure: `// ✅ SEGURO: Parâmetros vinculados (Prepared Statements)
const query = "SELECT * FROM users WHERE username = $1 AND pass = $2";
const user = await db.query(query, [req.body.user, req.body.pass]);`,
              explanation: 'Com Prepared Statements, o banco de dados trata o conteúdo de $1 e $2 estritamente como literais de dados, e nunca como sintaxe de comando executável.'
            },
            quiz: [
              {
                id: 'q-sqli-1',
                question: 'Qual é a defesa mais eficaz e recomendada pela OWASP contra SQL Injection?',
                options: [
                  'Trocar o banco de dados para NoSQL',
                  'Usar consultas parametrizadas (Prepared Statements) com bind de variáveis',
                  'Remover apenas as aspas simples com replace() manual no frontend',
                  'Esconder os nomes das tabelas'
                ],
                correctIndex: 1,
                explanation: 'Prepared Statements garantem que os dados do usuário nunca sejam interpretados como instruções de consulta SQL pelo mecanismo do banco.'
              }
            ]
          },
          {
            id: 'les-owasp-xss',
            title: 'Cross-Site Scripting (XSS): Refletido, Armazenado e DOM',
            duration: '10 min',
            xp: 85,
            content: `O XSS ocorre quando uma aplicação web inclui dados não validados ou não escapados em uma página renderizada no navegador de outros usuários. Isso permite que um script malicioso JavaScript seja executado no contexto da sessão da vítima.

**Tipos de XSS:**
1. **Stored (Armazenado/Persistente):** O payload é salvo no banco de dados (ex: em um comentário de blog). Todo usuário que visualizar a página executa o script.
2. **Reflected (Refletido):** O payload é enviado na requisição (ex: em um parâmetro de busca \`?busca=<script>...\`) e refletido imediatamente na resposta.
3. **DOM-based:** A vulnerabilidade reside na manipulação insegura de dados pelo JavaScript no próprio navegador do cliente (ex: uso de \`innerHTML\` com dados de \`window.location\`).

**Impacto:** Roubo de cookies de sessão (Session Hijacking), redirecionamento para sites fraudulentos e execução de ações em nome da vítima.`,
            summary: [
              'Proteja cookies de sessão com as flags \`HttpOnly\`, \`Secure\` e \`SameSite=Strict\`.',
              'Utilize Context-Aware Output Encoding (codificação de entidades HTML) antes de renderizar dados.',
              'Implemente uma política rigorosa de Content Security Policy (CSP).'
            ],
            codeExample: {
              language: 'javascript',
              vulnerable: `// ❌ VULNERÁVEL: Inserção de HTML cru no DOM
document.getElementById("greeting").innerHTML = "Olá, " + location.search.get("name");`,
              secure: `// ✅ SEGURO: Usando textContent ou sanitizadores certificados (DOMPurify)
document.getElementById("greeting").textContent = "Olá, " + location.search.get("name");`,
              explanation: 'textContent trata o valor como texto puro, impedindo que tags como <script> ou <img onerror=...> sejam interpretadas pelo navegador.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'pentest-methodology',
    title: 'Pentest & Ethical Hacking Profissional',
    shortDesc: 'Aprenda o ciclo de vida completo de um Teste de Intrusão: Reconhecimento, Varredura, Enumeração, Exploração Ética e Relatórios.',
    iconName: 'Crosshair',
    badgeName: 'Pentester Certificado',
    color: 'rose',
    level: 'Avançado',
    modules: [
      {
        id: 'mod-pentest-lifecycle',
        title: 'Módulo 1: As 6 Fases do Pentest (Metodologia PTES)',
        description: 'Como conduzir um teste de intrusão com autorização legal, escopo definido e rigor técnico.',
        lessons: [
          {
            id: 'les-ptest-1',
            title: 'Pré-Engajamento e Escopo: A diferença entre Hacker Ético e Criminoso',
            duration: '8 min',
            xp: 75,
            content: `A linha que separa o Ethical Hacker de um invasor cibernético ilegal é uma única coisa: **AUTORIZAÇÃO FORMAL POR ESCRITO (Rules of Engagement & NDA)**.

Nunca realize testes de intrusão, varreduras agressivas ou tentativas de exploração em sistemas, redes ou domínios sem expressa permissão documentada dos proprietários. No Brasil, invasão não autorizada é tipificada pela Lei Carolina Dieckmann (Lei nº 12.737/2012) e Código Penal (Art. 154-A).

**Tipos de Teste quanto ao Conhecimento:**
- **Black Box (Caixa Preta):** O pentester não tem conhecimento prévio da infraestrutura interna, simulando um invasor externo real.
- **White Box (Caixa Branca):** Acesso completo a código-fonte, diagramas de rede e credenciais de teste para auditoria profunda.
- **Grey Box (Caixa Cinza):** Conhecimento parcial, simulando um usuário comum ou funcionário com privilégios limitados.`,
            summary: [
              'Sempre obtenha um documento formal de escopo (RoE) assinado antes de enviar qualquer pacote de teste.',
              'Defina janelas de horário, contatos de emergência e sistemas fora de escopo (out-of-scope).',
              'O objetivo do pentest é encontrar e ajudar a corrigir vulnerabilidades, gerando valor defensivo.'
            ],
            keyTerms: [
              { term: 'RoE (Rules of Engagement)', definition: 'Documento contratual que estabelece os limites, IPs autorizados, ferramentas permitidas e horários do pentest.' },
              { term: 'Lei 12.737/2012', definition: 'Legislação brasileira que criminaliza o acesso indevido a dispositivo informático alheio.' }
            ]
          },
          {
            id: 'les-ptest-2',
            title: 'Reconhecimento Ativo vs Passivo (OSINT)',
            duration: '9 min',
            xp: 80,
            content: `O reconhecimento é a etapa que consome até 70% do tempo de um pentester ou atacante. Quanto mais informações coletadas sobre o alvo, maiores as chances de identificar vetores fracos.

**Reconhecimento Passivo (OSINT):**
Coleta de dados sem interagir diretamente com os servidores do alvo, tornando o processo indetectável.
- Consultas WHOIS e registros DNS públicos.
- Google Dorking (\`site:alvo.com filetype:pdf confidential\`, \`inurl:admin\`).
- Shodan e Censys (motores de busca para dispositivos conectados à internet).
- Redes sociais e vazamentos históricos (Have I Been Pwned, DeHashed).

**Reconhecimento Ativo:**
Interação direta com os sistemas do alvo, gerando logs e possíveis alertas em IDS/WAF.
- Varreduras de portas com Nmap.
- Enumeração de diretórios com Gobuster / Feroxbuster.
- Mapeamento de banners de serviços e versões de software.`,
            summary: [
              'Comece sempre pelo reconhecimento passivo para traçar o mapa do alvo sem disparar defesas.',
              'Google Dorks revelam arquivos de configuração esquecidos, planilhas internas e backups expostos.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'blue-team-defense',
    title: 'Blue Team & Defesa Ativa de Redes',
    shortDesc: 'Aprenda a detectar ameaças, analisar logs, configurar defesas em profundidade e responder a incidentes de segurança.',
    iconName: 'Server',
    badgeName: 'Sentinela Blue Team',
    color: 'indigo',
    level: 'Intermediário',
    modules: [
      {
        id: 'mod-soc-siem',
        title: 'Módulo 1: SOC, SIEM e Análise de Logs',
        description: 'Como centros de operações de segurança monitoram eventos em tempo real e identificam anomalias.',
        lessons: [
          {
            id: 'les-blue-1',
            title: 'O que faz um Analista de SOC (Security Operations Center)?',
            duration: '7 min',
            xp: 65,
            content: `O Blue Team é responsável pela defesa contínua da organização. Enquanto o Red Team ataca para encontrar brechas, o Blue Team constrói barreiras, monitora acessos e reage a violações.

**Ferramentas Centrais:**
- **SIEM (Security Information and Event Management):** Centraliza logs de firewalls, servidores, estações e bancos de dados (ex: Splunk, Elastic Security, Wazuh, QRadar).
- **EDR (Endpoint Detection and Response):** Monitora processos suspeitos diretamente nas máquinas dos usuários (ex: CrowdStrike, Defender for Endpoint).
- **Honeypots:** Sistemas armadilhas com vulnerabilidades simuladas para atrair invasores e estudar suas técnicas antes que alcancem dados reais.`,
            summary: [
              'A segurança não é um produto, mas um processo contínuo de visibilidade e resposta.',
              'Logs sem centralização e correlação dificultam a investigação forense pós-incidente.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'social-engineering',
    title: 'Engenharia Social & Defesa Comportamental',
    shortDesc: 'Compreenda as táticas mais sofisticadas de manipulação humana (Phishing, Vishing, Smishing, Deepfakes e Pretexting).',
    iconName: 'UserCheck',
    badgeName: 'Mestre da Psicologia Cibernética',
    color: 'purple',
    level: 'Todos os Públicos',
    modules: [
      {
        id: 'mod-soc-eng-tactics',
        title: 'Módulo 1: Os Vetores de Ataque Humano',
        description: 'Desvendando as técnicas que burlam as defesas tecnológicas através do elo mais explorado: o ser humano.',
        lessons: [
          {
            id: 'les-soc-1',
            title: 'Vishing (Voz), Smishing (SMS) e Clonagem de Voz por IA',
            duration: '6 min',
            xp: 60,
            content: `Com o avanço da Inteligência Artificial gerativa, criminosos conseguem clonar a voz de executivos, amigos ou familiares a partir de apenas 3 segundos de áudio extraído de redes sociais.

**Cenários modernos de golpe:**
- **Vishing:** Ligação simulando a central de segurança do banco pedindo para fazer um Pix de "estorno de teste".
- **Smishing:** SMS com link de rastreio de encomenda retida nos Correios ou pontuação de fidelidade expirando.
- **Palavra de Segurança Familiar:** Crie uma palavra-código secreta com sua família para confirmar a identidade caso alguém ligue pedindo dinheiro urgente.`,
            summary: [
              'Desconfie de ligações e áudios que criam senso de urgência e pedem transferências imediatas.',
              'Estabeleça palavras-chave de segurança entre pessoas próximas.',
              'Sempre desligue a chamada e ligue de volta no número oficial da instituição.'
            ]
          }
        ]
      }
    ]
  }
];
