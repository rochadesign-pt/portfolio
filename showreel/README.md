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
