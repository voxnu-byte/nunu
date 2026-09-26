import { useRef } from 'react'
import { TEXT } from '../../config'
import { gsap, Split, useGsap } from '../../lib/motion'
import { Pixel } from '../../lib/pixel'
import { useTilt } from '../../lib/useTilt'

const WORLDS = [
  { sprite: 'monitor', name: 'Dasturlash', line: 'Linux, Python, JS, C++ — kod va tizimlar', color: '#00e5ff', grad: 'from-[#00e5ff] to-[#7c4dff]', tag: 'LVL 01' },
  { sprite: 'clapper', name: 'Media', line: 'Montaj, rang, motion dizayn', color: '#ff2e88', grad: 'from-[#ff2e88] to-[#ff8a00]', tag: 'LVL 02' },
  { sprite: 'star', name: 'Generative AI', line: 'Rasm va videolarni AI bilan yaratish', color: '#b388ff', grad: 'from-[#a0ffe6] via-[#b388ff] to-[#ff80ab]', tag: 'LVL 03' },
  { sprite: 'chart', name: 'Marketing', line: 'SMM va Target reklama', color: '#00e676', grad: 'from-[#c6ff00] to-[#00e676]', tag: 'LVL 04' },
  { sprite: 'glove', name: 'Sport', line: 'Boks, kurash, karate, futbol, suzish', color: '#ff1744', grad: 'from-[#ff1744] to-[#ffc400]', tag: 'LVL 05' },
]

const STATS = [
  { n: 4, label: 'yil izlanish' },
  { n: 5, label: 'soha' },
  { n: 17, label: 'dastur va til' },
  { n: 5, label: 'sport turi' },
]

function WorldCard({ w, i }: { w: (typeof WORLDS)[number]; i: number }) {
  const tilt = useTilt<HTMLDivElement>(8)
  return (
    <div className="journey-card w-[78vw] shrink-0 md:w-[34vw] lg:w-[28vw]">
      <div ref={tilt} className="tilt glass glow-border overflow-hidden p-6 md:p-8" style={{ ['--accent' as string]: w.color }}>
        <span className="tilt-glare" />
        <div className="flex items-start justify-between">
          <span className="grid size-16 place-items-center border-2 border-white/15 bg-black/40 shadow-[inset_2px_2px_0_rgba(255,255,255,0.08)]">
            <Pixel name={w.sprite} size={36} />
          </span>
          <span className="pixel text-sm" style={{ color: w.color }}>
            {w.tag}
          </span>
        </div>
        <div className={`mt-8 bg-gradient-to-r ${w.grad} bg-clip-text font-display text-3xl font-extrabold tracking-tight text-transparent md:text-4xl`}>
          {w.name}
        </div>
        <p className="mt-3 text-sm text-white/70">{w.line}</p>
        <div className="mt-6 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/40">
          <span className="h-px flex-1 bg-white/10" />
          CLIP 0{i + 1}
        </div>
      </div>
    </div>
  )
}

export default function Journey() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGsap(root, (el) => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const t = track.current!
      const dist = () => t.scrollWidth - innerWidth + innerWidth * 0.1
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: el.querySelector('.journey-pin'),
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      gsap.fromTo('.journey-line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el.querySelector('.journey-pin'), start: 'top top', end: () => `+=${dist()}`, scrub: true } })
      el.querySelectorAll<HTMLElement>('.journey-card').forEach((c) => {
        gsap.fromTo(
          c,
          { opacity: 0.25, scale: 0.88, filter: 'grayscale(1)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'grayscale(0)',
            scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 85%', end: 'left 45%', scrub: true },
          },
        )
      })
    })
    el.querySelectorAll<HTMLElement>('.count').forEach((c) => {
      const n = Number(c.dataset.n)
      const o = { v: 0 }
      gsap.to(o, {
        v: n,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => (c.textContent = String(Math.round(o.v))),
        scrollTrigger: { trigger: c, start: 'top 90%' },
      })
    })
  })

  return (
    <section id="yol" ref={root} className="relative">
      <div className="journey-pin relative flex min-h-svh flex-col justify-center overflow-hidden py-24 md:py-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
        <div className="relative px-6 md:px-16">
          <p className="kicker mb-4">01 · Yoʻl xaritasi</p>
          <h2 data-split className="display max-w-4xl text-[clamp(2rem,5vw,4.6rem)]">
            <Split text={TEXT.journey.title} />
          </h2>
        </div>
        <div className="relative mt-12 md:mt-16">
          <div className="absolute top-1/2 left-0 hidden h-[2px] w-full bg-white/5 md:block">
            <div className="journey-line h-full origin-left bg-[linear-gradient(90deg,#00e5ff,#ff2e88,#b388ff,#00e676,#ff1744)] shadow-[0_0_20px_#ff2e88]" />
          </div>
          <div ref={track} className="flex flex-col gap-6 px-6 md:flex-row md:gap-10 md:px-16">
            {WORLDS.map((w, i) => (
              <WorldCard key={w.name} w={w} i={i} />
            ))}
          </div>
        </div>
        <div className="relative mt-12 grid grid-cols-2 gap-6 px-6 md:mt-14 md:flex md:gap-14 md:px-16">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="display text-5xl md:text-6xl">
                <span className="count" data-n={s.n}>
                  0
                </span>
                <span className="text-[#c6ff00]">.</span>
              </div>
              <div className="kicker mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
