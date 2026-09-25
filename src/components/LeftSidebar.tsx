import React from 'react';
import { Type, Square, Circle, Image as ImageIcon, LayoutList, LayoutTemplate, PenTool, Settings2, Smile, MousePointer, Hand, MessageSquare, ChevronRight, ChevronLeft, LayoutGrid } from 'lucide-react';
import { useLeftSidebar } from '../hooks/useLeftSidebar';

export function LeftSidebar() {
  const {
    scrollContainerRef,
    canScrollRight,
    canScrollLeft,
    checkScroll,
    scrollByAmount,
    handleAddText,
    handleAddShape,
    handleAddImage,
    toggleDrawingMode,
    toggleEmojiPicker,
    toggleChat,
    toggleRightSidebar,
    handleAddCollage,
    isDrawingMode,
    isEmojiPickerOpen,
    isChatOpen,
    isRightSidebarOpen,
    interactionMode,
    setInteractionMode
  } = useLeftSidebar();

  return (
    <>
      <aside 
        ref={scrollContainerRef as any}
        onScroll={checkScroll}
        className="w-full max-w-[100vw] overflow-x-auto overflow-y-hidden md:w-20 border-t md:border-t-0 md:border-r border-white/10 bg-[#161616] fixed bottom-0 md:static z-40 md:flex md:flex-col items-center justify-start md:py-6 md:px-0 md:overflow-x-hidden md:overflow-y-auto custom-scrollbar touch-pan-x"
      >
        <div className="flex flex-row md:flex-col items-center gap-3 md:gap-6 w-max min-w-full pl-4 pr-10 md:px-0 py-2 md:p-0 relative">
        <SidebarButton 
        icon={<MousePointer size={18} className="md:w-5 md:h-5" />} 
        label="Mouse" 
        onClick={() => setInteractionMode('select')} 
        active={interactionMode === 'select'} 
      />
      <SidebarButton 
        icon={<Hand size={18} className="md:w-5 md:h-5" />} 
        label="Mão" 
        onClick={() => setInteractionMode('pan')} 
        active={interactionMode === 'pan'} 
      />
      
      <div className="w-px h-6 md:w-full md:h-px bg-white/5 mx-1 md:mx-0 md:my-0 shrink-0" />

      <SidebarButton icon={<Type size={18} className="md:w-5 md:h-5" />} label="Texto" onClick={handleAddText} />
      <SidebarButton icon={<Smile size={18} className="md:w-5 md:h-5" />} label="Emoji" onClick={toggleEmojiPicker} active={isEmojiPickerOpen} />
      <SidebarButton icon={<Square size={18} className="md:w-5 md:h-5" />} label="Retângulo" onClick={() => handleAddShape('rectangle')} />
      <SidebarButton icon={<Circle size={18} className="md:w-5 md:h-5" />} label="Círculo" onClick={() => handleAddShape('circle')} />
      <SidebarButton icon={<LayoutGrid size={18} className="md:w-5 md:h-5" />} label="Colagem" onClick={handleAddCollage} />
      <SidebarButton icon={<ImageIcon size={18} className="md:w-5 md:h-5" />} label="Imagem" onClick={handleAddImage} />
      <SidebarButton icon={<PenTool size={18} className="md:w-5 md:h-5" />} label="Desenhar" onClick={toggleDrawingMode} active={isDrawingMode} />
      <SidebarButton 
        icon={<MessageSquare size={18} className="md:w-5 md:h-5" />} 
        label="Assistente" 
        onClick={toggleChat} 
        active={isChatOpen} 
      />
      
      {/* Property toggle always visible for mobile */}
      <div className="w-px h-6 md:w-full md:h-px bg-white/5 mx-1 md:hidden shrink-0" />
      <div className="md:hidden flex shrink-0">
        <SidebarButton 
          icon={<Settings2 size={18} />} 
          label="Ajustes" 
          onClick={toggleRightSidebar} 
          active={isRightSidebarOpen}
        />
      </div>
      </div>
      </aside>

      {/* Floating Scroll Navigators for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] pointer-events-none z-50">
        {canScrollLeft && (
          <button 
            onClick={() => scrollByAmount(-150)}
            className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center bg-gradient-to-r from-[#161616] via-[#161616]/80 to-transparent pointer-events-auto text-white/50 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {canScrollRight && (
          <button 
            onClick={() => scrollByAmount(150)}
            className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center bg-gradient-to-l from-[#161616] via-[#161616]/80 to-transparent pointer-events-auto text-white/50 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </>
  );
}

function SidebarButton({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 group transition-opacity shrink-0 ${active ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
      title={label}
    >
      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-blue-600/10 text-blue-400' : 'bg-white/5 text-white group-hover:bg-white/10'}`}>
        {icon}
      </div>
      <span className={`hidden md:block text-[10px] uppercase tracking-wider font-semibold ${active ? 'text-blue-400' : 'text-white'}`}>{label}</span>
    </button>
  );
}
