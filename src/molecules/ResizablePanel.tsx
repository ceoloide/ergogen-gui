import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Props for the ResizablePanel component.
 */
type ResizablePanelProps = {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number | string;
  side?: 'left' | 'right';
  'data-testid'?: string;
};

/**
 * A resizable panel component with a drag handle.
 * Can be used as a left or right panel in a split layout.
 */
const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  initialWidth = 300,
  minWidth = 100,
  maxWidth = '100%',
  side = 'left',
  'data-testid': dataTestId,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(initialWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      const deltaX = side === 'left' 
        ? e.clientX - startXRef.current 
        : startXRef.current - e.clientX;
      const newWidth = startWidthRef.current + deltaX;
      
      // Calculate max width
      let maxWidthPx: number;
      if (typeof maxWidth === 'string' && maxWidth.includes('%')) {
        const percentage = parseFloat(maxWidth) / 100;
        maxWidthPx = window.innerWidth * percentage;
      } else if (typeof maxWidth === 'string' && maxWidth.includes('px')) {
        maxWidthPx = parseFloat(maxWidth);
      } else if (typeof maxWidth === 'number') {
        maxWidthPx = maxWidth;
      } else {
        maxWidthPx = Infinity;
      }

      const constrainedWidth = Math.max(minWidth, Math.min(newWidth, maxWidthPx));
      setWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizingRef.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = side === 'left'
        ? touch.clientX - startXRef.current
        : startXRef.current - touch.clientX;
      const newWidth = startWidthRef.current + deltaX;
      
      let maxWidthPx: number;
      if (typeof maxWidth === 'string' && maxWidth.includes('%')) {
        const percentage = parseFloat(maxWidth) / 100;
        maxWidthPx = window.innerWidth * percentage;
      } else if (typeof maxWidth === 'string' && maxWidth.includes('px')) {
        maxWidthPx = parseFloat(maxWidth);
      } else if (typeof maxWidth === 'number') {
        maxWidthPx = maxWidth;
      } else {
        maxWidthPx = Infinity;
      }

      const constrainedWidth = Math.max(minWidth, Math.min(newWidth, maxWidthPx));
      setWidth(constrainedWidth);
    };

    const handleTouchEnd = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [minWidth, maxWidth, side]);

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    startWidthRef.current = width;
    
    if ('touches' in e) {
      startXRef.current = e.touches[0].clientX;
    } else {
      startXRef.current = e.clientX;
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <PanelContainer
      ref={containerRef}
      $width={width}
      $side={side}
      data-testid={dataTestId}
    >
      {children}
      <ResizeHandle
        $side={side}
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        data-testid={dataTestId && `${dataTestId}-resize-handle`}
      />
    </PanelContainer>
  );
};

const PanelContainer = styled.div<{ $width: number; $side: 'left' | 'right' }>`
  position: relative;
  width: ${(props) => props.$width}px;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  overflow: visible;
  border-right: ${(props) => (props.$side === 'left' ? `1px solid ${theme.colors.border}` : 'none')};
  border-left: ${(props) => (props.$side === 'right' ? `1px solid ${theme.colors.border}` : 'none')};

  @media (max-width: 639px) {
    width: 100% !important;
    border-right: none;
    border-left: none;
  }
`;

const ResizeHandle = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  ${(props) => (props.$side === 'left' ? 'right: -4px;' : 'left: -4px;')}
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  transition: height .2s cubic-bezier(.2, 1.7, .3, 1) var(--transition-delay), background-color .2s ease var(--transition-delay);
  --active-color: ${theme.colors.accent};
  --transition-delay: 0s;

  &::hover {
    --transition-delay: 0.05s;
  }
  
  &:hover::before, &:hover::after {
    background-color: var(--active-color);
  }
    
  &:hover::after {
    height: 64px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 48px;
    background-color: color-mix(in srgb, #e6e1ff 10%, transparent);
    transition: height .2s cubic-bezier(.2, 1.7, .3, 1) var(--transition-delay), background-color .2s ease var(--transition-delay);
    pointer-events: none;
    box-shadow: 0 -8px 0 0 ${theme.colors.backgroundLight}, 0 8px 0 0 ${theme.colors.backgroundLight};
    opacity: 1;
    border-radius: 99px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background-color: transparent;
    transform: translateX(-50%);
    transition: background-color .2s ease var(--transition-delay);
    pointer-events: none;
  }

  @media (max-width: 639px) {
    display: none;
  }
`;

export default ResizablePanel;
