# Echt brand assets

Vector sources match [`components/EchtLogo.tsx`](../../components/EchtLogo.tsx) (ECHT wordmark + green accent dot).

## PNG (download / decks)

| File | Use |
|------|-----|
| `echt-wordmark-dark.png` | Light backgrounds (~880px wide) |
| `echt-wordmark-white.png` | Dark / hero backgrounds |
| `echt-icon-dark-512.png` | App icon / favicon-style square mark (512×512) |

## SVG (same art, scalable)

- `echt-wordmark-dark.svg`, `echt-wordmark-white.svg`, `echt-icon-dark.svg`

## Regenerate PNGs from SVG

```bash
cd frontend && node scripts/generate-logo-pngs.mjs
```

Requires `sharp` (devDependency).

## Favicon (browser tab)

- **File:** [`app/icon.png`](../../app/icon.png) — Next.js App Router uses this automatically.
- **Source vector:** `echt-icon-favicon.svg` (E mark + green dot on white rounded tile).
- Regenerate: `node scripts/generate-favicon.mjs`
