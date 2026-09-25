import React from 'react';
import { useCarouselStore, SlideElement } from '../../store';
import { CurvedText } from '../CurvedText';
import { DrawingPath } from './DrawingPath';
import { CollageElement } from './CollageElement';
import { useElementDrag } from '../../hooks/useElementDrag';

interface CanvasElementProps {
  element: SlideElement;
  slideId: string;
  isDrawingMode: boolean;
  scale: number;
  otherElements: SlideElement[];
  canvasWidth: number;
  canvasHeight: number;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({ 
  element, 
  slideId, 
  isDrawingMode, 
  scale, 
  otherElements,
  canvasWidth,
  canvasHeight
}) => {
  const { selectedElementId, setSelectedElement } = useCarouselStore();
  const isSelected = selectedElementId === element.id;
  const isLocked = !!element.locked;

  const handleDragDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Always stop propagation to prevent canvas-level deselection
    if (isLocked) return;
    handlePointerDown(e);
  };

  const handleClick = (e: React.PointerEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    setSelectedElement(element.id);
  };

  const {
    localPos,
    isDraggingState,
    canDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useElementDrag(
    element,
    slideId,
    scale,
    isDrawingMode,
    otherElements,
    canvasWidth,
    canvasHeight
  );

  const style: React.CSSProperties = {
    position: 'absolute',
    left: localPos.x,
    top: localPos.y,
    width: element.width,
    height: element.height,
    opacity: isDraggingState ? 0.6 : (element.opacity ?? 1),
    transform: `rotate(${element.rotation}deg)`,
    transition: isDraggingState ? 'none' : 'opacity 0.2s ease-in-out',
    pointerEvents: 'auto', 
  };

  if (element.type === 'text' && (!element.textPathShape || element.textPathShape === 'none')) {
    style.color = element.color;
    style.fontSize = element.fontSize;
    style.fontFamily = element.fontFamily;
    style.fontWeight = element.fontWeight as any;
    style.textAlign = element.textAlign;
    style.fontStyle = element.fontStyle;
    style.textDecoration = element.textDecoration;
    style.textTransform = element.textTransform as any;
    style.lineHeight = element.lineHeight || 1.2;
    style.letterSpacing = `${element.letterSpacing || 0}px`;
    if (element.textStrokeWidth && element.textStrokeWidth > 0) {
      (style as any).WebkitTextStroke = `${element.textStrokeWidth}px ${element.textStrokeColor || '#000000'}`;
    }
    if (element.textShadowColor) {
      style.textShadow = `${element.textShadowOffsetX || 0}px ${element.textShadowOffsetY || 0}px ${element.textShadowBlur || 0}px ${element.textShadowColor}`;
    }
    style.whiteSpace = 'pre-wrap';
    style.wordBreak = 'break-word';
    style.height = 'auto';
    style.minHeight = element.height;
  }

  if (element.type === 'shape') {
    style.backgroundColor = element.backgroundColor;
    if (element.strokeWidth && element.strokeWidth > 0) {
      style.border = `${element.strokeWidth}px solid ${element.strokeColor || '#000000'}`;
    }
    if (element.shapeType === 'circle') {
      style.borderRadius = '50%';
    } else if (element.shapeType === 'rectangle' && element.borderRadius) {
      style.borderRadius = `${element.borderRadius}px`;
    }
  }

  return (
    <div
      onPointerDown={handleDragDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      style={style}
      className={`${canDrag ? 'cursor-move' : 'cursor-default pointer-events-none'} ${isSelected && !isDrawingMode ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0A0A0A] outline-none z-50' : 'z-auto'} select-none`}
    >
      {element.type === 'text' && (!element.textPathShape || element.textPathShape === 'none') && (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
          {element.text}
        </div>
      )}
      
      {element.type === 'text' && element.textPathShape && element.textPathShape !== 'none' && (
        <CurvedText element={element} />
      )}
      
      {element.type === 'shape' && (
        <div style={{ width: '100%', height: '100%' }} />
      )}
      
      {element.type === 'image' && element.src && (
        <img src={element.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
      )}
      
      {element.type === 'drawing' && element.path && (
        <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <DrawingPath
            id={element.id}
            path={element.path}
            strokeColor={element.strokeColor || '#000'}
            strokeWidth={element.strokeWidth || 5}
            opacity={1}
            brushType={element.brushType || 'solid'}
            backgroundColor={element.backgroundColor}
          />
        </svg>
      )}

      {element.type === 'collage' && (
        <CollageElement element={element} slideId={slideId} />
      )}
    </div>
  );
};
