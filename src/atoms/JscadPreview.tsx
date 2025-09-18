import React, { useEffect, useRef } from 'react'

// De-facto dependency injection
// See public/index.html

interface JscadPreviewProps {
  jscad: string
}

const JscadPreview: React.FC<JscadPreviewProps> = ({ jscad }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("JscadPreview: useEffect called")
    if (containerRef.current) {
      console.log("JscadPreview: containerRef.current is not null")
      try {
        const viewer = new (window as any).OpenJscad.Viewer(containerRef.current, {
          name: 'jscad-preview',
          color: [0.2, 0.2, 0.2, 1],
        })
        console.log("JscadPreview: viewer created")
        viewer.add(jscad)
        console.log("JscadPreview: jscad added to viewer")
      } catch (e) {
        console.error("JscadPreview: error creating viewer", e)
      }
    }
  }, [jscad])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default JscadPreview
