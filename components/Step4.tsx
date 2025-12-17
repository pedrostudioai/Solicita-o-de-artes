
import React, { useState } from 'react';
import { AppState } from '../types';
import { Icons } from '../constants';
import { jsPDF } from "https://esm.sh/jspdf";

interface Step4Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onPrev: () => void;
}

const Step4: React.FC<Step4Props> = ({ state, setState, onPrev }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClientChange = (field: 'name' | 'phone', value: string) => {
    setState(prev => ({
      ...prev,
      clientData: { ...prev.clientData, [field]: value }
    }));
  };

  // Validação: Nome > 2 caracteres e Telefone > 7 caracteres
  const isFormValid = state.clientData.name.trim().length > 2 && state.clientData.phone.trim().length > 7;
  const isArte = state.flowType === 'arte';

  const generatePDF = async () => {
    if (!isFormValid || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("D'sportivo Uniformes", 20, 20);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("SOLICITAÇÃO DE ORÇAMENTO DETALHADO", 20, 30);

      yPos = 55;
      
      // Client Info
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("DADOS DO CLIENTE / TIME", 20, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Nome: ${state.clientData.name}`, 20, yPos);
      yPos += 6;
      doc.text(`WhatsApp: ${state.clientData.phone}`, 20, yPos);
      yPos += 15;

      // Project Info
      doc.setFont("helvetica", "bold");
      doc.text("INFORMAÇÕES DO PEDIDO", 20, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.text(`Tipo: ${isArte ? 'Novo Pedido de Arte' : 'Solicitação de Modificação'}`, 20, yPos);
      yPos += 6;
      
      if (!isArte) {
        doc.setFont("helvetica", "bold");
        doc.text(`Referência do Pedido Original: ${state.orderReference}`, 20, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
      }

      if (isArte) {
        doc.text(`Linha Selecionada: ${state.selectedLine}`, 20, yPos);
        yPos += 10;
      } else {
        yPos += 10;
      }

      // Notes
      const notes = isArte ? state.arteNotes : state.modificationNotes;
      if (notes) {
        doc.setFont("helvetica", "bold");
        doc.text("DESCRIÇÃO E OBSERVAÇÕES:", 20, yPos);
        yPos += 8;
        doc.setFont("helvetica", "normal");
        const splitNotes = doc.splitTextToSize(notes, pageWidth - 40);
        doc.text(splitNotes, 20, yPos);
        yPos += (splitNotes.length * 6) + 10;
      }

      // Attachments Section
      const categories = [
        { key: 'models', label: isArte ? 'MODELOS DE REFERÊNCIA' : 'MODELO ORIGINAL' },
        { key: 'sponsors', label: 'LOGOS DE PATROCÍNIO' },
        { key: 'shields', label: 'ESCUDOS E BRASÕES' }
      ] as const;

      for (const cat of categories) {
        const imgs = state.attachments[cat.key];
        if (imgs.length > 0) {
          if (yPos > 240) { doc.addPage(); yPos = 20; }
          
          doc.setFont("helvetica", "bold");
          doc.text(cat.label, 20, yPos);
          yPos += 10;

          let xPos = 20;
          for (const imgData of imgs) {
            try {
              doc.addImage(imgData, 'JPEG', xPos, yPos, 40, 40);
              xPos += 45;
              if (xPos > pageWidth - 50) {
                xPos = 20;
                yPos += 45;
              }
              if (yPos > 240) { doc.addPage(); yPos = 20; xPos = 20; }
            } catch (e) {
              console.error("Erro ao adicionar imagem ao PDF", e);
            }
          }
          yPos += 55;
          xPos = 20;
        }
      }

      doc.save(`Solicitacao_Dsportivo_${state.clientData.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Ocorreu um erro ao gerar o PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppContact = () => {
    if (!isFormValid) return;
    const phoneNumber = "5516991679072"; 
    const message = `Olá D'sportivo! Acabei de gerar minha solicitação de ${isArte ? 'Arte' : 'Modificação'} através do simulador. Gostaria de enviar o PDF para validação. Nome: ${state.clientData.name}${!isArte ? ` (Ref: ${state.orderReference})` : ''}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const totalAttachments = state.attachments.models.length + 
                           state.attachments.sponsors.length + 
                           state.attachments.shields.length;

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Finalização</h2>
        <p className="text-slate-500 font-medium">Preencha seus dados para habilitar o download e o contato.</p>
      </div>

      <div className="p-8 rounded-3xl border border-indigo-100 bg-indigo-50/30 mb-8">
        <h3 className="text-sm font-bold text-indigo-900 mb-6 uppercase tracking-widest">Dados de Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Seu Nome ou Time</label>
            <input 
              type="text"
              placeholder="Ex: João da Silva / Time FC"
              value={state.clientData.name}
              onChange={(e) => handleClientChange('name', e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm font-bold block w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
            <input 
              type="text"
              placeholder="Ex: 16 99167-9072"
              value={state.clientData.phone}
              onChange={(e) => handleClientChange('phone', e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm font-bold block w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-3xl p-8 mb-8 border border-slate-100">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Resumo do Pedido</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {isArte && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-black uppercase">Linha {state.selectedLine}</span>
            )}
            <span className={`text-xs px-4 py-2 rounded-full font-black uppercase ${isArte ? 'bg-indigo-50 text-indigo-500' : 'bg-amber-100 text-amber-700'}`}>
              {isArte ? 'Novo Pedido' : 'Modificação'}
            </span>
            {!isArte && (
              <span className="text-xs bg-slate-200 text-slate-700 px-4 py-2 rounded-full font-black uppercase">Ref: {state.orderReference}</span>
            )}
            {totalAttachments > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-black uppercase">{totalAttachments} Imagens anexadas</span>
            )}
          </div>
          <p className="text-slate-700 italic font-medium leading-relaxed border-t border-slate-200 pt-4">
            "{(isArte ? state.arteNotes : state.modificationNotes).substring(0, 150)}..."
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white mb-8 shadow-2xl shadow-slate-900/20 text-center">
        <div className="mb-8">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Pronto para exportar</p>
          <h3 className="text-3xl font-black text-white uppercase">Relatório Consolidado</h3>
          <p className={`text-xs mt-2 max-w-sm mx-auto transition-colors duration-300 ${!isFormValid ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
            {!isFormValid 
              ? 'PREENCHA NOME E WHATSAPP PARA LIBERAR' 
              : 'Gere o PDF com todos os detalhes e clique no botão abaixo para nos enviar.'}
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={generatePDF}
            disabled={!isFormValid || isGenerating}
            className={`
              w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 transition-all duration-300
              ${isFormValid && !isGenerating 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] shadow-xl shadow-indigo-600/30' 
                : 'bg-slate-800 text-slate-600 opacity-40 cursor-not-allowed pointer-events-none border border-slate-700'}
            `}
          >
            {isGenerating ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Icons.Download />
            )}
            <span>{isGenerating ? 'GERANDO PDF...' : 'BAIXAR SOLICITAÇÃO EM PDF'}</span>
          </button>

          <button 
            onClick={handleWhatsAppContact}
            disabled={!isFormValid}
            className={`
              w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 transition-all duration-300
              ${isFormValid 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-[1.02] shadow-xl shadow-emerald-600/30' 
                : 'bg-slate-800 text-slate-600 opacity-40 cursor-not-allowed pointer-events-none border border-slate-700'}
            `}
          >
            <Icons.WhatsApp />
            <span>ENVIAR PELO WHATSAPP</span>
          </button>
        </div>
        
        <p className="text-[10px] text-indigo-300 mt-6 font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
          {!isFormValid ? <Icons.Info /> : <Icons.Save />}
          <span>{!isFormValid ? 'Campos de contato são obrigatórios' : 'Os botões de ação estão liberados!'}</span>
        </p>
      </div>

      <button 
        onClick={onPrev}
        className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-800 transition-colors self-start"
      >
        <Icons.ChevronLeft />
        <span>Voltar</span>
      </button>
    </div>
  );
};

export default Step4;
