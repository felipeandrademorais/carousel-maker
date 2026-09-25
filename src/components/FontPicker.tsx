import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Font {
  name: string;
  value: string;
}

interface FontPickerProps {
  value: string;
  onSelect: (value: string) => void;
  fonts: Font[];
}

export function FontPicker({ value, onSelect, fonts }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedFont = fonts.find(f => f.value === value) || fonts[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-[#F0F0F0] flex items-center justify-between hover:bg-white/5 transition-colors focus:ring-1 focus:ring-blue-500 outline-none"
        style={{ fontFamily: selectedFont.value }}
      >
        <span className="truncate">{selectedFont.name}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-[#262626] border border-white/10 rounded-lg shadow-2xl z-[100] max-h-60 overflow-y-auto no-scrollbar py-1">
          {fonts.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                onSelect(f.value);
                setIsOpen(false);
              }}
              className={`w-full text-left p-3 text-sm flex items-center justify-between transition-colors hover:bg-white/5 ${value === f.value ? 'bg-blue-500/10 text-blue-400' : 'text-white/80 hover:text-white'}`}
              style={{ fontFamily: f.value }}
            >
              <span className="truncate">{f.name}</span>
              {value === f.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
