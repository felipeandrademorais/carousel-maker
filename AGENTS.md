# Project Context & AI Instructions

This document provides persistent context for AI agents working on this project.

## 1. Core Architecture
- **State Management**: Zustand (`src/store.ts`).
- **Canvas Logic**: Custom hooks for drag (`useElementDrag.ts`), interaction (`useCanvasInteraction.ts`), and drawing (`useDrawing.ts`).
- **Full-Stack**: Express server (`server.ts`) handles API and asset serving.

## 2. Feature-Specific Context

### Image Collage System
- **Component**: `CollageElement.tsx`.
- **Layouts**: 1, 2v (vertical), 2h (horizontal), 3, 4.
- **Interactions**: Individual slots support panning and zooming (controlled via `onUpdate` in `CollageSlot`).
- **Adaptability**: Full-screen collages (width=1080) automatically resize their height when the project format (`1:1`, `4:5`, `9:16`, `3:5`) changes via the `setFormat` action in `store.ts`.
- **Selection**: New collages are added **unlocked** by default to allow layout configuration. Interaction with internal buttons is enabled via `pointerEvents: 'auto'` даже for "locked" elements in `CanvasElement.tsx`.

### Storage & Performance (LocalStorage Limits)
- **Problem**: Large project data (especially drawings and images) can exceed the 5MB browser limit (`QuotaExceededError`).
- **Solution**: 
  - `customStorage` wrapper in `src/store.ts` catches quota errors and prevents app crashes.
  - **Data Capping**: The store persists only the last 5 projects and last 2 custom templates.
  - **Auto-Save**: Implemented in `App.tsx` with a **1-second debounce** to prevent excessive disk writes during rapid editing.

### Canvas Element Interaction
- **Event Propagation**: `CanvasElement.tsx` usages `e.stopPropagation()` on `onPointerDown` to prevent the canvas-level "click-to-deselect" logic from firing when an element is clicked.
- **Locked Elements**: Locked elements still have `pointerEvents: 'auto'` to allow children (like collage upload buttons) to receive events, but they are ignored by the primary drag hook (`useElementDrag`).

## 3. Deployment & Environment
- **Port**: Always use port 3000.
- **HMR**: Disabled; the preview refreshes after turn completion.
- **Shared URLs**: Available for testing the "real" user experience outside the preview iframe.
