export const services = [
  {
    n: '01',
    key: 'branding',
    title: { pt: 'Branding & Identidade', en: 'Branding & Identity' },
    desc: {
      pt: 'Estratégia, naming, identidade visual e guidelines. Construímos marcas com fundação — não só um logótipo bonito.',
      en: 'Strategy, naming, visual identity and guidelines. We build brands with foundations — not just a pretty logo.',
    },
    items: {
      pt: ['Estratégia de marca', 'Naming & verbal', 'Identidade visual', 'Brand guidelines', 'Packaging'],
      en: ['Brand strategy', 'Naming & verbal', 'Visual identity', 'Brand guidelines', 'Packaging'],
    },
  },
  {
    n: '02',
    key: 'web',
    title: { pt: 'Web & Digital', en: 'Web & Digital' },
    desc: {
      pt: 'Sites e landing pages desenhados e construídos com craft. De protótipo a live — muitas vezes em Framer ou Webflow.',
      en: 'Websites and landing pages designed and built with craft. From prototype to live — often in Framer or Webflow.',
    },
    items: {
      pt: ['Web design', 'Landing pages', 'Art direction', 'Framer / Webflow', 'Motion'],
      en: ['Web design', 'Landing pages', 'Art direction', 'Framer / Webflow', 'Motion'],
    },
  },
  {
    n: '03',
    key: 'product',
    title: { pt: 'UI/UX & Produto', en: 'UI/UX & Product' },
    desc: {
      pt: 'Interfaces, apps e design systems. Produto digital que é bonito de ver e óbvio de usar.',
      en: 'Interfaces, apps and design systems. Digital product that is beautiful to look at and obvious to use.',
    },
    items: {
      pt: ['UI/UX', 'Design systems', 'Prototipagem', 'App design', 'Handoff para dev'],
      en: ['UI/UX', 'Design systems', 'Prototyping', 'App design', 'Dev handoff'],
    },
  },
]

export const stats = [
  { value: 24, suffix: '+', label: { pt: 'Projetos entregues', en: 'Projects shipped' } },
  { value: 12, suffix: '', label: { pt: 'Marcas construídas', en: 'Brands built' } },
  { value: 5, suffix: '', label: { pt: 'Países', en: 'Countries' } },
  { value: 100, suffix: '%', label: { pt: 'Feito com intenção', en: 'Made with intent' } },
]

export const process = [
  {
    n: '01',
    title: { pt: 'Descobrir', en: 'Discover' },
    desc: {
      pt: 'Mergulhamos no negócio, no mercado e nas pessoas. Boas perguntas antes de qualquer pixel.',
      en: 'We dive into the business, the market and the people. Good questions before any pixel.',
    },
  },
  {
    n: '02',
    title: { pt: 'Definir', en: 'Define' },
    desc: {
      pt: 'Traduzimos o que descobrimos em direção — estratégia, território visual e critérios de sucesso.',
      en: 'We translate what we found into direction — strategy, visual territory and success criteria.',
    },
  },
  {
    n: '03',
    title: { pt: 'Desenhar', en: 'Design' },
    desc: {
      pt: 'Onde a craft acontece. Iteramos rápido, mostramos cedo e refinamos até estar certo.',
      en: 'Where the craft happens. We iterate fast, show early and refine until it is right.',
    },
  },
  {
    n: '04',
    title: { pt: 'Entregar', en: 'Deliver' },
    desc: {
      pt: 'Ficheiros impecáveis, sistemas documentados e um handoff que a tua equipa vai agradecer.',
      en: 'Immaculate files, documented systems and a handoff your team will thank us for.',
    },
  },
]

export const values = [
  {
    title: { pt: 'Detalhe é tudo', en: 'Detail is everything' },
    desc: {
      pt: 'O que separa o bom do memorável está sempre nos detalhes que ninguém pediu.',
      en: 'What separates good from memorable is always in the details nobody asked for.',
    },
  },
  {
    title: { pt: 'Poucos, mas bem', en: 'Few, but well' },
    desc: {
      pt: 'Trabalhamos em poucos projetos de cada vez. Foco é a nossa vantagem injusta.',
      en: 'We take on few projects at a time. Focus is our unfair advantage.',
    },
  },
  {
    title: { pt: 'Design que trabalha', en: 'Design that works' },
    desc: {
      pt: 'Bonito não chega. Tem de vender, converter, funcionar. Craft com resultado.',
      en: 'Beautiful is not enough. It has to sell, convert, work. Craft with results.',
    },
  },
  {
    title: { pt: 'Parceiros, não fornecedores', en: 'Partners, not vendors' },
    desc: {
      pt: 'Entramos como parte da tua equipa. O teu problema passa a ser o nosso.',
      en: 'We come in as part of your team. Your problem becomes ours.',
    },
  },
]

export const team = [
  { name: 'Tiago Rocha', role: { pt: 'Fundador & Design Lead', en: 'Founder & Design Lead' } },
  { name: '[Nome]', role: { pt: 'Brand Designer', en: 'Brand Designer' } },
  { name: '[Nome]', role: { pt: 'Product Designer', en: 'Product Designer' } },
  { name: '[Nome]', role: { pt: 'Motion & Dev', en: 'Motion & Dev' } },
]

export const clients = ['Lumen', 'Meridian', 'Ferve', 'Orbit', 'Casa Nova', 'Pulse', 'Northwind', 'Atlas']

// Exploration / lab tiles — off-brief experiments, laid out as a mosaic.
// `ratio` drives the masonry variety. Placeholder duotones for now.
export const explorations = [
  { name: 'ASCII', category: { pt: 'Ferramenta', en: 'Design Tool' }, colors: ['#0b0b0d', '#1d1d20'], ratio: '4 / 5' },
  { name: 'Kinetic Type', category: { pt: 'Motion', en: 'Motion' }, colors: ['#ffc700', '#0b0b0d'], ratio: '4 / 3' },
  { name: 'Midjourney', category: { pt: 'Exploração', en: 'Exploration' }, colors: ['#7c8cff', '#0b0b0d'], ratio: '3 / 4' },
  { name: 'OiOne', category: { pt: 'Interno', en: 'Internal' }, colors: ['#ff7a4d', '#151517'], ratio: '16 / 11' },
  { name: 'Noteworthy', category: { pt: 'Conceito', en: 'Concept' }, colors: ['#0b0b0d', '#ffc700'], ratio: '1 / 1' },
  { name: 'Paleta', category: { pt: 'Estudo de cor', en: 'Colour study' }, colors: ['#ff5c8a', '#0b0b0d'], ratio: '3 / 4' },
  { name: 'Warlock Island', category: { pt: 'Jogo', en: 'Game' }, colors: ['#4de3c1', '#0b0b0d'], ratio: '16 / 9' },
  { name: 'SuppStack', category: { pt: 'Produto', en: 'Product' }, colors: ['#e8e2d4', '#0b0b0d'], ratio: '3 / 4' },
  { name: 'Grelha', category: { pt: 'Sistema', en: 'System' }, colors: ['#1d1d20', '#151517'], ratio: '4 / 5' },
  { name: 'Ícones', category: { pt: 'Set', en: 'Set' }, colors: ['#ffc700', '#151517'], ratio: '1 / 1' },
  { name: 'Web Toy', category: { pt: 'Experiência', en: 'Experiment' }, colors: ['#7c8cff', '#151517'], ratio: '4 / 3' },
  { name: '3D', category: { pt: 'Exploração', en: 'Exploration' }, colors: ['#ff7a4d', '#0b0b0d'], ratio: '3 / 4' },
]

export const social = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Behance', href: 'https://behance.net' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
]

export const contact = {
  email: 'hello@rochadesign.pt',
  location: 'Portugal · Remoto no mundo',
  locationEn: 'Portugal · Remote worldwide',
}
