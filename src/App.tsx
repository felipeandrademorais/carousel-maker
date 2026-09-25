import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { Canvas } from './components/Canvas';
import { RightSidebar } from './components/RightSidebar';
import { Timeline } from './components/Timeline';
import { TemplateModal } from './components/TemplateModal';
import { Dashboard } from './components/Dashboard';
import { EmojiPicker } from './components/EmojiPicker';
import { ChatAssistant } from './components/ChatAssistant';
import { useCarouselStore } from './store';

export default function App() {
  const { slides, format, undo, redo, view, currentProjectId, saveCurrentProject, isEmojiPickerOpen, setEmojiPickerOpen, addElement, activeSlideId } = useCarouselStore();
  const setActiveSlide = useCarouselStore(s => s.setActiveSlide);

  const handleEmojiSelect = (emoji: string) => {
    if (!activeSlideId) return;
    addElement(activeSlideId, {
      type: 'text',
      text: emoji,
      fontSize: 120,
      width: 150,
      height: 150,
      textAlign: 'center'
    });
  };

  // Autosave when slides or format change with a small debounce to avoid hammering storage
  useEffect(() => {
    if (view === 'editor' && currentProjectId) {
      const timeout = setTimeout(() => {
        saveCurrentProject();
      }, 1000); // Wait 1 second of inactivity before saving
      return () => clearTimeout(timeout);
    }
  }, [slides, format, currentProjectId, view, saveCurrentProject]);

  useEffect(() => {
    if (view === 'editor' && slides.length > 0 && !activeSlideId) {
      setActiveSlide(slides[0].id);
    }
  }, [slides, activeSlideId, setActiveSlide, view]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'editor') return;

      // Ignore if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, view]);

  if (view === 'dashboard') {
    return (
      <>
        <Dashboard />
        <TemplateModal />
      </>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0F0F0F] text-[#F0F0F0] font-sans overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
          <Canvas />
          <Timeline />
        </div>
        
        <RightSidebar />
      </div>

      <ChatAssistant />
      <TemplateModal />
      
      {isEmojiPickerOpen && (
        <EmojiPicker 
          onSelect={handleEmojiSelect}
          onClose={() => setEmojiPickerOpen(false)}
        />
      )}

      {/* Hidden export container */}
      <div id="export-container" className="hidden flex-col gap-4 bg-gray-100 p-8 fixed -z-50 opacity-0 pointer-events-none" style={{ left: '-9999px', top: '-9999px' }}>
         {slides.map(slide => (
           <div 
             key={`export-${slide.id}`} 
             className="export-slide relative bg-white overflow-hidden"
             style={{
               width: 1080,
               height: format === '1:1' ? 1080 : format === '4:5' ? 1350 : format === '9:16' ? 1920 : 1800,
               ...(slide.background.type === 'color' ? { backgroundColor: slide.background.value } : {}),
               ...(slide.background.type === 'image' ? { 
                 backgroundImage: `url(${slide.background.value})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               } : {})
             }}
           >
              {slide.elements.map(el => (
                 <div
                   key={el.id}
                   style={{
                     position: 'absolute',
                     left: el.x,
                     top: el.y,
                     width: el.width,
                     height: el.height,
                     opacity: el.opacity,
                     transform: `rotate(${el.rotation}deg)`,
                     ...(el.type === 'shape' ? { backgroundColor: el.backgroundColor, borderRadius: el.shapeType === 'circle' ? '50%' : 0 } : {}),
                     ...(el.type === 'text' ? { 
                       color: el.color, 
                       fontSize: el.fontSize, 
                       fontFamily: el.fontFamily, 
                       fontWeight: el.fontWeight as any, 
                       textAlign: el.textAlign,
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start'
                     } : {})
                   }}
                 >
                    {el.type === 'text' && el.text}
                    {el.type === 'image' && el.src && (
                       <img src={el.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    {el.type === 'collage' && (
                       <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap' }}>
                          {(el.collageItems || []).map((item, idx) => (
                             <div key={idx} style={{ flex: '1 1 50%', height: '50%', overflow: 'hidden' }}>
                                {item.src && <img src={item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              ))}
           </div>
         ))}
      </div>
    </div>
  );
}
