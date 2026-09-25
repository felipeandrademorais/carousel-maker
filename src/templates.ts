import { Slide, Format, SlideElement } from './store';

const createId = () => Math.random().toString(36).substr(2, 9);

export interface Template {
  id: string;
  name: string;
  format: Format;
  generate: () => Slide[];
  color: string;
  category: 'Moderno' | 'Clássico' | 'Tecnológico' | 'Orgânico' | 'Minimalista';
}

export const templates: Template[] = [
  {
    id: 'food-diary',
    name: 'Editorial Gastronômico Premium',
    format: '4:5',
    color: '#1A1A1A',
    category: 'Clássico',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#121212' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#2A2A2A', x: 0, y: 0, width: 1080, height: 1050, rotation: 0, opacity: 1 },
          { id: createId(), type: 'drawing', path: 'M 100 900 Q 540 800 980 900', strokeWidth: 15, strokeColor: '#D4A373', brushType: 'neon', x: 0, y: 0, width: 1080, height: 1350, rotation: 0, opacity: 0.8 },
          { id: createId(), type: 'text', x: 0, y: 480, width: 1080, height: 80, rotation: 0, opacity: 0.5, text: '[ FOTO PRINCIPAL DO PRATO ] 📸', color: '#FFFFFF', fontSize: 32, fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', letterSpacing: 4 },
          { id: createId(), type: 'text', x: 0, y: 880, width: 1080, height: 200, rotation: 0, opacity: 1, text: 'Sabor. 🍽️', color: '#F9F7F3', fontSize: 220, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic', letterSpacing: -5 },
          { id: createId(), type: 'text', x: 60, y: 1180, width: 500, height: 60, rotation: 0, opacity: 1, text: 'O ARQUIVO GASTRONÔMICO', color: '#A3998A', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'left', letterSpacing: 6 },
          { id: createId(), type: 'text', x: 520, y: 1180, width: 500, height: 60, rotation: 0, opacity: 1, text: 'VOL. I', color: '#A3998A', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'normal', textAlign: 'right', letterSpacing: 6 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#F9F7F3' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#D6D1C4', x: 40, y: 40, width: 1000, height: 1270, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 40, y: 600, width: 1000, height: 80, rotation: 0, opacity: 0.4, text: '[ FOTO DO PRATO ]', color: '#1A1A1A', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'shape', shapeType: 'circle', backgroundColor: '#1A1A1A', x: 40, y: 40, width: 220, height: 220, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 40, y: 120, width: 220, height: 60, rotation: 0, opacity: 1, text: '10/10', color: '#D4A373', fontSize: 56, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#121212' },
        elements: [
          { id: createId(), type: 'text', x: 80, y: 500, width: 920, height: 200, rotation: 0, opacity: 1, text: 'GOSTOU?\nSALVE PARA\nMAIS DICAS.', color: '#F9F7F3', fontSize: 80, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' },
          { id: createId(), type: 'shape', shapeType: 'circle', backgroundColor: '#D4A373', x: 440, y: 800, width: 200, height: 200, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 440, y: 880, width: 200, height: 40, rotation: 0, opacity: 1, text: 'COMPARTILHAR', color: '#121212', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'sports-run',
    name: 'Corrida & Esportes',
    format: '4:5',
    color: '#34D399',
    category: 'Moderno',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#111827' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#1F2937', x: 0, y: 0, width: 1080, height: 1350, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 0, y: 650, width: 1080, height: 80, rotation: 0, opacity: 0.3, text: 'FOTO TREINO', color: '#34D399', fontSize: 48, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center', letterSpacing: 10 },
          { id: createId(), type: 'text', x: -100, y: 300, width: 1280, height: 180, rotation: -10, opacity: 0.1, text: 'CONTINUE', color: '#FFFFFF', fontSize: 180, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#34D399', x: 80, y: 1050, width: 920, height: 220, rotation: 0, opacity: 0.9 },
          { id: createId(), type: 'text', x: 120, y: 1080, width: 300, height: 40, rotation: 0, opacity: 1, text: 'DISTÂNCIA', color: '#064E3B', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'left' }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#111827' },
        elements: [
          { id: createId(), type: 'text', x: 80, y: 100, width: 920, height: 100, rotation: 0, opacity: 1, text: 'O SEGREDO DA CONSTÂNCIA:', color: '#34D399', fontSize: 48, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'left' },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#1F2937', x: 80, y: 300, width: 920, height: 400, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 120, y: 450, width: 840, height: 100, rotation: 0, opacity: 0.5, text: '[ FOTO DETALHE ]', color: '#FFFFFF', fontSize: 32, fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'text', x: 80, y: 750, width: 920, height: 400, rotation: 0, opacity: 1, text: 'O maior desafio não é o ritmo, é aparecer todos os dias. Comece pequeno, termine grande.', color: '#FFFFFF', fontSize: 42, fontFamily: 'Inter, sans-serif', fontWeight: 'normal', textAlign: 'left', lineHeight: 1.5 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#34D399' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 400, width: 1080, height: 200, rotation: 0, opacity: 1, text: 'VAMOS JUNTOS?', color: '#064E3B', fontSize: 120, fontFamily: '"Space Grotesk", sans-serif', fontWeight: '900', textAlign: 'center' },
          { id: createId(), type: 'text', x: 0, y: 650, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'SIGA PARA MAIS MOTIVAÇÃO', color: '#111827', fontSize: 32, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center', letterSpacing: 4 },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#111827', x: 340, y: 850, width: 400, height: 100, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 340, y: 880, width: 400, height: 40, rotation: 0, opacity: 1, text: 'SIGA @USUARIO', color: '#34D399', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'lifestyle-buy',
    name: 'Look do Dia',
    format: '4:5',
    color: '#A78BFA',
    category: 'Minimalista',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#E5E7EB' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#9CA3AF', x: 0, y: 0, width: 1080, height: 1350, rotation: 0, opacity: 0.5 },
          { id: createId(), type: 'text', x: 40, y: 180, width: 1000, height: 150, rotation: 0, opacity: 1, text: 'VISUAL.', color: '#000000', fontSize: 160, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center', letterSpacing: -5 },
          { id: createId(), type: 'shape', shapeType: 'circle', backgroundColor: '#FFFFFF', x: 800, y: 1050, width: 220, height: 220, rotation: 0, opacity: 0.9 },
          { id: createId(), type: 'text', x: 800, y: 1115, width: 220, height: 80, rotation: 0, opacity: 1, text: 'Ver\nDetalhes', color: '#000000', fontSize: 32, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.1 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#FFFFFF' },
        elements: [
          { id: createId(), type: 'text', x: 80, y: 100, width: 920, height: 80, rotation: 0, opacity: 1, text: 'PEÇAS CHAVE:', color: '#000000', fontSize: 64, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'left' },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#F3F4F6', x: 80, y: 250, width: 440, height: 500, rotation: 0, opacity: 1 },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#F3F4F6', x: 560, y: 250, width: 440, height: 500, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 80, y: 800, width: 920, height: 100, rotation: 0, opacity: 1, text: '1. Sobretudo bege em lã\n2. Bota cano curto preta\n3. Acessórios em dourado', color: '#4B5563', fontSize: 36, fontFamily: 'Inter, sans-serif', fontWeight: 'normal', textAlign: 'left', lineHeight: 2 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#A78BFA' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 500, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'CURTIU O LOOK?', color: '#FFFFFF', fontSize: 80, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'text', x: 0, y: 650, width: 1080, height: 100, rotation: 0, opacity: 0.8, text: 'COMENTE "EU QUERO" PARA OS LINKS', color: '#F3F4F6', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: 'medium', textAlign: 'center', letterSpacing: 4 },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#FFFFFF', x: 390, y: 850, width: 300, height: 100, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 390, y: 885, width: 300, height: 30, rotation: 0, opacity: 1, text: 'COMPARTILHAR', color: '#A78BFA', fontSize: 20, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'tech-review',
    name: 'Tecnologia & Gadgets',
    format: '1:1',
    color: '#3B82F6',
    category: 'Tecnológico',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#0F172A' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#1E293B', x: 40, y: 40, width: 1000, height: 1000, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 80, y: 120, width: 920, height: 100, rotation: 0, opacity: 1, text: 'TECH NOVA', color: '#3B82F6', fontSize: 120, fontFamily: '"Space Grotesk", sans-serif', fontWeight: '900', textAlign: 'left' },
          { id: createId(), type: 'text', x: 80, y: 240, width: 920, height: 40, rotation: 0, opacity: 0.6, text: 'REVIEW COMPLETO DA SEMANA', color: '#FFFFFF', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'normal', textAlign: 'left', letterSpacing: 4 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#1E293B' },
        elements: [
          { id: createId(), type: 'text', x: 80, y: 100, width: 920, height: 80, rotation: 0, opacity: 1, text: 'PRÓS & CONTRAS', color: '#3B82F6', fontSize: 64, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'left' },
          { id: createId(), type: 'text', x: 80, y: 250, width: 440, height: 600, rotation: 0, opacity: 1, text: '+ Performance Ultra\n+ Design Minimalista\n+ Bateria 48h', color: '#34D399', fontSize: 36, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'left', lineHeight: 2 },
          { id: createId(), type: 'text', x: 560, y: 250, width: 440, height: 600, rotation: 0, opacity: 1, text: '- Preço Elevado\n- Sem Carregador\n- Poucas Portas', color: '#F87171', fontSize: 36, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'left', lineHeight: 2 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#3B82F6' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 350, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'VALE O INVESTIMENTO?', color: '#0F172A', fontSize: 72, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'text', x: 100, y: 550, width: 880, height: 100, rotation: 0, opacity: 1, text: 'Confira o vídeo completo no link da bio!', color: '#FFFFFF', fontSize: 32, fontFamily: 'Inter, sans-serif', fontWeight: 'medium', textAlign: 'center' },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#0F172A', x: 390, y: 750, width: 300, height: 80, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 390, y: 775, width: 300, height: 30, rotation: 0, opacity: 1, text: 'SALVAR POST', color: '#3B82F6', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'travel-journal',
    name: 'Diário de Viagem',
    format: '9:16',
    color: '#F59E0B',
    category: 'Orgânico',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#FAF7F2' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#E5E7EB', x: 0, y: 0, width: 1080, height: 1920, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 60, y: 1400, width: 960, height: 300, rotation: 0, opacity: 1, text: 'Alpes\nSuíços.', color: '#1A1A1A', fontSize: 180, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'left', fontStyle: 'italic', letterSpacing: -4 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#FAF7F2' },
        elements: [
          { id: createId(), type: 'text', x: 60, y: 100, width: 960, height: 200, rotation: 0, opacity: 1, text: 'Dia 03: O Pico', color: '#1A1A1A', fontSize: 72, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'left' },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#E5E7EB', x: 60, y: 350, width: 960, height: 800, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 60, y: 1250, width: 960, height: 400, rotation: 0, opacity: 1, text: 'A vista lá de cima faz todo o esforço valer a pena. O ar gelado e o silêncio são absolutos.', color: '#4B5563', fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: 'normal', textAlign: 'left', lineHeight: 1.4 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#1A1A1A' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 700, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'PLANEJE SUA AVENTURA', color: '#FAF7F2', fontSize: 64, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' },
          { id: createId(), type: 'text', x: 0, y: 850, width: 1080, height: 60, rotation: 0, opacity: 0.6, text: 'SIGA PARA VER MAIS HISTÓRIAS', color: '#FAF7F2', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'normal', textAlign: 'center', letterSpacing: 6 },
          { id: createId(), type: 'shape', shapeType: 'circle', backgroundColor: '#FAF7F2', x: 440, y: 1000, width: 200, height: 200, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 440, y: 1085, width: 200, height: 30, rotation: 0, opacity: 1, text: 'ENVIAR', color: '#1A1A1A', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'minimal-portfolio',
    name: 'Portfólio de Design',
    format: '4:5',
    color: '#6366F1',
    category: 'Minimalista',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#FFFFFF' },
        elements: [
          { id: createId(), type: 'text', x: 80, y: 500, width: 920, height: 100, rotation: 0, opacity: 1, text: 'PORTFÓLIO', color: '#000000', fontSize: 120, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center', letterSpacing: -2 },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#6366F1', x: 440, y: 650, width: 200, height: 4, rotation: 0, opacity: 1 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#F9FAFB' },
        elements: [
          { id: createId(), type: 'text', x: 80, y: 100, width: 920, height: 60, rotation: 0, opacity: 1, text: 'TRABALHOS SELECIONADOS', color: '#6366F1', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'left', letterSpacing: 4 },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#E5E7EB', x: 80, y: 250, width: 920, height: 600, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 80, y: 920, width: 920, height: 100, rotation: 0, opacity: 1, text: 'Identidade Visual - 2024\nMinimalismo na era moderna.', color: '#111827', fontSize: 42, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'left' }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#111827' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 500, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'VAMOS CRIAR JUNTOS?', color: '#FFFFFF', fontSize: 72, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'text', x: 0, y: 650, width: 1080, height: 60, rotation: 0, opacity: 0.5, text: 'OLA@STUDIO.COM', color: '#6366F1', fontSize: 32, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#6366F1', x: 390, y: 850, width: 300, height: 100, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 390, y: 885, width: 300, height: 30, rotation: 0, opacity: 1, text: 'CONTATO', color: '#FFFFFF', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'business-tips',
    name: 'Estratégia de Negócios',
    format: '4:5',
    color: '#0F172A',
    category: 'Clássico',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#0F172A' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#3B82F6', x: 0, y: 0, width: 20, height: 1350, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 100, y: 200, width: 880, height: 300, rotation: 0, opacity: 1, text: '5 REGRAS DO\nSUCESSO NO\nMKT DIGITAL', color: '#FFFFFF', fontSize: 90, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'left' }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#1E293B' },
        elements: [
          { id: createId(), type: 'text', x: 100, y: 100, width: 880, height: 80, rotation: 0, opacity: 1, text: 'REGRA #01: AUDIÊNCIA', color: '#3B82F6', fontSize: 48, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'left' },
          { id: createId(), type: 'text', x: 100, y: 250, width: 880, height: 800, rotation: 0, opacity: 1, text: 'Você não constrói um negócio em cima de plataformas, você constrói em cima de pessoas. Focar no seu seguidor é o melhor investimento a longo prazo.', color: '#CBD5E1', fontSize: 42, fontFamily: 'Inter, sans-serif', fontWeight: 'normal', textAlign: 'left', lineHeight: 1.6 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#3B82F6' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 500, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'QUER O GUIA COMPLETO?', color: '#0F172A', fontSize: 64, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'text', x: 0, y: 650, width: 1080, height: 60, rotation: 0, opacity: 1, text: 'COMENTE "GUIA" AQUI EMBAIXO', color: '#FFFFFF', fontSize: 32, fontFamily: 'Inter, sans-serif', fontWeight: 'medium', textAlign: 'center' },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#0F172A', x: 390, y: 850, width: 300, height: 100, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 390, y: 885, width: 300, height: 30, rotation: 0, opacity: 1, text: 'SALVAR AGORA', color: '#3B82F6', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'daily-affirmations',
    name: 'Saúde Mental',
    format: '1:1',
    color: '#FBCFE8',
    category: 'Orgânico',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#FFF1F2' },
        elements: [
          { id: createId(), type: 'text', x: 100, y: 400, width: 880, height: 300, rotation: 0, opacity: 1, text: '"Você é o suficiente hoje e sempre."', color: '#E11D48', fontSize: 70, fontFamily: '"Playfair Display", serif', fontWeight: 'normal', textAlign: 'center', fontStyle: 'italic' },
          { id: createId(), type: 'shape', shapeType: 'circle', backgroundColor: '#FECDD3', x: 490, y: 700, width: 100, height: 100, rotation: 0, opacity: 0.5 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#FFF1F2' },
        elements: [
          { id: createId(), type: 'text', x: 100, y: 300, width: 880, height: 400, rotation: 0, opacity: 1, text: 'Respire fundo.\nLembre-se que processos levam tempo e está tudo bem não estar 100% o tempo todo.', color: '#E11D48', fontSize: 48, fontFamily: '"Playfair Display", serif', fontWeight: 'normal', textAlign: 'center', lineHeight: 1.5 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#FBCFE8' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 450, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'ENVIE PARA ALGUÉM\nQUE PRECISA DISSO.', color: '#E11D48', fontSize: 64, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'shape', shapeType: 'circle', backgroundColor: '#E11D48', x: 490, y: 750, width: 100, height: 100, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 490, y: 785, width: 100, height: 30, rotation: 0, opacity: 1, text: '♥', color: '#FFFFFF', fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'real-estate',
    name: 'Imóveis de Luxo',
    format: '4:5',
    color: '#78350F',
    category: 'Clássico',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#1A1A1A' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#262626', x: 0, y: 0, width: 1080, height: 900, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 60, y: 980, width: 960, height: 100, rotation: 0, opacity: 1, text: 'Loft Moderno em SP', color: '#D4D4D4', fontSize: 90, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'left' },
          { id: createId(), type: 'text', x: 60, y: 1100, width: 960, height: 40, rotation: 0, opacity: 0.5, text: 'VILA MADALENA • R$ 3.500.000', color: '#D4D4D4', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'left', letterSpacing: 4 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#1A1A1A' },
        elements: [
          { id: createId(), type: 'text', x: 60, y: 100, width: 960, height: 80, rotation: 0, opacity: 1, text: 'DETALHES DO IMÓVEL:', color: '#A855F7', fontSize: 32, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'left' },
          { id: createId(), type: 'text', x: 60, y: 250, width: 960, height: 600, rotation: 0, opacity: 1, text: '• 180m² Privativos\n• 3 Suítes com Vista\n• Rooftop Integrado\n• Automação Completa', color: '#FFFFFF', fontSize: 56, fontFamily: '"Playfair Display", serif', fontWeight: 'normal', textAlign: 'left', lineHeight: 1.8 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#A855F7' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 500, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'AGENDE UMA VISITA', color: '#FFFFFF', fontSize: 80, fontFamily: '"Playfair Display", serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'text', x: 0, y: 650, width: 1080, height: 60, rotation: 0, opacity: 0.8, text: 'WHATSAPP: (11) 98888-8888', color: '#1A1A1A', fontSize: 32, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#1A1A1A', x: 390, y: 850, width: 300, height: 100, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 390, y: 885, width: 300, height: 30, rotation: 0, opacity: 1, text: 'MAPA', color: '#FFFFFF', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'study-tips',
    name: 'Dicas de Estudo',
    format: '4:5',
    color: '#D97706',
    category: 'Orgânico',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#FDFCF0' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#FEF3C7', x: 60, y: 60, width: 960, height: 400, rotation: 2, opacity: 1 },
          { id: createId(), type: 'text', x: 100, y: 150, width: 880, height: 200, rotation: 2, opacity: 1, text: 'COMO FOCO NO\nQUE IMPORTA', color: '#92400E', fontSize: 80, fontFamily: '"Space Grotesk", sans-serif', fontWeight: '900', textAlign: 'center' }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#FDFCF0' },
        elements: [
          { id: createId(), type: 'text', x: 100, y: 100, width: 880, height: 80, rotation: 0, opacity: 1, text: 'MÉTODO POMODORO:', color: '#D97706', fontSize: 48, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'left' },
          { id: createId(), type: 'text', x: 100, y: 250, width: 880, height: 800, rotation: 0, opacity: 1, text: '1. 25 min Foco Total\n2. 5 min Descanso\n3. Repita 4 vezes\n4. Descanso longo (30 min)', color: '#92400E', fontSize: 56, fontFamily: 'Inter, sans-serif', fontWeight: 'medium', textAlign: 'left', lineHeight: 2 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#FEF3C7' },
        elements: [
          { id: createId(), type: 'text', x: 0, y: 450, width: 1080, height: 100, rotation: 0, opacity: 1, text: 'SALVE PARA ESTUDAR!', color: '#92400E', fontSize: 72, fontFamily: '"Space Grotesk", sans-serif', fontWeight: '900', textAlign: 'center' },
          { id: createId(), type: 'text', x: 0, y: 600, width: 1080, height: 60, rotation: 0, opacity: 0.7, text: 'COMPARTILHE COM UM AMIGO', color: '#D97706', fontSize: 24, fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold', textAlign: 'center', letterSpacing: 4 },
          { id: createId(), type: 'shape', shapeType: 'circle', backgroundColor: '#92400E', x: 490, y: 800, width: 100, height: 100, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 490, y: 835, width: 100, height: 30, rotation: 0, opacity: 1, text: '→', color: '#FFFFFF', fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' }
        ]
      }
    ]
  },
  {
    id: 'joyful-summer',
    name: 'Vibe de Verão',
    format: '4:5',
    color: '#F472B6',
    category: 'Orgânico',
    generate: () => [
      {
        id: createId(),
        background: { type: 'color', value: '#FDF2F8' },
        elements: [
          { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#FEE2E2', x: 0, y: 0, width: 1080, height: 1350, rotation: 0, opacity: 1 },
          { id: createId(), type: 'drawing', path: 'M 100 200 Q 540 50 980 200 T 980 500', strokeWidth: 20, strokeColor: '#F472B6', brushType: 'spray', x: 0, y: 0, width: 1080, height: 1350, rotation: 0, opacity: 0.6 },
          { id: createId(), type: 'text', x: 50, y: 300, width: 980, height: 300, rotation: -2, opacity: 1, text: 'VIVA O AGORA! ☀️', color: '#9D174D', fontSize: 120, fontFamily: '"Space Grotesk", sans-serif', fontWeight: '900', textAlign: 'center' },
          { id: createId(), type: 'text', x: 100, y: 600, width: 880, height: 100, rotation: 0, opacity: 1, text: 'Aproveite cada segundo.', color: '#4C1D95', fontSize: 40, fontFamily: 'Inter, sans-serif', fontWeight: 'medium', textAlign: 'center' },
          { id: createId(), type: 'shape', shapeType: 'circle', backgroundColor: '#FBBF24', x: 440, y: 800, width: 200, height: 200, rotation: 0, opacity: 1 }
        ]
      },
      {
        id: createId(),
        background: { type: 'color', value: '#FEF3C7' },
        elements: [
          { id: createId(), type: 'drawing', path: 'M 540 100 L 540 1200', strokeWidth: 10, strokeColor: '#FBBF24', brushType: 'dotted', x: 0, y: 0, width: 1080, height: 1350, rotation: 0, opacity: 1 },
          { id: createId(), type: 'text', x: 50, y: 200, width: 980, height: 200, rotation: 0, opacity: 1, text: 'DICAS DE FELICIDADE 🌈', color: '#B45309', fontSize: 60, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textAlign: 'center' },
          { id: createId(), type: 'text', x: 100, y: 500, width: 400, height: 400, rotation: 0, opacity: 1, text: '1. Sorria sempre\n2. Beba água\n3. Esteja presente', color: '#000000', fontSize: 40, fontFamily: 'Inter, sans-serif', fontWeight: 'normal', textAlign: 'left', lineHeight: 2 }
        ]
      }
    ]
  }
];
