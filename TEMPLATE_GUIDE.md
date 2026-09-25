# Template Creation Guide for AI Agents

This document instructs AI agents on how to create and register new design templates within this application. All templates must follow the defined `Template` interface and adhere to the project's design philosophy of creating "distinctive and polished" layouts.

## 1. The Contract: `Template` Interface

When adding a template to `src/templates.ts`, you must strictly adhere to the `Template` interface:

```typescript
export interface Template {
  id: string; // Unique slug (e.g., 'tech-review')
  name: string; // Readable display name
  format: '1:1' | '4:5' | '9:16'; // Aspect ratio support
  generate: () => Slide[]; // Returns an array of slides
  color: string; // Hex color for UI representation
  category: 'Moderno' | 'Clássico' | 'Tecnológico' | 'Orgânico' | 'Minimalista';
}
```

Every slide and every element placed within a slide **MUST** have a unique ID, generated using the `createId` helper function:
```typescript
const createId = () => Math.random().toString(36).substr(2, 9);
```

## 2. Structural Building Blocks

### A. Slides
A template is an array of `Slide` objects. Each slide consists of:
- `id`: `createId()`
- `background`: `{ type: 'color' | 'image', value: string }`
- `elements`: An array of `SlideElement` objects (see below)

### B. Slide Elements
Elements are positioned absolutely using `x`, `y`, `width`, `height`, and `rotation`.

#### 1. Text Elements
```typescript
{
  type: 'text',
  text: string,
  color: string,
  fontSize: number,
  fontFamily: string,
  fontWeight: 'bold' | 'normal' | 'medium' | string,
  textAlign: 'left' | 'center' | 'right',
  // Optional extras:
  lineHeight: number,
  letterSpacing: number,
  textPathShape: 'none' | 'arc' | 'circle', // For curved text
  opacity: number
}
```

#### 2. Shape Elements
```typescript
{
  type: 'shape',
  shapeType: 'rectangle' | 'circle',
  backgroundColor: string,
  opacity: number
}
```

#### 3. Image Elements
```typescript
{
  type: 'image',
  src: string, // Requires data URL or valid image URL
  opacity: number
}
```

## 3. Step-by-Step Template Creation Process

1.  **Metadata Definition**: Assign a unique `id`, a descriptive `name`, and select an appropriate `category` and `format`.
2.  **Generate Logic**: Implement the `generate` function. Ensure it returns at least one slide.
3.  **Slide Design**:
    - **Background**: Set the `background` for each slide.
    - **Elements**: Design the visual composition.
    - **IDs**: Ensure every single element has `id: createId()`.
4.  **Registration**: Export the new object within the `templates` array in `src/templates.ts`.

## 4. Design Philosophy for AI
To ensure the templates are high-quality:
- **Intentional Spacing**: Avoid generic layouts. Use varying padding and margin to create visual rhythm.
- **Typography**: Pair fonts purposefully (e.g., *Playfair Display* for classic titles with *Inter* for body text). Do not use default fonts for everything.
- **Visual Contrast**: Use bold color choices for shapes or text to guide user focus.
- **Complexity within Layers**: Use overlapping shapes (`rectangle`, `circle`) with varied opacities to create depth.
- **Dry/Solid**: If you find yourself reusing complex groups of elements, design them as a reusable component or structure them cleanly within the `elements` array to ease future maintenance.

## Example Template Registration

```typescript
{
  id: 'new-clean-look',
  name: 'Minimalist Clean',
  format: '1:1',
  color: '#FFFFFF',
  category: 'Minimalista',
  generate: () => [
    {
      id: createId(),
      background: { type: 'color', value: '#FFFFFF' },
      elements: [
        { id: createId(), type: 'shape', shapeType: 'rectangle', backgroundColor: '#000000', x: 50, y: 50, width: 980, height: 980, rotation: 0, opacity: 0.05 },
        { id: createId(), type: 'text', x: 100, y: 400, width: 880, height: 200, rotation: 0, opacity: 1, text: 'Minimalist Design.', color: '#000000', fontSize: 100, fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' }
      ]
    }
  ]
}
```
