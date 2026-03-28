import { create } from 'zustand';

interface ElementStyles {
  fontSize?: number;
  textAlign?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  borderRadius?: number;
  width?: string;
  display?: string;
  marginLeft?: string;
  marginRight?: string;
  [key: string]: unknown;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider';
  content: string;
  styles: ElementStyles;
  href?: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

interface EditorState {
  elements: CanvasElement[];
  selectedId: string | null;
  templateTitle: string;
  templateId: string | null;
  saving: boolean;
  snackbar: SnackbarState;
  history: CanvasElement[][];
  historyStep: number;

  setSelectedId: (id: string | null) => void;
  setTemplateTitle: (title: string) => void;
  setTemplateId: (id: string | null) => void;
  setSaving: (saving: boolean) => void;
  setSnackbar: (snackbar: SnackbarState) => void;
  closeSnackbar: () => void;
  updateElements: (newElements: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[])) => void;
  undo: () => void;
  redo: () => void;
  resetEditor: () => void;
  loadTemplate: (id: string, name: string, elements: CanvasElement[]) => void;
}

const defaultSnackbar: SnackbarState = { open: false, message: '', severity: 'success' };

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedId: null,
  templateTitle: 'New Template',
  templateId: null,
  saving: false,
  snackbar: defaultSnackbar,
  history: [[]],
  historyStep: 0,

  setSelectedId: (id) => set({ selectedId: id }),
  setTemplateTitle: (title) => set({ templateTitle: title }),
  setTemplateId: (id) => set({ templateId: id }),
  setSaving: (saving) => set({ saving }),
  setSnackbar: (snackbar) => set({ snackbar }),
  closeSnackbar: () => set({ snackbar: { ...get().snackbar, open: false } }),

  updateElements: (newElements) => {
    const { elements, history, historyStep } = get();
    const nextEls = typeof newElements === 'function' ? newElements(elements) : newElements;
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(nextEls);
    set({
      elements: nextEls,
      history: newHistory,
      historyStep: newHistory.length - 1,
    });
  },

  undo: () => {
    const { historyStep, history } = get();
    if (historyStep > 0) {
      set({ historyStep: historyStep - 1, elements: history[historyStep - 1] });
    }
  },

  redo: () => {
    const { historyStep, history } = get();
    if (historyStep < history.length - 1) {
      set({ historyStep: historyStep + 1, elements: history[historyStep + 1] });
    }
  },

  resetEditor: () =>
    set({
      elements: [],
      selectedId: null,
      templateTitle: 'New Template',
      templateId: null,
      saving: false,
      snackbar: defaultSnackbar,
      history: [[]],
      historyStep: 0,
    }),

  loadTemplate: (id, name, elements) =>
    set({
      templateId: id,
      templateTitle: name,
      elements,
      history: [elements],
      historyStep: 0,
    }),
}));
