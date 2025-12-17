
import React from 'react';
import { AppState, UniformLine } from '../types';
import { LINES, Icons } from '../constants';

interface Step1Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onNext: () => void;
  onPrev: () => void;
}

const Step1: React.FC<Step1Props> = ({ state, setState, onNext, onPrev }) => {
  const handleSelectLine = (line: UniformLine) => {
    setState(prev => ({
      ...prev,
      selectedLine: line
    }));
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-4">
        Escolha sua <span className="text-indigo-600">Linha</span>
      </h2>
      <p className="text-slate-500 text-center max-w-lg mb-10">
        Selecione o padrão de qualidade para o seu novo uniforme.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {Object.values(LINES).map((line) => (
          <div 
            key={line.id}
            onClick={() => handleSelectLine(line.id)}
            className={`
              relative p-8 rounded-2xl border-t-8 border transition-all duration-300 cursor-pointer hover:shadow-lg flex flex-col items-center text-center
              ${line.color}
              ${state.selectedLine === line.id ? 'bg-white ring-2 ring-indigo-500 ring-offset-2 shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 hover:border-slate-200'}
            `}
          >
            <div className={`p-4 rounded-2xl bg-slate-50 text-slate-700 mb-6`}>
              {line.id === UniformLine.PRATA && <Icons.Trophy />}
              {line.id === UniformLine.OURO && <Icons.Trophy />}
              {line.id === UniformLine.DIAMANTE && <Icons.Diamond />}
              {line.id === UniformLine.EMPRESARIAL && <Icons.Briefcase />}
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">{line.id}</h3>

            <div className={`
              w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl border font-bold text-sm uppercase tracking-widest transition-all
              ${state.selectedLine === line.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-100'}
            `}>
              <span>{state.selectedLine === line.id ? 'Selecionado' : 'Selecionar'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between w-full">
        <button 
          onClick={onPrev}
          className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
        >
          <Icons.ChevronLeft />
          <span>Voltar ao início</span>
        </button>

        <button 
          onClick={onNext}
          className="flex items-center space-x-2 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
        >
          <span>PRÓXIMO PASSO</span>
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <Icons.ChevronRight />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Step1;
