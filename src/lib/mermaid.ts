import mermaid from 'mermaid'

let initialised = false

export function initMermaid() {
  if (initialised) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  })
  initialised = true
}

let renderSeq = 0

export interface RenderResult {
  svg: string
}

/** Render Mermaid source to an SVG string. Throws on invalid syntax. */
export async function renderToSvg(code: string): Promise<RenderResult> {
  initMermaid()
  const id = `mmd-${renderSeq++}`
  const { svg } = await mermaid.render(id, code.trim())
  return { svg }
}

/**
 * Rasterise a rendered <svg> element to a high-resolution PNG blob on a white
 * background.
 *
 * A data URI is used as the image source rather than a blob: URL: blob URLs are
 * treated as tainted cross-origin resources when the page is opened over
 * file://, which makes canvas.toBlob() throw.
 */
export function svgElementToPngBlob(svgEl: SVGSVGElement, scale = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let bbox: { x: number; y: number; width: number; height: number }
    try {
      bbox = svgEl.getBBox()
    } catch {
      bbox = { x: 0, y: 0, width: svgEl.clientWidth || 600, height: svgEl.clientHeight || 400 }
    }

    const pad = 24
    const w = Math.max(bbox.width + pad * 2, 10)
    const h = Math.max(bbox.height + pad * 2, 10)

    const clone = svgEl.cloneNode(true) as SVGSVGElement
    clone.setAttribute('width', String(w))
    clone.setAttribute('height', String(h))
    clone.setAttribute('viewBox', `${bbox.x - pad} ${bbox.y - pad} ${w} ${h}`)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const svgData = new XMLSerializer().serializeToString(clone)
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w * scale
      canvas.height = h * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas not supported'))
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Image export failed'))
        resolve(blob)
      }, 'image/png')
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = dataUrl
  })
}
