import React, { useState, useCallback } from 'react';
import { useCarouselStore } from '../store';

export function useDrawing(canvasRef: React.RefObject<HTMLElement>, scale: number, canvasWidth: number, canvasHeight: number) {
  const { addElement, activeSlideId, drawingSettings, isDrawingMode, setSelectedElement } = useCarouselStore();
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  const startDrawing = useCallback((clientX: number, clientY: number) => {
    if (!isDrawingMode || !canvasRef.current) {
       if (!isDrawingMode) setSelectedElement(null);
       return false;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;
    setCurrentPath(`M ${x} ${y}`);
    return true;
  }, [isDrawingMode, scale, canvasRef, setSelectedElement]);

  const drawMove = useCallback((clientX: number, clientY: number) => {
    if (!isDrawingMode || !currentPath || !canvasRef.current) return false;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;
    setCurrentPath(prev => `${prev} L ${x} ${y}`);
    return true;
  }, [isDrawingMode, currentPath, scale, canvasRef]);

  const endDrawing = useCallback(() => {
    if (!isDrawingMode || !currentPath || !activeSlideId) return false;
    addElement(activeSlideId, {
      type: 'drawing',
      path: currentPath,
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      strokeColor: drawingSettings.color,
      strokeWidth: drawingSettings.strokeWidth,
      opacity: drawingSettings.opacity,
      brushType: drawingSettings.brushType,
      rotation: 0
    });
    setCurrentPath(null);
    return true;
  }, [isDrawingMode, currentPath, activeSlideId, addElement, canvasWidth, canvasHeight, drawingSettings]);

  return {
    currentPath,
    startDrawing,
    drawMove,
    endDrawing
  };
}
