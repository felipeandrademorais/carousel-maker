export interface SnapGuide {
  type: 'horizontal' | 'vertical';
  position: number;
}

export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

export function getSnapPoints(
  rect: Rect,
  targets: Rect[],
  threshold: number = 8
): { x: number | null; y: number | null; guides: SnapGuide[] } {
  let snapX: number | null = null;
  let snapY: number | null = null;
  const guides: SnapGuide[] = [];

  const xSnapPoints = [
    { value: rect.left, type: 'left' },
    { value: rect.centerX, type: 'centerX' },
    { value: rect.right, type: 'right' },
  ];

  const ySnapPoints = [
    { value: rect.top, type: 'top' },
    { value: rect.centerY, type: 'centerY' },
    { value: rect.bottom, type: 'bottom' },
  ];

  // Check X snapping
  for (const target of targets) {
    const targetXPoints = [
      { value: target.left, type: 'left' },
      { value: target.centerX, type: 'centerX' },
      { value: target.right, type: 'right' },
    ];

    for (const p of xSnapPoints) {
      for (const tp of targetXPoints) {
        if (Math.abs(p.value - tp.value) < threshold) {
          if (p.type === 'left') snapX = tp.value;
          else if (p.type === 'centerX') snapX = tp.value - (rect.right - rect.left) / 2;
          else if (p.type === 'right') snapX = tp.value - (rect.right - rect.left);
          
          guides.push({ type: 'vertical', position: tp.value });
          break;
        }
      }
      if (snapX !== null) break;
    }
    if (snapX !== null) break;
  }

  // Check Y snapping
  for (const target of targets) {
    const targetYPoints = [
      { value: target.top, type: 'top' },
      { value: target.centerY, type: 'centerY' },
      { value: target.bottom, type: 'bottom' },
    ];

    for (const p of ySnapPoints) {
      for (const tp of targetYPoints) {
        if (Math.abs(p.value - tp.value) < threshold) {
          if (p.type === 'top') snapY = tp.value;
          else if (p.type === 'centerY') snapY = tp.value - (rect.bottom - rect.top) / 2;
          else if (p.type === 'bottom') snapY = tp.value - (rect.bottom - rect.top);
          
          guides.push({ type: 'horizontal', position: tp.value });
          break;
        }
      }
      if (snapY !== null) break;
    }
    if (snapY !== null) break;
  }

  return { x: snapX, y: snapY, guides };
}
