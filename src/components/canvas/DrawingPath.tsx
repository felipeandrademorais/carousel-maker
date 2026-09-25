import React from 'react';
import { BrushType } from '../../store';

interface DrawingPathProps {
  id?: string;
  path: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  brushType: BrushType;
  backgroundColor?: string;
}

export const DrawingPath: React.FC<DrawingPathProps> = ({
  id = 'temp',
  path,
  strokeColor,
  strokeWidth,
  opacity,
  brushType,
  backgroundColor
}) => {
  if (brushType === 'neon') {
    return (
      <>
        <path d={path} stroke={strokeColor} strokeWidth={strokeWidth * 2} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.4} filter="blur(4px)" />
        <path d={path} stroke="#fff" strokeWidth={strokeWidth * 0.5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={1} />
      </>
    );
  }
  
  if (brushType === 'double') {
    return (
      <>
        <path d={path} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={path} stroke={backgroundColor || '#fff'} strokeWidth={strokeWidth * 0.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    );
  }
  
  if (brushType === 'outline') {
    return (
      <>
        <path d={path} stroke="#000" strokeWidth={strokeWidth + 4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={path} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    );
  }

  const extraProps: any = {
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  const extraStyle: React.CSSProperties = {};

  if (brushType === 'dashed') {
    extraProps.strokeDasharray = `${strokeWidth * 2} ${strokeWidth * 2}`;
  } else if (brushType === 'dotted') {
    extraProps.strokeDasharray = `0 ${strokeWidth * 2}`;
  } else if (brushType === 'dash-dot') {
    extraProps.strokeDasharray = `${strokeWidth * 3} ${strokeWidth * 2} 0 ${strokeWidth * 2}`;
  } else if (brushType === 'marker') {
    extraProps.strokeLinecap = 'square';
    extraProps.strokeLinejoin = 'bevel';
    extraProps.opacity = 0.5;
  } else if (brushType === 'highlighter') {
    extraProps.strokeLinecap = 'square';
    extraStyle.mixBlendMode = 'multiply';
    extraProps.opacity = 0.6;
  } else if (brushType === 'chalk') {
    extraProps.filter = `url(#chalk)`;
  } else if (brushType === 'grunge') {
    extraProps.filter = `url(#grunge)`;
  } else if (brushType === 'dry-brush') {
    extraProps.filter = `url(#dry-brush)`;
  } else if (brushType === 'rough') {
    extraProps.filter = `url(#rough)`;
  } else if (brushType === 'charcoal') {
    extraProps.filter = `url(#charcoal)`;
  } else if (brushType === 'spray') {
    extraProps.filter = `url(#spray)`;
  }

  return (
    <path 
      d={path} 
      stroke={strokeColor} 
      strokeWidth={strokeWidth} 
      fill="none" 
      opacity={opacity} 
      style={extraStyle}
      {...extraProps} 
    />
  );
};

export const SvgDefFilters: React.FC = () => (
  <defs>
    <filter id="chalk">
      <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="grunge">
      <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="4" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="dry-brush">
      <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="4" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="rough">
      <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
    </filter>
    <filter id="charcoal">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="spray">
      <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
    </filter>
  </defs>
);
