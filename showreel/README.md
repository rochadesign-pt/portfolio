# Showreel

`rds-showreel.mp4` — 24s, 1920×1080, 30fps, com banda sonora (120 BPM).

| Tempo | Cena |
| --- | --- |
| 0–2s | Wordmark ROCHA® entra letra a letra, palmas nos tempos 2 e 4 |
| 2–4s | "Desenhamos marcas e produtos digitais com *craft e intenção.*" |
| 4–16s | Lumen · Meridian · Ferve · Orbit · Ecoxperience · Pulse — um projeto por compasso, corte no tempo forte |
| 16–20s | Montagem rápida + grelha dos 6 projetos, clap roll |
| 20–24s | Impacto → wordmark, "Vamos começar algo grande.", contactos |

Tudo é gerado em código: a animação é uma timeline GSAP (`reel.html`) avançada frame a
frame pelo Playwright, e a música é sintetizada em `beat.py`. Para mudar textos, cores ou
projetos, edita `reel.html` e volta a renderizar.

```bash
cd showreel
npm i --no-save gsap playwright @fontsource-variable/geist @fontsource/instrument-serif
pip install numpy
python3 beat.py                 # → beat.wav
node render.mjs 30              # → frames/*.png  (node render.mjs 30 4.5,12 → stills de teste)
ffmpeg -y -framerate 30 -i frames/f%04d.png -i beat.wav -c:v libx264 -preset slow -crf 16 \
  -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -shortest rds-showreel.mp4
```

## Construção do logótipo

`rds-logo-construction.mp4` — 15s, 1920×1080, 30fps, com som.

A geometria vem do SVG real do wordmark (`src/components/Wordmark.jsx`): os pontos de
ancoragem, as alças Bézier e os círculos de construção (ajustados a cada curva) são
calculados a partir dos paths, não desenhados à mão.

| Tempo | Passo |
| --- | --- |
| 0–2s | 01 Grelha — linhas de altura, base, overshoot, barras, diagonais do A |
| 2–6s | 02 Estrutura — câmara percorre R·O·C·H·A, contornos, pontos, alças, círculos |
| 6–9s | 03 Forma — cotas (162.7 / 167.2 / ∠17.3°) e preenchimento letra a letra |
| 9–10.6s | 04 Símbolo ® — hexágono, círculo circunscrito, eixos a 60° |
| 10.6–12s | 05 Assinatura — DESIGN STUDIO |
| 12–15s | 06 Marca — guias desaparecem, wordmark final + "Construção da marca." |

```bash
HTML=logo-construction.html DUR=15 OUT=frames-logo node render.mjs 30   # também gera ticks.json
python3 logo_sound.py                                                  # → logo.wav (cliques sincronizados)
ffmpeg -y -framerate 30 -i frames-logo/f%04d.png -i logo.wav -c:v libx264 -preset slow -crf 16 \
  -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -shortest rds-logo-construction.mp4
```
