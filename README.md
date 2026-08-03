# Rocha Design Studio — Portfolio

Reconstrução do portfólio do **Rocha Design Studio**. Planeado e prototipado
em código antes de ser recriado/refinado no **Framer**.

- **Marca:** Rocha Design Studio (voz "nós")
- **Objetivo:** craft impecável + conversão comercial
- **Línguas:** PT (raiz) + EN (`/en/`) — bilingue com hreflang
- **Serviços:** Branding · Web/Digital · UI/UX & Produto

## Stack

- **Vite + React 19**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Framer Motion** — reveals, stagger, transições de página
- **GSAP + @gsap/react** — timelines, scroll-driven, counters
- **Lenis** — smooth scroll global
- **react-router-dom** — routing PT/EN

## Correr localmente

```bash
npm install
npm run dev
```

## Deploy

Deploy contínuo via **Vercel** (SPA rewrites em `vercel.json`). Importar o
repo no Vercel e apontar a branch de produção.

## Estado

🚧 Em construção — scaffold + página de arranque. Estrutura completa
(Home · Work · Services · Studio · Contact) a caminho.
