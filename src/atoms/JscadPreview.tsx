import React, { useEffect, useRef, useState } from 'react'
import { cameras, prepareRender, drawCommands, entitiesFromSolids } from '@jscad/regl-renderer'
import { stlDeSerializer } from '@jscad/io'


interface JscadPreviewProps {
  jscad: string // This is actually an STL string
}

const JscadPreview: React.FC<JscadPreviewProps> = ({ jscad: stl }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [entities, setEntities] = useState([])

  useEffect(() => {
    if (!stl) {
      setEntities([])
      return
    }
    try {
      const solids = stlDeSerializer.deserialize({ output: 'geometry', addMetadata: false }, stl)
      const entities = entitiesFromSolids({}, solids)
      setEntities(entities)
    } catch (e) {
      console.error("Error deserializing STL", e)
      setEntities([])
    }
  }, [stl])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return;

    // cleanup previous canvas if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    if (!entities.length) return;

    const camera = { ...cameras.perspective.defaults, position: [150, 150, 200] }

    const renderOptions = {
        glOptions: { container },
        camera,
        drawCommands: {
            drawGrid: drawCommands.drawGrid,
            drawAxis: drawCommands.drawAxis,
            drawMesh: drawCommands.drawMesh,
        },
        entities: [
            {
                visuals: { drawCmd: 'drawGrid', show: true, color: [0, 0, 0, 0.1] },
                size: [200, 200],
                ticks: [10, 1],
            },
            {
                visuals: { drawCmd: 'drawAxis', show: true },
            },
            ...entities
        ]
    }
    const render = prepareRender(renderOptions)

    // For now, just a static render.
    render(renderOptions)

  }, [entities, containerRef])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default JscadPreview
