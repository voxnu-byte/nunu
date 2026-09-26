import { useEffect, useRef, useState } from 'react'
import { TEXT } from '../../config'
import { ScrollTrigger, Split, useGsap, gsap } from '../../lib/motion'
import { IconTile, BrandIcon } from '../../lib/icons'

type Line = { cmd?: string; out?: { t: string; c?: string; icon?: string }[] }

const SCRIPT: Line[] = [
  { cmd: 'whoami' },
  { out: [{ t: 'nunu', c: '#c6ff00' }, { t: '— dasturlash va tizimlar' }] },
  { cmd: 'ls ./os' },
  { out: [{ t: 'Linux', c: '#fcc624', icon: 'linux' }, { t: 'Windows-7' , c: '#3a96dd', icon: 'windows' }, { t: 'Windows-10', c: '#3a96dd' }, { t: 'Windows-11', c: '#3a96dd' }] },
  { cmd: 'ls ./tillar' },
  { out: [{ t: 'Python', c: '#ffd43b', icon: 'python' }, { t: 'JavaScript', c: '#f7df1e', icon: 'javascript' }, { t: 'C++', c: '#659ad2', icon: 'cpp' }, { t: 'HTML', c: '#e34f26', icon: 'html' }, { t: 'CSS', c: '#a78bfa', icon: 'css' }] },
  { cmd: 'ls ./loyihalar' },
  { out: [{ t: 'telegram-botlar/', c: '#26a5e4', icon: 'telegram' }, { t: 'veb-saytlar/', c: '#00e5ff' }] },
  { cmd: 'echo $MAQSAD' },
  { out: [{ t: '"jamoada ishlash va oʻsish"', c: '#ff9ec0' }] },
]

function Terminal() {
  const box = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState<Line[]>([])
  const [typing, setTyping] = useState('')
  const started = useRef(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: box.current,
      start: 'top 75%',
      once: true,
      onEnter: async () => {
        if (started.current) return
        started.current = true
        const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
        for (const line of SCRIPT) {
          if (line.cmd) {
            for (let i = 1; i <= line.cmd.length; i++) {
              setTyping(line.cmd.slice(0, i))
              await wait(45 + Math.random() * 50)
            }
            await wait(180)
            setTyping('')
          } else await wait(120)
          setShown((s) => [...s, line])
        }
      },
    })
    return () => st.kill()
  }, [])

  return (
    <div ref={box} className="glass glow-border overflow-hidden !rounded-2xl" style={{ ['--accent' as string]: '#00e5ff' }}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex items-center gap-2 font-mono text-xs text-white/50">
          <BrandIcon name="bash" size={13} /> nunu@mint: ~/portfolio
        </span>
      </div>
      <div className="min-h-[340px] p-5 font-mono text-[13px] leading-7 md:text-sm">
        {shown.map((l, i) =>
          l.cmd ? (
            <div key={i}>
              <span className="text-[#5fbf3a]">nunu@mint</span>
              <span className="text-white/40">:~$ </span>
              {l.cmd}
            </div>
          ) : (
            <div key={i} className="flex flex-wrap gap-x-4 gap-y-1 pb-1">
              {l.out!.map((o) => (
                <span key={o.t} className="inline-flex items-center gap-1.5" style={{ color: o.c ?? '#bbb' }}>
                  {o.icon && <BrandIcon name={o.icon} size={14} />}
                  {o.t}
                </span>
              ))}
            </div>
          ),
        )}
        {shown.length < SCRIPT.length && (
          <div>
            <span className="text-[#5fbf3a]">nunu@mint</span>
            <span className="text-white/40">:~$ </span>
            <span className="caret">{typing}</span>
          </div>
        )}
        {shown.length === SCRIPT.length && (
          <div>
            <span className="text-[#5fbf3a]">nunu@mint</span>
            <span className="text-white/40">:~$ </span>
            <span className="caret" />
          </div>
        )}
      </div>
    </div>
  )
}

const TILES = [
  { name: 'linux', label: 'Linux' },
  { name: 'windows', label: 'Windows' },
  { name: 'python', label: 'Python' },
  { name: 'javascript', label: 'JavaScript' },
  { name: 'cpp', label: 'C++' },
  { name: 'html', label: 'HTML' },
  { name: 'css', label: 'CSS' },
  { name: 'telegram', label: 'Telegram bot' },
]

export default function Code() {
  const root = useRef<HTMLElement>(null)
  useGsap(root, () => {
    gsap.to('.code-marquee', {
      xPercent: -20,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
  return (
    <section id="kod" ref={root} className="relative overflow-hidden px-6 py-28 md:px-16 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_20%,rgba(0,229,255,0.12),transparent),radial-gradient(50%_50%_at_10%_90%,rgba(124,77,255,0.14),transparent)]" />
      <div className="code-marquee pointer-events-none absolute top-16 left-0 font-display text-[18vw] leading-none font-extrabold whitespace-nowrap text-white/[0.025] select-none">
        {'<Python/> {JavaScript} C++ #HTML .CSS $bash'}
      </div>

      <div className="relative grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="kicker mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-[#00e5ff]" /> 02 · Kod
          </p>
          <h2 data-split className="display text-[clamp(2.4rem,6vw,5.5rem)]">
            <Split text="Dasturlash" charClass="text-[#00e5ff]" />
            <br />
            <Split text="va Tizimlar" />
          </h2>
          {TEXT.code.body.map((p, i) => (
            <p key={i} data-reveal data-delay={0.1 * i} className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              {p}
            </p>
          ))}
          <div data-stagger className="mt-10 grid grid-cols-4 gap-x-4 gap-y-7 sm:gap-x-6">
            {TILES.map((t) => (
              <IconTile key={t.name} name={t.name} label={t.label} size={68} />
            ))}
          </div>
        </div>
        <div data-reveal>
          <Terminal />
        </div>
      </div>
    </section>
  )
}
