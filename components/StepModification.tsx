
import React from 'react';
import { AppState } from '../types';
import { Icons } from '../constants';

interface StepModificationProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onNext: () => void;
  onPrev: () => void;
}

const StepModification: React.FC<StepModificationProps> = ({ state, setState, onNext, onPrev }) => {
  return (
    <div className="flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Solicitar Modificação</h2>
        <p className="text-slate-500">Descreva detalhadamente o que você deseja alterar no seu uniforme.</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 mb-10">
        <label className="block text-sm font-bold text-amber-900 uppercase tracking-widest mb-4">
          O que deve ser alterado?
        </label>
        <textarea 
          rows={6}
          placeholder="Ex: Gostaria de mudar a gola do modelo X para gola polo, e alterar a cor do patrocinador master para branco..."
          className="w-full bg-white border border-amber-200 rounded-2xl p-6 text-slate-700 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
          value={state.modificationNotes}
          onChange={(e) => setState(prev => ({ ...prev, modificationNotes: e.target.value }))}
        />
        <p className="mt-4 text-xs text-amber-700 font-medium">
          Nossa equipe de design entrará em contato para confirmar as alterações solicitadas.
        </p>
      </div>

      <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center mb-12">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-400 mb-4 shadow-sm">
          <Icons.Upload />
        </div>
        <p className="font-bold text-slate-700">Anexar Referência (Opcional)</p>
        <p className="text-xs text-slate-400 mt-1">Envie um print ou foto do que deseja mudar.</p>
        <button className="mt-6 px-6 py-2 bg-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors">Selecionar Arquivo</button>
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={onPrev}
          className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
        >
          <Icons.ChevronLeft />
          <span>Voltar ao início</span>
        </button>

        <button 
          onClick={onNext}
          disabled={!state.modificationNotes.trim()}
          className={`
            flex items-center space-x-2 px-10 py-5 rounded-2xl font-black text-lg transition-all
            ${state.modificationNotes.trim() ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-xl shadow-amber-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          <span>CONTINUAR</span>
          <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default StepModification;
