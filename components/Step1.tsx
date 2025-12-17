
import React from 'react';
import { AppState } from '../types';
import { CATEGORIES, Icons } from '../constants';

interface Step1Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onNext: () => void;
  onPrev: () => void;
}

const Step1: React.FC<Step1Props> = ({ state, setState, onNext, onPrev }) => {
  const toggleCategory = (category: string) => {
    setState(prev => {
      const exists = prev.selectedItems.find(i => i.category === category);
      if (exists) {
        return {
          ...prev,
          selectedItems: prev.selectedItems.filter(i => i.category !== category)
        };
      } else {
        return {
          ...prev,
          selectedItems: [...prev.selectedItems, { category, line: prev.selectedItems[0]?.line || Object.keys(prev.selectedItems).length === 0 ? 'Prata' : prev.selectedItems[0].line as any, quantity: 15 }]
        };
      }
    });
  };

  const isSelected = (cat: string) => state.selectedItems.some(i => i.category === cat);

  return (
    <div className="flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">O que você precisa?</h2>
        <p className="text-slate-500 font-medium">Selecione todas as categorias que farão parte do seu pedido.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`
              p-6 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 group
              ${isSelected(cat) 
                ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' 
                : 'border-slate-100 bg-white hover:border-slate-200'}
            `}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl transition-colors ${isSelected(cat) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                <Icons.Shirt />
              </div>
              <span className={`font-bold text-lg ${isSelected(cat) ? 'text-indigo-900' : 'text-slate-600'}`}>{cat}</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}>
              {isSelected(cat) && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-800 transition-colors">
          <Icons.ChevronLeft />
          <span>Voltar</span>
        </button>

        <button 
          onClick={onNext}
          disabled={state.selectedItems.length === 0}
          className={`
            flex items-center space-x-2 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl
            ${state.selectedItems.length > 0 ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 group' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          <span>DEFINIR LINHAS</span>
          <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Step1;
