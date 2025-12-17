
import React from 'react';
import { AppState, UniformLine } from '../types';
import { LINES, Icons } from '../constants';

interface Step2Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onNext: () => void;
  onPrev: () => void;
}

const Step2: React.FC<Step2Props> = ({ state, setState, onNext, onPrev }) => {
  const updateItem = (category: string, line: UniformLine) => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.map(item => 
        item.category === category ? { ...item, line } : item
      )
    }));
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Defina as Linhas</h2>
        <p className="text-slate-500 font-medium">Escolha o padrão de qualidade para cada item do seu pedido.</p>
      </div>

      <div className="space-y-8 mb-12">
        {state.selectedItems.map((item) => (
          <div key={item.category} className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Icons.Shirt />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{item.category}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(LINES).map((line) => (
                <button
                  key={line.id}
                  onClick={() => updateItem(item.category, line.id)}
                  className={`
                    p-6 rounded-2xl border-2 text-left transition-all duration-300
                    ${item.line === line.id 
                      ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100 ring-2 ring-indigo-600/10' 
                      : 'border-transparent bg-white/50 hover:bg-white hover:border-slate-200'}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black uppercase tracking-widest ${item.line === line.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                      Linha {line.id}
                    </span>
                    {item.line === line.id && <div className="w-4 h-4 bg-indigo-600 rounded-full" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">{line.description}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-800 transition-colors">
          <Icons.ChevronLeft />
          <span>Voltar</span>
        </button>

        <button 
          onClick={onNext}
          className="flex items-center space-x-2 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
        >
          <span>DETALHES DA ARTE</span>
          <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Step2;
