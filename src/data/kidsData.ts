import { KidsQuest } from '../types';

export const kidsQuestsList: KidsQuest[] = [
  {
    id: 'quest-super-password',
    title: 'A Chave Mágica: Criando Super Senhas!',
    iconName: 'KeyRound',
    category: 'Senhas Secretas',
    story: 'No Reino Digital, sua senha é como a chave da sua casa mágica ou da sua conta no Roblox e Minecraft! Se você usa uma chave fraca como "123456" ou o nome do seu cachorro, qualquer monstrinho hacker pode entrar e pegar seus itens raros!',
    mission: 'Aprenda a inventar uma senha secreta que ninguém no universo consegue adivinhar, mas que é super fácil para você lembrar!',
    superTips: [
      'Junte 3 palavras divertidas que você gosta (ex: "Dinossauro", "Pipoca", "Voador").',
      'Misture um número legal e um símbolo (ex: "DinossauroPipocaVoador!2026").',
      'Nunca conte sua senha nem para o seu melhor amigo da escola! Só seus pais ou responsáveis podem saber.',
      'Nunca digite sua senha em computadores estranhos da escola ou lan houses sem supervisão.'
    ],
    miniQuiz: {
      question: 'Se um amigo do jogo online pedir sua senha dizendo que vai te dar 10.000 Robux ou Diamantes grátis, o que você deve fazer?',
      options: [
        'Passar a senha correndo para ganhar os itens!',
        'Não passar a senha de jeito nenhum, pois isso é uma armadilha, e avisar um adulto!',
        'Passar a senha, mas pedir para ele prometer que não vai roubar',
        'Passar a senha do seu irmão no lugar'
      ],
      correctIndex: 1,
      explanation: 'Ninguém dá itens caros de graça na internet pedindo sua senha! Isso é golpe (phishing) para roubar sua conta.'
    },
    rewardBadge: 'Mestre da Chave Mágica'
  },
  {
    id: 'quest-safe-games',
    title: 'Gamer Esperto: Protegendo suas Contas nos Jogos',
    iconName: 'Gamepad2',
    category: 'Games Seguros',
    story: 'Você passou semanas construindo sua vila no Minecraft ou juntando skins no Roblox e Fortnite. Mas existem armadilhas de links falsos ("sites de diamantes grátis", downloads de mods estranhos que contêm vírus)!',
    mission: 'Descubra como jogar seus games favoritos sem nunca perder suas contas nem pegar vírus no celular ou computador.',
    superTips: [
      'Ative a Verificação em Duas Etapas (2FA) na sua conta do jogo com a ajuda dos seus pais.',
      'Só baixe mods e jogos de lojas oficiais (Google Play, App Store, Steam, Epic Games).',
      'Se um site pedir para você preencher um formulário com seu login para "ganhar V-Bucks/Robux", feche a página imediatamente!',
      'Não clique em links estranhos enviados no chat do Discord ou nas mensagens do jogo.'
    ],
    miniQuiz: {
      question: 'Qual é o lugar mais seguro para baixar jogos e aplicativos no celular?',
      options: [
        'Em um site aleatório que você achou no YouTube',
        'Nas lojas oficiais de aplicativos (Google Play ou Apple App Store)',
        'Clicando em um anúncio que pisca na tela dizendo "Seu celular está com vírus!"',
        'Em um link que um desconhecido mandou no chat'
      ],
      correctIndex: 1,
      explanation: 'As lojas oficiais verificam se os aplicativos são seguros antes de você instalar.'
    },
    rewardBadge: 'Gamer Blindado'
  },
  {
    id: 'quest-anti-bullying',
    title: 'Escudo Amigo: Como Vencer o Cyberbullying',
    iconName: 'ShieldAlert',
    category: 'Anti-Bullying',
    story: 'A internet foi feita para nos divertirmos, aprendermos coisas incríveis e conversarmos com amigos. Mas às vezes, pessoas mal-educadas ou maldosas usam a internet para xingar, espalhar mentiras ou fazer piadas de mau gosto.',
    mission: 'Aprenda a ativar seu escudo de proteção contra o Cyberbullying e saiba exatamente o que fazer!',
    superTips: [
      'Não responda com mais ofensas: quem faz bullying quer atenção ou irritar você.',
      'Tire um print (foto da tela) de todas as mensagens ruins como prova.',
      'Use o botão de Bloquear e Denunciar no aplicativo ou jogo.',
      'Converse IMEDIATAMENTE com seus pais, responsáveis ou professores na escola. Você nunca está sozinho!'
    ],
    miniQuiz: {
      question: 'Se alguém começar a mandar mensagens maldosas no grupo do WhatsApp ou no jogo, o que é o mais correto a fazer?',
      options: [
        'Guardar segredo e chorar sozinho no quarto',
        'Xingar a pessoa de volta com palavras feias',
        'Tirar print para guardar prova, bloquear a pessoa e contar tudo para um adulto de confiança',
        'Apagar todas as conversas e fingir que nada aconteceu'
      ],
      correctIndex: 2,
      explanation: 'Guardar a prova e avisar pais ou professores é o caminho mais seguro e eficaz para parar o bullying.'
    },
    rewardBadge: 'Guardião da Paz Digital'
  },
  {
    id: 'quest-privacy-detective',
    title: 'Detetive de Privacidade: Quem é Você na Web?',
    iconName: 'EyeOff',
    category: 'Privacidade',
    story: 'Imagine se você saísse na rua com uma placa pendurada no pescoço mostrando seu endereço, onde estuda e o telefone da sua mãe! Na internet, quando você posta fotos com uniforme da escola ou diz onde está em tempo real, é quase isso!',
    mission: 'Aprenda a ser um verdadeiro agente secreto e não deixar pistas perigosas sobre sua vida na internet.',
    superTips: [
      'Nunca compartilhe seu endereço de casa, nome da sua escola ou horário que seus pais saem para trabalhar.',
      'Não ligue a câmera de vídeo nem mostre seu quarto para pessoas que você conheceu apenas em jogos ou na internet.',
      'Mantenha seus perfis em redes sociais privados, visíveis apenas para amigos e parentes que você conhece na vida real.',
      'Se alguém que você não conhece insistir para te encontrar pessoalmente, avise seus pais na hora!'
    ],
    miniQuiz: {
      question: 'Por que NÃO devemos postar fotos na internet vestindo o uniforme da escola onde estudamos?',
      options: [
        'Porque o uniforme não combina com fotos',
        'Porque estranhos mal-intencionados podem descobrir onde você estuda todos os dias',
        'Porque a câmera do celular pode estragar',
        'Não tem problema nenhum postar'
      ],
      correctIndex: 1,
      explanation: 'Manter em segredo o local da sua escola e sua rotina protege sua segurança no mundo real.'
    },
    rewardBadge: 'Agente Secreto Digital'
  }
];
