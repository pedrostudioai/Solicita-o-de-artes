
import React from 'react';
import { AppState, AttachmentCategory } from '../types';
import { Icons } from '../constants';

interface StepArteDetailsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onNext: () => void;
  onPrev: () => void;
}

const StepArteDetails: React.FC<StepArteDetailsProps> = ({ state, setState, onNext, onPrev }) => {
  const isArte = state.flowType === 'arte';

  const handleFileUpload = (category: keyof AttachmentCategory, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setState(prev => ({
          ...prev,
          attachments: {
            ...prev.attachments,
            [category]: [...prev.attachments[category], base64String]
          }
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (category: keyof AttachmentCategory, index: number) => {
    setState(prev => ({
      ...prev,
      attachments: {
        ...prev.attachments,
        [category]: prev.attachments[category].filter((_, i) => i !== index)
      }
    }));
  };

  const CategoryUpload = ({ label, category, icon, required, helper }: { label: string, category: keyof AttachmentCategory, icon: React.ReactNode, required?: boolean, helper?: string }) => (
    <div className={`bg-slate-50 rounded-2xl p-6 border ${required && state.attachments[category].length === 0 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
              {icon}
            </div>
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">{label}</h4>
          </div>
          {required && state.attachments[category].length === 0 && (
            <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-100 px-2 py-1 rounded">Obrigatório</span>
          )}
        </div>
        {helper && <p className="text-[10px] text-slate-400 mt-2 ml-11 font-medium italic">{helper}</p>}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
        {state.attachments[category].map((src, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 bg-white">
            <img src={src} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={() => removeFile(category, idx)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <Icons.Minus />
            </button>
          </div>
        ))}
        <label className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group ${required && state.attachments[category].length === 0 ? 'border-amber-300 hover:bg-amber-100' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'}`}>
          <div className="bg-white p-2 rounded-lg shadow-sm mb-1 group-hover:scale-110 transition-transform">
            <Icons.Plus />
          </div>
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-500 uppercase">Anexar</span>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => handleFileUpload(category, e)} 
          />
        </label>
      </div>
    </div>
  );

  const title = isArte ? "Personalização da Arte" : "Detalhes da Modificação";
  const noteValue = isArte ? state.arteNotes : state.modificationNotes;
  const isFormComplete = isArte 
    ? noteValue.trim().length > 0 
    : noteValue.trim().length > 0 && state.orderReference.trim().length > 0 && state.attachments.models.length > 0;

  return (
    <div className="flex flex-col relative">
      <a 
        href="https://www.dsportivo.com.br/simulador/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 group border-2 border-white/20 backdrop-blur-sm"
      >
        <div className="bg-white/20 p-2 rounded-lg group-hover:rotate-12 transition-transform">
          <Icons.ExternalLink />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] opacity-70 mb-1">Dúvidas no design?</span>
          <span>Simulador 3D Externo</span>
        </div>
      </a>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 font-medium italic">Anexe seus arquivos e descreva seu projeto abaixo.</p>
      </div>

      {!isArte && (
        <div className="mb-8">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Identificação do Pedido <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            placeholder="Nome do Time ou Nº do Pedido"
            value={state.orderReference}
            onChange={(e) => setState(prev => ({ ...prev, orderReference: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
          />
        </div>
      )}

      <div className="mb-10">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
          Descrição Geral do Design <span className="text-red-500">*</span>
        </label>
        <textarea 
          rows={5}
          placeholder="Descreva cores, golas, punhos e posicionamento de logos..."
          className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none font-medium"
          value={noteValue}
          onChange={(e) => setState(prev => ({ ...prev, [isArte ? 'arteNotes' : 'modificationNotes']: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-12">
        <CategoryUpload 
          label={isArte ? "Modelos de Referência" : "Foto do Modelo Original *"} 
          category="models" 
          icon={<Icons.Shirt />} 
          required={!isArte}
          helper="Envie fotos da camisa, calção ou meião que servirá de base."
        />
        <CategoryUpload 
          label="Logos de Patrocinadores" 
          category="sponsors" 
          icon={<Icons.Briefcase />} 
          helper="Serão exportados em páginas individuais para máxima qualidade."
        />
        <CategoryUpload 
          label="Escudos e Brasões" 
          category="shields" 
          icon={<Icons.Diamond />} 
          helper="Envie com fundo transparente ou em alta resolução."
        />
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={onPrev}
          className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
        >
          <Icons.ChevronLeft />
          <span>Voltar</span>
        </button>

        <button 
          onClick={onNext}
          disabled={!isFormComplete}
          className={`
            flex items-center space-x-2 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl
            ${isFormComplete ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 group' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          <span>FINALIZAR SOLICITAÇÃO</span>
          <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default StepArteDetails;
