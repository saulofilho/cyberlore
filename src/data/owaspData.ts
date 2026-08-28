import { OwaspItem } from '../types';

export const owaspTop10List: OwaspItem[] = [
  {
    id: 'a01-broken-access-control',
    code: 'A01:2021',
    title: 'Quebra de Controle de Acesso & IDOR',
    englishTitle: 'Broken Access Control',
    severity: 'Crítica',
    description: 'Falha em restringir o que usuários autenticados podem ver ou fazer. Permite que atacantes acessem contas alheias (IDOR), visualizem dados confidenciais ou realizem ações administrativas não autorizadas.',
    impact: 'Vazamento massivo de prontuários, documentos, faturas, alteração de senhas de outros usuários e escalação de privilégios para Administrador.',
    howItWorks: 'Ocorre quando o servidor confia cegamente em identificadores fornecidos pelo cliente (como `user_id=105` na URL ou corpo da requisição) sem validar se o token de sessão do usuário logado realmente tem permissão para acessar aquele recurso.',
    prevention: [
      'Valide as permissões de acesso no lado do servidor em TODAS as requisições, nunca confiando em dados vindos do frontend.',
      'Implemente controle de acesso baseado em funções (RBAC) ou atributos (ABAC) de forma centralizada.',
      'Desative a listagem de diretórios no servidor web e bloqueie acesso a arquivos sensíveis (.git, .env, backups).',
      'Use identificadores não sequenciais e difíceis de adivinhar (UUID v4) em vez de números inteiros sequenciais (ID=1, 2, 3).'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL (IDOR): O backend busca o relatório pelo ID fornecido na URL sem verificar se pertence ao usuário logado
app.get('/api/invoices/:invoiceId', async (req, res) => {
  const invoice = await db.findInvoiceById(req.params.invoiceId);
  return res.json(invoice);
});`,
    secureSnippet: `// ✅ SEGURO: Valida que a fatura pertence estritamente ao usuário autenticado na sessão
app.get('/api/invoices/:invoiceId', authenticateToken, async (req, res) => {
  const invoice = await db.findInvoiceById(req.params.invoiceId);
  
  if (!invoice || (invoice.userId !== req.user.id && req.user.role !== 'ADMIN')) {
    return res.status(403).json({ error: 'Acesso negado: você não tem permissão para ver este recurso.' });
  }
  
  return res.json(invoice);
});`,
    language: 'javascript',
    labType: 'idor'
  },
  {
    id: 'a02-cryptographic-failures',
    code: 'A02:2021',
    title: 'Falhas Criptográficas',
    englishTitle: 'Cryptographic Failures',
    severity: 'Alta',
    description: 'Uso de algoritmos criptográficos obsoletos ou fracos (MD5, SHA1, DES), armazenamento de senhas em texto puro, transmissão de dados sem HTTPS ou gerenciamento negligente de chaves secretas.',
    impact: 'Exposição de senhas de usuários, dados de cartão de crédito (CVV), chaves de API mestre e quebra de sigilo das comunicações.',
    howItWorks: 'Dados sensíveis armazenados sem hash salgado (salt) ou transmitidos em texto claro podem ser interceptados em redes Wi-Fi públicas (ataques Man-in-the-Middle) ou recuperados instantaneamente através de Rainbow Tables.',
    prevention: [
      'Nunca armazene senhas em texto puro nem com algoritmos rápidos como MD5 ou SHA256 simples. Use algoritmos lentos com salt adaptativo: Argon2id ou bcrypt (fator de trabalho 12+).',
      'Force HTTPS em todo o site e ative HSTS (HTTP Strict Transport Security) com max-age longo.',
      'Criptografe dados sensíveis em repouso (AES-256-GCM) e rotacione chaves criptográficas periodicamente.',
      'Desative cifras e protocolos TLS antigos (TLS 1.0 e 1.1), aceitando apenas TLS 1.2 e TLS 1.3.'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL: Hash simples e rápido (MD5/SHA1) sem salt é quebrado em milissegundos por Rainbow Tables
import crypto from 'crypto';
const hash = crypto.createHash('md5').update(password).digest('hex');
await db.saveUser({ username, passwordHash: hash });`,
    secureSnippet: `// ✅ SEGURO: Uso de Argon2id ou bcrypt com fator de custo e salt gerado aleatoriamente
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;
const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
await db.saveUser({ username, passwordHash });`,
    language: 'javascript'
  },
  {
    id: 'a03-injection',
    code: 'A03:2021',
    title: 'Injeção (SQL, NoSQL, OS Command & LDAP)',
    englishTitle: 'Injection',
    severity: 'Crítica',
    description: 'Ocorre quando dados não confiáveis são enviados para um interpretador (como um banco de dados SQL ou shell do sistema operacional) como parte de um comando ou consulta.',
    impact: 'Execução arbitrária de comandos no servidor (RCE), leitura, alteração e deleção completa de bases de dados relacionais e extração de credenciais.',
    howItWorks: 'O invasor manipula a estrutura sintática da consulta injetando caracteres de controle (aspas simples, ponto e vírgula, pipes `|`, operadores lógicos `OR 1=1`).',
    prevention: [
      'Use consultas parametrizadas (Prepared Statements) em todas as chamadas a bancos de dados.',
      'Evite passar argumentos de usuários diretamente para funções de execução do sistema operacional (como `exec()`, `system()`, `eval()`).',
      'Adote listas de permissão (allowlist) rigorosas para validação de formatos de entrada.',
      'Utilize ORMs modernos com consultas seguras por padrão.'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL (SQL Injection): Concatenação de string no SQL
const sql = \`SELECT * FROM accounts WHERE user_id = '\${req.body.userId}' AND pin = '\${req.body.pin}'\`;
const result = await db.query(sql);`,
    secureSnippet: `// ✅ SEGURO: Prepared Statement com parâmetros vinculados
const sql = 'SELECT id, username, email FROM accounts WHERE user_id = $1 AND pin_hash = $2';
const result = await db.query(sql, [req.body.userId, computedPinHash]);`,
    language: 'javascript',
    labType: 'sqli'
  },
  {
    id: 'a04-insecure-design',
    code: 'A04:2021',
    title: 'Design Inseguro',
    englishTitle: 'Insecure Design',
    severity: 'Alta',
    description: 'Defeitos estruturais na arquitetura e no modelo de ameaças do sistema antes mesmo da primeira linha de código ser escrita. Representa a falta de práticas de Security by Design.',
    impact: 'Falhas conceituais impossíveis de corrigir apenas com patches de sintaxe (ex: fluxos de recuperação de senha que dependem de perguntas fáceis, promoções de e-commerce sem limite de cupom por CPF).',
    howItWorks: 'Acontece quando a equipe desenvolve funcionalidades assumindo um mundo ideal onde usuários são benevolentes, sem conduzir modelagem de ameaças (Threat Modeling como STRIDE) ou validação de limites de negócio.',
    prevention: [
      'Realize sessões de Modelagem de Ameaças (Threat Modeling) durante a fase de planejamento de produto.',
      'Estabeleça e use bibliotecas de padrões de design seguros (Design Patterns & Guardrails).',
      'Defina limites de taxa (Rate Limiting) e travas anti-abuso na lógica de negócios desde o início.'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL: Lógica de negócio falha permite aplicar 100 cupons simultâneos no mesmo pedido
app.post('/api/apply-coupon', async (req, res) => {
  order.discount += coupon.value; // Não valida se já há cupom aplicado ou se o desconto supera 100%
  res.json({ total: order.total - order.discount });
});`,
    secureSnippet: `// ✅ SEGURO: Regras estritas de negócio com travamento e validação transacional
app.post('/api/apply-coupon', async (req, res) => {
  if (order.hasCouponApplied) throw new Error('Apenas 1 cupom por pedido permitido.');
  if (coupon.isExpired || coupon.usageCount >= coupon.maxUsage) throw new Error('Cupom indisponível.');
  order.applySingleDiscount(coupon);
  res.json({ total: order.calculateFinalTotal() });
});`,
    language: 'javascript'
  },
  {
    id: 'a05-security-misconfiguration',
    code: 'A05:2021',
    title: 'Configuração Incorreta de Segurança',
    englishTitle: 'Security Misconfiguration',
    severity: 'Alta',
    description: 'Sistemas implantados com senhas padrão de fábrica, mensagens de erro detalhadas (stack traces) exibidas aos usuários, portas e serviços desnecessários abertos ou arquivos de configuração (.env, .git) expostos na web.',
    impact: 'Acesso imediato com credenciais padrão (admin/admin), vazamento de segredos de infraestrutura e mapeamento facilitado da arquitetura por atacantes.',
    howItWorks: 'Desenvolvedores deixam modos de debug ativados em produção ou servidores web configurados para permitir visualização de diretórios (Directory Listing).',
    prevention: [
      'Mantenha um processo de Hardening automatizado e repetível com ferramentas de infraestrutura como código (IaC).',
      'Desative recursos, portas, serviços e páginas de teste desnecessárias.',
      'Configure cabeçalhos de segurança HTTP (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).',
      'Nunca suba arquivos sensíveis (.env, .git, chaves .pem) para pastas públicas do servidor web.'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL: Erros internos brutos com stack trace expostos na resposta da API
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack, // Revela caminhos do servidor, versões e código interno!
    databaseConfig: process.env.DATABASE_URL
  });
});`,
    secureSnippet: `// ✅ SEGURO: Mensagens genéricas para o usuário e log estruturado seguro no servidor
app.use((err, req, res, next) => {
  logger.error('Erro interno processado com traceId:', { traceId: req.traceId, err });
  res.status(500).json({
    message: 'Ocorreu um erro interno. Nossa equipe técnica já foi notificada.',
    traceId: req.traceId
  });
});`,
    language: 'javascript',
    labType: 'misconfig'
  },
  {
    id: 'a06-vulnerable-components',
    code: 'A06:2021',
    title: 'Componentes Vulneráveis e Desatualizados',
    englishTitle: 'Vulnerable and Outdated Components',
    severity: 'Alta',
    description: 'Uso de bibliotecas, frameworks, plugins ou dependências de código aberto desatualizadas com vulnerabilidades conhecidas (CVEs catalogadas).',
    impact: 'Invasões automáticas através de exploits públicos disponíveis na internet (como aconteceu no histórico caso Log4Shell ou na falha Equifax Apache Struts).',
    howItWorks: 'Atacantes utilizam scanners automatizados para detectar versões antigas de WordPress, bibliotecas npm, pacotes pip ou containers vulneráveis e disparam scripts prontos.',
    prevention: [
      'Mantenha um inventário contínuo de todas as dependências (Software Bill of Materials - SBOM).',
      'Execute scanners de segurança de dependências em seu pipeline CI/CD (ex: `npm audit`, Snyk, Dependabot, Trivy).',
      'Remova dependências não utilizadas, documentações e arquivos de exemplo de produção.'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL: Uso de dependência com vulnerabilidade crítica conhecida (ex: lodash < 4.17.21 com Prototype Pollution)
// package.json
{
  "dependencies": {
    "lodash": "4.17.4" // Versão antiga vulnerável a Prototype Pollution e DoS
  }
}`,
    secureSnippet: `// ✅ SEGURO: Dependências travadas em versões corrigidas com verificação periódica de audit
// package.json
{
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "scripts": {
    "security-check": "npm audit --audit-level=high"
  }
}`,
    language: 'json'
  },
  {
    id: 'a07-auth-failures',
    code: 'A07:2021',
    title: 'Falhas de Identificação e Autenticação',
    englishTitle: 'Identification and Authentication Failures',
    severity: 'Alta',
    description: 'Permitir ataques de força bruta ou Credential Stuffing por falta de Rate Limiting, senhas fracas permitidas, sessões que não expiram ou falhas no fluxo de esqueci minha senha.',
    impact: 'Sequestro de contas de usuários legítimos, automação de botnets para testar milhões de senhas e roubo de sessões.',
    howItWorks: 'A aplicação não bloqueia requisições repetidas após erros consecutivos de senha nem exige autenticação multifatorial, permitindo que scripts testem dicionários com facilidade.',
    prevention: [
      'Implemente bloqueio temporário ou Rate Limiting rigoroso baseado em IP e conta.',
      'Exija senhas fortes com no mínimo 12 a 16 caracteres e verifique contra listas de senhas vazadas (Have I Been Pwned API).',
      'Invalide IDs de sessão antigos no logout e regenere o token de sessão após o login (contra Session Fixation).'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL: Endpoint de login sem limite de tentativas (vulnerável a força bruta e dicionário)
app.post('/api/login', async (req, res) => {
  const user = await db.getUser(req.body.email);
  if (!user || user.password !== req.body.password) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  return res.json({ token: user.token });
});`,
    secureSnippet: `// ✅ SEGURO: Rate limiting com express-rate-limit + bloqueio de conta temporário
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 tentativas de login por IP
  message: { error: 'Muitas tentativas de login. Aguarde 15 minutos.' }
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // Lógica segura com verificação de hash e tempo constante
});`,
    language: 'javascript',
    labType: 'broken_auth'
  },
  {
    id: 'a08-integrity-failures',
    code: 'A08:2021',
    title: 'Falhas de Integridade de Software e Dados',
    englishTitle: 'Software and Data Integrity Failures',
    severity: 'Alta',
    description: 'Confiar em atualizações de software, plugins ou pipelines de CI/CD sem verificar assinaturas digitais e integridade criptográfica. Também abrange desserialização insegura.',
    impact: 'Ataques na cadeia de suprimentos (Supply Chain Attacks como o SolarWinds), injeção de código malicioso através de CDNs adulteradas e RCE via desserialização.',
    howItWorks: 'Um script de terceiro ou pacote npm é comprometido pelo atacante. Como a aplicação não valida hashes de integridade (SRI - Subresource Integrity), o código infectado roda no navegador dos clientes.',
    prevention: [
      'Use Subresource Integrity (SRI) com tags `integrity="sha384-..."` ao carregar scripts externos de CDNs.',
      'Assine digitalmente artefatos de build e use ferramentas como Sigstore/Cosign.',
      'Nunca desserialize objetos complexos vindos de fontes não confiáveis sem validação estrita de esquemas.'
    ],
    vulnerableSnippet: `<!-- ❌ VULNERÁVEL: Carregando biblioteca externa de CDN sem hash de integridade -->
<script src="https://cdn.exemplo.com/analytics.js"></script>`,
    secureSnippet: `<!-- ✅ SEGURO: Tag com Subresource Integrity (SRI) e política CORS estrita -->
<script 
  src="https://cdn.exemplo.com/analytics.js" 
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC" 
  crossorigin="anonymous">
</script>`,
    language: 'html'
  },
  {
    id: 'a09-logging-failures',
    code: 'A09:2021',
    title: 'Falhas em Registro de Logs e Monitoramento',
    englishTitle: 'Security Logging and Monitoring Failures',
    severity: 'Média',
    description: 'Falta de auditoria para eventos críticos de segurança (como falhas consecutivas de login, mudanças de privilégio ou transações financeiras suspeitas).',
    impact: 'Invasores permanecem semanas ou meses dentro da rede sem serem detectados (o tempo médio de permanência de um invasor antes da detecção ultrapassa 200 dias no mundo real).',
    howItWorks: 'A empresa só percebe que foi violada quando os dados aparecem à venda na dark web ou quando é vítima de ransomware com tela de resgate, pois ninguém olhava os alertas de rede.',
    prevention: [
      'Gere logs para todas as ações críticas: logins com sucesso e falhas, transações, exclusão de dados e alterações de permissão.',
      'Garanta que logs estejam em formato estruturado (JSON) e protegidos contra adulteração em servidor dedicado de logs.',
      'Configure alertas automatizados em tempo real para picos anômalos de requisições ou acessos fora de horário.'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL: Ações críticas de segurança ocorrem silenciosamente sem registro em log
app.post('/api/admin/grant-privileges', async (req, res) => {
  await db.makeAdmin(req.body.targetUserId);
  res.json({ success: true });
});`,
    secureSnippet: `// ✅ SEGURO: Log estruturado com IP, operador, timestamp e alerta para SIEM
app.post('/api/admin/grant-privileges', authenticateAdmin, async (req, res) => {
  await db.makeAdmin(req.body.targetUserId);
  
  auditLogger.warn('ELEVACAO_DE_PRIVILEGIO', {
    executorId: req.user.id,
    targetUserId: req.body.targetUserId,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true });
});`,
    language: 'javascript'
  },
  {
    id: 'a10-ssrf',
    code: 'A10:2021',
    title: 'Server-Side Request Forgery (SSRF)',
    englishTitle: 'Server-Side Request Forgery',
    severity: 'Alta',
    description: 'Ocorre quando uma aplicação web busca um recurso remoto em uma URL fornecida pelo usuário sem validar a URL de destino.',
    impact: 'Acessar serviços internos protegidos por firewall, ler metadados confidenciais de nuvem (AWS EC2 metadata `http://169.254.169.254/latest/meta-data/`) e escanear a rede privada da empresa.',
    howItWorks: 'A aplicação possui uma função como "Importar foto de perfil por URL" ou "Gerar PDF de um link". O invasor passa uma URL interna da rede local (`http://localhost:8080/admin` ou `http://169.254.169.254`), fazendo o servidor agir como proxy para a invasão interna.',
    prevention: [
      'Valide e filtre todas as URLs fornecidas por clientes contra uma lista de permissão estrita de domínios confiáveis.',
      'Bloqueie requisições para endereços de loopback (127.0.0.1, localhost) e faixas de IP privadas (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).',
      'Desative o redirecionamento HTTP automático no cliente HTTP utilizado.',
      'Bloqueie no firewall o acesso ao IP de metadados da nuvem (169.254.169.254).'
    ],
    vulnerableSnippet: `// ❌ VULNERÁVEL (SSRF): Busca qualquer URL passada pelo usuário sem restrição
app.post('/api/fetch-avatar', async (req, res) => {
  const imageUrl = req.body.url; // Invasor envia: "http://169.254.169.254/latest/meta-data/iam/security-credentials/"
  const response = await fetch(imageUrl);
  const data = await response.buffer();
  res.send(data);
});`,
    secureSnippet: `// ✅ SEGURO: Validação de protocolo (apenas HTTPS) e bloqueio de IPs privados e loopback
import ipaddr from 'ipaddr.js';
import dns from 'dns/promises';

async function isSafeUrl(urlString) {
  const parsed = new URL(urlString);
  if (parsed.protocol !== 'https:') return false;
  
  const lookup = await dns.lookup(parsed.hostname);
  const addr = ipaddr.parse(lookup.address);
  
  // Rejeita loopback, privados, link-local de nuvem (169.254.x.x)
  if (addr.range() !== 'unicast') return false;
  return true;
}

app.post('/api/fetch-avatar', async (req, res) => {
  if (!(await isSafeUrl(req.body.url))) {
    return res.status(400).json({ error: 'URL não permitida ou destino interno proibido.' });
  }
  // Processamento seguro...
});`,
    language: 'javascript'
  }
];
