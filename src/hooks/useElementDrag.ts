import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCarouselStore, SlideElement } from '../store';
import { getSnapPoints, Rect } from '../lib/snapHelper';

export function useElementDrag(
  element: SlideElement,
  slideId: string,
  scale: number,
  isDrawingMode: boolean,
  otherElements: SlideElement[],
  canvasWidth: number,
  canvasHeight: number
) {
  const { setSelectedElement, updateElement, saveSnapshot, setIsDragging: setGlobalIsDragging, setSnapGuides, interactionMode } = useCarouselStore();

  const posRef = useRef({ x: element.x, y: element.y });
  const rawPosRef = useRef({ x: element.x, y: element.y });
  const [localPos, setLocalPos] = useState({ x: element.x, y: element.y });
  const [isDraggingState, setIsDraggingState] = useState(false);
  const isDragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging.current) {
      posRef.current = { x: element.x, y: element.y };
      rawPosRef.current = { x: element.x, y: element.y };
      setLocalPos({ x: element.x, y: element.y });
    }
  }, [element.x, element.y]);

  const canDrag = !isDrawingMode && element.type !== 'drawing';

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDrawingMode || interactionMode === 'pan') return;
    e.stopPropagation();
    setSelectedElement(element.id);
    if (!canDrag) return;
    
    saveSnapshot(); 
    isDragging.current = true;
    setIsDraggingState(true);
    setGlobalIsDragging(true);
    lastPtr.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [isDrawingMode, interactionMode, element.id, setSelectedElement, canDrag, saveSnapshot, setGlobalIsDragging]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    const dx = (e.clientX - lastPtr.current.x) / scale;
    const dy = (e.clientY - lastPtr.current.y) / scale;
    lastPtr.current = { x: e.clientX, y: e.clientY };
    
    rawPosRef.current = { x: rawPosRef.current.x + dx, y: rawPosRef.current.y + dy };
    
    let newX = rawPosRef.current.x;
    let newY = rawPosRef.current.y;

    const rect: Rect = {
      left: newX,
      right: newX + element.width,
      top: newY,
      bottom: newY + element.height,
      centerX: newX + element.width / 2,
      centerY: newY + element.height / 2
    };

    const targets: Rect[] = [
      { left: 0, right: canvasWidth, top: 0, bottom: canvasHeight, centerX: canvasWidth / 2, centerY: canvasHeight / 2 },
      ...otherElements.map(el => ({
        left: el.x,
        right: el.x + el.width,
        top: el.y,
        bottom: el.y + (el.type === 'text' ? el.height || 50 : el.height),
        centerX: el.x + el.width / 2,
        centerY: el.y + (el.type === 'text' ? (el.height || 50) / 2 : el.height / 2)
      }))
    ];

    const { x: snappedX, y: snappedY, guides } = getSnapPoints(rect, targets, 6);

    if (snappedX !== null) newX = snappedX;
    if (snappedY !== null) newY = snappedY;

    setSnapGuides(guides);
    
    posRef.current = { x: newX, y: newY };
    setLocalPos(posRef.current);
    updateElement(slideId, element.id, posRef.current);
  }, [scale, element.width, element.height, canvasWidth, canvasHeight, otherElements, setSnapGuides, slideId, element.id, updateElement]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    isDragging.current = false;
    setIsDraggingState(false);
    setGlobalIsDragging(false);
    setSnapGuides([]);
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, [setGlobalIsDragging, setSnapGuides]);

  return {
    localPos,
    isDraggingState,
    canDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
}
