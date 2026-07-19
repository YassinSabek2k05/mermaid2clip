import { useCallback, useEffect, useRef, useState } from 'react'
import { Header } from './components/Header'
import { Editor, type EditorHandle } from './components/Editor'
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
const VIM_KEY = 'mermaid2clip:vim'

function loadInitialCode(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_DIAGRAM
  } catch {
    return DEFAULT_DIAGRAM
  }
}

function loadInitialVim(): boolean {
  try {
    return localStorage.getItem(VIM_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [code, setCode] = useState(loadInitialCode)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [rendering, setRendering] = useState(false)
  const [guideOpen, setGuideOpen] = useState(() => window.innerWidth >= 1100)
  const [vimEnabled, setVimEnabled] = useState(loadInitialVim)
  const [toast, setToast] = useState<Toast | null>(null)

  const editorRef = useRef<EditorHandle>(null)
  const svgHostRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = useCallback((message: string, kind: ToastKind) => {
    setToast({ message, kind })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  // Stop the Escape key from closing the installed PWA (Brave/Chrome
  // standalone). CodeMirror handles its own Escape (e.g. Vim mode) and stops
  // propagation, so this only fires when the editor hasn't consumed it.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      // Only close the guide when not typing in the editor, so a Vim user's
      // Esc (exit insert mode) doesn't also dismiss the guide.
      const inEditor = (e.target as Element | null)?.closest?.('.cm-editor')
      if (!inEditor) setGuideOpen((open) => (open ? false : open))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Persist the code so a reload keeps your work.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* storage may be unavailable in private mode */
    }
  }, [code])

  // Remember the Vim preference.
  useEffect(() => {
    try {
      localStorage.setItem(VIM_KEY, vimEnabled ? '1' : '0')
    } catch {
      /* storage may be unavailable in private mode */
    }
  }, [vimEnabled])

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
      if (snippet.template) {
        const replace =
          !code.trim() || window.confirm('Replace the current diagram with this template?')
        if (!replace) return
        setCode(snippet.code)
        showToast(`${snippet.label} inserted`, 'ok')
        requestAnimationFrame(() => editorRef.current?.focus())
        return
      }

      editorRef.current?.insertAtCursor(snippet.code)
      showToast('Snippet added', 'ok')
    },
    [code, showToast],
  )

  const getSvgEl = useCallback((): SVGSVGElement | null => {
    return svgHostRef.current?.querySelector('svg') ?? null
  }, [])

  const handleCopy = useCallback(async () => {
    const svgEl = getSvgEl()
    if (!svgEl) return showToast('Render a diagram first', 'err')
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
      return showToast('Clipboard not supported here — use Download PNG', 'err')
    }
    try {
      // Pass the blob Promise straight into ClipboardItem so the write is
      // issued synchronously within the click's transient activation. Samsung
      // Internet strictly enforces this and silently rejects if the async PNG
      // conversion runs *before* clipboard.write().
      const item = new ClipboardItem({ 'image/png': svgElementToPngBlob(svgEl) })
      await navigator.clipboard.write([item])
      showToast('Image copied to clipboard', 'ok')
    } catch {
      // Fallback for engines that don't accept a Promise inside ClipboardItem.
      try {
        const blob = await svgElementToPngBlob(svgEl)
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        showToast('Image copied to clipboard', 'ok')
      } catch (err) {
        const name = err instanceof Error ? err.name : ''
        showToast(`Copy failed${name ? ` (${name})` : ''} — use Download PNG`, 'err')
      }
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
    requestAnimationFrame(() => editorRef.current?.focus())
  }, [])

  const handleCopyCode = useCallback(async () => {
    if (!code.trim()) return showToast('Nothing to copy', 'err')
    try {
      await navigator.clipboard.writeText(code)
      showToast('Code copied to clipboard', 'ok')
    } catch {
      showToast('Copy blocked — select and copy manually', 'err')
    }
  }, [code, showToast])

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text) return showToast('Clipboard is empty', 'err')
      editorRef.current?.insertText(text)
      showToast('Pasted from clipboard', 'ok')
    } catch {
      showToast('Paste blocked — use Ctrl/Cmd+V instead', 'err')
    }
  }, [showToast])

  const handleSaveCode = useCallback(() => {
    if (!code.trim()) return showToast('Nothing to save', 'err')
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagram.mmd'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Code saved', 'ok')
  }, [code, showToast])

  const handleImportClick = useCallback(() => fileInputRef.current?.click(), [])

  const handleFileChosen = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = '' // allow re-importing the same file
      if (!file) return

      // Warn before discarding meaningful unsaved work.
      const current = code.trim()
      const hasWork = current.length > 0 && current !== DEFAULT_DIAGRAM.trim()
      if (
        hasWork &&
        !window.confirm(
          `Replace the current diagram with "${file.name}"? Your unsaved changes will be lost.`,
        )
      ) {
        return
      }

      try {
        const text = await file.text()
        setCode(text)
        showToast(`Imported ${file.name}`, 'ok')
        requestAnimationFrame(() => editorRef.current?.focus())
      } catch {
        showToast('Could not read file', 'err')
      }
    },
    [code, showToast],
  )

  const canExport = Boolean(svg) && !error

  return (
    <div className={`app ${guideOpen ? 'guide-open' : ''}`}>
      <Header guideOpen={guideOpen} onToggleGuide={() => setGuideOpen((o) => !o)} />

      <div className="layout">
        <main className="workspace">
          <div className="pane pane-editor">
            <Editor
              ref={editorRef}
              value={code}
              onChange={setCode}
              hasContent={Boolean(code.trim())}
              onCopyAll={handleCopyCode}
              onPaste={handlePaste}
              onSave={handleSaveCode}
              onImport={handleImportClick}
              onClear={handleClear}
              vimEnabled={vimEnabled}
              onToggleVim={() => setVimEnabled((v) => !v)}
            />
            <Toolbar canExport={canExport} onCopy={handleCopy} onDownload={handleDownload} />
            <input
              ref={fileInputRef}
              type="file"
              accept=".mmd,.mermaid,.txt,text/plain"
              hidden
              onChange={handleFileChosen}
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
