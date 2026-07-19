import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

interface PreviewProps {
  svg: string
  error: string | null
  rendering: boolean
}

interface Transform {
  scale: number
  x: number
  y: number
}

const MIN_SCALE = 0.2
const MAX_SCALE = 8
const FIT_PADDING = 32
const IDENTITY: Transform = { scale: 1, x: 0, y: 0 }

function clampScale(s: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
}

/** Mermaid renders width:100% + max-width; pin the SVG to its intrinsic size. */
function normalizeSvg(svg: SVGSVGElement) {
  svg.style.maxWidth = 'none'
  const vb = svg.viewBox?.baseVal
  if (vb && vb.width && vb.height) {
    svg.setAttribute('width', String(vb.width))
    svg.setAttribute('height', String(vb.height))
  }
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(function Preview(
  { svg, error, rendering },
  ref,
) {
  const stageRef = useRef<HTMLDivElement>(null)
  const panRef = useRef<HTMLDivElement>(null)
  const [t, setT] = useState<Transform>(IDENTITY)
  const drag = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)

  // Scale the diagram to fit the stage and centre it. currentScale is the scale
  // currently applied in the DOM, used to recover the SVG's natural size.
  const computeFit = useCallback((currentScale: number): Transform => {
    const stage = stageRef.current
    const svgEl = panRef.current?.querySelector('svg') as SVGSVGElement | null
    if (!stage || !svgEl) return IDENTITY
    normalizeSvg(svgEl)
    const sRect = stage.getBoundingClientRect()
    const gRect = svgEl.getBoundingClientRect()
    const natW = gRect.width / currentScale
    const natH = gRect.height / currentScale
    if (!natW || !natH) return IDENTITY
    const fit = Math.min(
      1,
      (sRect.width - FIT_PADDING) / natW,
      (sRect.height - FIT_PADDING) / natH,
    )
    const scale = clampScale(fit > 0 ? fit : 1)
    return {
      scale,
      x: (sRect.width - natW * scale) / 2,
      y: (sRect.height - natH * scale) / 2,
    }
  }, [])

  // Re-fit whenever a new diagram is rendered.
  useLayoutEffect(() => {
    if (!svg) return setT(IDENTITY)
    setT((prev) => computeFit(prev.scale))
  }, [svg, computeFit])

  const reset = useCallback(() => setT((prev) => computeFit(prev.scale)), [computeFit])

  // Zoom toward a point (in stage coordinates), keeping that point fixed.
  const zoomAt = useCallback((px: number, py: number, factor: number) => {
    setT((prev) => {
      const scale = clampScale(prev.scale * factor)
      const applied = scale / prev.scale
      return {
        scale,
        x: px - (px - prev.x) * applied,
        y: py - (py - prev.y) * applied,
      }
    })
  }, [])

  // Non-passive wheel listener so we can prevent the page from scrolling.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = stage.getBoundingClientRect()
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor)
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const zoomByCentre = useCallback(
    (factor: number) => {
      const rect = stageRef.current?.getBoundingClientRect()
      if (!rect) return
      zoomAt(rect.width / 2, rect.height / 2, factor)
    },
    [zoomAt],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    drag.current = { startX: e.clientX, startY: e.clientY, origX: t.x, origY: t.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    setT((prev) => ({
      ...prev,
      x: drag.current!.origX + (e.clientX - drag.current!.startX),
      y: drag.current!.origY + (e.clientY - drag.current!.startY),
    }))
  }
  const endDrag = (e: React.PointerEvent) => {
    drag.current = null
    ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  const showStage = !error && Boolean(svg)

  return (
    <div className="preview">
      <div className="panel-label preview-label">
        <span>Preview</span>
        {rendering && <span className="preview-spinner" aria-label="Rendering" />}
      </div>
      <div className="preview-stage" ref={stageRef}>
        {error ? (
          <div className="preview-error" role="alert">
            <strong>Syntax error</strong>
            <span>{error}</span>
          </div>
        ) : svg ? (
          <div
            className="preview-viewport"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={reset}
          >
            <div
              className="preview-pan"
              ref={panRef}
              style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})` }}
            >
              <div className="preview-svg" ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
          </div>
        ) : (
          <p className="preview-empty">Your diagram will appear here.</p>
        )}

        {showStage && (
          <div className="zoom-controls" role="group" aria-label="Zoom">
            <button className="zoom-btn" onClick={() => zoomByCentre(1 / 1.2)} aria-label="Zoom out">
              −
            </button>
            <button className="zoom-level" onClick={reset} title="Reset to fit">
              {Math.round(t.scale * 100)}%
            </button>
            <button className="zoom-btn" onClick={() => zoomByCentre(1.2)} aria-label="Zoom in">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
