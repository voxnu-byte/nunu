import { useRef } from 'react'
import { TEXT } from '../../config'
import { gsap, Split, useGsap } from '../../lib/motion'
import { Pixel } from '../../lib/pixel'
import { useTilt } from '../../lib/useTilt'

const SPORTS = [
  { word: 'BOKS', sprite: 'glove', note: 'Zarba va reaksiya', color: '#ff1744' },
  { word: 'KURASH', sprite: 'jacket', note: 'Kuch va muvozanat', color: '#29b6f6' },
  { word: 'KARATE', sprite: 'gi', note: 'Texnika va intizom', color: '#ffffff' },
  { word: 'FUTBOL', sprite: 'ball', note: 'Jamoa va strategiya', color: '#5fbf3a' },
  { word: 'SUZISH', sprite: 'wave', note: 'Nafas va chidamlilik', color: '#4dd0e1' },
]

// Kartaga sichqoncha kelganda pixel "zarba" zarrachalari sachraydi
function burst(el: HTMLElement, color: string) {
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('span')
    p.style.cssText = `position:absolute;left:50%;top:40%;width:6px;height:6px;background:${color};pointer-events:none;z-index:5`
    el.appendChild(p)
    const a = Math.random() * Math.PI * 2
    const d = 50 + Math.random() * 70
    gsap.to(p, { x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, rotate: 180, duration: 0.7, ease: 'power3.out', onComplete: () => p.remove() })
  }
}

function SportCard({ s }: { s: (typeof SPORTS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(12)
  return (
    <div
      ref={tilt}
      onPointerEnter={(e) => burst(e.currentTarget, s.color)}
      className="tilt glass group relative flex flex-col items-center gap-4 overflow-hidden !rounded-2xl px-4 py-7 text-center"
      style={{ ['--accent' as string]: s.color }}
    >
      <span className="tilt-glare" />
      <span className="grid size-20 place-items-center border-2 border-white/10 bg-black/40 shadow-[inset_3px_3px_0_rgba(255,255,255,0.06),inset_-3px_-3px_0_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
        <Pixel name={s.sprite} size={44} title={s.word} />
      </span>
      <span className="pixel text-xl font-bold tracking-wider" style={{ color: s.color }}>
        {s.word}
      </span>
      <span className="text-xs text-white/55">{s.note}</span>
    </div>
  )
}

export default function Sport() {
  const root = useRef<HTMLElement>(null)

  useGsap(root, (el) => {
    const words = gsap.utils.toArray<HTMLElement>('.slam-word')
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el.querySelector('.slam-pin'), start: 'top top', end: '+=220%', pin: true, scrub: 0.4 },
    })
    words.forEach((w, i) => {
      const ring = w.querySelector('.slam-ring')
      tl.fromTo(w, { scale: 3, opacity: 0, filter: 'blur(20px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power4.in' })
        .fromTo(ring, { scale: 0.2, opacity: 1 }, { scale: 2.4, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false })
        .fromTo('.slam-shake', { x: -14, y: 8 }, { x: 0, y: 0, duration: 0.25, ease: 'elastic.out(1,0.3)', immediateRender: false }, '<')
        .fromTo('.slam-flash', { opacity: 0.35 }, { opacity: 0, duration: 0.3, immediateRender: false }, '<')
        .set('.slam-count', { textContent: `0${i + 1}` }, '<')
      if (i < words.length - 1) tl.to(w, { scale: 0.7, opacity: 0, y: -60, duration: 0.3, delay: 0.25 })
    })
    tl.to('.slam-final', { opacity: 1, y: 0, duration: 0.4 })
  })

  return (
    <section id="sport" ref={root} className="relative">
      <div className="slam-pin relative h-svh overflow-hidden bg-[radial-gradient(ellipse_at_center,#2a0508,#07070a_70%)]">
        <div className="slam-flash pointer-events-none absolute inset-0 bg-[#ff1744] opacity-0" />
        <div className="absolute inset-x-0 top-24 px-6 text-center md:top-28">
          <p className="kicker">06 · Intizom maktabi</p>
        </div>
        <div className="slam-shake absolute inset-0 grid place-items-center">
          {SPORTS.map((s) => (
            <div key={s.word} className="slam-word absolute flex flex-col items-center opacity-0">
              <span className="slam-ring absolute opacity-0 top-1/2 left-1/2 -mt-[20vmin] -ml-[20vmin] size-[40vmin] rounded-full border-4" style={{ borderColor: s.color }} />
              <Pixel name={s.sprite} size={72} />
              <span
                className="display mt-4 text-[clamp(4rem,17vw,15rem)]"
                style={{ color: s.color, textShadow: `0 0 60px ${s.color}66, 0 8px 0 rgba(0,0,0,0.6)` }}
              >
                {s.word}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-28 left-6 font-mono text-xs text-white/50 md:left-16">
          RAUND <span className="slam-count text-[#ffc400]">01</span> / 05
        </div>
        <div className="slam-final absolute inset-x-0 bottom-28 translate-y-6 px-6 text-center opacity-0 md:bottom-32">
          <p className="display text-[clamp(1.2rem,2.6vw,2rem)] text-white">
            Intizom va chidamlilik — <span className="text-[#ffc400]">sportdan.</span>
          </p>
        </div>
      </div>

      <div className="relative px-6 pt-20 pb-28 md:px-16 md:pb-40">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 data-split className="display text-[clamp(2.4rem,6vw,5.5rem)]">
              <Split text="Sport" charClass="text-[#ff1744]" />
            </h2>
            <p data-reveal className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              {TEXT.sport.body}
            </p>
          </div>
          <div data-stagger className="flex flex-wrap gap-4">
            {['INTIZOM', 'CHIDAMLILIK'].map((b, i) => (
              <div key={b} className="relative flex-1 overflow-hidden rounded-2xl border-2 p-5" style={{ borderColor: i ? '#ffc400' : '#ff1744', background: i ? 'rgba(255,196,0,0.08)' : 'rgba(255,23,68,0.08)' }}>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }).map((_, k) => (
                    <Pixel key={k} name="heart" size={14} />
                  ))}
                </div>
                <div className="display mt-3 text-2xl md:text-3xl" style={{ color: i ? '#ffc400' : '#ff1744' }}>
                  {b}
                </div>
                <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/50">SPORTDAN KELGAN</div>
              </div>
            ))}
          </div>
        </div>
        <p data-reveal className="mt-10 max-w-3xl font-display text-xl font-bold md:text-3xl">
          “{TEXT.sport.punch}”
        </p>
        <div data-stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
          {SPORTS.map((s) => (
            <SportCard key={s.word} s={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
