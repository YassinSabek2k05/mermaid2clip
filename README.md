# Mermaid 2 Clip

An installable web app for turning [Mermaid](https://mermaid.js.org/)
diagram code into an image you can copy straight to your clipboard or download as
a PNG — with a built-in **syntax guide** so you never have to memorise the syntax.

**Live:** <https://mermaid2clip.yassinsabek.dev>

## Features

- **Live preview** — diagrams re-render as you type.
- **Copy image / Download PNG** — high-resolution export on a white background.
- **Syntax guide** — clickable snippets and full templates for flowcharts,
  sequence, class, state, ER, Gantt, pie, mindmap, git graph and user-journey
  diagrams. Click to insert at the cursor; no memorising required.
- **Code editor** — CodeMirror with line numbers, and an optional **Vim mode**
  (toggle in the editor header) with a modal status bar. Your choice is remembered.
- **PWA** — installable and works offline once loaded.
- Your latest diagram is saved locally between sessions.

## Development

```bash
npm install
npm run icons   # generate PWA icons (once, or after changing the logo)
npm run dev     # start the dev server
npm run build   # production build into dist/
```

## Deployment

Deployed with **Cloudflare Workers** (static assets) on the custom domain
<https://mermaid2clip.yassinsabek.dev>.

Because the app is served from the domain root, `base` in `vite.config.ts` must
be `/` (not a subpath).

## Tech

React + TypeScript + Vite, `mermaid` for rendering, CodeMirror + `@replit/codemirror-vim`
for the editor, and `vite-plugin-pwa` for the service worker and manifest.
