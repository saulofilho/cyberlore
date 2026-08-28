import { CTFChallenge } from '../types';

export const ctfChallengesList: CTFChallenge[] = [
  {
    id: 'ctf-recon-1',
    title: 'Missão 1: Reconhecimento do Alvo (Whois & DNS)',
    category: 'Recon',
    difficulty: 'Fácil',
    points: 100,
    description: 'Um novo servidor de testes corporativo foi detectado no domínio fictício `lab-corp.local`. Use o comando `whois lab-corp.local` ou `ping lab-corp.local` no terminal para descobrir as informações do servidor e capturar a primeira flag.',
    hint: 'Execute: whois lab-corp.local no terminal.',
    targetInfo: 'Host: lab-corp.local (IP Simulado: 192.168.1.10)',
    flag: 'FLAG{recon_whois_master_2026}'
  },
  {
    id: 'ctf-scan-2',
    title: 'Missão 2: Varredura de Portas com Nmap',
    category: 'Redes',
    difficulty: 'Fácil',
    points: 150,
    description: 'Descubra quais portas e serviços estão abertos no host `192.168.1.10`. Execute uma varredura com Nmap para inspecionar os serviços escutando.',
    hint: 'Execute: nmap -sV 192.168.1.10 no terminal.',
    targetInfo: 'Alvo: 192.168.1.10',
    flag: 'FLAG{nmap_port_scanner_pro}'
  },
  {
    id: 'ctf-web-3',
    title: 'Missão 3: Enumeração de Diretórios Web Ocultos',
    category: 'Web',
    difficulty: 'Médio',
    points: 200,
    description: 'O servidor web na porta 80 parece esconder páginas confidenciais. Utilize a ferramenta `dirb http://192.168.1.10` para forçar diretórios ocultos e inspecione o arquivo encontrado com `cat`.',
    hint: 'Use: dirb http://192.168.1.10 e depois use cat /admin/.env ou cat /backup/secret.txt.',
    targetInfo: 'URL: http://192.168.1.10',
    flag: 'FLAG{dirb_hidden_files_unlocked}'
  },
  {
    id: 'ctf-crypto-4',
    title: 'Missão 4: Decodificação de Segredo em Base64',
    category: 'Criptografia',
    difficulty: 'Fácil',
    points: 120,
    description: 'Encontramos uma string criptografada em Base64 deixada por um desenvolvedor em um cabeçalho HTTP: `RkxBR3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb25fc2VjdXJlfQ==`. Decodifique-a usando a ferramenta `decode base64 <string>`.',
    hint: 'Execute: decode base64 RkxBR3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb25fc2VjdXJlfQ==',
    targetInfo: 'String: RkxBR3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb25fc2VjdXJlfQ==',
    flag: 'FLAG{base64_is_not_encryption_secure}'
  },
  {
    id: 'ctf-sqli-5',
    title: 'Missão 5: Exploração Automatizada com SQLmap',
    category: 'Web',
    difficulty: 'Médio',
    points: 250,
    description: 'O endpoint de busca `http://192.168.1.10/api/produtos?id=1` apresenta indícios de SQL Injection. Execute a ferramenta `sqlmap http://192.168.1.10/api/produtos?id=1` para extrair os dados da tabela de administradores.',
    hint: 'Execute: sqlmap http://192.168.1.10/api/produtos?id=1',
    targetInfo: 'Endpoint vulnerável: http://192.168.1.10/api/produtos?id=1',
    flag: 'FLAG{sqli_database_dumped_successfully}'
  },
  {
    id: 'ctf-hash-6',
    title: 'Missão 6: Quebra de Hash com Hashcat / Dicionário',
    category: 'Criptografia',
    difficulty: 'Médio',
    points: 200,
    description: 'Extraímos um hash MD5 da senha do administrador: `5d41402abc4b2a76b9719d911017c592`. Quebre esse hash usando o comando `hashcat 5d41402abc4b2a76b9719d911017c592` para descobrir a palavra e a flag.',
    hint: 'Execute: hashcat 5d41402abc4b2a76b9719d911017c592 no terminal.',
    targetInfo: 'Hash MD5: 5d41402abc4b2a76b9719d911017c592',
    flag: 'FLAG{hashcat_hello_cracked_md5}'
  }
];
