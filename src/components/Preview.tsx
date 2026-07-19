import { forwardRef } from 'react'

interface PreviewProps {
  svg: string
  error: string | null
  rendering: boolean
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(function Preview(
  { svg, error, rendering },
  ref,
) {
  return (
    <div className="preview">
      <div className="panel-label preview-label">
        <span>Preview</span>
        {rendering && <span className="preview-spinner" aria-label="Rendering" />}
      </div>
      <div className="preview-stage">
        {error ? (
          <div className="preview-error" role="alert">
            <strong>Syntax error</strong>
            <span>{error}</span>
          </div>
        ) : svg ? (
          <div className="preview-svg" ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <p className="preview-empty">Your diagram will appear here.</p>
        )}
      </div>
    </div>
  )
})
