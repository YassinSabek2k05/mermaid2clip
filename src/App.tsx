import { useCallback, useEffect, useRef, useState } from 'react'
import { Header } from './components/Header'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
import { Toolbar } from './components/Toolbar'
import { Guide } from './components/Guide'
import { renderToSvg, svgElementToPngBlob } from './lib/mermaid'
import { DEFAULT_DIAGRAM, type Snippet } from './data/guide'

type ToastKind = 'ok' | 'err'
interface Toast {
  message: string
  kind: ToastKind
}

const STORAGE_KEY = 'mermaid2clip:code'

function loadInitialCode(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_DIAGRAM
  } catch {
    return DEFAULT_DIAGRAM
  }
}

export default function App() {
  const [code, setCode] = useState(loadInitialCode)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [rendering, setRendering] = useState(false)
  const [guideOpen, setGuideOpen] = useState(() => window.innerWidth >= 1100)
  const [toast, setToast] = useState<Toast | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const svgHostRef = useRef<HTMLDivElement>(null)

  const showToast = useCallback((message: string, kind: ToastKind) => {
    setToast({ message, kind })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  // Persist the code so a reload keeps your work.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* storage may be unavailable in private mode */
    }
  }, [code])

  // Debounced live render.
  useEffect(() => {
    const trimmed = code.trim()
    if (!trimmed) {
      setSvg('')
      setError(null)
      return
    }
    setRendering(true)
    const handle = setTimeout(async () => {
      try {
        const { svg } = await renderToSvg(trimmed)
        setSvg(svg)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setRendering(false)
      }
    }, 350)
    return () => clearTimeout(handle)
  }, [code])

  const insertSnippet = useCallback(
    (snippet: Snippet) => {
      const el = textareaRef.current

      if (snippet.template) {
        const replace =
          !code.trim() ||
          window.confirm('Replace the current diagram with this template?')
        if (!replace) return
        setCode(snippet.code)
        showToast(`${snippet.label} inserted`, 'ok')
        requestAnimationFrame(() => el?.focus())
        return
      }

      if (!el) {
        setCode((c) => (c ? `${c}\n${snippet.code}` : snippet.code))
        return
      }

      const start = el.selectionStart
      const end = el.selectionEnd
      const before = code.slice(0, start)
      const after = code.slice(end)
      const needsLeadingNewline = before.length > 0 && !before.endsWith('\n')
      const insertText = (needsLeadingNewline ? '\n' : '') + snippet.code
      const next = before + insertText + after
      setCode(next)
      showToast('Snippet added', 'ok')

      const caret = before.length + insertText.length
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(caret, caret)
      })
    },
    [code, showToast],
  )

  const getSvgEl = useCallback((): SVGSVGElement | null => {
    return svgHostRef.current?.querySelector('svg') ?? null
  }, [])

  const handleCopy = useCallback(async () => {
    const svgEl = getSvgEl()
    if (!svgEl) return showToast('Render a diagram first', 'err')
    try {
      const blob = await svgElementToPngBlob(svgEl)
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      showToast('Image copied to clipboard', 'ok')
    } catch {
      showToast('Copy blocked — try Download instead', 'err')
    }
  }, [getSvgEl, showToast])

  const handleDownload = useCallback(async () => {
    const svgEl = getSvgEl()
    if (!svgEl) return showToast('Render a diagram first', 'err')
    try {
      const blob = await svgElementToPngBlob(svgEl)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'diagram.png'
      a.click()
      URL.revokeObjectURL(url)
      showToast('PNG downloaded', 'ok')
    } catch {
      showToast('Export failed', 'err')
    }
  }, [getSvgEl, showToast])

  const handleClear = useCallback(() => {
    setCode('')
    requestAnimationFrame(() => textareaRef.current?.focus())
  }, [])

  const canExport = Boolean(svg) && !error

  return (
    <div className={`app ${guideOpen ? 'guide-open' : ''}`}>
      <Header guideOpen={guideOpen} onToggleGuide={() => setGuideOpen((o) => !o)} />

      <div className="layout">
        <main className="workspace">
          <div className="pane pane-editor">
            <Editor ref={textareaRef} value={code} onChange={setCode} />
            <Toolbar
              canExport={canExport}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onClear={handleClear}
            />
          </div>
          <div className="pane pane-preview">
            <Preview ref={svgHostRef} svg={svg} error={error} rendering={rendering} />
          </div>
        </main>

        <Guide open={guideOpen} onClose={() => setGuideOpen(false)} onInsert={insertSnippet} />
        {guideOpen && (
          <div className="guide-scrim" onClick={() => setGuideOpen(false)} aria-hidden="true" />
        )}
      </div>

      {toast && <div className={`toast toast-${toast.kind}`}>{toast.message}</div>}
    </div>
  )
}
