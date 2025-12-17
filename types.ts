
export enum UniformLine {
  PRATA = 'Prata',
  OURO = 'Ouro',
  DIAMANTE = 'Diamante',
  EMPRESARIAL = 'Empresarial / Eventos'
}

export interface LineDetails {
  id: UniformLine;
  shirtPrice: number;
  shortsPrice: number;
  description: string;
  color: string;
}

export interface AttachmentCategory {
  models: string[];
  sponsors: string[];
  shields: string[];
}

export interface AppState {
  currentStep: number;
  flowType: 'arte' | 'modificacao' | null;
  selectedLine: UniformLine;
  totalQuantity: number;
  clientData: {
    name: string;
    phone: string;
  };
  orderReference: string;
  modificationNotes: string;
  arteNotes: string;
  attachments: AttachmentCategory;
}
