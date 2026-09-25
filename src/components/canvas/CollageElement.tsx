import React, { useRef, useState, useEffect } from 'react';
import { useCarouselStore, SlideElement, CollageItem } from '../../store';
import { Plus, Image as ImageIcon, Move, Search } from 'lucide-react';

interface CollageElementProps {
  element: SlideElement;
  slideId: string;
}

const CollageSlot: React.FC<{
  item: CollageItem;
  width: string;
  height: string;
  top: string;
  left: string;
  onUpload: () => void;
  onUpdate: (updates: Partial<CollageItem>) => void;
  dividerWidth: number;
  dividerColor: string;
}> = ({ item, width, height, top, left, onUpload, onUpdate, dividerWidth, dividerColor }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!item.src) return;
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { x: item.x, y: item.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    onUpdate({
      x: startOffset.current.x + dx,
      y: startOffset.current.y + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!item.src) return;
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(1, Math.min(5, item.zoom * delta));
    onUpdate({ zoom: newZoom });
  };

  return (
    <div 
      ref={containerRef}
      className="absolute overflow-hidden group"
      style={{
        width,
        height,
        top,
        left,
        padding: `${dividerWidth / 2}px`,
      }}
    >
      <div 
        className="w-full h-full relative overflow-hidden bg-white/5 border border-white/10 rounded-sm flex items-center justify-center"
        style={{ backgroundColor: !item.src ? undefined : 'black' }}
      >
        {item.src ? (
          <div 
            className="w-full h-full relative cursor-move touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            <img 
              src={item.src} 
              alt="" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${item.zoom}) translate(${item.x / item.zoom}px, ${item.y / item.zoom}px)`,
                pointerEvents: 'none'
              }}
              draggable={false}
            />
            {/* Overlay indicators on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
              <div className="flex gap-4">
                <div className="bg-black/60 p-2 rounded-full text-white backdrop-blur-md border border-white/10">
                  <Move size={16} />
                </div>
                <div className="bg-black/60 p-2 rounded-full text-white backdrop-blur-md border border-white/10">
                  <Search size={16} />
                </div>
              </div>
            </div>
            {/* Change button */}
            <button 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onUpload(); }}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-white hover:text-black rounded-lg text-white transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-md"
            >
              <ImageIcon size={14} />
            </button>
          </div>
        ) : (
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onUpload(); }}
            className="w-14 h-14 rounded-full bg-black border border-white/20 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all duration-300 z-20"
          >
            <Plus size={32} />
          </button>
        )}
      </div>
    </div>
  );
};

export const CollageElement: React.FC<CollageElementProps> = ({ element, slideId }) => {
  const { updateElement } = useCarouselStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSlotIndex = useRef<number | null>(null);

  const handleUploadClick = (index: number) => {
    activeSlotIndex.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlotIndex.current !== null) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const currentItems = element.collageItems || [];
        const index = activeSlotIndex.current!;
        
        // Ensure array is large enough
        const newItems = [...currentItems];
        while (newItems.length <= index) {
          newItems.push({ id: Math.random().toString(36).substr(2, 9), x: 0, y: 0, zoom: 1 });
        }
        
        newItems[index] = {
          ...newItems[index],
          src,
          zoom: 1,
          x: 0,
          y: 0
        };
        
        updateElement(slideId, element.id, { collageItems: newItems });
        e.target.value = ''; // Reset input
      };
      reader.readAsDataURL(file);
    }
  };

  const updateItem = (index: number, updates: Partial<CollageItem>) => {
    const newItems = [...(element.collageItems || [])];
    if (newItems[index]) {
      newItems[index] = { ...newItems[index], ...updates };
      updateElement(slideId, element.id, { collageItems: newItems });
    }
  };

  const layout = element.collageLayout || '1';
  const dividerWidth = element.collageDividerWidth ?? 8;
  const dividerColor = element.collageDividerColor || '#ffffff';

  const getSlotConfig = () => {
    switch (layout) {
      case '2v':
        return [
          { width: '50%', height: '100%', top: '0', left: '0' },
          { width: '50%', height: '100%', top: '0', left: '50%' }
        ];
      case '2h':
        return [
          { width: '100%', height: '50%', top: '0', left: '0' },
          { width: '100%', height: '50%', top: '50%', left: '0' }
        ];
      case '3':
        return [
          { width: '66.66%', height: '100%', top: '0', left: '0' },
          { width: '33.33%', height: '50%', top: '0', left: '66.66%' },
          { width: '33.33%', height: '50%', top: '50%', left: '66.66%' }
        ];
      case '4':
        return [
          { width: '50%', height: '50%', top: '0', left: '0' },
          { width: '50%', height: '50%', top: '0', left: '50%' },
          { width: '50%', height: '50%', top: '50%', left: '0' },
          { width: '50%', height: '50%', top: '50%', left: '50%' }
        ];
      default:
        return [{ width: '100%', height: '100%', top: '0', left: '0' }];
    }
  };

  const slots = getSlotConfig();

  return (
    <div 
      className="w-full h-full relative"
      style={{ backgroundColor: dividerColor }}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {slots.map((slot, index) => {
        const item = element.collageItems?.[index] || {
          id: `slot-${index}`,
          x: 0,
          y: 0,
          zoom: 1
        };
        
        return (
          <CollageSlot
            key={index}
            item={item}
            {...slot}
            dividerWidth={dividerWidth}
            dividerColor={dividerColor}
            onUpload={() => handleUploadClick(index)}
            onUpdate={(updates) => updateItem(index, updates)}
          />
        );
      })}
    </div>
  );
};
