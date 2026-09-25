import React, { useState, useRef, useEffect } from 'react';
import { useCarouselStore } from '../store';
import { getGeminiResponse } from '../services/geminiService';
import { Send, X, Bot, User, Loader2, Sparkles, AlertCircle, Square, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export function ChatAssistant() {
  const { isChatOpen: isOpen, setChatOpen: setIsOpen, showFloatingChatButton, setShowFloatingChatButton } = useCarouselStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou seu assistente de design. Como posso ajudar com seu carrossel hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const store = useCarouselStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const executeFunction = async (call: any) => {
    const { name, args } = call;
    console.log(`AI invoking: ${name}`, args);

    try {
      switch (name) {
        case 'addElement': {
          const processedArgs = { ...args };
          if (processedArgs.text) {
            processedArgs.text = processedArgs.text.replace(/\\n/g, '\n');
          }
          store.addElement(args.slideId || store.activeSlideId!, processedArgs);
          return { success: true, message: 'Elemento adicionado com sucesso.' };
        }
        case 'updateElement': {
          const { slideId, elementId, ...updates } = args;
          if (updates.text) {
            updates.text = updates.text.replace(/\\n/g, '\n');
          }
          store.updateElement(slideId, elementId, updates);
          return { success: true, message: 'Elemento atualizado com sucesso.' };
        }
        case 'deleteElement':
          store.deleteElement(args.slideId, args.elementId);
          return { success: true, message: 'Elemento excluído com sucesso.' };
        case 'updateSlideBackground':
          store.updateSlideBackground(args.slideId, { type: args.type, value: args.value });
          return { success: true, message: 'Fundo do slide atualizado.' };
        case 'addSlide':
          store.addSlide();
          return { success: true, message: 'Novo slide adicionado.' };
        case 'duplicateSlide':
          store.duplicateSlide(args.slideId);
          return { success: true, message: 'Slide duplicado.' };
        case 'deleteSlide':
          store.deleteSlide(args.slideId);
          return { success: true, message: 'Slide excluído.' };
        case 'setActiveSlide':
          store.setActiveSlide(args.slideId);
          return { success: true, message: 'Slide ativo alterado.' };
        case 'undo':
          store.undo();
          return { success: true, message: 'Desfeito.' };
        case 'redo':
          store.redo();
          return { success: true, message: 'Refeito.' };
        default:
          return { error: 'Função não encontrada.' };
      }
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const context = {
        slides: store.slides,
        activeSlideId: store.activeSlideId,
        format: store.format,
      };

      const result = await getGeminiResponse(userMessage, context, [], abortControllerRef.current.signal);
      const response = result.response;
      const candidates = response.candidates;
      
      if (candidates && candidates[0].content.parts) {
        const executionMessages: string[] = [];
        for (const part of candidates[0].content.parts) {
          if (part.functionCall) {
            const res = await executeFunction(part.functionCall);
            if (res.message) executionMessages.push(res.message);
            else if (res.error) executionMessages.push(`Erro: ${res.error}`);
          }
        }
        
        let assistantText = '';
        try {
          assistantText = response.text();
        } catch (e) {
          // If no text part exists, use executed function messages
          assistantText = executionMessages.length > 0 
            ? executionMessages.join('. ') 
            : 'Entendido! Já executei as alterações solicitadas.';
        }
        
        setMessages(prev => [...prev, { role: 'assistant', content: assistantText.trim() }]);
      }
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Ação interrompida.',
        }]);
      } else {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Desculpe, ocorreu um erro ao processar sua solicitação.',
          isError: true 
        }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {showFloatingChatButton && (
        <div className="fixed bottom-44 md:bottom-36 right-4 md:right-[304px] z-[100] group flex items-center justify-center">
          {/* Close/Hide Button: always visible on touch devices, hover-controlled on desktop */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowFloatingChatButton(false); }}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-[#262626] border border-white/10 text-white/40 hover:text-red-400 rounded-full flex items-center justify-center transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-md hover:scale-110 z-10 cursor-pointer"
            title="Ocultar botão flutuante"
          >
            <X size={10} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl cursor-pointer ${
              isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600 hover:bg-blue-500 scale-110'
            }`}
          >
            {isOpen ? <X size={24} className="text-white" /> : <Bot size={28} className="text-white" />}
            {!isOpen && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[244px] md:bottom-52 right-4 md:right-[304px] w-[calc(100vw-32px)] md:w-96 h-[360px] md:h-[512px] bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Assistente Gemini</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setShowFloatingChatButton(!showFloatingChatButton)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${showFloatingChatButton ? 'text-blue-400 hover:bg-white/5' : 'text-white/30 hover:bg-white/5 hover:text-white/60'}`}
                  title={showFloatingChatButton ? 'Ocultar botão flutuante' : 'Mostrar botão flutuante'}
                >
                  {showFloatingChatButton ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-colors cursor-pointer"
                  title="Fechar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-purple-600/20 text-purple-400' : 
                    msg.isError ? 'bg-red-500/20 text-red-500' : 'bg-blue-600/20 text-blue-500'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : msg.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm font-medium leading-relaxed ${
                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-white/80 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/5 text-white/40 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">Pensando...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Diga 'Crie um texto vermelho ao topo'..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                />
                {isLoading ? (
                  <button
                    onClick={handleStop}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition-all shadow-lg shadow-red-900/20"
                    title="Interromper geração"
                  >
                    <Square size={18} className="fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/20 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20"
                  >
                    <Send size={18} />
                  </button>
                )}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5 opacity-30">
                <Sparkles size={10} className="text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Powered by Gemini AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
