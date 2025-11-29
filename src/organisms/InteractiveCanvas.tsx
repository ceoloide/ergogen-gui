import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useInteractiveLayoutContext } from '../context/InteractiveLayoutContext';
import { useConfigContext } from '../context/ConfigContext';

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

interface Props {
  onCursorMove?: (x: number, y: number, snappedX?: number, snappedY?: number) => void;
}

const getPoints = (obj: any): any[] => {
  let points: any[] = [];
  if (!obj) return points;
  if (typeof obj.x === 'number' && typeof obj.y === 'number') {
    points.push(obj);
    return points; // A point is a leaf
  }
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      points = points.concat(getPoints(obj[key]));
    }
  }
  return points;
};

const InteractiveCanvas = React.memo(({ onCursorMove }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configContext = useConfigContext();
  const results = configContext?.results;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { state, setViewState } = useInteractiveLayoutContext();
  const { grid, view, activeTool } = state;
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  // Cursor state for rendering cross
  const [cursorPos, setCursorPos] = useState<{ x: number, y: number } | null>(null);

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
    ctx.scale(view.k, -view.k); // Flip Y Axis

    // Draw Grid
    if (grid.enabled) {
      // Inverse transform for bounds
      // Screen = Center + View - World * k (for Y)
      // Screen Top = 0. World Top = (CenterY + ViewY) / k
      // Screen Bottom = H. World Bottom = (CenterY + ViewY - H) / k
      // Wait, let's trust the math:
      // wx = (sx - cx - vx) / k
      // wy = -(sy - cy - vy) / k

      const left = (-view.x - centerX) / view.k;
      const right = (centerX - view.x) / view.k;
      const top = (centerY + view.y) / view.k; // Screen 0 maps to this world Y
      const bottom = (centerY + view.y - wrapperSize.height) / view.k; // Screen H maps to this world Y

      // Note: Top > Bottom in World Y (since Y goes Up)

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
        const startY = Math.floor(bottom / subSize) * subSize;
        const endY = Math.ceil(top / subSize) * subSize;

        for (let x = startX; x <= endX; x += subSize) {
            ctx.moveTo(x, bottom);
            ctx.lineTo(x, top);
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
      const startY = Math.floor(bottom / gridSize) * gridSize;
      const endY = Math.ceil(top / gridSize) * gridSize;

      for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, bottom);
        ctx.lineTo(x, top);
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
      }
      ctx.stroke();
    }

    // Draw Points
    if (results?.points) {
      const points = getPoints(results.points);
      ctx.strokeStyle = '#ff6d6d'; // Red crosshair
      ctx.lineWidth = 1 / view.k;
      const crossSize = 3 / view.k;

      points.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.r || 0) * Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(-crossSize, 0);
        ctx.lineTo(crossSize, 0);
        ctx.moveTo(0, -crossSize);
        ctx.lineTo(0, crossSize);
        ctx.stroke();

        ctx.restore();
      });
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

    // Draw Snap Cross
    if (grid.snapEnabled && cursorPos) {
      const crossSize = 8 / view.k;
      ctx.beginPath();
      ctx.strokeStyle = '#28a745'; // Green accent
      ctx.lineWidth = 1.5 / view.k;
      ctx.moveTo(cursorPos.x - crossSize, cursorPos.y);
      ctx.lineTo(cursorPos.x + crossSize, cursorPos.y);
      ctx.moveTo(cursorPos.x, cursorPos.y - crossSize);
      ctx.lineTo(cursorPos.x, cursorPos.y + crossSize);
      ctx.stroke();
    }

    ctx.restore();

  }, [wrapperSize, grid, view, cursorPos, results]);

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
    const worldY = -(mouseY - centerY - view.y) / view.k; // Flipped Y

    // Calculate new offset to keep worldX under mouseX
    // mouseX = centerX + newX + worldX * newK
    // mouseY = centerY + newY - worldY * newK
    const newX = mouseX - centerX - worldX * newK;
    const newY = mouseY - centerY + worldY * newK;

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
    // Calculate world coordinates for status bar
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const worldX = (mouseX - centerX - view.x) / view.k;
      const worldY = -(mouseY - centerY - view.y) / view.k; // Flipped Y

      // Calculate snapped coordinates
      let snappedX = worldX;
      let snappedY = worldY;

      if (grid.snapEnabled) {
        const gridSize = grid.size;
        const subDivs = Math.max(1, grid.subdivisions);
        const subSize = gridSize / subDivs;
        snappedX = Math.round(worldX / subSize) * subSize;
        snappedY = Math.round(worldY / subSize) * subSize;
        setCursorPos({ x: snappedX, y: snappedY });
      } else {
        setCursorPos(null);
      }

      if (onCursorMove) {
        onCursorMove(worldX, worldY, snappedX, snappedY);
      }
    }

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

  const handlePointerLeave = () => {
    setCursorPos(null);
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
        onPointerLeave={(e) => {
          handlePointerUp(e);
          handlePointerLeave();
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </CanvasWrapper>
  );
});

export default InteractiveCanvas;
