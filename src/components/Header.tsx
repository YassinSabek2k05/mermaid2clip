interface HeaderProps {
  guideOpen: boolean
  onToggleGuide: () => void
}

export function Header({ guideOpen, onToggleGuide }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M3 17c3-6 6-9 9-9s6 3 9 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="3" cy="17" r="2.4" fill="currentColor" />
            <circle cx="21" cy="17" r="2.4" fill="currentColor" />
            <circle cx="12" cy="8" r="2.4" fill="currentColor" />
          </svg>
        </span>
        <div className="brand-text">
          <h1>
            Mermaid <span className="accent">2</span> Clip
          </h1>
          <p>Diagrams from code, copied in one click</p>
        </div>
      </div>

      <button
        className={`guide-toggle ${guideOpen ? 'is-active' : ''}`}
        onClick={onToggleGuide}
        aria-pressed={guideOpen}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path
            d="M4 5h16M4 12h16M4 19h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Guide
      </button>
    </header>
  )
}
