import React, { useState } from 'react';
import { useCarouselStore } from '../store';
import { colors, fonts } from '../constants';
import { FontPicker } from './FontPicker';
import { Image as ImageIcon, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Type as TypeIcon, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Square, Circle, PenTool, ChevronLeft, X, GripVertical, Lock, Unlock, LayoutGrid } from 'lucide-react';
import { Reorder } from 'motion/react';

export function RightSidebar() {
  const { slides, activeSlideId, selectedElementId, updateElement, deleteElement, reorderElement, updateSlideBackground, isDrawingMode, drawingSettings, updateDrawingSettings, saveSnapshot, setSelectedElement, setDrawingMode, isDragging, isRightSidebarOpen, setRightSidebarOpen, setSlideElements } = useCarouselStore();
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  const [textSubTab, setTextSubTab] = useState<'content' | 'style' | 'effects'>('content');
  
  const activeSlide = slides.find(s => s.id === activeSlideId);
  const selectedElement = activeSlide?.elements.find(e => e.id === selectedElementId);

  if (!activeSlide) return null;

  // On mobile, auto-open ONLY if drawing mode is active or user explicitly opened it. 
  const showMobile = (isDrawingMode || isRightSidebarOpen) && !isDragging;
  
  const sidebarContent = (
    <div className={`fixed md:relative inset-y-0 right-0 z-50 w-80 md:w-72 bg-[#161616] flex flex-col md:h-full overflow-hidden shadow-2xl md:shadow-none transition-transform duration-300 md:translate-x-0 ${showMobile ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex shrink-0 border-b border-white/10 relative h-[57px]">
         <button onClick={() => setActiveTab('properties')} className={`flex-1 flex items-center justify-center border-b-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'properties' ? 'border-blue-500 text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
           Propriedades
         </button>
         <button onClick={() => setActiveTab('layers')} className={`flex-1 flex items-center justify-center border-b-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'layers' ? 'border-blue-500 text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
           Camadas
         </button>
         
         <button 
           onClick={() => { setRightSidebarOpen(false); setDrawingMode(false); }}
           className="md:hidden absolute -left-12 top-4 w-10 h-10 flex items-center justify-center bg-[#161616] border border-white/10 rounded-full text-white/60 hover:text-white shadow-xl"
         >
           <X size={20} />
         </button>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-32 md:pb-8">
        {activeTab === 'properties' && (
          <>
            <div className="p-6 border-b border-white/10 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-white/50">
              {isDrawingMode ? 'Pincel de Desenho' : selectedElement ? 'Editar Elemento' : 'Fundo do Slide'}
              {selectedElement && !isDrawingMode && (
                 <button onClick={() => deleteElement(activeSlide.id, selectedElement.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-md transition-colors" title="Excluir Elemento">
                    <Trash2 size={16} />
                 </button>
              )}
            </div>

            <div className="p-6 flex flex-col gap-6">
        {isDrawingMode ? (
          // Drawing Settings
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Estilo de Pincel</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'solid', label: 'Sólido' },
                  { value: 'dashed', label: 'Tracejado' },
                  { value: 'dotted', label: 'Pontilhado' },
                  { value: 'dash-dot', label: 'Traço-Ponto' },
                  { value: 'marker', label: 'Marcador' },
                  { value: 'neon', label: 'Neon' },
                  { value: 'chalk', label: 'Giz' },
                  { value: 'highlighter', label: 'Marca-texto' },
                  { value: 'double', label: 'Linha dupla' },
                  { value: 'outline', label: 'Contorno' },
                  { value: 'grunge', label: 'Desgastado' },
                  { value: 'dry-brush', label: 'Pincel Seco' },
                  { value: 'rough', label: 'Rugoso' },
                  { value: 'charcoal', label: 'Carvão' },
                  { value: 'spray', label: 'Spray' },
                ].map(brush => {
                  const isSelected = drawingSettings.brushType === brush.value;
                  const sWidth = 4;
                  const sColor = isSelected ? '#ffffff' : '#a3a3a3';
                  const d = "M 10 25 Q 30 5 50 25 T 90 25";
                  
                  return (
                    <button
                      key={brush.value}
                      onClick={() => updateDrawingSettings({ brushType: brush.value as any })}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all h-16 group ${
                        isSelected
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 text-white/50 border-white/5 hover:border-white/20 hover:text-white/90'
                      }`}
                      title={brush.label}
                    >
                      <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible mb-1">
                        <defs>
                          {brush.value === 'chalk' && (
                            <filter id={`chalk-preview-${isSelected ? 'sel' : 'unsel'}`}>
                              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
                              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                          )}
                          {brush.value === 'grunge' && (
                            <filter id={`grunge-preview-${isSelected ? 'sel' : 'unsel'}`}>
                              <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="4" result="noise" />
                              <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                          )}
                          {brush.value === 'dry-brush' && (
                            <filter id={`dry-brush-preview-${isSelected ? 'sel' : 'unsel'}`}>
                              <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="4" result="noise" />
                              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                          )}
                          {brush.value === 'rough' && (
                            <filter id={`rough-preview-${isSelected ? 'sel' : 'unsel'}`}>
                              <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="noise" />
                              <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
                            </filter>
                          )}
                          {brush.value === 'charcoal' && (
                            <filter id={`charcoal-preview-${isSelected ? 'sel' : 'unsel'}`}>
                              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                              <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                          )}
                          {brush.value === 'spray' && (
                            <filter id={`spray-preview-${isSelected ? 'sel' : 'unsel'}`}>
                              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="noise" />
                              <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
                            </filter>
                          )}
                        </defs>
                        {(() => {
                           const b = brush.value;
                           if (b === 'neon') return (
                             <>
                              <path d={d} stroke={sColor} strokeWidth={sWidth * 2} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.4} filter="blur(4px)" />
                              <path d={d} stroke="#fff" strokeWidth={sWidth * 0.5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={1} />
                             </>
                           );
                           if (b === 'double') return (
                             <>
                              <path d={d} stroke={sColor} strokeWidth={sWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              <path d={d} stroke={isSelected ? '#3b82f6' : '#262626'} strokeWidth={sWidth * 0.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                             </>
                           );
                           if (b === 'outline') return (
                             <>
                              <path d={d} stroke={isSelected ? '#1e3a8a' : '#000'} strokeWidth={sWidth + 4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              <path d={d} stroke={sColor} strokeWidth={sWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                             </>
                           );
                           
                           let extraProps: any = { strokeLinecap: 'round', strokeLinejoin: 'round' };
                           let extraStyle: any = {};
                           if (b === 'dashed') extraProps.strokeDasharray = `${sWidth * 2} ${sWidth * 2}`;
                           else if (b === 'dotted') extraProps.strokeDasharray = `0 ${sWidth * 2}`;
                           else if (b === 'dash-dot') extraProps.strokeDasharray = `${sWidth * 3} ${sWidth * 2} 0 ${sWidth * 2}`;
                           else if (b === 'marker') { extraProps.strokeLinecap = 'square'; extraProps.strokeLinejoin = 'bevel'; extraProps.opacity = 0.5; }
                           else if (b === 'highlighter') { extraProps.strokeLinecap = 'square'; extraProps.opacity = 0.6; extraStyle.mixBlendMode = 'multiply'; }
                           else if (b === 'chalk') extraProps.filter = `url(#chalk-preview-${isSelected ? 'sel' : 'unsel'})`;
                           else if (b === 'grunge') extraProps.filter = `url(#grunge-preview-${isSelected ? 'sel' : 'unsel'})`;
                           else if (b === 'dry-brush') extraProps.filter = `url(#dry-brush-preview-${isSelected ? 'sel' : 'unsel'})`;
                           else if (b === 'rough') extraProps.filter = `url(#rough-preview-${isSelected ? 'sel' : 'unsel'})`;
                           else if (b === 'charcoal') extraProps.filter = `url(#charcoal-preview-${isSelected ? 'sel' : 'unsel'})`;
                           else if (b === 'spray') extraProps.filter = `url(#spray-preview-${isSelected ? 'sel' : 'unsel'})`;

                           return <path d={d} stroke={sColor} strokeWidth={sWidth} fill="none" {...extraProps} style={extraStyle} className={!isSelected ? "group-hover:stroke-white transition-colors duration-200" : ""} />;
                        })()}
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Cor do Pincel</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 ${drawingSettings.color === color ? 'ring-2 ring-offset-2 ring-offset-[#161616] ring-blue-500' : 'border-white/10'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateDrawingSettings({ color })}
                  />
                ))}
              </div>
            </div>
            <div>
               <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block flex justify-between">
                 <span>Espessura</span>
                 <span className="text-blue-400">{drawingSettings.strokeWidth}px</span>
               </label>
               <div className="flex gap-2 mb-3">
                 {[2, 5, 10, 20, 35].map(w => (
                   <button
                     key={w}
                     onClick={() => updateDrawingSettings({ strokeWidth: w })}
                     className={`flex-1 flex items-center justify-center h-8 rounded-lg border transition-all ${
                       drawingSettings.strokeWidth === w 
                         ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                         : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                     }`}
                     title={`${w}px`}
                   >
                     <div className="bg-current rounded-full" style={{ width: Math.max(2, w/2), height: Math.max(2, w/2) }} />
                   </button>
                 ))}
               </div>
               <input 
                 type="range" 
                 min="1" max="50" step="1" 
                 value={drawingSettings.strokeWidth} 
                 onChange={(e) => updateDrawingSettings({ strokeWidth: parseInt(e.target.value) })}
                 className="w-full accent-blue-500"
               />
            </div>
            <div>
               <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block flex justify-between">
                 <span>Opacidade</span>
                 <span className="text-blue-400">{Math.round(drawingSettings.opacity * 100)}%</span>
               </label>
               <input 
                 type="range" 
                 min="0.1" max="1" step="0.05" 
                 value={drawingSettings.opacity} 
                 onChange={(e) => updateDrawingSettings({ opacity: parseFloat(e.target.value) })}
                 className="w-full accent-blue-500"
               />
            </div>
          </div>
        ) : !selectedElement ? (
          // Slide Background Edit
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Cor de Fundo</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 ${activeSlide.background.type === 'color' && activeSlide.background.value === color ? 'ring-2 ring-offset-2 ring-offset-[#161616] ring-blue-500' : 'border-white/10'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSlideBackground(activeSlide.id, { type: 'color', value: color })}
                  />
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Imagem de Fundo</label>
              <label className="flex items-center justify-center gap-2 w-full border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 rounded-xl p-4 text-sm text-white/60 cursor-pointer transition-colors">
                <ImageIcon size={18} />
                Fazer Upload
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const url = event.target?.result as string;
                        updateSlideBackground(activeSlide.id, { type: 'image', value: url });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        ) : (
          // Element Edit
          <div className="space-y-6">
            
            {/* Position & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Largura (px)</label>
                <input 
                  type="number" 
                  value={selectedElement.width || 0}
                  onFocus={() => saveSnapshot()}
                  onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { width: parseInt(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-[#F0F0F0] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Altura (px)</label>
                <input 
                  type="number" 
                  value={selectedElement.height || 0}
                  onFocus={() => saveSnapshot()}
                  onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { height: parseInt(e.target.value) })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-[#F0F0F0] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Layer Settings */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Ordem de Camadas</label>
              <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
                <button onClick={() => reorderElement(activeSlide.id, selectedElement.id, 'up')} className="flex-1 flex justify-center p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="Trazer para Frente (1 nível)"><ChevronUp size={16}/></button>
                <button onClick={() => reorderElement(activeSlide.id, selectedElement.id, 'down')} className="flex-1 flex justify-center p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="Enviar para Trás (1 nível)"><ChevronDown size={16}/></button>
                <div className="w-px bg-white/10 mx-1"></div>
                <button onClick={() => reorderElement(activeSlide.id, selectedElement.id, 'front')} className="flex-1 flex justify-center p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="Trazer para o Topo"><ChevronsUp size={16}/></button>
                <button onClick={() => reorderElement(activeSlide.id, selectedElement.id, 'back')} className="flex-1 flex justify-center p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="Enviar para o Fundo"><ChevronsDown size={16}/></button>
              </div>
            </div>

            {/* Text Properties with Sub-tabs */}
            {selectedElement.type === 'text' && (
              <div className="space-y-6">
                <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
                  <button 
                    onClick={() => setTextSubTab('content')} 
                    className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${textSubTab === 'content' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    Base
                  </button>
                  <button 
                    onClick={() => setTextSubTab('style')} 
                    className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${textSubTab === 'style' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    Estilo
                  </button>
                  <button 
                    onClick={() => setTextSubTab('effects')} 
                    className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${textSubTab === 'effects' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    Efeitos
                  </button>
                </div>

                {textSubTab === 'content' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Conteúdo do Texto</label>
                      <textarea 
                        value={selectedElement.text || ''} 
                        onFocus={() => saveSnapshot()}
                        onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { text: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-[#F0F0F0] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        rows={4}
                        placeholder="Digite seu texto aqui..."
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Família da Fonte</label>
                      <FontPicker 
                        value={selectedElement.fontFamily || ''}
                        onSelect={(value) => {
                          saveSnapshot();
                          updateElement(activeSlide.id, selectedElement.id, { fontFamily: value });
                        }}
                        fonts={fonts}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Cor do Texto</label>
                      <div className="grid grid-cols-7 gap-2">
                        {colors.map(color => (
                          <button
                            key={color}
                            className={`w-full aspect-square rounded-full border shadow-sm transition-transform hover:scale-110 ${selectedElement.color === color ? 'ring-2 ring-offset-2 ring-offset-[#161616] ring-blue-500' : 'border-white/10'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { color }) }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {textSubTab === 'style' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Tamanho</label>
                        <input 
                          type="number" 
                          value={selectedElement.fontSize || 16}
                          onFocus={() => saveSnapshot()} 
                          onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { fontSize: parseInt(e.target.value) })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-[#F0F0F0] focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Alinhamento</label>
                        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
                          <button onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { textAlign: 'left' }) }} className={`flex-1 flex justify-center p-1.5 rounded-md transition-colors ${selectedElement.textAlign === 'left' ? 'bg-white/10 shadow-sm text-white' : 'text-white/40 hover:text-white'}`}><AlignLeft size={16}/></button>
                          <button onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { textAlign: 'center' }) }} className={`flex-1 flex justify-center p-1.5 rounded-md transition-colors ${selectedElement.textAlign === 'center' ? 'bg-white/10 shadow-sm text-white' : 'text-white/40 hover:text-white'}`}><AlignCenter size={16}/></button>
                          <button onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { textAlign: 'right' }) }} className={`flex-1 flex justify-center p-1.5 rounded-md transition-colors ${selectedElement.textAlign === 'right' ? 'bg-white/10 shadow-sm text-white' : 'text-white/40 hover:text-white'}`}><AlignRight size={16}/></button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Formatação</label>
                        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
                          <button onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { fontWeight: selectedElement.fontWeight === 'bold' || selectedElement.fontWeight === '700' ? 'normal' : 'bold' }) }} className={`flex-1 flex justify-center p-1.5 rounded-md transition-colors ${selectedElement.fontWeight === 'bold' || selectedElement.fontWeight === '700' ? 'bg-white/10 shadow-sm text-white' : 'text-white/40 hover:text-white'}`}><Bold size={16}/></button>
                          <button onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' }) }} className={`flex-1 flex justify-center p-1.5 rounded-md transition-colors ${selectedElement.fontStyle === 'italic' ? 'bg-white/10 shadow-sm text-white' : 'text-white/40 hover:text-white'}`}><Italic size={16}/></button>
                          <button onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' }) }} className={`flex-1 flex justify-center p-1.5 rounded-md transition-colors ${selectedElement.textDecoration === 'underline' ? 'bg-white/10 shadow-sm text-white' : 'text-white/40 hover:text-white'}`}><Underline size={16}/></button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Transformar</label>
                        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
                          <button onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { textTransform: selectedElement.textTransform === 'uppercase' ? 'none' : 'uppercase' }) }} className={`flex-1 flex justify-center p-1.5 rounded-md transition-colors ${selectedElement.textTransform === 'uppercase' ? 'bg-white/10 shadow-sm text-white' : 'text-white/40 hover:text-white'}`}>
                            <span className="font-bold text-[10px] uppercase">Aa</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block flex justify-between">
                          <span>Espaçamento entre Linhas</span>
                          <span className="text-blue-400">{selectedElement.lineHeight || 1.2}</span>
                        </label>
                        <input 
                          type="range" min="0.5" max="3" step="0.1" 
                          value={selectedElement.lineHeight || 1.2}
                          onPointerDown={() => saveSnapshot()}
                          onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { lineHeight: parseFloat(e.target.value) })}
                          className="w-full accent-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block flex justify-between">
                          <span>Espaçamento entre Letras</span>
                          <span className="text-blue-400">{selectedElement.letterSpacing || 0}</span>
                        </label>
                        <input 
                          type="range" min="-10" max="50" step="1" 
                          value={selectedElement.letterSpacing || 0}
                          onPointerDown={() => saveSnapshot()}
                          onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { letterSpacing: parseInt(e.target.value) })}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {textSubTab === 'effects' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2 block">Curva do Texto (Efeito SVG)</label>
                      <select 
                        value={selectedElement.textPathShape || 'none'}
                        onFocus={() => saveSnapshot()}
                        onChange={(e) => {
                          const shape = e.target.value as any;
                          const updates: any = { textPathShape: shape };
                          if (shape === 'circle' || shape === 'arc') {
                            const diameter = Math.max(selectedElement.width, selectedElement.height, 400);
                            updates.width = diameter;
                            updates.height = diameter;
                          }
                          updateElement(activeSlide.id, selectedElement.id, updates);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-[#F0F0F0] focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                      >
                        <option value="none">Normal (Sem Curva)</option>
                        <option value="arc">Semicírculo (Arco cima)</option>
                        <option value="circle">Círculo Completo</option>
                        <option value="wave">Onda Suave</option>
                      </select>
                    </div>

                    {(selectedElement.textPathShape === 'circle' || selectedElement.textPathShape === 'arc') && (
                      <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block flex justify-between">
                          <span>Diâmetro da Curva</span>
                          <span>{selectedElement.width}px</span>
                        </label>
                        <p className="text-[9px] text-white/40 leading-relaxed italic">
                          Dica: Use para envolver objetos circulares no seu post.
                        </p>
                        <input 
                          type="range" min="100" max="1500" step="10" 
                          value={selectedElement.width}
                          onPointerDown={() => saveSnapshot()}
                          onChange={(e) => {
                            const size = parseInt(e.target.value);
                            updateElement(activeSlide.id, selectedElement.id, { width: size, height: size });
                          }}
                          className="w-full accent-blue-400"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4 block">Contorno (Outline)</label>
                      <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Largura</span>
                          <span className="text-blue-400 text-xs font-bold">{selectedElement.textStrokeWidth || 0}px</span>
                        </div>
                        <input 
                          type="range" min="0" max="20" step="0.5" 
                          value={selectedElement.textStrokeWidth || 0}
                          onPointerDown={() => saveSnapshot()}
                          onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { textStrokeWidth: parseFloat(e.target.value) })}
                          className="w-full accent-blue-500"
                        />
                        <div className="pt-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 block">Cor do Contorno</span>
                           <div className="grid grid-cols-7 gap-2">
                             {colors.map(color => (
                               <button
                                 key={color}
                                 className={`w-full aspect-square rounded-full border transition-transform hover:scale-110 ${selectedElement.textStrokeColor === color ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#161616]' : 'border-white/10'}`}
                                 style={{ backgroundColor: color }}
                                 onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { textStrokeColor: color }) }}
                               />
                             ))}
                           </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4 block">Sombra (Drop Shadow)</label>
                      <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">Desfoque</span>
                            <input 
                              type="range" min="0" max="50" step="1" 
                              value={selectedElement.textShadowBlur || 0}
                              onPointerDown={() => saveSnapshot()}
                              onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { textShadowBlur: parseInt(e.target.value) })}
                              className="w-full accent-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block text-right">{selectedElement.textShadowBlur || 0}px</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">Offset X</span>
                            <input 
                              type="range" min="-50" max="50" step="1" 
                              value={selectedElement.textShadowOffsetX || 0}
                              onPointerDown={() => saveSnapshot()}
                              onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { textShadowOffsetX: parseInt(e.target.value) })}
                              className="w-full accent-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">Offset Y</span>
                            <input 
                              type="range" min="-50" max="50" step="1" 
                              value={selectedElement.textShadowOffsetY || 0}
                              onPointerDown={() => saveSnapshot()}
                              onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { textShadowOffsetY: parseInt(e.target.value) })}
                              className="w-full accent-blue-500"
                            />
                          </div>
                        </div>
                        <div className="pt-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 block">Cor da Sombra</span>
                           <div className="grid grid-cols-7 gap-2">
                             {colors.map(color => (
                               <button
                                 key={color}
                                 className={`w-full aspect-square rounded-full border transition-transform hover:scale-110 ${selectedElement.textShadowColor === color ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#161616]' : 'border-white/10'}`}
                                 style={{ backgroundColor: color }}
                                 onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { textShadowColor: color }) }}
                               />
                             ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Collage Properties */}
            {selectedElement.type === 'collage' && (
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4 block">Layout da Colagem</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['1', '2v', '2h', '3', '4'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { collageLayout: type }) }}
                        className={`aspect-square rounded-lg border flex items-center justify-center transition-all ${selectedElement.collageLayout === type ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                        title={`Layout ${type}`}
                      >
                        <div className="w-4 h-4 border border-current relative">
                          {type === '2v' && <div className="absolute left-1/2 top-0 bottom-0 w-px bg-current" />}
                          {type === '2h' && <div className="absolute top-1/2 left-0 right-0 h-px bg-current" />}
                          {type === '3' && (
                            <>
                              <div className="absolute left-[66%] top-0 bottom-0 w-px bg-current" />
                              <div className="absolute left-[66%] top-1/2 right-0 h-px bg-current" />
                            </>
                          )}
                          {type === '4' && (
                            <>
                              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-current" />
                              <div className="absolute top-1/2 left-0 right-0 h-px bg-current" />
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                   <div className="flex items-center justify-between mb-4">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Espessura da Divisória</label>
                     <span className="text-blue-400 text-xs font-bold">{selectedElement.collageDividerWidth ?? 8}px</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" step="1" 
                     value={selectedElement.collageDividerWidth ?? 8}
                     onPointerDown={() => saveSnapshot()}
                     onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { collageDividerWidth: parseInt(e.target.value) })}
                     className="w-full accent-blue-500"
                   />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Cor da Divisória</label>
                  <div className="flex flex-wrap gap-2">
                    {['#ffffff', '#000000', ...colors.filter(c => c !== '#ffffff' && c !== '#000000')].slice(0, 14).map(color => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110 ${selectedElement.collageDividerColor === color ? 'ring-2 ring-offset-2 ring-offset-[#161616] ring-blue-500' : 'border-white/10'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { collageDividerColor: color }) }}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Shape Properties */}
            {selectedElement.type === 'shape' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Cor</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110 ${selectedElement.backgroundColor === color ? 'ring-2 ring-offset-2 ring-offset-[#161616] ring-blue-500' : 'border-white/10'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { backgroundColor: color }) }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block">Espessura (px)</label>
                  <input 
                    type="number"
                    min="0"
                    max="20"
                    value={selectedElement.strokeWidth || 0}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                    onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { strokeWidth: parseInt(e.target.value) || 0 })}
                  />
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 my-3 block">Cor do Contorno</label>
                  <div className="flex flex-wrap gap-2">
                    {/* Botão para remover contorno */}
                    <button
                      className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shadow-sm transition-transform hover:scale-110 ${!selectedElement.strokeColor || selectedElement.strokeColor === 'transparent' ? 'ring-2 ring-offset-2 ring-offset-[#161616] ring-blue-500' : ''}`}
                      onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { strokeColor: 'transparent', strokeWidth: 0 }) }}
                      title="Remover contorno"
                    >
                      <div className="w-full h-px bg-red-500 rotate-45"></div>
                    </button>

                    {colors.map(color => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110 ${selectedElement.strokeColor === color ? 'ring-2 ring-offset-2 ring-offset-[#161616] ring-blue-500' : 'border-white/10'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => { saveSnapshot(); updateElement(activeSlide.id, selectedElement.id, { strokeColor: color }) }}
                        />
                      ))}
                  </div>

                  {selectedElement.shapeType === 'rectangle' && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block flex justify-between">
                        <span>Arredondamento (px)</span>
                      </label>
                      <input 
                        type="number"
                        min="0"
                        max="50"
                        value={selectedElement.borderRadius || 0}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                        onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { borderRadius: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Common Image Properties (Opacity) */}
            <div>
               <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3 block flex justify-between">
                 <span>Opacidade</span>
                 <span className="text-blue-400">{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
               </label>
               <p className="hidden md:block text-[9px] text-yellow-500/70 mb-2 leading-relaxed">
                  O elemento está com 60% de opacidade no Canvas porque está selecionado. Você verá a opacidade final exata ao desmarcá-lo.
               </p>
               <input 
                 type="range" 
                 min="0" max="1" step="0.01" 
                 value={selectedElement.opacity ?? 1}
                 onPointerDown={() => saveSnapshot()}
                 onChange={(e) => updateElement(activeSlide.id, selectedElement.id, { opacity: parseFloat(e.target.value) })}
                 className="w-full accent-blue-500"
               />
            </div>

          </div>
        )}
            </div>
          </>
        )}

        {activeTab === 'layers' && (
          <div className="p-4 flex flex-col gap-2 relative">
             {activeSlide.elements.length === 0 && (
               <p className="text-xs text-white/40 text-center py-8">Nenhuma camada neste slide.</p>
             )}
             <Reorder.Group 
               axis="y" 
               values={activeSlide.elements.slice().reverse()} 
               onReorder={(newOrder) => setSlideElements(activeSlide.id, [...newOrder].reverse())}
               className="flex flex-col gap-2"
             >
               {activeSlide.elements.slice().reverse().map((el, reversedIndex) => {
                  const actualIndex = activeSlide.elements.length - 1 - reversedIndex;
                  let Icon = TypeIcon;
                  let title = 'Texto';
                  if (el.type === 'shape') { Icon = el.shapeType === 'circle' ? Circle : Square; title = el.shapeType === 'circle' ? 'Círculo' : 'Retângulo'; }
                  if (el.type === 'collage') { Icon = LayoutGrid; title = 'Colagem'; }
                  if (el.type === 'image') { Icon = ImageIcon; title = 'Imagem'; }
                  if (el.type === 'drawing') { Icon = PenTool; title = 'Desenho livre'; }
                  return (
                    <Reorder.Item 
                      key={el.id}
                      value={el}
                      onClick={() => setSelectedElement(el.id)}
                      className={`group flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer relative ${selectedElementId === el.id ? 'bg-blue-500/20 border-blue-500/50' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                         <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 p-1 shrink-0 -ml-2" onClick={(e) => e.stopPropagation()}>
                           <GripVertical size={14} />
                         </div>
                         <div className={`p-2 rounded-md shrink-0 ${selectedElementId === el.id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/50'}`}>
                            <Icon size={14} />
                         </div>
                         <div className="flex flex-col overflow-hidden whitespace-nowrap min-w-0">
                            <span className="text-xs font-bold text-white/90 truncate">{title}</span>
                            {el.type === 'text' && <span className="text-[10px] text-white/50 truncate w-24">{el.text}</span>}
                         </div>
                      </div>
                      
                      <div className={`flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${selectedElementId === el.id ? 'opacity-100' : ''}`}>
                         <button onClick={(e) => { e.stopPropagation(); updateElement(activeSlide.id, el.id, { locked: !el.locked }); }} className="p-1 mr-1 text-white/40 hover:text-yellow-400 transition-colors">
                           {el.locked ? <Lock size={14} /> : <Unlock size={14} />}
                         </button>
                         <div className="flex flex-col mx-1">
                            <button onClick={(e) => { e.stopPropagation(); reorderElement(activeSlide.id, el.id, 'up'); }} disabled={actualIndex === activeSlide.elements.length - 1} className="hover:text-white text-white/40 disabled:opacity-30"><ChevronUp size={14}/></button>
                            <button onClick={(e) => { e.stopPropagation(); reorderElement(activeSlide.id, el.id, 'down'); }} disabled={actualIndex === 0} className="hover:text-white text-white/40 disabled:opacity-30"><ChevronDown size={14}/></button>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); deleteElement(activeSlide.id, el.id); }} className="p-1 ml-1 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </Reorder.Item>
                  );
               })}
             </Reorder.Group>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden md:flex flex-col shrink-0 overflow-hidden border-white/10 w-72 border-l opacity-100`}>
        <div className="w-72 h-full flex flex-col shrink-0">
          {sidebarContent}
        </div>
      </aside>
      
      {showMobile && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
          onClick={() => { setRightSidebarOpen(false); setDrawingMode(false); }}
        />
      )}
      
      <div className="md:hidden">
        {sidebarContent}
      </div>
    </>
  );
}
