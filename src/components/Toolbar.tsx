interface ToolbarProps {
  canExport: boolean
  canSave: boolean
  onCopy: () => void
  onDownload: () => void
  onSave: () => void
  onImport: () => void
  onClear: () => void
}

export function Toolbar({
  canExport,
  canSave,
  onCopy,
  onDownload,
  onSave,
  onImport,
  onClear,
}: ToolbarProps) {
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
      <button className="btn" onClick={onSave} disabled={!canSave} title="Save the diagram code as a .mmd file">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M5 4h11l3 3v13H5zM8 4v5h7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        Save code
      </button>
      <button className="btn" onClick={onImport} title="Load diagram code from a file">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M12 20V10m0 0 4 4m-4-4-4 4M5 5h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Import
      </button>
      <button className="btn ghost" onClick={onClear}>
        Clear
      </button>
    </div>
  )
}
