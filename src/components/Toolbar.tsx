interface ToolbarProps {
  canExport: boolean
  onCopy: () => void
  onPreview: () => void
  onDownload: () => void
}

export function Toolbar({ canExport, onCopy, onPreview, onDownload }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button className="btn primary" onClick={onCopy} disabled={!canExport}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M5 15V5a2 2 0 0 1 2-2h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Copy image
      </button>
      <button className="btn" onClick={onPreview} disabled={!canExport}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
        Preview image
      </button>
      <button className="btn" onClick={onDownload} disabled={!canExport}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download PNG
      </button>
    </div>
  )
}
