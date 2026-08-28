import { SecurityTip, EmergencyAction } from '../types';

export const securityTipsList: SecurityTip[] = [
  {
    id: 'tip-whatsapp-pin',
    title: 'Ative o PIN de 6 dígitos no WhatsApp com e-mail de recuperação',
    category: 'Senhas & 2FA',
    importance: 'Urgente',
    summary: 'A confirmação em duas etapas impede que golpistas registrem seu número em outro aparelho mesmo se interceptarem o SMS.',
    practicalSteps: [
      'Abra o WhatsApp > Configurações (ou Ajustes) > Conta > Confirmação em duas etapas.',
      'Toque em Ativar e defina um PIN numérico de 6 dígitos que você não vá esquecer.',
      'Adicione um endereço de e-mail seguro para recuperar o PIN caso necessário.'
    ],
    dos: [
      'Cadastre um e-mail ao qual só você tem acesso.',
      'Memorize o PIN.'
    ],
    donts: [
      'Nunca digite datas de aniversário como 123456 ou seu ano de nascimento.',
      'Nunca compartilhe o código de 6 dígitos do WhatsApp com ninguém que ligar para você.'
    ]
  },
  {
    id: 'tip-public-wifi',
    title: 'Cuidado redobrado em Wi-Fi de aeroportos, hotéis e cafeterias',
    category: 'Redes & Wi-Fi',
    importance: 'Essencial',
    summary: 'Redes públicas abertas podem ser clonadas (Evil Twin) para interceptar o tráfego de quem se conecta.',
    practicalSteps: [
      'Evite acessar aplicativos bancários ou digitar senhas críticas conectado a Wi-Fi público sem VPN.',
      'Se precisar usar com frequência, utilize uma VPN confiável (Mullvad, ProtonVPN).',
      'Desative a opção de "Conectar automaticamente a redes abertas" no seu celular.'
    ],
    dos: [
      'Dê preferência para usar os dados móveis (4G/5G) do seu próprio plano.',
      'Verifique se a barra de endereço mostra o cadeado HTTPS.'
    ],
    donts: [
      'Nunca instale certificados ou perfis de configuração solicitados por portais de Wi-Fi de cafeteria.'
    ]
  },
  {
    id: 'tip-pix-fake',
    title: 'Como se blindar contra o golpe do Pix e do Falso Comprovante',
    category: 'Golpes & Phishing',
    importance: 'Urgente',
    summary: 'Golpistas enviam prints editados de Pix agendado ou fingem ser parentes pedindo dinheiro urgente em números novos.',
    practicalSteps: [
      'Se um parente ou amigo mandar mensagem de número novo pedindo Pix, ligue por chamada de vídeo ou no número antigo para checar.',
      'Ao vender produtos, nunca libere a mercadoria olhando apenas o print de comprovante enviado pelo comprador.',
      'Abra o aplicativo oficial do seu banco e confirme se o dinheiro REALMENTE entrou no seu saldo disponível.'
    ],
    dos: [
      'Confira o extrato bancário diretamente no app oficial.',
      'Cadastre chaves Pix aleatórias (EVP) em vez do seu CPF ou telefone em compras gerais.'
    ],
    donts: [
      'Não confie em notificações por e-mail ou SMS dizendo "Pix recebido" sem checar o app do banco.'
    ]
  },
  {
    id: 'tip-phishing-urls',
    title: 'Inspeção Rápida de Links e Domínios Fraudulentos',
    category: 'Golpes & Phishing',
    importance: 'Essencial',
    summary: 'O domínio real é o que vem logo antes da primeira barra (`/`) e do sufixo (`.com.br`, `.com`).',
    practicalSteps: [
      'Exemplo falso: `https://banco.com.br.suporte-autorizado.xyz/login` -> O site real é `suporte-autorizado.xyz`, e NÃO o banco!',
      'Desconfie de encurtadores de links (bit.ly, is.gd) em mensagens não solicitadas.',
      'Use ferramentas como o VirusTotal ou urlscan.io para escanear links suspeitos antes de abri-los.'
    ],
    dos: [
      'Digite o endereço do site diretamente na barra do navegador.',
      'Salve os sites que você mais usa em seus favoritos.'
    ],
    donts: [
      'Não clique em links de SMS alegando que seus pontos de cartão de crédito vão expirar hoje.'
    ]
  },
  {
    id: 'tip-device-lost',
    title: 'Blindagem do Celular contra Roubo e Acesso a Bancos',
    category: 'Celular & Apps',
    importance: 'Essencial',
    summary: 'Dificulte o acesso de criminosos aos seus dados caso o aparelho físico seja subtraído.',
    practicalSteps: [
      'Coloque uma senha com PIN forte no chip da operadora (SIM Card). Assim, se o chip for colocado em outro celular, ele estará bloqueado!',
      'Ative a proteção contra restauração de fábrica e biometria em apps bancários.',
      'Utilize a função "Pasta Segura" ou "Espaço Privado" para esconder apps financeiros.',
      'Anote o número IMEI do aparelho (digite *#06# no teclado de chamada) em um papel seguro em casa.'
    ],
    dos: [
      'Configure limites baixos para transferências Pix noturnas no seu banco.',
      'Mantenha o backup automático em nuvem ativado.'
    ],
    donts: [
      'Não salve senhas ou fotos de cartões de crédito na galeria de fotos ou no bloco de notas.'
    ]
  }
];

export const emergencyActionsList: EmergencyAction[] = [
  {
    id: 'em-whatsapp-stolen',
    threat: 'Meu WhatsApp foi Clonado / Invasão de Conta',
    icon: 'MessageSquareX',
    urgency: 'Imediato',
    firstActions: [
      'Avise imediatamente seus amigos e familiares por ligação ou outras redes sociais para NÃO transferirem dinheiro!',
      'Tente reinstalar o WhatsApp e solicitar o código de 6 dígitos por SMS no seu aparelho.',
      'Se o golpista tiver ativado um PIN de 2FA que você não sabe, aguarde 7 dias para redefinir enquanto mantém o suporte notificado.'
    ],
    detailedSteps: [
      { step: 1, title: 'Reinstalar o App', desc: 'Ao colocar seu número e digitar o código SMS, o invasor é desconectado automaticamente da sessão anterior.' },
      { step: 2, title: 'Enviar e-mail para o suporte do WhatsApp', desc: 'Envie um e-mail para support@whatsapp.com com o assunto "Conta clonada/desativada" e no corpo escreva seu número em formato internacional (+55 11 9XXXX-XXXX).' },
      { step: 3, title: 'Registrar Boletim de Ocorrência (B.O.)', desc: 'Faça um B.O. online na Delegacia de Crimes Cibernéticos do seu estado para se resguardar legalmente.' }
    ],
    contactsToCall: ['Suporte WhatsApp: support@whatsapp.com', 'Delegacia Eletrônica da Polícia Civil']
  },
  {
    id: 'em-phone-stolen',
    threat: 'Celular Físico Roubado / Furtado',
    icon: 'SmartphoneNfc',
    urgency: 'Imediato',
    firstActions: [
      'Ligue IMEDIATAMENTE para a central dos seus bancos para bloquear o acesso ao aplicativo e cartões.',
      'Ligue para a operadora de telefonia para bloquear a linha e o chip SIM.',
      'Acesse Encontrar Meu Dispositivo (Google / Apple iCloud) de outro computador e mande BLOQUEAR e APAGAR os dados remotamente.'
    ],
    detailedSteps: [
      { step: 1, title: 'Bloqueio de Bancos', desc: 'Peça o cancelamento imediato de sessões ativas e tokens de segurança no atendimento de emergência do banco.' },
      { step: 2, title: 'Bloqueio do IMEI', desc: 'Informe o código IMEI para a operadora e na confecção do Boletim de Ocorrência para inutilizar o aparelho.' },
      { step: 3, title: 'Troca de Senhas Principais', desc: 'Troque a senha da sua conta Google/Apple ID, e-mail principal e redes sociais a partir de um computador seguro.' }
    ],
    contactsToCall: ['Central de Atendimento do seu Banco', 'Operadora de Telefonia (Vivo: 1058, Claro: 1052, TIM: 1056)', 'Disque Denúncia / 190']
  },
  {
    id: 'em-pix-scam',
    threat: 'Caí em um Golpe e Fiz um Pix para um Criminoso',
    icon: 'AlertTriangle',
    urgency: 'Imediato',
    firstActions: [
      'Acione o MED (Mecanismo Especial de Devolução) do Banco Central IMEDIATAMENTE pelo chat ou telefone do seu banco!',
      'Quanto mais rápido você solicitar o MED (dentro dos primeiros minutos), maiores são as chances de o banco bloquear o valor na conta do fraudador.',
      'Guarde todos os comprovantes, conversas, prints e chaves Pix envolvidas.'
    ],
    detailedSteps: [
      { step: 1, title: 'Solicitar o MED no Banco', desc: 'Explique que foi vítima de golpe financeiro e exija a abertura do Mecanismo Especial de Devolução (Resolução BCB nº 103).' },
      { step: 2, title: 'Boletim de Ocorrência com dados da conta recebedora', desc: 'Anexe o B.O. com nome, CPF/CNPJ e agência da conta que recebeu os recursos.' },
      { step: 3, title: 'Reclamação no BACEN e Procon', desc: 'Se o banco se recusar a abrir o MED, registre queixa no portal do Banco Central (bcb.gov.br) e no Consumidor.gov.br.' }
    ],
    contactsToCall: ['SAC / Ouvidoria do seu Banco', 'Banco Central do Brasil: 145', 'Consumidor.gov.br']
  }
];

export const securityChecklist = [
  { id: 'chk-1', text: 'Ativei autenticação em 2 fatores (2FA) com app autenticador no meu e-mail principal', category: 'Contas' },
  { id: 'chk-2', text: 'Configurei o PIN de 6 dígitos no WhatsApp com e-mail de recuperação cadastrado', category: 'Mensageiros' },
  { id: 'chk-3', text: 'Não repito a mesma senha em nenhum site ou serviço', category: 'Senhas' },
  { id: 'chk-4', text: 'Uso um gerenciador de senhas com senha mestra robusta', category: 'Senhas' },
  { id: 'chk-5', text: 'Coloquei PIN no chip (SIM Card) do meu celular para evitar clonagem física', category: 'Celular' },
  { id: 'chk-6', text: 'Defini limites baixos para transferências Pix e limite noturno no banco', category: 'Bancos' },
  { id: 'chk-7', text: 'Ativei biometria e bloqueio automático de tela em 30 segundos no celular', category: 'Celular' },
  { id: 'chk-8', text: 'Anotei o código IMEI do meu celular em local seguro em casa', category: 'Celular' },
  { id: 'chk-9', text: 'Tenho backup em nuvem ou disco externo criptografado dos meus arquivos vitais', category: 'Backup' },
  { id: 'chk-10', text: 'Mantenho o sistema operacional e aplicativos sempre atualizados', category: 'Dispositivos' }
];
