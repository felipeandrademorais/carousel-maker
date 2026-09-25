import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { Tool } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const AI_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "addElement",
        description: "Adds a new element (text, shape, or image) to a slide. Canvas size is 1080x1920 (width x height). Use x and y to position elements based on this coordinate system.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            slideId: { type: SchemaType.STRING, description: "The slide ID to add to (if omitted, uses active slide)." },
            type: { type: SchemaType.STRING, format: "enum", enum: ["text", "shape", "image"], description: "The type of element." },
            text: { type: SchemaType.STRING, description: "The text content (for text elements)." },
            x: { type: SchemaType.NUMBER, description: "X coordinate (0-1080)." },
            y: { type: SchemaType.NUMBER, description: "Y coordinate (0-1920)." },
            width: { type: SchemaType.NUMBER, description: "Width (0-1080)." },
            height: { type: SchemaType.NUMBER, description: "Height (0-1920)." },
            color: { type: SchemaType.STRING, description: "Text or stroke color (CSS hex, e.g., #FF0000)." },
            backgroundColor: { type: SchemaType.STRING, description: "Background color (CSS hex, e.g., #000000)." },
            fontSize: { type: SchemaType.NUMBER, description: "Font size in pixels." }
          },
          required: ["type"]
        }
      },
      {
        name: "updateElement",
        description: "Updates properties of an existing element.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            slideId: { type: SchemaType.STRING },
            elementId: { type: SchemaType.STRING },
            text: { type: SchemaType.STRING },
            x: { type: SchemaType.NUMBER },
            y: { type: SchemaType.NUMBER },
            color: { type: SchemaType.STRING },
            backgroundColor: { type: SchemaType.STRING },
            fontSize: { type: SchemaType.NUMBER }
          },
          required: ["slideId", "elementId"]
        }
      },
      {
        name: "deleteElement",
        description: "Deletes an element from a slide.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            slideId: { type: SchemaType.STRING },
            elementId: { type: SchemaType.STRING }
          },
          required: ["slideId", "elementId"]
        }
      },
      {
        name: "addSlide",
        description: "Adds a new blank slide to the project."
      }
    ]
  }
];

export const getGeminiResponse = async (prompt: string, context: any, history: any[] = [], signal?: AbortSignal) => {
  const systemMessage = `Você é um assistente de design expert para a plataforma CarouselMaker.

  CONTEXTO:
  - O projeto possui os seguintes formatos disponíveis: 1:1, 3:5, 4:5, 9:16.
  - O Canvas é dimensionado automaticamente. A largura base é 1080. A altura varia conforme o formato (1:1=1080, 4:5=1350, 9:16=1920, 3:5=1800).
  - O canto superior esquerdo é (0,0). O canto inferior direito é (1080, [altura]).
  
  DIRETRIZES DE AÇÃO:
  - Sempre responda confirmando as ações executadas. Se algo falhar, explique o porquê.
  - POSICIONAMENTO: Ao receber pedidos de posicionamento ("topo", "meio", "baixo", "esquerda", "direita"), calcule as coordenadas (x,y) baseadas na altura do formato ativo.
  - TEMPLATES: Para pedidos de "criar template", você deve analisar a estrutura solicitada e executar múltiplas chamadas de 'addElement' em sequência para criar cada elemento (fundo, título, texto de apoio) posicionados de forma coerente.
  - FORMATAÇÃO DE TEXTO: Se o usuário pedir para pular linha, garanta que suas chamadas de ferramenta incluam o caractere de nova linha (\\n) no parâmetro 'text'.
  - Preste atenção ao slide correto (use activeSlideId se o usuário não especificar).
  
  ESTADO ATUAL:
  ${JSON.stringify(context, null, 2)}`;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash-lite-preview",
    tools: AI_TOOLS,
    systemInstruction: systemMessage,
    safetySettings: [],
  });

  const chat = model.startChat({
    history: history,
  });

  const requestOptions = signal ? { signal } : undefined;
  // Passing signal might need an object with requestOptions, but try passing it in the second arg
  const result = await chat.sendMessage(prompt, { signal } as any);
  return result;
};
