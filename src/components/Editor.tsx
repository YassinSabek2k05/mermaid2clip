import { forwardRef } from 'react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(function Editor(
  { value, onChange },
  ref,
) {
  return (
    <div className="editor">
      <label className="panel-label" htmlFor="diagram-code">
        Diagram code
      </label>
      <textarea
        id="diagram-code"
        ref={ref}
        value={value}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type Mermaid code, or pick a snippet from the guide…"
      />
    </div>
  )
})
