// Saytdagi barcha matn va havolalar shu yerda. Komponentlarga tegmasdan tahrirlash mumkin.

export const PERSON = {
  nick: 'NUNU',
  name: 'Obidjonov Nurmuhammad',
  role: 'Dasturlash · Media · AI · Marketing · Sport',
}

export const LINKS = {
  telegram: { label: '@nunu_akt', url: 'https://t.me/nunu_akt' },
  email: { label: 'user.obidjonov@gmail.com', url: 'mailto:user.obidjonov@gmail.com' },
  github: { label: 'voxnu-byte', url: 'https://github.com/voxnu-byte' },
  instagram: { label: '@on.3des', url: 'https://instagram.com/on.3des' },
}

// Showreel tayyor boʻlganda shu yerga video havolasini qoʻying (masalan '/media/showreel.mp4')
export const SHOWREEL_URL = ''

export type SectionId =
  | 'hero'
  | 'yol'
  | 'kod'
  | 'media'
  | 'ai'
  | 'marketing'
  | 'sport'
  | 'haqiqat'
  | 'maqsad'
  | 'aloqa'

export type TransitionKind = 'flash' | 'leak' | 'glitch' | 'whip' | 'iris'

// Pastdagi "hotbar" navigatsiya va har bir boʻlimga kirishdagi perehod turi
export const SECTIONS: {
  id: SectionId
  label: string
  sprite: string
  color: string
  transition: TransitionKind
}[] = [
  { id: 'hero', label: 'Boshlanish', sprite: 'mountain', color: '#8be9fd', transition: 'flash' },
  { id: 'yol', label: 'Yoʻl', sprite: 'pickaxe', color: '#c6ff00', transition: 'whip' },
  { id: 'kod', label: 'Dasturlash', sprite: 'monitor', color: '#00e5ff', transition: 'glitch' },
  { id: 'media', label: 'Media', sprite: 'clapper', color: '#ff2e88', transition: 'leak' },
  { id: 'ai', label: 'AI', sprite: 'star', color: '#b388ff', transition: 'iris' },
  { id: 'marketing', label: 'Marketing', sprite: 'chart', color: '#00e676', transition: 'whip' },
  { id: 'sport', label: 'Sport', sprite: 'glove', color: '#ff1744', transition: 'flash' },
  { id: 'haqiqat', label: 'Haqiqat', sprite: 'book', color: '#e0e0e0', transition: 'leak' },
  { id: 'maqsad', label: 'Maqsad', sprite: 'diamond', color: '#40e0d0', transition: 'iris' },
  { id: 'aloqa', label: 'Aloqa', sprite: 'envelope', color: '#ffc400', transition: 'glitch' },
]

export const TEXT = {
  hero: {
    title: ['4 yil.', '5 dunyo.', '1 yoʻl.'],
    lead: 'Soʻnggi 4 yil davomida kompyuter qarshisida turlicha sohalarni sinab koʻrish bilan band boʻldim. Shu vaqt ichida oʻzimga mos va haqiqatan qiziq boʻlgan kasbni izladim.',
    mono: 'Javobini topshiriqlar, amaliyot va xatolar orasida qidirishga toʻgʻri keldi.',
  },
  journey: {
    title: 'Hozirgacha nimalar bilan mashgʻul boʻldim?',
  },
  code: {
    title: 'Dasturlash va Tizimlar',
    body: [
      'Linux hamda Windows (7, 10, 11) operatsion tizimlarida faol ishlayman.',
      'Python, JavaScript, C++, HTML hamda CSS tillarida kod yozganman. Telegram botlar va sodda veb-saytlar yaratish tajribam bor.',
    ],
  },
  media: {
    title: 'Media va Vizual',
    body: 'DaVinci Resolve, Adobe Premiere Pro, After Effects va CapCut dasturlarida video montaj, ranglar bilan ishlash hamda motion dizayn boʻyicha amaliyot qilganman.',
  },
  ai: {
    title: 'Generative AI',
    body: 'Generative AI (sun\'iy intellekt) yordamida rasmlar va videolarni yaratishni yoʻlga qoʻyganman.',
    prompt: 'qorli togʻlar, quyosh botishi, koʻl aksi, kinematografik, 35mm, yumshoq tuman',
  },
  marketing: {
    title: 'Marketing',
    body: 'SMM va Target (Vibcoder hamda boshqa kurslar) sohalarini oʻrgandim.',
  },
  sport: {
    title: 'Sport',
    body: 'Hayotimda sport muhim oʻrin tutadi: boks, kurash, karate, futbol va suzish bilan shugʻullanganman.',
    punch: 'Intizom va chidamlilik aynan sportdan kelgan.',
  },
  truth: {
    title: 'Muhim bir haqiqat',
    lines: [
      'Koʻp sohalarni parallel oʻrganishga harakat qilganim uchun, ayrim texnik konseptlarda kamchiliklarim yoki bilimsizligim boʻlishi tabiiy.',
      'Hammasini bilaman deb da\'vo qilmayman — bu hali bosib oʻtilishi kerak boʻlgan yoʻlning bir qismi.',
      'Ba\'zida kichik va katta narsalarni tez unutib qoʻyishim mumkin, shuning uchun barcha ishlarimni Notion va Anki kabi tizimlarda tartiblab, hujjatlashtirib boraman.',
    ],
  },
  goal: {
    kicker: 'Hozirgi maqsad va reja',
    title: 'Yakkadan — jamoaga.',
    body: 'Yakka tartibdagi tajribalarni toʻxtatib, bor e\'tiborni jamoa bilan birga ishlashga, doimiy oʻsishga va barqaror daromad bosqichiga chiqishga qaratmoqdaman.',
  },
}
