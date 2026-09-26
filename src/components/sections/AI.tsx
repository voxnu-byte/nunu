import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Sparkles, Image as ImageIcon, Video } from 'lucide-react'
import { TEXT } from '../../config'
import { ScrollTrigger, Split } from '../../lib/motion'
import { IconTile } from '../../lib/icons'
import Scene, { type SceneVariant } from '../fx/Scene'

const AIBlob = lazy(() => import('../three/AIBlob'))

// Shovqindan tiniq rasmga — diffuziya jarayoniga oʻxshash ochilish
function Generated({ variant, start, label }: { variant: SceneVariant; start: boolean; label: string }) {
  const cv = useRef<HTMLCanvasElement>(null)
  const [done, setDone] = useState(false)
  const [blur, setBlur] = useState(18)
  useEffect(() => {
    const c = cv.current!
    const ctx = c.getContext('2d')!
    const W = (c.width = 64)
    const H = (c.height = 64)
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const v = Math.random() * 255
        ctx.fillStyle = `rgb(${v * 0.9},${v * 0.7},${v})`
        ctx.fillRect(x, y, 1, 1)
      }
    if (!start) return
    let raf = 0
    let t0 = 0
    const cells = Array.from({ length: W * H }, (_, i) => i).sort(() => Math.random() - 0.5)
    let cleared = 0
    const step = (t: number) => {
      if (!t0) t0 = t
      const p = Math.min(1, (t - t0) / 1800)
      const target = Math.floor(cells.length * p * p)
      for (; cleared < target; cleared++) {
        const i = cells[cleared]
        ctx.clearRect(i % W, Math.floor(i / W), 1, 1)
      }
      setBlur(18 * (1 - p))
      if (p < 1) raf = requestAnimationFrame(step)
      else setDone(true)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [start])
  return (
    <figure className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black">
      <Scene variant={variant} className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-110" style={{ filter: `blur(${blur}px) saturate(1.2)` }} />
      <canvas ref={cv} className="absolute inset-0 size-full [image-rendering:pixelated]" />
      <figcaption className={`absolute inset-x-2 bottom-2 flex items-center justify-between rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] backdrop-blur transition-opacity ${done ? 'opacity-100' : 'opacity-0'}`}>
        <span>{label}</span>
        <span className="text-[#a0ffe6]">✓ 30/30</span>
      </figcaption>
    </figure>
  )
}

const IMAGES: { v: SceneVariant; label: string }[] = [
  { v: 'sunset', label: 'seed 4031' },
  { v: 'night', label: 'seed 1187' },
  { v: 'morning', label: 'seed 2250' },
  { v: 'dream', label: 'seed 9004' },
]

export default function AI() {
  const panel = useRef<HTMLDivElement>(null)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'idle' | 'typing' | 'gen' | 'done'>('idle')
  const [step, setStep] = useState(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: panel.current,
      start: 'top 70%',
      once: true,
      onEnter: async () => {
        const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
        setPhase('typing')
        const txt = TEXT.ai.prompt
        for (let i = 1; i <= txt.length; i++) {
          setTyped(txt.slice(0, i))
          await wait(22)
        }
        await wait(300)
        setPhase('gen')
        for (let s = 1; s <= 30; s++) {
          setStep(s)
          await wait(60)
        }
        setPhase('done')
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section id="ai" className="relative overflow-hidden px-6 py-28 md:px-16 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_75%_30%,rgba(179,136,255,0.18),transparent),radial-gradient(40%_40%_at_20%_80%,rgba(160,255,230,0.1),transparent)]" />
      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <p className="kicker mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-[#b388ff]" /> 04 · Sun'iy intellekt
          </p>
          <h2 data-split className="display text-[clamp(2.4rem,6vw,5.5rem)]">
            <Split text="Generative" />
            <br />
            <Split text="AI" charClass="text-[#b388ff]" />
          </h2>
          <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
            {TEXT.ai.body}
          </p>
          <div data-stagger className="mt-8 flex gap-5">
            <IconTile name="sparkles" label="Rasm" size={64} />
            <IconTile name="film" label="Video" size={64} />
            <IconTile name="wand" label="Prompt" size={64} />
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(179,136,255,0.35),transparent_65%)] blur-2xl" />
          <Suspense fallback={null}>
            <AIBlob />
          </Suspense>
          <span className="pixel pointer-events-none absolute top-[12%] right-[6%] rotate-6 rounded border-2 border-[#b388ff]/40 bg-black/50 px-2 py-1 text-xs text-[#d1b3ff] backdrop-blur">hover me ✦</span>
        </div>
      </div>

      {/* Prompt → natija */}
      <div ref={panel} data-reveal className="glass glow-border relative mt-16 p-4 md:p-6" style={{ ['--accent' as string]: '#b388ff' }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
            <Sparkles className="size-4 shrink-0 text-[#b388ff]" />
            <span className={`font-mono text-xs text-white/85 md:text-sm ${phase === 'typing' ? 'caret' : ''}`}>{typed || ' '}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip !py-2 font-mono !text-[11px]">
              <ImageIcon className="size-3.5 text-[#a0ffe6]" /> 1:1 · 4×
            </span>
            <span className="chip !py-2 font-mono !text-[11px]">
              <Video className="size-3.5 text-[#ff80ab]" /> 5s
            </span>
            <span className="rounded-full bg-gradient-to-r from-[#a0ffe6] via-[#b388ff] to-[#ff80ab] px-5 py-2 text-xs font-bold text-black">
              {phase === 'gen' ? `Step ${step}/30` : phase === 'done' ? 'Tayyor ✓' : 'Generate'}
            </span>
          </div>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded bg-white/5">
          <div className="h-full bg-gradient-to-r from-[#a0ffe6] via-[#b388ff] to-[#ff80ab] transition-[width] duration-100" style={{ width: `${(step / 30) * 100}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {IMAGES.map((im, i) => (
            <Generated key={im.v} variant={im.v} label={im.label} start={phase === 'done' || (phase === 'gen' && step > 6 + i * 5)} />
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] text-white/35">* Namuna: bu yerga oʻzingiz yaratgan AI rasmlar qoʻyiladi.</p>
      </div>
    </section>
  )
}
