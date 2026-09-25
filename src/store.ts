import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Format = '1:1' | '4:5' | '9:16' | '3:5';

export type ElementType = 'text' | 'shape' | 'image' | 'drawing' | 'collage';

export type BrushType = 'solid' | 'dashed' | 'dotted' | 'dash-dot' | 'marker' | 'neon' | 'chalk' | 'highlighter' | 'double' | 'outline' | 'grunge' | 'dry-brush' | 'rough' | 'charcoal' | 'spray';

export type CollageLayout = '1' | '2v' | '2h' | '3' | '4';

export interface CollageItem {
  id: string;
  src?: string;
  x: number;
  y: number;
  zoom: number;
}

export interface SlideElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
  // Text specific
  text?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  lineHeight?: number;
  letterSpacing?: number;
  textPathShape?: 'none' | 'arc' | 'circle' | 'wave';
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
  // Shape specific
  shapeType?: 'rectangle' | 'circle' | 'star' | 'pentagon';
  backgroundColor?: string;
  strokeWidth?: number;
  strokeColor?: string;
  borderRadius?: number;
  // Image specific
  src?: string;
  // Drawing specific
  path?: string;
  brushType?: BrushType;
  // Collage specific
  collageLayout?: CollageLayout;
  collageDividerWidth?: number;
  collageDividerColor?: string;
  collageItems?: CollageItem[];
}

export interface Slide {
  id: string;
  background: {
    type: 'color' | 'image';
    value: string;
  };
  elements: SlideElement[];
}

export interface Project {
  id: string;
  name: string;
  format: Format;
  slides: Slide[];
  lastModified: number;
}

interface CarouselState {
  currentProjectId: string | null;
  projects: Project[];
  view: 'dashboard' | 'editor';
  isProjectModalOpen: boolean;
  setProjectModalOpen: (isOpen: boolean) => void;
  createProject: (name: string, templateSlides?: Slide[], templateFormat?: Format) => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, newName: string) => void;
  saveCurrentProject: () => void;
  goToDashboard: () => void;

  format: Format;
  slides: Slide[];
  activeSlideId: string | null;
  selectedElementId: string | null;
  
  isDrawingMode: boolean;
  drawingSettings: {
    color: string;
    strokeWidth: number;
    opacity: number;
    brushType: BrushType;
  };

  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  isRightSidebarOpen: boolean;
  setRightSidebarOpen: (isOpen: boolean) => void;
  
  snapGuides: { type: 'horizontal' | 'vertical'; position: number }[];
  setSnapGuides: (guides: { type: 'horizontal' | 'vertical'; position: number }[]) => void;
  
  past: { slides: Slide[], format: Format }[];
  future: { slides: Slide[], format: Format }[];
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  
  setFormat: (format: Format) => void;
  addSlide: (slide?: Partial<Slide>) => void;
  duplicateSlide: (id: string) => void;
  deleteSlide: (id: string) => void;
  reorderSlide: (id: string, direction: 'left' | 'right') => void;
  setActiveSlide: (id: string) => void;
  updateSlideBackground: (id: string, background: Slide['background']) => void;
  
  addElement: (slideId: string, element: Partial<SlideElement>) => void;
  updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => void;
  deleteElement: (slideId: string, elementId: string) => void;
  reorderElement: (slideId: string, elementId: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  setSlideElements: (slideId: string, elements: SlideElement[]) => void;
  setSelectedElement: (id: string | null) => void;
  
  setDrawingMode: (active: boolean) => void;
  updateDrawingSettings: (settings: Partial<CarouselState['drawingSettings']>) => void;
  
  interactionMode: 'select' | 'pan';
  setInteractionMode: (mode: 'select' | 'pan') => void;
  
  isTemplateModalOpen: boolean;
  setTemplateModalOpen: (isOpen: boolean) => void;
  isEmojiPickerOpen: boolean;
  setEmojiPickerOpen: (isOpen: boolean) => void;
  isChatOpen: boolean;
  setChatOpen: (isOpen: boolean) => void;
  showFloatingChatButton: boolean;
  setShowFloatingChatButton: (show: boolean) => void;
  loadTemplate: (slides: Slide[], format?: Format) => void;
  saveAsTemplate: (name: string, category: 'Moderno' | 'Clássico' | 'Tecnológico' | 'Orgânico' | 'Minimalista') => void;
  customTemplates: any[];
}

const createId = () => Math.random().toString(36).slice(2, 11);

const createDefaultSlide = (): Slide => ({
  id: createId(),
  background: { type: 'color', value: '#ffffff' },
  elements: [],
});

const customStorage = {
  getItem: (name: string) => {
    try {
      const value = localStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    } catch { return null; }
  },
  setItem: (name: string, value: any) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('LocalStorage limit reached. Project changes might not be saved between sessions until some projects are deleted.');
      }
    }
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useCarouselStore = create<CarouselState>()(
  persist(
    (set, get) => ({
  currentProjectId: null,
  projects: [],
  view: 'dashboard',
  isProjectModalOpen: false,

  setProjectModalOpen: (isOpen) => set({ isProjectModalOpen: isOpen }),
  
  createProject: (name, templateSlides, templateFormat) => {
    const id = createId();
    const slides = templateSlides || [createDefaultSlide()];
    const newProject: Project = {
      id,
      name,
      format: templateFormat || '4:5',
      slides: slides.map(s => ({ ...s, id: createId() })),
      lastModified: Date.now(),
    };
    
    set((state) => ({
      projects: [...state.projects, newProject].slice(-10),
      currentProjectId: id,
      slides,
      format: templateFormat || '4:5',
      activeSlideId: slides[0].id,
      selectedElementId: null,
      past: [],
      future: [],
      view: 'editor',
      isTemplateModalOpen: false
    }));
  },

  loadProject: (id) => {
    get().saveCurrentProject(); // Save current before loading new
    const state = get();
    const projectToLoad = state.projects.find(p => p.id === id);
    if (!projectToLoad) return;
    
    set({
      currentProjectId: id,
      slides: projectToLoad.slides,
      format: projectToLoad.format,
      activeSlideId: projectToLoad.slides[0]?.id || null,
      selectedElementId: null,
      past: [],
      future: [],
      view: 'editor',
      isProjectModalOpen: false
    });
  },

  deleteProject: (id) => {
    set((state) => {
      const newProjects = state.projects.filter(p => p.id !== id);
      const isDeletingCurrent = state.currentProjectId === id;
      
      let nextState: Partial<CarouselState> = { projects: newProjects };
      
      if (isDeletingCurrent) {
        nextState = {
          ...nextState,
          currentProjectId: null,
          view: 'dashboard',
          slides: [createDefaultSlide()],
          format: '4:5',
          activeSlideId: null,
          past: [],
          future: []
        };
      }
      
      return nextState;
    });
  },

  renameProject: (id, newName) => {
    set((state) => ({
      projects: state.projects.map(p => 
        p.id === id ? { ...p, name: newName, lastModified: Date.now() } : p
      )
    }));
  },

  saveCurrentProject: () => {
    try {
      const state = get();
      if (!state.currentProjectId) return;

      set((state) => ({
        projects: state.projects.map(p => 
          p.id === state.currentProjectId 
            ? { ...p, slides: [...state.slides], format: state.format, lastModified: Date.now() }
            : p
        )
      }));
    } catch (error) {
      console.warn('LocalStorage Quota Exceeded: Could not save project details.', error);
      // We don't throw to prevent app crash
    }
  },

  goToDashboard: () => {
    get().saveCurrentProject();
    set({ view: 'dashboard', currentProjectId: null });
  },

  format: '4:5',
  slides: [createDefaultSlide()],
  activeSlideId: null,
  selectedElementId: null,
  
  isDrawingMode: false,
  drawingSettings: {
    color: '#3B82F6',
    strokeWidth: 5,
    opacity: 1,
    brushType: 'solid',
  },

  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  isRightSidebarOpen: false,
  setRightSidebarOpen: (isOpen) => set({ isRightSidebarOpen: isOpen }),

  snapGuides: [],
  setSnapGuides: (guides) => set({ snapGuides: guides }),

  past: [],
  future: [],

  saveSnapshot: () => {
    const state = get();
    const snapshot = { slides: state.slides, format: state.format };
    if (state.past.length > 0) {
      const last = state.past[state.past.length - 1];
      if (JSON.stringify(last) === JSON.stringify(snapshot)) return;
    }
    const newPast = [...state.past, snapshot];
    if (newPast.length > 20) newPast.shift();
    set({ past: newPast, future: [] });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    set({
      past: newPast,
      future: [{ slides: state.slides, format: state.format }, ...state.future],
      slides: previous.slides,
      format: previous.format,
      selectedElementId: null
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    set({
      past: [...state.past, { slides: state.slides, format: state.format }],
      future: newFuture,
      slides: next.slides,
      format: next.format,
      selectedElementId: null
    });
  },

  setFormat: (format) => {
    get().saveSnapshot();
    const formatHeights = {
      '1:1': 1080,
      '4:5': 1350,
      '9:16': 1920,
      '3:5': 1800
    };
    const newHeight = formatHeights[format] || 1350;

    set((state) => {
      // Safe guard against undefined slides
      const currentSlides = state.slides || [];
      return { 
        format,
        slides: currentSlides.map(slide => ({
          ...slide,
          elements: (slide.elements || []).map(el => {
            if (el.type === 'collage' && el.x === 0 && el.width === 1080) {
              // If it was full screen (or close to it)
              return { ...el, height: newHeight };
            }
            return el;
          })
        }))
      };
    });
  },
  
  addSlide: (slide) => {
    get().saveSnapshot();
    set((state) => {
      const newSlide = { ...createDefaultSlide(), ...slide, id: createId() };
      return {
        slides: [...state.slides, newSlide],
        activeSlideId: newSlide.id,
      };
    });
  },

  duplicateSlide: (id) => {
    get().saveSnapshot();
    set((state) => {
      const slideToDuplicate = state.slides.find(s => s.id === id);
      if (!slideToDuplicate) return state;
      
      const newSlide = { 
        ...slideToDuplicate, 
        id: createId(),
        elements: slideToDuplicate.elements.map(e => ({ ...e, id: createId() }))
      };
      
      const index = state.slides.findIndex(s => s.id === id);
      const newSlides = [...state.slides];
      newSlides.splice(index + 1, 0, newSlide);
      
      return { slides: newSlides, activeSlideId: newSlide.id };
    });
  },

  deleteSlide: (id) => {
    get().saveSnapshot();
    set((state) => {
      if (state.slides.length <= 1) return state; // Prevent deleting last slide
      const newSlides = state.slides.filter(s => s.id !== id);
      return { 
        slides: newSlides,
        activeSlideId: state.activeSlideId === id ? newSlides[0].id : state.activeSlideId
      };
    });
  },

  reorderSlide: (id, direction) => {
    get().saveSnapshot();
    set((state) => {
      const index = state.slides.findIndex(s => s.id === id);
      if (index === -1) return state;
      if (direction === 'left' && index === 0) return state;
      if (direction === 'right' && index === state.slides.length - 1) return state;

      const newSlides = [...state.slides];
      const swapIndex = direction === 'left' ? index - 1 : index + 1;
      [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
      
      return { slides: newSlides };
    });
  },

  setActiveSlide: (id) => set({ activeSlideId: id, selectedElementId: null }),

  updateSlideBackground: (id, background) => {
    get().saveSnapshot();
    set((state) => ({
      slides: state.slides.map(s => s.id === id ? { ...s, background } : s)
    }));
  },

  addElement: (slideId, element) => {
    get().saveSnapshot();
    set((state) => {
      const newElement: SlideElement = {
        id: createId(),
        type: 'text',
        x: 50,
        y: 50,
        width: 200,
        height: 100,
        rotation: 0,
        opacity: 1,
        ...element,
      };
      return {
        slides: state.slides.map(s => s.id === slideId ? { ...s, elements: [...s.elements, newElement] } : s),
        selectedElementId: newElement.id,
      };
    });
  },

  updateElement: (slideId, elementId, updates) => set((state) => ({
    slides: state.slides.map(s => 
      s.id === slideId 
        ? { ...s, elements: s.elements.map(e => e.id === elementId ? { ...e, ...updates } : e) } 
        : s
    )
  })),

  deleteElement: (slideId, elementId) => {
    get().saveSnapshot();
    set((state) => ({
      slides: state.slides.map(s => 
        s.id === slideId 
          ? { ...s, elements: s.elements.filter(e => e.id !== elementId) } 
          : s
      ),
      selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId
    }));
  },

  reorderElement: (slideId, elementId, direction) => {
    get().saveSnapshot();
    set((state) => {
      const slideIndex = state.slides.findIndex(s => s.id === slideId);
      if (slideIndex === -1) return state;

      const slide = state.slides[slideIndex];
      const elementIndex = slide.elements.findIndex(e => e.id === elementId);
      if (elementIndex === -1) return state;

      const newElements = [...slide.elements];

      if (direction === 'up' && elementIndex < newElements.length - 1) {
        [newElements[elementIndex], newElements[elementIndex + 1]] = [newElements[elementIndex + 1], newElements[elementIndex]];
      } else if (direction === 'down' && elementIndex > 0) {
        [newElements[elementIndex], newElements[elementIndex - 1]] = [newElements[elementIndex - 1], newElements[elementIndex]];
      } else if (direction === 'front' && elementIndex < newElements.length - 1) {
        const [el] = newElements.splice(elementIndex, 1);
        newElements.push(el);
      } else if (direction === 'back' && elementIndex > 0) {
        const [el] = newElements.splice(elementIndex, 1);
        newElements.unshift(el);
      } else {
        return state; // No change needed
      }

      const newSlides = [...state.slides];
      newSlides[slideIndex] = { ...slide, elements: newElements };
      return { slides: newSlides };
    });
  },

  setSlideElements: (slideId, elements) => {
    get().saveSnapshot();
    set((state) => ({
      slides: state.slides.map(s => 
        s.id === slideId ? { ...s, elements } : s
      )
    }));
  },

  setSelectedElement: (id) => set({ selectedElementId: id }),
  
  setDrawingMode: (active) => set({ isDrawingMode: active, selectedElementId: null }),
  updateDrawingSettings: (settings) => set((state) => ({ drawingSettings: { ...state.drawingSettings, ...settings } })),
  
  interactionMode: 'select',
  setInteractionMode: (mode) => {
    const isPan = mode === 'pan';
    set({ 
      interactionMode: mode, 
      isDrawingMode: false,
      selectedElementId: isPan ? null : get().selectedElementId 
    });
  },

  isTemplateModalOpen: false,
  setTemplateModalOpen: (isOpen) => set({ isTemplateModalOpen: isOpen }),
  isEmojiPickerOpen: false,
  setEmojiPickerOpen: (isOpen) => set({ isEmojiPickerOpen: isOpen }),
  isChatOpen: false,
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  showFloatingChatButton: true,
  setShowFloatingChatButton: (show) => set({ showFloatingChatButton: show }),
  loadTemplate: (slides, format) => {
    get().saveSnapshot();
    set((state) => ({
      slides,
      activeSlideId: slides[0].id,
      selectedElementId: null,
      format: format || state.format,
      isTemplateModalOpen: false
    }));
  },
  
  customTemplates: [],
  saveAsTemplate: (name, category) => {
    const state = get();
    const newTemplate = {
      id: createId(),
      name,
      format: state.format,
      slides: [...state.slides], // Store slides data directly
      color: '#FFFFFF', // default
      category
    };
    set((state) => ({
      customTemplates: [...state.customTemplates, newTemplate]
    }));
  }
}),
  {
    name: 'carousel-storage',
    storage: customStorage as any,
    partialize: (state) => {
      // Optimization: Only save essential data to fit in 5MB LocalStorage
      return { 
        projects: state.projects.slice(-5), // Limit to 5 projects to save space
        currentProjectId: state.currentProjectId,
        view: state.view,
        slides: state.slides, 
        format: state.format, 
        drawingSettings: state.drawingSettings,
        activeSlideId: state.activeSlideId,
        showFloatingChatButton: state.showFloatingChatButton,
        customTemplates: state.customTemplates.slice(-2) // Limit templates even more
      };
    },
  }
));
