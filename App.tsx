
import React, { useState } from 'react';
import { AppState, UniformLine } from './types';
import StepEntry from './components/StepEntry';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step4 from './components/Step4';
import StepArteDetails from './components/StepArteDetails';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentStep: 0,
    flowType: null,
    selectedItems: [],
    clientData: { name: '', phone: '' },
    orderReference: '',
    modificationNotes: '',
    arteNotes: '',
    attachments: {
      models: [],
      sponsors: [],
      shields: []
    }
  });

  const goToNextStep = () => setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  const goToPrevStep = () => setState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <StepEntry state={state} setState={setState} onNext={goToNextStep} />;
      case 1:
        // Seleção de Categorias
        return <Step1 state={state} setState={setState} onNext={goToNextStep} onPrev={goToPrevStep} />;
      case 2:
        // Configuração de Linhas por Categoria
        return <Step2 state={state} setState={setState} onNext={goToNextStep} onPrev={goToPrevStep} />;
      case 3:
        // Detalhes da Arte e Uploads
        return <StepArteDetails state={state} setState={setState} onNext={goToNextStep} onPrev={goToPrevStep} />;
      case 4:
        // Finalização (PDF/Whats)
        return <Step4 state={state} setState={setState} onPrev={goToPrevStep} />;
      default:
        return <StepEntry state={state} setState={setState} onNext={goToNextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">
          D'sportivo <span className="text-xs uppercase font-semibold block tracking-widest text-center mt-[-4px]">Uniformes</span>
        </h1>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 mt-4">
        <div className="p-8 md:p-12">
          {renderStep()}
        </div>
      </div>

      <footer className="mt-8 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} D'sportivo Uniformes. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default App;
