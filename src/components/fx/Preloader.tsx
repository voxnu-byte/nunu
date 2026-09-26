import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../../lib/motion'
import { Pixel } from '../../lib/pixel'

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')

// Kinodagidek "film leader": 3·2·1 sanogʻi + taymkod 4 yilni sanaydi + pixel yuklanish chizigʻi
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [num, setNum] = useState(3)
  const [tc, setTc] = useState('00:00:00:00')
  const [pct, setPct] = useState(0)

  useEffect(() => {
    document.body.classList.add('is-loading')
    const total = reducedMotion() ? 0.4 : 2.7
    const state = { t: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('is-loading')
        onDone()
      },
    })
    tl.to(state, {
      t: 1,
      duration: total,
      ease: 'power1.inOut',
      onUpdate: () => {
        const years = state.t * 4
        const frames = (state.t * 96) % 24
        setTc(`0${Math.floor(years)}:${pad((years % 1) * 12)}:${pad((state.t * 600) % 60)}:${pad(frames)}`)
        setNum(Math.max(1, 3 - Math.floor(state.t * 3)))
        setPct(Math.round(state.t * 100))
      },
    })
      .to('.pl-flash', { opacity: 1, duration: 0.08 })
      .set('.pl-content', { opacity: 0 })
      .to('.pl-flash', { opacity: 0, duration: 0.5 })
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.35')
    return () => {
      tl.kill()
      document.body.classList.remove('is-loading')
    }
  }, [onDone])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] bg-[#060608] text-white"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="pl-content absolute inset-0 grid place-items-center">
        {/* nishon chiziqlari */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
          <div className="absolute top-1/2 left-0 h-px w-full bg-white" />
        </div>
        <div className="relative grid size-[min(62vw,340px)] place-items-center">
          <div
            className="absolute inset-0 rounded-full border-2 border-white/60"
            style={{
              background: `conic-gradient(rgb(255 255 255 / 0.18) ${((3 - num + (pct % 33.4) / 33.4) / 3) * 360}deg, transparent 0)`,
            }}
          />
          <div className="absolute inset-[12%] rounded-full border border-white/30" />
          <span className="display relative text-[min(34vw,190px)] leading-none">{num}</span>
        </div>
        <div className="absolute top-6 left-6 flex items-center gap-3 font-mono text-xs tracking-widest text-white/70">
          <span className="rec-dot size-2.5 rounded-full bg-red-500" /> NUNU_PORTFOLIO.MOV
        </div>
        <div className="absolute top-6 right-6 font-mono text-xs tracking-widest text-white/70">{tc}</div>
        <div className="absolute bottom-10 left-1/2 flex w-[min(80vw,360px)] -translate-x-1/2 flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Pixel name="grass" size={22} />
            <span className="pixel text-lg">Dunyo yuklanmoqda…</span>
          </div>
          <div className="h-4 w-full border-2 border-[#3a3a46] bg-[#111] p-[2px]">
            <div className="h-full bg-[#5fbf3a]" style={{ width: `${pct}%`, boxShadow: 'inset 0 -3px 0 #3f8f2a' }} />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50">4 YIL · 5 DUNYO · 1 YOʻL</span>
        </div>
      </div>
      <div className="pl-flash pointer-events-none absolute inset-0 bg-white opacity-0" />
    </div>
  )
}
