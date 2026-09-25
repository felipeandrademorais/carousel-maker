import React, { useMemo } from 'react';
import { useCarouselStore, SlideElement, Slide } from '../store';
import { templates, Template } from '../templates';
import { X, LayoutTemplate, Layers, CheckCircle2 } from 'lucide-react';

function TemplatePreview({ template, scale = 0.15 }: { template: any, scale?: number }) {
  const firstSlide = useMemo(() => {
    if ('generate' in template) return template.generate()[0];
    return template.slides[0];
  }, [template]);
  
  // Base dimensions for preview calculation
  const baseWidth = 1080;
  const baseHeight = template.format === '1:1' ? 1080 : template.format === '4:5' ? 1350 : 1920;

  return (
    <div 
      className="relative overflow-hidden shadow-inner border border-white/5"
      style={{ 
        width: baseWidth * scale, 
        height: baseHeight * scale,
        backgroundColor: firstSlide.background.type === 'color' ? firstSlide.background.value : '#000',
        backgroundImage: firstSlide.background.type === 'image' ? `url(${firstSlide.background.value})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {firstSlide.elements.map((el: SlideElement) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: el.x * scale,
            top: el.y * scale,
            width: el.width * scale,
            height: (el.type === 'text' ? 'auto' : el.height * scale),
            minHeight: el.type === 'text' ? el.height * scale : 'auto',
            backgroundColor: el.type === 'shape' ? el.backgroundColor : 'transparent',
            borderRadius: el.type === 'shape' && el.shapeType === 'circle' ? '50%' : '0',
            opacity: el.opacity,
            transform: `rotate(${el.rotation}deg)`,
            color: el.color,
            fontSize: el.fontSize ? el.fontSize * scale : 16 * scale,
            fontFamily: el.fontFamily,
            fontWeight: el.fontWeight as any,
            textAlign: el.textAlign,
            lineHeight: el.lineHeight || 1.2,
            overflow: 'hidden',
          }}
        >
          {el.type === 'text' && (
            <div style={{ pointerEvents: 'none' }}>{el.text}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function TemplateModal() {
  const { isTemplateModalOpen, setTemplateModalOpen, loadTemplate, view, createProject, customTemplates } = useCarouselStore();

  if (!isTemplateModalOpen) return null;

  const allTemplates = [...templates, ...customTemplates];

  const handleSelectTemplate = (template: any) => {
    const slidesData = 'generate' in template ? template.generate() : template.slides;
    if (view === 'dashboard') {
      createProject(`Projeto ${template.name}`, slidesData, template.format);
    } else {
      loadTemplate(slidesData, template.format);
    }
    setTemplateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="p-4 md:p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#0F0F0F] to-[#161616]">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/30">
              <LayoutTemplate size={24} className="md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">Galeria de Modelos</h2>
              <p className="hidden sm:block text-sm text-white/40 mt-0.5">Escolha uma base profissional para seu próximo carrossel de alto impacto.</p>
            </div>
          </div>
          <button 
            onClick={() => setTemplateModalOpen(false)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 overflow-y-auto bg-[#0A0A0A]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {allTemplates.map((template) => {
              const slidesData = 'generate' in template ? template.generate() : template.slides;
              const slideCount = slidesData.length;
              return (
                <div 
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="group relative bg-[#161616] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* Preview Area */}
                  <div className="aspect-[4/5] w-full bg-[#0F0F0F] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="transform scale-[0.8] md:scale-100">
                      <TemplatePreview template={template} scale={0.18} />
                    </div>
                    
                    {/* Format Label */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white/70 border border-white/10 tracking-widest uppercase">
                        {template.format}
                      </span>
                    </div>

                    {/* Overlay Action */}
                    <div className="absolute inset-0 z-30 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-6 backdrop-blur-[2px]">
                       <span className="bg-white text-blue-600 px-6 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <CheckCircle2 size={14} />
                          Usar este Modelo
                       </span>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-5 flex flex-col gap-1 relative z-40 bg-[#161616]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                        {template.category}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-base leading-tight truncate group-hover:text-blue-400 transition-colors">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                       <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                          <Layers size={12} />
                          {slideCount} Slides
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
