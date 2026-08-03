export default function App() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Grain / edge frame */}
      <div className="pointer-events-none fixed inset-0 z-10 m-3 rounded-2xl border border-line md:m-5" />

      <div className="relative z-20 flex min-h-screen flex-col px-6 py-8 md:px-10 md:py-10">
        {/* Top bar */}
        <header className="flex items-center justify-between text-sm tracking-tight">
          <span className="font-medium">Rocha Design Studio</span>
          <span className="text-muted">Est. 2025 · Portugal</span>
        </header>

        {/* Center statement */}
        <section className="flex flex-1 flex-col justify-center py-20">
          <p className="mb-6 text-sm uppercase tracking-[0.2em] text-muted">
            Branding · Web · Product
          </p>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            We design brands and
            <br />
            digital products with
            <br />
            <span className="italic text-accent">craft and intent.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted">
            A new portfolio is taking shape. Built in code, tuned pixel by
            pixel — the real work lands here soon.
          </p>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-2 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Rocha Design Studio</span>
          <a
            href="mailto:hello@rochadesign.pt"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            hello@rochadesign.pt
          </a>
        </footer>
      </div>
    </main>
  )
}
