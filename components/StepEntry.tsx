
import React from 'react';
import { AppState } from '../types';

interface StepEntryProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onNext: () => void;
}

const StepEntry: React.FC<StepEntryProps> = ({ state, setState, onNext }) => {
  const handleSelect = (flow: 'arte' | 'modificacao') => {
    setState(prev => ({ ...prev, flowType: flow, currentStep: 1 }));
  };

  return (
    <div className="flex flex-col items-center py-10">
      <h2 className="text-4xl font-black text-slate-900 mb-2 text-center">Bem-vindo à D'sportivo</h2>
      <p className="text-slate-500 mb-12 text-center max-w-md font-medium">
        Como podemos ajudar sua equipe hoje? Selecione uma das opções abaixo para continuar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Choice: ARTE */}
        <button 
          onClick={() => handleSelect('arte')}
          className="group relative flex flex-col items-center p-12 rounded-3xl border-2 border-slate-100 bg-white hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <h3 className="relative z-10 text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Arte</h3>
          <p className="relative z-10 text-slate-500 text-center font-medium">
            Criar um novo pedido do zero.
          </p>
        </button>

        {/* Choice: MODIFICAÇÃO */}
        <button 
          onClick={() => handleSelect('modificacao')}
          className="group relative flex flex-col items-center p-12 rounded-3xl border-2 border-slate-100 bg-white hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-100 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 w-24 h-24 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-1.9"/><path d="m3 19 2-2"/><path d="M5 21 3 19"/><path d="M8 12.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"/><path d="M9.5 7.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"/><path d="M11.5 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"/><path d="M16 9.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"/></svg>
          </div>
          <h3 className="relative z-10 text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Modificação</h3>
          <p className="relative z-10 text-slate-500 text-center font-medium">
            Solicitar ajustes em um pedido existente.
          </p>
        </button>
      </div>
    </div>
  );
};

export default StepEntry;
