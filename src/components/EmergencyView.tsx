import React, { useState } from 'react';
import { 
  AlertOctagon, 
  MessageSquareX, 
  SmartphoneNfc, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { emergencyActionsList } from '../data/tipsData';
import { EmergencyAction } from '../types';

export const EmergencyView: React.FC = () => {
  const [selectedThreatId, setSelectedThreatId] = useState<string>(emergencyActionsList[0].id);

  const selectedThreat = emergencyActionsList.find(t => t.id === selectedThreatId) || emergencyActionsList[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Primeiros Socorros Cibernéticos</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Central de Resposta a Emergências & Incidentes
        </h1>
        <p className="text-slate-400 mt-1 max-w-3xl text-sm sm:text-base">
          Foi vítima de um golpe, teve o celular furtado ou o WhatsApp clonado? Siga os passos imediatos de contenção para minimizar os danos e acionar os canais oficiais.
        </p>
      </div>

      {/* Threat Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {emergencyActionsList.map((threat) => {
          const isSelected = threat.id === selectedThreatId;
          return (
            <button
              key={threat.id}
              onClick={() => setSelectedThreatId(threat.id)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-rose-500/60 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80'
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Urgência {threat.urgency}
              </span>
              <h3 className={`text-sm sm:text-base font-bold mt-2 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {threat.threat}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Action Plan */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase mb-1">
            Plano de Contenção Imediata
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {selectedThreat.threat}
          </h2>
        </div>

        {/* Immediate First 3 Actions */}
        <div className="bg-rose-950/20 border border-rose-900/50 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-mono font-bold uppercase text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            O que fazer nos PRIMEIROS 5 MINUTOS:
          </h3>
          <div className="space-y-2">
            {selectedThreat.firstActions.map((act, idx) => (
              <div key={idx} className="p-3 bg-rose-950/50 rounded-xl border border-rose-800/60 text-xs sm:text-sm text-rose-100 font-medium flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed step by step */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Passo a Passo Detalhado de Resolução
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedThreat.detailedSteps.map((step) => (
              <div key={step.step} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400">Passo {step.step}</span>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            Contatos & Canais Oficiais de Atendimento
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedThreat.contactsToCall.map((contact, idx) => (
              <span key={idx} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                📞 {contact}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
