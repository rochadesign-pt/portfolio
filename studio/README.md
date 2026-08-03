# Rocha Design Studio — Content Studio (Sanity)

The content control panel. Manage **Projects / case studies**, **Explorations
(lab)**, and **Site settings** here; the website reads from it.

## First-time setup (once)

1. Create a free Sanity project → https://www.sanity.io/manage (or run
   `npx sanity@latest init` inside this folder and follow the prompts).
2. Copy your **Project ID**.
3. Run the Studio locally:
   ```bash
   cd studio
   npm install
   SANITY_STUDIO_PROJECT_ID=<your-id> npm run dev
   ```
   (or hardcode the id in `sanity.config.js`).
4. Deploy the hosted Studio (optional): `npm run deploy` → gives you a
   `your-studio.sanity.studio` URL to edit content from anywhere.

## Connect the website

In the website (root project), set env vars (locally in `.env`, and in Vercel):

```
VITE_SANITY_PROJECT_ID=<your-id>
VITE_SANITY_DATASET=production
```

With those set, the site pulls Projects and Explorations from Sanity; without
them it falls back to the bundled local data. (The page-level wiring is the
final step — see the site's `src/lib/sanity.js`.)

## Content types

- **Project** — title, slug, *is case study*, category, disciplines, industry,
  country, year, services, cover image (+ fallback colours), tagline, intro,
  challenge / approach / outcome (blank line = new paragraph), client quote,
  results/metrics, gallery, order.
- **Exploration** — name, category, image, aspect ratio, order.
- **Site settings** — contact email, location, social links.
