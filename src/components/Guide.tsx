import { useState } from 'react'
import { GUIDE, type Snippet } from '../data/guide'

interface GuideProps {
  open: boolean
  onClose: () => void
  onInsert: (snippet: Snippet) => void
}

export function Guide({ open, onClose, onInsert }: GuideProps) {
  const [activeId, setActiveId] = useState(GUIDE[0].id)
  const active = GUIDE.find((s) => s.id === activeId) ?? GUIDE[0]

  return (
    <aside className={`guide ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="guide-head">
        <div>
          <h2>Syntax guide</h2>
          <p>Pick a diagram type, then click a snippet to add it.</p>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close guide">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <nav className="guide-tabs" aria-label="Diagram types">
        {GUIDE.map((section) => (
          <button
            key={section.id}
            className={`guide-tab ${section.id === activeId ? 'is-active' : ''}`}
            onClick={() => setActiveId(section.id)}
          >
            {section.title}
          </button>
        ))}
      </nav>

      <div className="guide-body">
        <p className="guide-blurb">{active.blurb}</p>
        <ul className="snippet-list">
          {active.snippets.map((snippet, i) => (
            <li key={i}>
              <button className="snippet" onClick={() => onInsert(snippet)}>
                <span className="snippet-top">
                  <span className="snippet-label">{snippet.label}</span>
                  {snippet.template && <span className="snippet-badge">template</span>}
                </span>
                <span className="snippet-desc">{snippet.description}</span>
                <code className="snippet-code">{snippet.code}</code>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
