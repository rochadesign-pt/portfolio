# Synthesised 120 BPM track, 24s. Beat = 0.5s, bar = 2s.
# 0-2 claps intro · 2-4 kick enters · 4-16 full groove (one project per bar)
# 16-20 montage + clap roll/riser · 20 hit · 20-24 outro end card
import numpy as np, wave

SR = 48000
DUR = 24.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
BEAT = 0.5
rng = np.random.default_rng(7)

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    s = sig[: N - i] * gain
    L[i:i+len(s)] += s * (1 - max(pan, 0))
    R[i:i+len(s)] += s * (1 + min(pan, 0))

def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    e = np.exp(-t / d)
    att = int(a * SR)
    if att: e[:att] *= np.linspace(0, 1, att)
    return e

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / 0.22)
    click = rng.standard_normal(n) * np.exp(-t / 0.003) * 0.3
    return np.tanh((s + click) * 1.6)

def bp_noise(n, lo, hi):
    x = rng.standard_normal(n)
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR)
    X[(fr < lo) | (fr > hi)] = 0
    y = np.fft.irfft(X, n)
    return y / (np.abs(y).max() + 1e-9)

def clap():
    n = int(0.35 * SR); t = np.arange(n) / SR
    nz = bp_noise(n, 900, 5000)
    e = np.zeros(n)
    for k, off in enumerate([0, 0.009, 0.019, 0.028]):
        i = int(off * SR)
        e[i:] += np.exp(-(t[: n - i]) / (0.008 if k < 3 else 0.12))
    return nz * e * 0.9

def hat(open_=False):
    n = int((0.25 if open_ else 0.06) * SR); t = np.arange(n) / SR
    return bp_noise(n, 7000, 16000) * np.exp(-t / (0.08 if open_ else 0.015)) * 0.5

def bass(freq, length):
    n = int(length * SR); t = np.arange(n) / SR
    saw = 2 * ((t * freq) % 1) - 1
    sub = np.sin(2 * np.pi * freq * t)
    s = 0.5 * sub + 0.35 * np.tanh(saw * 2)
    # crude low-pass via moving average
    k = 24
    s = np.convolve(s, np.ones(k) / k, mode='same')
    return s * env(n, 0.004, length * 0.6)

def stab(freqs, length=0.4):
    n = int(length * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) for f in freqs)
    return s / len(freqs) * env(n, 0.003, 0.12)

def riser(length):
    n = int(length * SR); t = np.arange(n) / SR
    nz = bp_noise(n, 2000, 12000)
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1800 * (t / length) ** 2) / SR)
    return (nz * 0.5 + sweep * 0.25) * (t / length) ** 2

def impact():
    n = int(2.5 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 80 * np.exp(-t / 0.08)) / SR) * np.exp(-t / 0.7)
    nz = bp_noise(n, 200, 9000) * np.exp(-t / 0.35) * 0.5
    return np.tanh((boom + nz) * 1.4)

K, C, H, HO = kick(), clap(), hat(), hat(True)
A, F, G, D = 55.0, 43.65, 49.0, 36.71  # A1 F1 G1 D1
prog = [A, F, D, G]

# Intro bar: claps on 2 & 4 + a stab
for b in [1, 3]: add(C, b * BEAT, 0.8)
add(stab([220, 277.2, 329.6], 0.6), 0, 0.35)
# Bar 2: kick enters, claps, hats
for b in range(4, 8):
    add(K, b * BEAT, 0.9)
    if b % 2 == 1: add(C, b * BEAT, 0.8)
    add(H, b * BEAT + 0.25, 0.4, 0.3)
add(C, 3.75, 0.5, -0.4)  # pickup clap

# Full groove 4-16s (bars 3-8) + montage 16-20 (bars 9-10)
for bar in range(2, 10):
    t0 = bar * 2.0
    root = prog[(bar - 2) % 4]
    for b in range(4):
        tb = t0 + b * BEAT
        add(K, tb, 1.0)
        if b % 2 == 1: add(C, tb, 0.85)
        add(H, tb + 0.25, 0.45, 0.35)
        add(H, tb + 0.125, 0.18, -0.35)
        add(bass(root, 0.22), tb + 0.25, 0.55)
        add(bass(root * 2, 0.1), tb + 0.375, 0.25)
    add(HO, t0 + 1.75, 0.35, 0.2)
    # stab on the downbeat of every project cut
    add(stab([root * 4, root * 5, root * 6], 0.35), t0, 0.22)
    if bar % 2 == 1: add(C, t0 + 1.875, 0.45, 0.4)  # ghost clap

# Clap roll building 18-20s
for i in range(16):
    add(C, 18.0 + i * 0.125, 0.35 + i * 0.03, (-1) ** i * 0.3)
add(riser(2.0), 18.0, 0.6)

# Hit at 20s and outro groove (claps + soft kick) to 24
add(impact(), 20.0, 1.0)
add(K, 20.0, 1.0)
add(stab([110, 138.6, 164.8, 220], 1.6), 20.0, 0.45)
for b in range(41, 47):
    add(C if b % 2 == 1 else H, b * BEAT, 0.6 if b % 2 == 1 else 0.3)
add(C, 23.0, 0.9)  # final clap

mix = np.stack([L, R], 1)
mix /= np.abs(mix).max() + 1e-9
mix = np.tanh(mix * 1.3) / np.tanh(1.3) * 0.92
fade = int(0.6 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
with wave.open('beat.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok')
