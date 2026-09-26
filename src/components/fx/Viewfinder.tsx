import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../../config'
import { Pixel } from '../../lib/pixel'

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')

// Kamera koʻzgusi overleyi: REC, scrollga bogʻlangan taymkod, burchak ramkalari,
// XP chizigʻi va Minecraft uslubidagi hotbar (asosiy navigatsiya).
export default function Viewfinder({ active, onJump }: { active: number; onJump: (i: number) => void }) {
  const [tc, setTc] = useState('00:00:00:00')
  const xp = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? scrollY / max : 0
      const secs = p * 240
      setTc(`00:${pad(secs / 60)}:${pad(secs % 60)}:${pad((secs * 24) % 24)}`)
      if (xp.current) xp.current.style.transform = `scaleX(${p})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const corner = 'absolute size-6 border-white/60'
  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      <div className="absolute inset-3 md:inset-5">
        <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} />
        <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} />
        <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${corner} right-0 bottom-0 border-r-2 border-b-2`} />
      </div>
      <div className="absolute top-6 left-7 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/80 md:top-8 md:left-10 md:text-[11px]">
        <span className="rec-dot size-2 rounded-full bg-red-500 shadow-[0_0_10px_#f00]" />
        REC
        <span className="hidden text-white/40 md:inline">· NUNU_PORTFOLIO.MOV</span>
      </div>
      <div className="absolute top-6 right-7 text-right font-mono text-[10px] tracking-[0.2em] text-white/80 md:top-8 md:right-10 md:text-[11px]">
        {tc}
        <div className="hidden text-white/40 md:block">24 FPS · 4K · ISO 400</div>
      </div>

      {/* Hotbar */}
      <nav
        aria-label="Boʻlimlar"
        className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 md:bottom-6"
      >
        <div className="flex items-center gap-2">
          <span className="pixel text-sm text-[#80ff20] [text-shadow:2px_2px_0_#000]">{active + 1}</span>
        </div>
        <div className="h-[6px] w-full border border-black bg-[#1b1b1b]">
          <div ref={xp} className="h-full origin-left bg-[#80ff20] shadow-[inset_0_-2px_0_#4a9e10]" />
        </div>
        <div className="flex gap-[3px] bg-black/40 p-[3px] backdrop-blur-sm">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onJump(i)}
              className={`hotbar-slot max-md:!size-[30px] ${i === active ? 'is-active' : ''}`}
              style={{ ['--c' as string]: s.color }}
              aria-label={s.label}
              aria-current={i === active ? 'true' : undefined}
            >
              <Pixel name={s.sprite} size={window.innerWidth < 768 ? 18 : 26} />
              <span className="hotbar-tip max-md:hidden">{s.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
