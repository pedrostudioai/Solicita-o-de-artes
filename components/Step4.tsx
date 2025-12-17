
import React, { useState } from 'react';
import { AppState } from '../types';
import { Icons } from '../constants';
import { jsPDF } from "jspdf";

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

  const isFormValid = state.clientData.name.trim().length > 2 && state.clientData.phone.trim().length > 7;
  const isArte = state.flowType === 'arte';

  const generatePDF = async () => {
    if (!isFormValid || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // --- PÁGINA 1: RESUMO ---
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("D'sportivo Uniformes", 20, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("RELATÓRIO TÉCNICO DE SOLICITAÇÃO", 20, 35);

      yPos = 60;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("DADOS DO CLIENTE / EQUIPE", 20, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Nome: ${state.clientData.name}`, 20, yPos);
      yPos += 6;
      doc.text(`WhatsApp: ${state.clientData.phone}`, 20, yPos);
      yPos += 15;

      doc.setFont("helvetica", "bold");
      doc.text("ITENS DO PEDIDO E QUALIDADE", 20, yPos);
      yPos += 8;
      doc.setFillColor(241, 245, 249);
      doc.rect(18, yPos - 5, pageWidth - 36, 10, 'F');
      doc.setFontSize(10);
      doc.text("CATEGORIA", 25, yPos + 2);
      doc.text("LINHA (TECNOLOGIA)", 110, yPos + 2);
      yPos += 12;

      doc.setFont("helvetica", "normal");
      state.selectedItems.forEach((item) => {
        doc.text(item.category, 25, yPos);
        doc.setFont("helvetica", "bold");
        doc.text(item.line, 110, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 8;
      });
      yPos += 10;

      const notes = isArte ? state.arteNotes : state.modificationNotes;
      if (notes) {
        doc.setFont("helvetica", "bold");
        doc.text("DESCRIÇÃO DETALHADA:", 20, yPos);
        yPos += 8;
        doc.setFont("helvetica", "normal");
        const splitNotes = doc.splitTextToSize(notes, pageWidth - 40);
        doc.text(splitNotes, 20, yPos);
        yPos += (splitNotes.length * 6) + 15;
      }

      // --- PÁGINAS DE REFERÊNCIA (MODELOS) ---
      if (state.attachments.models.length > 0) {
        doc.addPage();
        yPos = 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("REFERÊNCIAS DE MODELO / DESIGN", 20, yPos);
        yPos += 15;

        let xPos = 20;
        for (const imgData of state.attachments.models) {
          try {
            doc.addImage(imgData, 'JPEG', xPos, yPos, 80, 80, undefined, 'FAST');
            xPos += 85;
            if (xPos > pageWidth - 80) {
              xPos = 20;
              yPos += 85;
            }
            if (yPos > 200) { doc.addPage(); yPos = 20; xPos = 20; }
          } catch (e) { console.error(e); }
        }
      }

      // --- PÁGINAS INDIVIDUAIS: PATROCÍNIOS ---
      for (let i = 0; i < state.attachments.sponsors.length; i++) {
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`PATROCÍNIO ${i + 1}`, 20, 20);
        
        const imgData = state.attachments.sponsors[i];
        // Centralizar imagem grande para qualidade máxima
        const imgWidth = pageWidth - 40;
        const imgHeight = 150; // Área grande para o logo
        doc.addImage(imgData, 'JPEG', 20, 40, imgWidth, imgHeight, undefined, 'FAST', 0);
        
        doc.setFontSize(8);
        doc.text("ARQUIVO EXPORTADO EM ALTA ESCALA PARA VETORIZAÇÃO/PRODUÇÃO", 20, pageHeight - 10);
      }

      // --- PÁGINAS INDIVIDUAIS: ESCUDOS ---
      for (let i = 0; i < state.attachments.shields.length; i++) {
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`ESCUDO / BRASÃO ${i + 1}`, 20, 20);
        
        const imgData = state.attachments.shields[i];
        // Escudos geralmente são mais quadrados, centralizar com proporção melhor
        const size = 150;
        const xOffset = (pageWidth - size) / 2;
        doc.addImage(imgData, 'JPEG', xOffset, 50, size, size, undefined, 'FAST', 0);

        doc.setFontSize(8);
        doc.text("ARQUIVO EXPORTADO EM ALTA ESCALA PARA VETORIZAÇÃO/PRODUÇÃO", 20, pageHeight - 10);
      }

      doc.save(`SOLICITACAO_DS_PORTIVO_${state.clientData.name.toUpperCase().replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar PDF de alta qualidade.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppContact = () => {
    if (!isFormValid) return;
    const phoneNumber = "5516991679072"; 
    const message = `Olá D'sportivo! Finalizei minha configuração no simulador.\nEquipe: ${state.clientData.name}\nItens: ${state.selectedItems.map(i => `${i.category} (Linha ${i.line})`).join(', ')}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Quase lá!</h2>
        <p className="text-slate-500 font-medium">Seu relatório de alta qualidade está pronto para ser gerado.</p>
      </div>

      <div className="p-8 rounded-3xl border border-indigo-100 bg-indigo-50/30 mb-8">
        <h3 className="text-sm font-bold text-indigo-900 mb-6 uppercase tracking-widest">Informações Finais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome Completo ou Time</label>
            <input 
              type="text"
              placeholder="Ex: João Silva / Real Madrid FC"
              value={state.clientData.name}
              onChange={(e) => handleClientChange('name', e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold w-full focus:ring-4 focus:ring-indigo-500/10 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">WhatsApp de Contato</label>
            <input 
              type="text"
              placeholder="(00) 00000-0000"
              value={state.clientData.phone}
              onChange={(e) => handleClientChange('phone', e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-bold w-full focus:ring-4 focus:ring-indigo-500/10 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Icons.Trophy />
        </div>
        
        <div className="mb-8 text-center relative z-10">
          <h3 className="text-2xl font-black uppercase tracking-tighter">Exportação Premium</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
            Garemos um PDF onde cada escudo e patrocínio terá sua própria página para garantir nitidez total.
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <button 
            onClick={generatePDF}
            disabled={!isFormValid || isGenerating}
            className={`w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 transition-all ${isFormValid ? 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] shadow-xl shadow-indigo-500/20' : 'bg-slate-800 opacity-50 cursor-not-allowed'}`}
          >
            {isGenerating ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <Icons.Download />}
            <span>{isGenerating ? 'PROCESSANDO IMAGENS...' : 'BAIXAR PDF EM ALTA'}</span>
          </button>

          <button 
            onClick={handleWhatsAppContact}
            disabled={!isFormValid}
            className={`w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 transition-all ${isFormValid ? 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] shadow-xl shadow-emerald-500/20' : 'bg-slate-800 opacity-50 cursor-not-allowed'}`}
          >
            <Icons.WhatsApp />
            <span>ENVIAR PARA A EQUIPE</span>
          </button>
        </div>
      </div>

      <button onClick={onPrev} className="mt-8 flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-800 self-start transition-colors">
        <Icons.ChevronLeft />
        <span>Voltar e revisar</span>
      </button>
    </div>
  );
};

export default Step4;
