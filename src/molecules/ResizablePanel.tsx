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
  overflow: hidden;

  @media (max-width: 639px) {
    width: 100% !important;
  }
`;

const ResizeHandle = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  ${(props) => (props.$side === 'left' ? 'right: -2px;' : 'left: -2px;')}
  width: 4px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 50px;
    background-color: ${theme.colors.border};
    transition: background-color 0.15s ease-in-out;
  }

  &:hover {
    background-color: rgba(40, 167, 69, 0.1);
    
    &::before {
      background-color: ${theme.colors.accent};
    }
  }

  @media (max-width: 639px) {
    display: none;
  }
`;

export default ResizablePanel;
