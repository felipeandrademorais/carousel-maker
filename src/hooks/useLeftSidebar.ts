import { useCallback, useRef, useState, useEffect } from 'react';
import { useCarouselStore } from '../store';

export function useLeftSidebar() {
  const { 
    addElement, 
    activeSlideId, 
    isDrawingMode, 
    setDrawingMode, 
    selectedElementId, 
    setRightSidebarOpen, 
    isRightSidebarOpen, 
    setEmojiPickerOpen, 
    isEmojiPickerOpen, 
    interactionMode, 
    setInteractionMode, 
    setChatOpen, 
    isChatOpen,
    showFloatingChatButton,
    setShowFloatingChatButton
  } = useCarouselStore();

  const scrollContainerRef = useRef<HTMLElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.round(scrollLeft + clientWidth) < scrollWidth);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scrollByAmount = useCallback((offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, []);

  const handleAddText = useCallback(() => {
    if (!activeSlideId) return;
    setDrawingMode(false);
    setEmojiPickerOpen(false);
    setInteractionMode('select');
    addElement(activeSlideId, {
      type: 'text',
      text: 'Novo Texto',
      fontSize: 48,
      color: '#000000',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 0,
      textPathShape: 'none',
      width: 400,
      height: 80
    });
  }, [activeSlideId, addElement, setDrawingMode, setEmojiPickerOpen, setInteractionMode]);

  const handleAddShape = useCallback((shapeType: 'rectangle' | 'circle' | 'star' | 'pentagon') => {
    if (!activeSlideId) return;
    setDrawingMode(false);
    setEmojiPickerOpen(false);
    setInteractionMode('select');
    addElement(activeSlideId, {
      type: 'shape',
      shapeType,
      backgroundColor: '#3B82F6',
      width: 200,
      height: 200,
    });
  }, [activeSlideId, addElement, setDrawingMode, setEmojiPickerOpen, setInteractionMode]);

  const handleAddImage = useCallback(() => {
    if (!activeSlideId) return;
    setDrawingMode(false);
    setEmojiPickerOpen(false);
    setInteractionMode('select');
    
    // Simulate image upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          addElement(activeSlideId, {
            type: 'image',
            src: url,
            width: 400,
            height: 400,
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [activeSlideId, addElement, setDrawingMode, setEmojiPickerOpen, setInteractionMode]);

  const handleAddCollage = useCallback(() => {
    const formatHeights = {
      '1:1': 1080,
      '4:5': 1350,
      '9:16': 1920,
      '3:5': 1800
    };
    const currentHeight = formatHeights[useCarouselStore.getState().format] || 1350;

    if (!activeSlideId) return;
    setDrawingMode(false);
    setEmojiPickerOpen(false);
    setInteractionMode('select');
    addElement(activeSlideId, {
      type: 'collage',
      collageLayout: '4',
      collageDividerWidth: 10,
      collageDividerColor: '#FFFFFF',
      collageItems: Array.from({ length: 4 }).map((_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        x: 0,
        y: 0,
        zoom: 1
      })),
      width: 1080,
      height: currentHeight,
      x: 0,
      y: 0,
      locked: false // Change to false to allow initial configuration
    });
  }, [activeSlideId, addElement, setDrawingMode, setEmojiPickerOpen, setInteractionMode]);

  const toggleDrawingMode = useCallback(() => {
    setEmojiPickerOpen(false);
    setInteractionMode('select');
    setDrawingMode(true);
  }, [setDrawingMode, setEmojiPickerOpen, setInteractionMode]);

  const toggleEmojiPicker = useCallback(() => {
    setDrawingMode(false);
    setEmojiPickerOpen(!isEmojiPickerOpen);
  }, [setDrawingMode, setEmojiPickerOpen, isEmojiPickerOpen]);

  const toggleChat = useCallback(() => {
    setEmojiPickerOpen(false);
    if (!showFloatingChatButton) {
      setShowFloatingChatButton(true);
    }
    setChatOpen(!isChatOpen);
  }, [setChatOpen, setEmojiPickerOpen, isChatOpen, showFloatingChatButton, setShowFloatingChatButton]);

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarOpen(!isRightSidebarOpen);
  }, [setRightSidebarOpen, isRightSidebarOpen]);

  return {
    scrollContainerRef,
    canScrollRight,
    canScrollLeft,
    checkScroll,
    scrollByAmount,
    handleAddText,
    handleAddShape,
    handleAddImage,
    handleAddCollage,
    toggleDrawingMode,
    toggleEmojiPicker,
    toggleChat,
    toggleRightSidebar,
    isDrawingMode,
    isEmojiPickerOpen,
    isChatOpen,
    isRightSidebarOpen,
    interactionMode,
    setInteractionMode
  };
}
