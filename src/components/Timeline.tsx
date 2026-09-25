import React from 'react';
import { useCarouselStore } from '../store';
import { Trash2, Copy, Plus, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export function Timeline() {
  const { slides, activeSlideId, setActiveSlide, addSlide, duplicateSlide, deleteSlide, reorderSlide } = useCarouselStore();

  return (
    <div className="h-24 md:h-32 border-t border-white/10 bg-[#161616] flex items-center justify-center px-4 md:px-6 gap-3 md:gap-6 overflow-x-auto shrink-0 relative">
      {slides.map((slide, index) => (
        <div key={slide.id} className="relative group shrink-0 mt-2">
          <div className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold whitespace-nowrap">
            {index + 1}
          </div>
          <button
            onClick={() => setActiveSlide(slide.id)}
            className={`w-[45px] md:w-[60px] aspect-[4/5] rounded-lg border-2 overflow-hidden transition-all ${activeSlideId === slide.id ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20 scale-110 opacity-100 z-10' : 'border-white/10 hover:border-white/20 opacity-50 hover:opacity-80'}`}
            style={{
              ...(slide.background.type === 'color' ? { backgroundColor: slide.background.value } : {}),
              ...(slide.background.type === 'image' ? { 
                backgroundImage: `url(${slide.background.value})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {})
            }}
          >
             {/* Thumbnail preview of elements (simplified) */}
             <div className="w-full h-full relative" style={{ transform: 'scale(0.05)', transformOrigin: 'top left' }}>
                {slide.elements.map(el => (
                  <div key={el.id} style={{ 
                    position: 'absolute', 
                    left: el.x, top: el.y, 
                    width: el.width, height: el.height,
                    backgroundColor: el.type === 'shape' ? el.backgroundColor : el.type === 'text' ? el.color : 'rgba(0,0,0,0.1)',
                    borderRadius: el.type === 'shape' && el.shapeType === 'circle' ? '50%' : '0'
                  }} />
                ))}
             </div>
          </button>

          {/* Hover Actions */}
          <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-[#161616] shadow-sm rounded-full p-1 border border-white/10 z-20">
            <button onClick={(e) => { e.stopPropagation(); duplicateSlide(slide.id); }} className="p-1 hover:bg-white/10 text-white/80 rounded-full transition-colors" title="Duplicar">
              <Copy size={12} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }} className="p-1 hover:bg-red-500/20 text-red-500 rounded-full transition-colors" title="Excluir">
              <Trash2 size={12} />
            </button>
          </div>
          
          <div className="absolute -bottom-6 w-full flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 z-20">
             <button onClick={(e) => { e.stopPropagation(); reorderSlide(slide.id, 'left'); }} disabled={index === 0} className="hover:text-blue-400 disabled:opacity-30 transition-colors"><ChevronLeft size={14}/></button>
             <button onClick={(e) => { e.stopPropagation(); reorderSlide(slide.id, 'right'); }} disabled={index === slides.length - 1} className="hover:text-blue-400 disabled:opacity-30 transition-colors"><ChevronRight size={14}/></button>
          </div>
        </div>
      ))}

      <button
        onClick={() => addSlide()}
        className="w-[45px] md:w-[60px] aspect-[4/5] rounded-lg border border-white/10 bg-white/5 flex flex-col items-center justify-center text-white/40 hover:text-blue-400 hover:border-blue-400/50 transition-colors shrink-0 mt-2"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
