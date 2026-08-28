import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface EthicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicsModal: React.FC<EthicsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Código de Ética do Hacker Ético (White Hat)</h2>
              <p className="text-xs text-slate-400">Princípios fundamentais e conformidade legal</p>
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
          <p className="leading-relaxed">
            O conhecimento em cibersegurança e testes de intrusão confere grande poder técnico. A diferença entre um criminoso cibernético (Black Hat) e um profissional de segurança respeitado (White Hat) reside na ética, na autorização e no respeito às leis.
          </p>

          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase font-bold text-emerald-400">
              Os 5 Mandamentos do Ethical Hacking:
            </h3>
            <ul className="space-y-2.5">
              {[
                { title: '1. Autorização Prévia e Formal', desc: 'Nunca teste sistemas, redes, sites ou dispositivos sem autorização por escrito (termo de escopo e RoE).' },
                { title: '2. Respeito à Privacidade e Dados (LGPD)', desc: 'Caso encontre dados sensíveis durante auditorias, não os copie, divulgue ou compartilhe com terceiros.' },
                { title: '3. Divulgação Responsável (Responsible Disclosure)', desc: 'Reporte vulnerabilidades diretamente aos responsáveis técnicos da empresa antes de qualquer menção pública.' },
                { title: '4. Não Causar Danos à Disponibilidade', desc: 'Evite testes destrutivos ou ataques volumétricos (DDoS) que prejudiquem os serviços em produção.' },
                { title: '5. Transparência e Honestidade Técnica', desc: 'Apresente relatórios precisos com passos claros para que os desenvolvedores possam blindar os sistemas.' }
              ].map((item, i) => (
                <li key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{item.title}</strong>
                    <span className="text-xs text-slate-400">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
            ⚠️ <strong>Aviso Legal (Brasil):</strong> O acesso não autorizado a dispositivos informáticos alheios é crime tipificado pelo Art. 154-A do Código Penal (Lei Carolina Dieckmann nº 12.737/2012). O CyberShield é uma plataforma 100% educacional destinada à formação de defensores.
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
          >
            Compreendo e Aceito o Código de Ética
          </button>
        </div>
      </div>
    </div>
  );
};
