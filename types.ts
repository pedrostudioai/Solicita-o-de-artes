
export enum UniformLine {
  PRATA = 'Prata',
  OURO = 'Ouro',
  DIAMANTE = 'Diamante',
  EMPRESARIAL = 'Empresarial / Eventos'
}

export interface LineDetails {
  id: UniformLine;
  description: string;
  color: string;
}

export interface SelectedItem {
  category: string;
  line: UniformLine;
  quantity: number;
}

export interface AttachmentCategory {
  models: string[];
  sponsors: string[];
  shields: string[];
}

export interface AppState {
  currentStep: number;
  flowType: 'arte' | 'modificacao' | null;
  selectedItems: SelectedItem[];
  clientData: {
    name: string;
    phone: string;
  };
  orderReference: string;
  modificationNotes: string;
  arteNotes: string;
  attachments: AttachmentCategory;
}
