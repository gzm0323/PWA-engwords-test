# 初中英语单词练习测试机 (English Vocabulary PWA)

A lightweight, installable Progressive Web App for practising the ~1600 words on
the Chinese junior‑high (中考) English vocabulary list. No build step, no backend —
plain HTML/CSS/JS served as static files and deployed to GitHub Pages.

## Modules

| Page | Name | What it does |
|------|------|--------------|
| `index.html` / `EtoC.html` | 看英文写中文 | Random quiz: see English, type Chinese. Live answer checking + show‑answer. |
| `CtoE.html` | 看中文写英文 | Random quiz: see Chinese, type English. |
| `sentence.html` | 勤学不辍 | Click‑to‑match pairing game (English ↔ Chinese). |
| `needle.html` | 铁杵成针 | Drills the harder words (long words / common affixes) plus user‑flagged words. |
| `accumulate.html` | 日积月累 | Read short English stories per word, with Chinese translation. |
| `roots.html` | 水滴石穿 | Learn common Latin/Greek roots & prefixes. |
| `nim.html` | (五子棋) | A standalone Gomoku mini‑game (not in the main nav). |

## How it works

- **Word data** lives in `words_f.js`, a plain script that declares a global
  `const words = ['english', '中文', ...]` (flat array of alternating
  English/Chinese pairs; index `k` ⇒ `words[k*2]` / `words[k*2+1]`).
- **`scripts/word_policy.js`** — weighted random word selection (filters function
  words, down‑weights the top‑100 most common words).
- **`scripts/quiz_storage.js`** — per‑user learning state in `localStorage`
  (难词库 / "needle" pool and 已掌握 / "mastered" pool), CSV export, and answer matching.
- **`scripts/status.js`** — main quiz UI (render cells, live grading, mark
  needle/mastered, toasts, export).
- **`scripts/hard_words.js`** — derives the "harder words" pool for `needle.html`.
- **`scripts/analytics.js`** — shared GA bootstrap, included by every page.
- **`sw.js` / `pwa.js`** — service worker (network‑first for HTML, stale‑while‑revalidate
  for static assets) and its registration.

### Regenerating the word list

`scripts/words.txt` is the original human‑readable source (the 1600‑word list,
grouped by part of speech). `words_f.js` is the flattened, app‑ready version
derived from it. There is no automated build for this yet — if you edit the source
list, regenerate `words_f.js` to match the `const words = [...]` format above.

## Develop / run locally

Any static file server works (a service worker requires `http://`, not `file://`):

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

After changing cached assets, bump `CACHE_NAME` in `sw.js` so clients pick up the
new files.

## Deploy

Pushing to `main` (or `pages`) triggers `.github/workflows/deploy-pages.yml`,
which publishes the repo root to GitHub Pages. In repo **Settings → Pages →
Build and deployment → Source**, choose **GitHub Actions**.
