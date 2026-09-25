import React, { useRef, useMemo } from 'react';
import { useCarouselStore } from '../store';
import { Plus, Minus, Maximize } from 'lucide-react';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { useDrawing } from '../hooks/useDrawing';
import { CanvasElement } from './canvas/CanvasElement';
import { DrawingPath, SvgDefFilters } from './canvas/DrawingPath';

export function Canvas() {
  const { slides, activeSlideId, format, isDrawingMode, drawingSettings, interactionMode, snapGuides, setSelectedElement } = useCarouselStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = format === '1:1' ? 1080 : format === '4:5' ? 1350 : format === '9:16' ? 1920 : 1800;

  const {
    scale,
    setScale,
    offset,
    isPanning,
    handleWheel,
    handleResetZoom,
    startPan,
    handlePanMove,
    stopPan,
    handlePinchStart,
    handlePinchMove,
    handlePinchEnd
  } = useCanvasInteraction(CANVAS_WIDTH, CANVAS_HEIGHT, containerRef);

  const {
    currentPath,
    startDrawing,
    drawMove,
    endDrawing
  } = useDrawing(canvasRef, scale, CANVAS_WIDTH, CANVAS_HEIGHT);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (handlePinchStart(e.pointerId, e.clientX, e.clientY)) return;

    if (e.button === 1 || (e.button === 0 && e.altKey) || interactionMode === 'pan') {
      startPan(e.clientX, e.clientY, e.pointerId, e.currentTarget as HTMLElement);
      return;
    }

    if (!startDrawing(e.clientX, e.clientY)) {
      return;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (handlePinchMove(e.pointerId, e.clientX, e.clientY)) return;
    
    if (isPanning) {
      handlePanMove(e.clientX, e.clientY);
      return;
    }

    drawMove(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    handlePinchEnd(e.pointerId);

    if (isPanning) {
      stopPan(e.pointerId, e.currentTarget as HTMLElement);
      return;
    }

    endDrawing();
  };

  return (
    <main 
      className={`flex-1 bg-[#0A0A0A] overflow-hidden flex items-center justify-center relative touch-none ${interactionMode === 'pan' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''}`} 
      ref={containerRef}
      onWheel={handleWheel}
    >
      {/* Zoom Controls */}
      <div className="absolute left-6 bottom-6 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-full shadow-2xl">
        <button 
          onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          title="Zoom Out"
        >
          <Minus size={18} />
        </button>
        <div className="w-12 text-center text-[11px] font-bold text-white/80 select-none">
          {Math.round(scale * 100)}%
        </div>
        <button 
          onClick={() => setScale(prev => Math.min(5, prev + 0.1))}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          title="Zoom In"
        >
          <Plus size={18} />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button 
          onClick={handleResetZoom}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          title="Fit to Screen"
        >
          <Maximize size={18} />
        </button>
      </div>

      <div 
        ref={canvasRef}
        className={`relative bg-white shadow-2xl overflow-hidden ring-2 ring-blue-500 rounded-lg flex-shrink-0 ${isDrawingMode ? 'cursor-crosshair' : (isPanning || interactionMode === 'pan') ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
          ...(activeSlide.background.type === 'color' ? { backgroundColor: activeSlide.background.value } : {}),
          ...(activeSlide.background.type === 'image' ? { 
            backgroundImage: `url(${activeSlide.background.value})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {})
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <SvgDefFilters />
        </svg>

        {activeSlide.elements.map(element => (
          <CanvasElement 
            key={element.id} 
            element={element} 
            slideId={activeSlide.id} 
            isDrawingMode={isDrawingMode} 
            scale={scale}
            otherElements={activeSlide.elements.filter(el => el.id !== element.id)}
            canvasWidth={CANVAS_WIDTH}
            canvasHeight={CANVAS_HEIGHT}
          />
        ))}
        
        {!isDrawingMode && snapGuides.map((guide, i) => (
          <div
            key={i}
            className="absolute bg-blue-500/40 z-[100] pointer-events-none"
            style={{
              left: guide.type === 'vertical' ? guide.position : 0,
              top: guide.type === 'horizontal' ? guide.position : 0,
              width: guide.type === 'vertical' ? 1 / scale : '100%',
              height: guide.type === 'horizontal' ? 1 / scale : '100%',
            }}
          />
        ))}

        {isDrawingMode && currentPath && (
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }}>
            <DrawingPath
              id="temp"
              path={currentPath}
              strokeColor={drawingSettings.color}
              strokeWidth={drawingSettings.strokeWidth}
              opacity={drawingSettings.opacity}
              brushType={drawingSettings.brushType}
            />
          </svg>
        )}
      </div>
    </main>
  );
}
