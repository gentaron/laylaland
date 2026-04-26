# Layla Land — Layla Virel Nova Official Site

> The official character portal for **Layla Virel Nova** — *Pink Voltage*, legendary warrior of the EDU universe (E325–E522).

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_BADGE_ID/deploy-status)](https://laylaland.netlify.app)

> 🇯🇵 コンテンツは日本語。English localization is planned.

---

## What is Layla Land?

A dedicated cyberpunk-themed web portal for **Layla Virel Nova**, one of the central characters of the [Eternal Dominion Universe (EDU)](https://github.com/gentaron/edu). The site features her full story, battle stats, ranking, gallery, and an AI chatbot driven by her lore.

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Main portal — character overview & navigation |
| About | `about.html` | Lore, biography, abilities, timeline |
| Colosseum | `colosseum.html` | Neon Colosseum battle simulator |
| Story | `story.html` | Full story archive (sourced from `layla.txt`) |
| Stats | `stats.html` | Character stats & data visualization |
| Rank | `rank.html` | Rankings and leaderboard |

---

## Features

### AI Chatbot

An AI chatbot endpoint (`api/chat.js`) powered by Layla's lore — `layla.txt` contains 314KB of original story content. Responses are authenticated via Privy.

### Web3 Auth & Payments

| API | File | Purpose |
|-----|------|---------|
| Chat | `api/chat.js` | AI chatbot powered by lore |
| Verify Payment | `api/verify-payment.js` | On-chain payment verification |
| Verify Token | `api/verify-token.js` | JWT / Privy token validation |

**Auth:** `@privy-io/react-auth` — the `src/privy-auth.jsx` component is bundled with esbuild into `privy-auth.bundle.js` at build time.

### Gallery

25 original character illustrations in `gallery/` (`imagelayla (1–25).png`).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Static HTML + CSS |
| Auth | Privy (`@privy-io/react-auth ^3.19`) |
| React (Privy bundle) | React 18 + esbuild |
| JWT | jose |
| Bundler | esbuild |
| Hosting | Netlify |
| Runtime (Node) | Node.js 18 |

---

## Getting Started

**Prerequisites:** Node.js ≥ 18

```bash
git clone https://github.com/gentaron/laylaland.git
cd laylaland
npm install
npm run build          # bundles src/privy-auth.jsx → privy-auth.bundle.js
```

Open `index.html` in a browser or serve with any static file server.

### Commands

```bash
npm run build    # esbuild: bundle Privy auth component (production, minified)
```

---

## Project Structure

```
laylaland/
├── index.html              # Home
├── about.html              # Lore & biography
├── colosseum.html          # Battle simulator
├── story.html              # Story archive
├── stats.html              # Stats dashboard
├── rank.html               # Rankings
├── style.css               # Global stylesheet
├── layla.txt               # Full story source (314KB)
├── rank.csv                # Ranking data
├── stats.csv               # Stats data
├── layladamage.png         # Battle damage illustration
├── layladamages.png        # Battle damage variations
├── laylastand.png          # Standing pose
├── gallery/
│   └── imagelayla (1–25).png   # 25 original illustrations
├── api/
│   ├── chat.js             # AI chatbot endpoint
│   ├── verify-payment.js   # On-chain payment verification
│   └── verify-token.js     # Privy JWT verification
├── src/
│   └── privy-auth.jsx      # React/Privy auth (bundled by esbuild)
├── package.json
└── netlify.toml            # Netlify deployment config
```

---

## Character Profile

**Layla Virel Nova** — *Pink Voltage*

| Attribute | Value |
|-----------|-------|
| Era | E325–E522 |
| Rarity | SR |
| Affiliation | EDU Universe / Gigapolis |
| Role | Legendary warrior, protagonist |
| Attribute | Electric / Combat |

Layla is part of the **64-character EDU roster** — full wiki at [gentaron/edu](https://github.com/gentaron/edu).

---

## Related Repositories

| Repo | Purpose |
|------|---------|
| [gentaron/edu](https://github.com/gentaron/edu) | Main EDU universe web app (Next.js) |
| [gentaron/image](https://github.com/gentaron/image) | Character artwork (PNG) |
| [gentaron/edutext](https://github.com/gentaron/edutext) | Raw story text files (.txt) |
| [gentaron/edunft](https://github.com/gentaron/edunft) | NFT card metadata + minting scripts |

---

## License

Story content and character designs are the intellectual property of the EDU project authors. Web application source code is MIT licensed.
