import React, { useState, useCallback, useRef, useEffect } from 'react';

export function useCanvasInteraction(
  canvasWidth: number,
  canvasHeight: number,
  containerRef: React.RefObject<HTMLElement>
) {
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  // Touch/Pinch states
  const touchesRef = useRef<{ [key: number]: { x: number; y: number } }>({});
  const lastDistanceRef = useRef<number | null>(null);
  const lastPtr = useRef({ x: 0, y: 0 });

  const handleResetZoom = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const padding = window.innerWidth < 768 ? 20 : 60;
      const availableWidth = clientWidth - padding * 2;
      const availableHeight = clientHeight - padding * 2;
      
      const scaleX = availableWidth / canvasWidth;
      const scaleY = availableHeight / canvasHeight;
      
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
      setOffset({ x: 0, y: 0 });
    }
  }, [canvasWidth, canvasHeight, containerRef]);

  useEffect(() => {
    handleResetZoom();
    window.addEventListener('resize', handleResetZoom);
    return () => window.removeEventListener('resize', handleResetZoom);
  }, [handleResetZoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      e.preventDefault();
      const delta = -e.deltaY;
      const factor = Math.pow(1.1, delta / 100);
      const newScale = Math.max(0.1, Math.min(5, scale * factor));
      
      // Zoom towards mouse position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        
        const scaleChange = newScale / scale;
        
        setOffset(prev => ({
          x: mouseX - (mouseX - prev.x) * scaleChange,
          y: mouseY - (mouseY - prev.y) * scaleChange
        }));
      }
      
      setScale(newScale);
    } else {
      // Pan
      setOffset(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  }, [scale, containerRef]);

  const startPan = useCallback((clientX: number, clientY: number, pointerId: number, target: HTMLElement) => {
    setIsPanning(true);
    lastPtr.current = { x: clientX, y: clientY };
    target.setPointerCapture(pointerId);
  }, []);

  const handlePanMove = useCallback((clientX: number, clientY: number) => {
    if (isPanning) {
      const dx = clientX - lastPtr.current.x;
      const dy = clientY - lastPtr.current.y;
      lastPtr.current = { x: clientX, y: clientY };
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    }
  }, [isPanning]);

  const stopPan = useCallback((pointerId: number, target: HTMLElement) => {
    if (isPanning) {
      setIsPanning(false);
      target.releasePointerCapture(pointerId);
    }
  }, [isPanning]);

  const handlePinchStart = useCallback((pointerId: number, clientX: number, clientY: number) => {
    touchesRef.current[pointerId] = { x: clientX, y: clientY };
    const touchIds = Object.keys(touchesRef.current);
    
    if (touchIds.length === 2) {
      const t1 = touchesRef.current[parseInt(touchIds[0])];
      const t2 = touchesRef.current[parseInt(touchIds[1])];
      lastDistanceRef.current = Math.hypot(t1.x - t2.x, t1.y - t2.y);
      lastPtr.current = { x: (t1.x + t2.x) / 2, y: (t1.y + t2.y) / 2 };
      setIsPanning(false); // Disable single-finger pan during pinch
      return true; // indicates pinch started
    }
    return false;
  }, []);

  const handlePinchMove = useCallback((pointerId: number, clientX: number, clientY: number) => {
    touchesRef.current[pointerId] = { x: clientX, y: clientY };
    const touchIds = Object.keys(touchesRef.current);

    if (touchIds.length === 2) {
      const t1 = touchesRef.current[parseInt(touchIds[0])];
      const t2 = touchesRef.current[parseInt(touchIds[1])];
      
      const distance = Math.hypot(t1.x - t2.x, t1.y - t2.y);
      const centerX = (t1.x + t2.x) / 2;
      const centerY = (t1.y + t2.y) / 2;
      
      if (lastDistanceRef.current !== null && lastPtr.current) {
        // Zoom
        const factor = distance / lastDistanceRef.current;
        const newScale = Math.max(0.1, Math.min(5, scale * factor));
        
        // Pan (midpoint movement)
        const dx = centerX - lastPtr.current.x;
        const dy = centerY - lastPtr.current.y;
        
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const targetX = centerX - rect.left - rect.width / 2;
          const targetY = centerY - rect.top - rect.height / 2;
          
          const scaleChange = newScale / scale;
          setOffset(prev => ({
            x: prev.x + dx - (targetX - prev.x) * (scaleChange - 1),
            y: prev.y + dy - (targetY - prev.y) * (scaleChange - 1)
          }));
        }
        
        setScale(newScale);
      }
      
      lastDistanceRef.current = distance;
      lastPtr.current = { x: centerX, y: centerY };
      return true; // handled pinch
    }
    return false;
  }, [scale, containerRef]);

  const handlePinchEnd = useCallback((pointerId: number) => {
    delete touchesRef.current[pointerId];
    if (Object.keys(touchesRef.current).length < 2) {
      lastDistanceRef.current = null;
    }
  }, []);

  return {
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
  };
}
