import React, { useState } from 'react';
import { Award, Shield, Check, Printer, X, Download, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  trackTitle
}) => {
  const [studentName, setStudentName] = useState<string>('Seu Nome Completo');
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const certId = `CS-${Math.random().toString(36).substring(2, 9).toUpperCase()}-2026`;

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Certificado Oficial de Conclusão Prática</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Customizer Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Nome no Certificado:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Salvar em PDF
            </button>
          </div>
        </div>

        {/* Certificate Document (Printable) */}
        <div className="p-6 sm:p-10 flex justify-center">
          <div 
            id="certificate-print-area"
            className="w-full max-w-3xl bg-slate-950 rounded-2xl border-4 border-amber-500/40 p-8 sm:p-12 relative overflow-hidden shadow-2xl text-center space-y-6 text-slate-100"
          >
            {/* Watermark / Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <Shield className="w-96 h-96 text-emerald-400" />
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-8 h-8 text-emerald-400" />
              <span className="font-mono text-xl font-extrabold tracking-tight text-white">CyberShield Academy</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
                Certificado de Excelência & Hacking Ético
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                CERTIFICADO DE CONCLUSÃO
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Certificamos que o profissional abaixo concluiu com êxito todas as lições, laboratórios práticos e avaliações da trilha:
            </p>

            <div className="py-2">
              <h2 className="text-xl sm:text-3xl font-extrabold text-emerald-400 font-serif border-b-2 border-slate-800 pb-2 inline-block px-8">
                {studentName}
              </h2>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 max-w-md mx-auto">
              <span className="text-xs text-slate-400 uppercase font-mono block">Especialização:</span>
              <span className="text-base sm:text-lg font-bold text-amber-300">{trackTitle}</span>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-slate-800 text-xs text-slate-400 max-w-lg mx-auto">
              <div>
                <span className="block font-mono text-slate-300 font-bold">{currentDate}</span>
                <span className="text-[10px] uppercase text-slate-500">Data de Emissão</span>
              </div>
              <div>
                <span className="block font-mono text-emerald-400 font-bold">{certId}</span>
                <span className="text-[10px] uppercase text-slate-500">Código de Autenticidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
