# Sound design for logo-construction (15s): drone pad, precise ticks on every
# anchor/dimension event (ticks.json, exported by render.mjs), whooshes on camera
# moves and a hit + chime on the final reveal at 12s.
import json, os, sys, wave
import numpy as np

SR = 48000
DUR = 15.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)
t_all = np.arange(N) / SR

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    s = sig[: N - i] * gain
    L[i:i+len(s)] += s * (1 - max(pan, 0))
    R[i:i+len(s)] += s * (1 + min(pan, 0))

def bp(n, lo, hi):
    X = np.fft.rfft(rng.standard_normal(n)); f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)

def tick(freq=3200):
    n = int(0.05 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * t) * 0.6 + bp(n, 4000, 12000) * 0.4) * np.exp(-t / 0.006)

def whoosh(length, up=True):
    n = int(length * SR); t = np.arange(n) / SR
    e = np.sin(np.pi * t / length) ** 2
    nz = bp(n, 300, 6000)
    return nz * e * 0.5

def hit():
    n = int(3 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(32 + 70 * np.exp(-t / 0.07)) / SR) * np.exp(-t / 0.9)
    return np.tanh(boom * 1.5 + bp(n, 200, 5000) * np.exp(-t / 0.2) * 0.4)

def chime(freqs, length=3.0):
    n = int(length * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) * (0.6 ** k) for k, f in enumerate(freqs))
    return s * np.exp(-t / 1.1) * np.minimum(t / 0.005, 1)

SFX = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else {}
OUT = sys.argv[2] if len(sys.argv) > 2 else 'logo.wav'
HIT = SFX.get('hit', 12.0)

# drone pad: A minor-ish, swelling, low-passed by keeping it to sines
pad = np.zeros(N)
for f, g in [(55, .5), (110, .35), (164.8, .18), (220, .12), (261.6, .08)]:
    pad += g * np.sin(2 * np.pi * f * t_all + np.sin(2 * np.pi * 0.2 * t_all) * 0.5)
swell = np.clip(t_all / 2.5, 0, 1) * (0.75 + 0.25 * np.sin(2 * np.pi * t_all / 4))
pad *= swell * np.where(t_all < HIT, 1, np.exp(-(t_all - HIT) / 0.4))  # drops out on the reveal
L += pad * 0.35; R += pad * 0.35

ticks = SFX.get('ticks') or json.load(open('ticks.json'))
for k, t in enumerate(ticks):
    add(tick(2600 + (k % 5) * 300), t, 0.35, ((k % 3) - 1) * 0.5)

for t, d in SFX.get('whoosh') or [(1.55, 0.9), (5.9, 1.1), (8.85, 1.0), (10.35, 1.1), (10.8, 1.2)]:
    add(whoosh(d), t, 0.3)

# soft heartbeat pulses under the build
for t in np.arange(2.0, HIT, 1.0):
    n = int(0.3 * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * np.cumsum(45 + 40 * np.exp(-tt / 0.03)) / SR) * np.exp(-tt / 0.12), t, 0.45)

add(hit(), HIT, 0.9)
add(chime([880, 1318.5, 1760, 2637]), HIT, 0.25, -0.2)
add(chime([659.3, 987.8]), HIT + 0.55, 0.15, 0.3)

mix = np.stack([L, R], 1)
mix /= np.abs(mix).max() + 1e-9
mix = np.tanh(mix * 1.2) / np.tanh(1.2) * 0.9
fade = int(0.7 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok')
