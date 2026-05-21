<div align="center">

# Layla Land

**Layla Virel Nova ("Pink Voltage") — AURALIS Character Fan Site**

[English](#english) · [日本語](#日本語)

</div>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)]()

🌐 **Live**: [laylaland.netlify.app](https://laylaland.netlify.app)

---

## 日本語

### 概要

Layla Land は EDU（Eternal Dominion Universe）のキャラクター **Layla Virel Nova**（"Pink Voltage"）のファンサイト。AURALIS Collective に属する Layla のプロフィール、ストーリー、バトルシミュレーター、AI チャットボットなどを提供する。Next.js の Wiki/Timeline ページと、スタンドアロン HTML ページのハイブリッド構成。

### Features

| Feature | 説明 |
|---------|------|
| **キャラクタープロフィール** | Layla の詳細プロフィール + キャラクタークイズ |
| **Colosseum** | ターン制バトルシミュレーター（部位別 HP システム、20 ランド耐久モード） |
| **Story Reader** | [edutext](https://github.com/gentaron/edutext) から Layla のストーリーを取得、目次付き多章読書、進捗バー、JA/EN 切替 |
| **Stats & AI Chat** | ユニバース lore と Layla AI チャットボット（`/api/chat`） |
| **Gallery** | 25 枚の Layla テーマ画像 |
| **Wiki / Timeline** | EDU 共有 Wiki/Timeline（他サイトと同じアーキテクチャ） |
| **Web3** | Ethereum ウォレット接続対応（Brave / MetaMask / Coinbase / WalletConnect） |
| **多言語対応** | 日本語 / 英語 bilingual |

### Quick Start

```bash
git clone https://github.com/gentaron/laylaland.git && cd laylaland
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # production server
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) · React 19 + Vanilla HTML/CSS/JS |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 · Custom CSS variables |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Space Grotesk, Inter |
| AI | `/api/chat` endpoint (Layla chatbot) |
| Web3 | Ethereum wallet connection (EIP-6963) |
| Deploy | Netlify |

### Project Structure

```
laylaland/
├── src/
│   ├── app/              # Next.js App Router pages (wiki, timeline)
│   ├── domains/
│   │   ├── wiki/         # Wiki data, search engine
│   │   └── civilizations/ # Civilization data
│   ├── platform/         # Shared UI components
│   ├── lib/              # Utilities, language config
│   └── types/            # TypeScript type definitions
├── index.html            # Landing page
├── about.html            # Character profile + quiz
├── colosseum.html        # Turn-based battle simulator
├── story.html            # Multi-chapter story reader
├── stats.html            # Universe lore + AI chatbot
├── rank.html             # Official links
├── gallery/              # 25 Layla-themed images
└── netlify.toml          # Netlify deploy config
```

### Story Source

Layla のストーリーテキストは [gentaron/edutext](https://github.com/gentaron/edutext) から取得：
- `LAYLA.txt` (English)
- `LAYLA_JP.txt` (Japanese)

---

## English

### Overview

Layla Land is the character fan site for **Layla Virel Nova** ("Pink Voltage") from the AURALIS Collective in the Eternal Dominion Universe. A hybrid site combining Next.js wiki/timeline pages with standalone HTML pages featuring a turn-based battle simulator (body-part HP system, 20-round endurance), multi-chapter story reader fetching from [edutext](https://github.com/gentaron/edutext), AI chatbot, character gallery, and Ethereum wallet integration.

### Key Pages

- `/` — Landing page
- `/wiki` — EDU encyclopedia browser
- `/timeline` — Universe timeline
- `about.html` — Detailed character profile + quiz
- `colosseum.html` — Turn-based battle simulator
- `story.html` — Multi-chapter story reader (JA/EN)
- `stats.html` — Universe lore + AI chatbot

---

## Related Repositories

| Repo | Description |
|------|-------------|
| [gentaron/edu](https://github.com/gentaron/edu) | Main EDU application |
| [gentaron/edutext](https://github.com/gentaron/edutext) | Story text files (LAYLA.txt source) |
| [gentaron/image](https://github.com/gentaron/image) | Character artwork |
| [gentaron/eurekaspace](https://github.com/gentaron/eurekaspace) | EDU encyclopedia site |
| [gentaron/irisworlds](https://github.com/gentaron/irisworlds) | Iris character site |

## License

[MIT](LICENSE)
