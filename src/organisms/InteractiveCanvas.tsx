import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useInteractiveLayoutContext } from '../context/InteractiveLayoutContext';

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #1e1e1e;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none; // Prevent browser gestures
`;

const InteractiveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { state, setViewState } = useInteractiveLayoutContext();
  const { grid, view, activeTool } = state;
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  // Space key state
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Pan State
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [isGrabbing, setIsGrabbing] = useState(false); // For cursor

  // Handle Space Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' && !e.repeat) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle Resize
  useEffect(() => {
    if (!wrapperRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWrapperSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    resizeObserver.observe(wrapperRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || wrapperSize.width === 0 || wrapperSize.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle HiDPI
    const dpr = window.devicePixelRatio || 1;
    // Only set canvas size if it changed to avoid flickering/clearing
    if (canvas.width !== wrapperSize.width * dpr || canvas.height !== wrapperSize.height * dpr) {
        canvas.width = wrapperSize.width * dpr;
        canvas.height = wrapperSize.height * dpr;
    }

    // Scale context to match
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, wrapperSize.width, wrapperSize.height);

    // Apply View Transform
    // view.x/y are offsets from the center of the screen
    const centerX = wrapperSize.width / 2;
    const centerY = wrapperSize.height / 2;

    ctx.save();
    ctx.translate(centerX + view.x, centerY + view.y);
    ctx.scale(view.k, view.k);

    // Draw Grid
    if (grid.enabled) {
      const left = (-view.x - centerX) / view.k;
      const top = (-view.y - centerY) / view.k;
      const right = (centerX - view.x) / view.k;
      const bottom = (centerY - view.y) / view.k;

      const gridSize = grid.size; // mm
      const subDivs = Math.max(1, grid.subdivisions);
      const subSize = gridSize / subDivs;

      // Draw Minor Grid
      if (subSize * view.k > 4) {
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1 / view.k;

        const startX = Math.floor(left / subSize) * subSize;
        const endX = Math.ceil(right / subSize) * subSize;
        const startY = Math.floor(top / subSize) * subSize;
        const endY = Math.ceil(bottom / subSize) * subSize;

        for (let x = startX; x <= endX; x += subSize) {
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
        }
        for (let y = startY; y <= endY; y += subSize) {
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
        }
        ctx.stroke();
      }

      // Draw Major Grid
      ctx.beginPath();
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1.5 / view.k;

      const startX = Math.floor(left / gridSize) * gridSize;
      const endX = Math.ceil(right / gridSize) * gridSize;
      const startY = Math.floor(top / gridSize) * gridSize;
      const endY = Math.ceil(bottom / gridSize) * gridSize;

      for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
      }
      ctx.stroke();
    }

    // Draw Origin
    ctx.beginPath();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2 / view.k;
    const originLen = 10 / view.k;
    ctx.moveTo(-originLen, 0);
    ctx.lineTo(originLen, 0);
    ctx.moveTo(0, -originLen);
    ctx.lineTo(0, originLen);
    ctx.stroke();

    ctx.restore();

  }, [wrapperSize, grid, view]);

  // --- Interaction Logic ---

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault(); // Prevent page scroll

    // Zoom Logic
    const zoomIntensity = 0.001;
    const delta = -e.deltaY;
    const zoomFactor = Math.exp(delta * zoomIntensity);

    // Limit zoom
    const newK = Math.max(0.1, Math.min(50, view.k * zoomFactor));

    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Convert mouse to world coordinates relative to the new origin (center + offset)
    const worldX = (mouseX - centerX - view.x) / view.k;
    const worldY = (mouseY - centerY - view.y) / view.k;

    // Calculate new offset to keep worldX under mouseX
    // mouseX = centerX + newX + worldX * newK
    const newX = mouseX - centerX - worldX * newK;
    const newY = mouseY - centerY - worldY * newK;

    setViewState({ k: newK, x: newX, y: newY });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const isPanTool = activeTool === 'pan';
    const isMiddle = e.button === 1; // Middle click
    const isLeft = e.button === 0;

    // Pan condition: Middle click, OR (Left click AND (Pan Tool OR Space held))
    if (isMiddle || (isLeft && (isPanTool || isSpacePressed))) {
        e.preventDefault();
        isDragging.current = true;
        setIsGrabbing(true);
        lastPos.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
        e.preventDefault();
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };

        setViewState({ x: view.x + dx, y: view.y + dy });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
        isDragging.current = false;
        setIsGrabbing(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  // Cursor style logic
  let cursorStyle = 'default';
  if (isGrabbing) {
      cursorStyle = 'grabbing';
  } else if (activeTool === 'pan' || isSpacePressed) {
      cursorStyle = 'grab';
  }

  return (
    <CanvasWrapper ref={wrapperRef}>
      <Canvas
        ref={canvasRef}
        style={{ cursor: cursorStyle }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      />
    </CanvasWrapper>
  );
};

export default InteractiveCanvas;
