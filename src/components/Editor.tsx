import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { Compartment, EditorState } from '@codemirror/state'
import { indentWithTab } from '@codemirror/commands'
import { vim } from '@replit/codemirror-vim'

export interface EditorHandle {
  /** Insert text at the caret, starting on a fresh line when needed. */
  insertAtCursor: (text: string) => void
  focus: () => void
}

interface EditorProps {
  value: string
  onChange: (value: string) => void
  vimEnabled: boolean
  onToggleVim: () => void
}

const editorTheme = EditorView.theme(
  {
    '&': {
      height: '100%',
      backgroundColor: 'var(--ink-1)',
      color: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius)',
      // Clip the Vim status panel so its corners follow the rounded box.
      overflow: 'hidden',
      fontSize: '0.86rem',
    },
    '&.cm-focused': {
      outline: 'none',
      borderColor: 'var(--rust-2)',
      boxShadow: '0 0 0 3px rgba(225, 112, 65, 0.15)',
    },
    '.cm-scroller': {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      lineHeight: '1.6',
      padding: '8px 0',
      borderRadius: 'var(--radius)',
    },
    '.cm-content': { caretColor: 'var(--rust-2)' },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'var(--muted-2)',
      border: 'none',
    },
    '.cm-activeLine': { backgroundColor: 'rgba(255, 255, 255, 0.03)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--muted)' },
    '.cm-cursor': { borderLeftColor: 'var(--rust-2)' },
    '.cm-fat-cursor': { background: 'var(--rust-2)', color: 'var(--ink)' },
    '&:not(.cm-focused) .cm-fat-cursor': {
      background: 'transparent',
      outline: '1px solid var(--rust-2)',
    },
    '.cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'rgba(225, 112, 65, 0.28)',
    },
    '.cm-panels': {
      backgroundColor: 'var(--ink-2)',
      color: 'var(--muted)',
      borderTop: '1px solid var(--line)',
    },
    '.cm-vim-panel': {
      padding: '4px 10px',
      fontFamily: 'ui-monospace, Consolas, monospace',
      fontSize: '0.78rem',
    },
    '.cm-vim-panel input': { color: 'var(--paper)' },
  },
  { dark: true },
)

export const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(
  { value, onChange, vimEnabled, onToggleVim },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const vimCompartment = useRef(new Compartment())
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Create the editor once.
  useEffect(() => {
    if (!hostRef.current) return
    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          // vim() must come first so its keymaps take precedence.
          vimCompartment.current.of(vimEnabled ? [vim({ status: true })] : []),
          basicSetup,
          // Keep Tab in the editor (indent) instead of moving focus away.
          keymap.of([indentWithTab]),
          EditorView.lineWrapping,
          editorTheme,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current(u.state.doc.toString())
          }),
        ],
      }),
    })
    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
    // Initial value/vim are captured on mount; later changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the document in sync with external changes (snippets, templates, clear).
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } })
    }
  }, [value])

  // Toggle vim on/off without recreating the editor.
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({
      effects: vimCompartment.current.reconfigure(vimEnabled ? [vim({ status: true })] : []),
    })
  }, [vimEnabled])

  useImperativeHandle(
    ref,
    () => ({
      insertAtCursor(text: string) {
        const view = viewRef.current
        if (!view) return
        const { from, to } = view.state.selection.main
        const before = view.state.sliceDoc(0, from)
        const needsLeadingNewline = before.length > 0 && !before.endsWith('\n')
        const insert = (needsLeadingNewline ? '\n' : '') + text
        view.dispatch({
          changes: { from, to, insert },
          selection: { anchor: from + insert.length },
          scrollIntoView: true,
        })
        view.focus()
      },
      focus() {
        viewRef.current?.focus()
      },
    }),
    [],
  )

  return (
    <div className="editor">
      <div className="editor-head">
        <span className="panel-label">Diagram code</span>
        <button
          type="button"
          className={`vim-toggle ${vimEnabled ? 'is-active' : ''}`}
          onClick={onToggleVim}
          aria-pressed={vimEnabled}
          title="Toggle Vim keybindings"
        >
          Vim
        </button>
      </div>
      <div className="cm-host" ref={hostRef} />
    </div>
  )
})
