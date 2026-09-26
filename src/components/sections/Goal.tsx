import { useRef } from 'react'
import { TEXT } from '../../config'
import { gsap, Split, useGsap } from '../../lib/motion'
import { Pixel } from '../../lib/pixel'
import { useTilt } from '../../lib/useTilt'

// Pixel jamoa: har kim oʻz tomonidan keladi va markazda birlashadi
const TEAM = [
  { from: -1, shirt: '#00e5ff', shade: '#0097a7', hair: '#2b1d14', label: 'NUNU', me: true },
  { from: 1, shirt: '#ff2e88', shade: '#c2185b', hair: '#5d3a1a', label: 'Dizayner' },
  { from: -1, shirt: '#c6ff00', shade: '#7cb342', hair: '#1a1a1a', label: 'Backend' },
  { from: 1, shirt: '#ffc400', shade: '#ff8f00', hair: '#3e2723', label: 'Menejer' },
]

const GOALS = [
  { sprite: 'hero', title: 'Jamoa bilan ishlash', text: 'Yakka tajribalardan — umumiy natijaga.', color: '#00e5ff' },
  { sprite: 'chart', title: 'Doimiy oʻsish', text: 'Har kuni bir qadam: oʻrganish, amaliyot, takrorlash.', color: '#c6ff00' },
  { sprite: 'diamond', title: 'Barqaror daromad', text: 'Bilimni qadriyatga, qadriyatni daromadga aylantirish.', color: '#40e0d0' },
]

function GoalCard({ g, i }: { g: (typeof GOALS)[number]; i: number }) {
  const tilt = useTilt<HTMLDivElement>(10)
  return (
    <div ref={tilt} className="tilt glass glow-border p-6" style={{ ['--accent' as string]: g.color }}>
      <span className="tilt-glare" />
      <div className="flex items-center justify-between">
        <span className="grid size-14 place-items-center border-2 border-white/10 bg-black/40">
          <Pixel name={g.sprite} size={g.sprite === 'hero' ? 34 : 30} />
        </span>
        <span className="pixel text-sm text-white/30">0{i + 1}</span>
      </div>
      <div className="mt-6 font-display text-xl font-bold" style={{ color: g.color }}>
        {g.title}
      </div>
      <p className="mt-2 text-sm text-white/60">{g.text}</p>
    </div>
  )
}

export default function Goal() {
  const root = useRef<HTMLElement>(null)
  useGsap(root, (el) => {
    el.querySelectorAll<HTMLElement>('.team-member').forEach((m, i) => {
      const dir = Number(m.dataset.from)
      gsap.fromTo(
        m,
        { x: () => dir * (innerWidth * 0.45), opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: el.querySelector('.team-stage'), start: `top ${85 - i * 4}%`, end: 'top 30%', scrub: true },
        },
      )
    })
    gsap.fromTo('.team-heart', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out(3)', scrollTrigger: { trigger: el.querySelector('.team-stage'), start: 'top 32%', toggleActions: 'play none none reverse' } })
  })

  return (
    <section id="maqsad" ref={root} className="relative overflow-hidden px-6 py-28 md:px-16 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_60%,rgba(64,224,208,0.12),transparent)]" />
      <div className="relative text-center">
        <p className="kicker mb-5">08 · {TEXT.goal.kicker}</p>
        <h2 data-split className="display text-[clamp(2.6rem,8vw,7.5rem)]">
          <Split text="Yakkadan —" />
          <br />
          <Split text="jamoaga." charClass="text-[#40e0d0]" />
        </h2>
        <p data-reveal className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
          {TEXT.goal.body}
        </p>
      </div>

      {/* Pixel sahna: togʻ fonida jamoa yigʻiladi */}
      <div className="team-stage relative mx-auto mt-16 h-[260px] max-w-5xl overflow-hidden rounded-3xl border border-white/10 md:h-[320px]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1a3a,#3a3a7a_55%,#ff9a7a)]" />
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-10 h-2/3 w-full" shapeRendering="crispEdges">
          <path d="M0 40 V26 H6 V20 H12 V14 H18 V8 H22 V12 H28 V18 H34 V22 H40 V16 H46 V10 H50 V4 H54 V10 H60 V16 H66 V20 H72 V14 H78 V8 H82 V14 H88 V22 H94 V26 H100 V40Z" fill="#4a4a7a" />
          <path d="M18 8 H22 V12 H18Z M50 4 H54 V8 H50Z M78 8 H82 V11 H78Z" fill="#fff" />
          <path d="M0 40 V30 H10 V26 H20 V30 H30 V24 H42 V28 H56 V24 H70 V28 H84 V24 H92 V30 H100 V40Z" fill="#2c2c55" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex h-10">
          {Array.from({ length: 40 }).map((_, i) => (
            <Pixel key={i} name="grass" size={40} className="shrink-0" />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-10 flex items-end justify-center gap-3 md:gap-8">
          {TEAM.map((t, i) => (
            <div key={i} className="team-member flex flex-col items-center" data-from={t.from}>
              <span className={`pixel mb-1 rounded-sm px-1.5 text-[10px] md:text-xs ${t.me ? 'bg-[#00e5ff] text-black' : 'bg-black/50 text-white'}`}>{t.label}</span>
              <div className="walk" style={{ animationDelay: `${i * 0.1}s` }}>
                <Pixel name="hero" size={window.innerWidth < 768 ? 54 : 78} colors={{ T: t.shirt, t: t.shade, H: t.hair }} />
              </div>
            </div>
          ))}
        </div>
        <div className="team-heart absolute bottom-[150px] left-1/2 -translate-x-1/2 md:bottom-[190px]">
          <Pixel name="heart" size={30} />
        </div>
      </div>

      <div data-stagger className="relative mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
        {GOALS.map((g, i) => (
          <GoalCard key={g.title} g={g} i={i} />
        ))}
      </div>
    </section>
  )
}
