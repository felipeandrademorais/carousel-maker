import React from 'react';
import { SlideElement } from '../store';

export function CurvedText({ element }: { element: SlideElement }) {
  const text = element.text || '';
  const textId = `text-path-${element.id}`;
  const width = element.width;
  const height = element.height;
  
  // Basic geometry for paths based on standardized bounding boxes
  let d = '';
  
  if (element.textPathShape === 'circle') {
    // Start at bottom center slightly offset, clockwise to top, then clockwise to bottom
    const r = Math.min(width, height) / 2 - 10;
    const cx = width / 2;
    const cy = height / 2;
    // Sweep=1 is clockwise. Left half goes bottom-to-top, right half goes top-to-bottom
    d = `M ${cx - 0.1}, ${cy + r} A ${r},${r} 0 0,1 ${cx},${cy - r} A ${r},${r} 0 0,1 ${cx + 0.1},${cy + r}`;
  } 
  else if (element.textPathShape === 'arc') {
    // Semicircle arc pointing upwards
    const r = Math.min(width, height) / 2 - 10;
    const cx = width / 2;
    const cy = height / 2 + r/2; // slight shift down
    d = `M ${cx - r}, ${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`;
  }
  else if (element.textPathShape === 'wave') {
    // Sine wave roughly spanning the width
    const w = width;
    const h = height / 4;
    const midY = height / 2;
    d = `M 10,${midY} Q ${w * 0.25},${midY - h} ${w * 0.5},${midY} T ${w - 10},${midY}`;
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <path id={textId} d={d} fill="none" stroke="none" />
      <text
        fill={element.color}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        fontWeight={element.fontWeight}
        style={{
          fontStyle: element.fontStyle,
          textDecoration: element.textDecoration,
          textTransform: element.textTransform as any,
          letterSpacing: `${element.letterSpacing || 0}px`
        }}
      >
        <textPath href={`#${textId}`} startOffset={element.textAlign === 'center' ? '50%' : element.textAlign === 'right' ? '100%' : '0%'} textAnchor={element.textAlign === 'center' ? 'middle' : element.textAlign === 'right' ? 'end' : 'start'}>
          {text}
        </textPath>
      </text>
    </svg>
  );
}
