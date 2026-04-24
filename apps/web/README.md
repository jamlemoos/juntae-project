# Juntaê Web

Frontend da plataforma Juntaê.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS v4

---

## Estrutura

```
src/
  main.tsx       entry point
  App.tsx        componente raiz
  index.css      @import "tailwindcss"
index.html
vite.config.ts
eslint.config.js
```

---

## Como executar

```bash
cd apps/web
npm install
npm run dev
```

Disponível em `http://localhost:5173`.

---

## Scripts

| Comando           | O que faz                            |
| ----------------- | ------------------------------------ |
| `npm run dev`     | inicia o servidor de desenvolvimento |
| `npm run build`   | compila TypeScript e gera `dist/`    |
| `npm run lint`    | roda ESLint                          |
| `npm run preview` | serve o build de produção localmente |

Ou a partir da raiz do monorepo:

```bash
npm run web:dev
npm run web:build
npm run web:lint
```
