import { useEffect, useRef, useState, type PointerEvent as RPE } from 'react'
import { Scissors, Palette, Spline, Wand2, Play } from 'lucide-react'
import { TEXT, SHOWREEL_URL, type TransitionKind } from '../../config'
import { gsap, Split, transitions, useGsap } from '../../lib/motion'
import { IconTile } from '../../lib/icons'
import Scene, { type SceneVariant } from '../fx/Scene'

type Mode = 'cut' | 'color' | 'motion' | 'fx'
const MODES: { id: Mode; label: string; page: string; icon: typeof Scissors; color: string; hint: string }[] = [
  { id: 'cut', label: 'Montaj', page: 'Cut', icon: Scissors, color: '#ff2e88', hint: 'Kadrlarni kesish, ritmga tushirish, hikoya qurish.' },
  { id: 'color', label: 'Rang', page: 'Color', icon: Palette, color: '#ff8a00', hint: 'LOG → tayyor koʻrinish. Chiziqni suring, gʻildiraklarni aylantiring.' },
  { id: 'motion', label: 'Motion', page: 'Fusion', icon: Spline, color: '#b388ff', hint: 'Keyframe va easing egri chizigʻi — harakatga "jon" beradi.' },
  { id: 'fx', label: 'Perehod', page: 'Effects', icon: Wand2, color: '#00e5ff', hint: 'Tugmani bosing — perehod butun saytda oʻynaydi.' },
]
const SHOTS: SceneVariant[] = ['sunset', 'night', 'morning']

// ---------- Rang gʻildiragi (Lift / Gamma / Gain) ----------
function Wheel({ label, value, onChange }: { label: string; value: { x: number; y: number }; onChange: (v: { x: number; y: number }) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = (e: RPE) => {
    if (e.buttons !== 1 && e.type !== 'pointerdown') return
    const r = ref.current!.getBoundingClientRect()
    let x = ((e.clientX - r.left) / r.width) * 2 - 1
    let y = ((e.clientY - r.top) / r.height) * 2 - 1
    const d = Math.hypot(x, y)
    if (d > 1) {
      x /= d
      y /= d
    }
    onChange({ x, y })
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref}
        onPointerDown={(e) => {
          ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
          drag(e)
        }}
        onPointerMove={drag}
        data-cursor="Drag"
        className="relative size-20 touch-none rounded-full border border-white/20 shadow-[inset_0_0_0_6px_#101017] md:size-24"
        style={{ background: 'radial-gradient(circle, #fff 0%, transparent 62%), conic-gradient(from 90deg, #f44, #ff0, #4f4, #0ff, #44f, #f0f, #f44)' }}
      >
        <span className="absolute inset-[34%] rounded-full bg-[#101017]/70" />
        <span
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow"
          style={{ left: `${50 + value.x * 42}%`, top: `${50 + value.y * 42}%` }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">{label}</span>
    </div>
  )
}

function ColorPanel({ grade, setGrade }: { grade: Record<string, { x: number; y: number }>; setGrade: (g: Record<string, { x: number; y: number }>) => void }) {
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex justify-around gap-2">
        {(['lift', 'gamma', 'gain'] as const).map((k) => (
          <Wheel key={k} label={k} value={grade[k]} onChange={(v) => setGrade({ ...grade, [k]: v })} />
        ))}
      </div>
      <p className="text-center font-mono text-[10px] text-white/40">Primaries · Color Wheels</p>
    </div>
  )
}

function gradeFilter(g: Record<string, { x: number; y: number }>) {
  const hue = Math.atan2(g.gain.y, g.gain.x) * (180 / Math.PI) * Math.hypot(g.gain.x, g.gain.y) * 0.5
  const sat = 1.25 + Math.hypot(g.gamma.x, g.gamma.y) * 0.8
  const bright = 1 - g.lift.y * 0.25
  return `saturate(${sat.toFixed(2)}) contrast(1.12) hue-rotate(${hue.toFixed(0)}deg) brightness(${bright.toFixed(2)})`
}

// ---------- Keyframe grafigi ----------
function MotionPanel() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <svg viewBox="0 0 220 120" className="w-full">
        <defs>
          <linearGradient id="mcurve" x1="0" x2="1">
            <stop offset="0" stopColor="#b388ff" />
            <stop offset="1" stopColor="#ff80ab" />
          </linearGradient>
        </defs>
        {[20, 50, 80, 110].map((y) => (
          <line key={y} x1="0" x2="220" y1={y} y2={y} stroke="#fff" strokeOpacity="0.06" />
        ))}
        <path id="mpath" d="M10 110 C 120 110, 90 10, 210 10" fill="none" stroke="url(#mcurve)" strokeWidth="2.5" />
        <line x1="10" y1="110" x2="120" y2="110" stroke="#fff" strokeOpacity="0.35" strokeDasharray="3 3" />
        <line x1="210" y1="10" x2="90" y2="10" stroke="#fff" strokeOpacity="0.35" strokeDasharray="3 3" />
        <circle cx="120" cy="110" r="4" fill="#fff" />
        <circle cx="90" cy="10" r="4" fill="#fff" />
        <rect x="5" y="105" width="10" height="10" transform="rotate(45 10 110)" fill="#ffc400" />
        <rect x="205" y="5" width="10" height="10" transform="rotate(45 210 10)" fill="#ffc400" />
        <circle r="6" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px #ff80ab)' }}>
          <animateMotion dur="2.2s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.8;1" calcMode="linear">
            <mpath href="#mpath" />
          </animateMotion>
        </circle>
      </svg>
      <div className="flex items-center justify-between font-mono text-[10px] text-white/45">
        <span>Position · Y</span>
        <span className="text-[#ff80ab]">cubic-bezier(.7,0,.2,1)</span>
      </div>
    </div>
  )
}

const FX: { k: TransitionKind; label: string }[] = [
  { k: 'flash', label: 'Flash' },
  { k: 'leak', label: 'Light leak' },
  { k: 'glitch', label: 'Glitch' },
  { k: 'whip', label: 'Whip-pan' },
  { k: 'iris', label: 'Iris' },
]

function FxPanel({ onPlay }: { onPlay: (k: TransitionKind) => void }) {
  return (
    <div className="grid h-full grid-cols-2 content-center gap-2">
      {FX.map((f) => (
        <button
          key={f.k}
          onClick={() => onPlay(f.k)}
          data-cursor="Play"
          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-xs font-medium transition hover:border-[#00e5ff] hover:bg-[#00e5ff]/10 last:col-span-2"
        >
          <Play className="size-3 fill-[#00e5ff] text-[#00e5ff] transition group-hover:scale-125" />
          {f.label}
        </button>
      ))}
    </div>
  )
}

export default function Media() {
  const root = useRef<HTMLElement>(null)
  const [p, setP] = useState(0)
  const [mode, setMode] = useState<Mode>('cut')
  const [shot, setShot] = useState(0)
  const [flash, setFlash] = useState(0)
  const [split, setSplit] = useState(50)
  const [grade, setGrade] = useState({ lift: { x: 0, y: 0.1 }, gamma: { x: 0.3, y: -0.2 }, gain: { x: 0.45, y: 0.2 } })
  const viewer = useRef<HTMLDivElement>(null)

  useGsap(root, (el) => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: el.querySelector('.media-pin'),
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: true,
          onUpdate: (st) => {
            setP(st.progress)
            setMode(MODES[Math.min(3, Math.floor(st.progress * 4))].id)
          },
        },
      })
    })
    mm.add('(max-width: 1023px)', () => {
      const o = { v: 0 }
      gsap.to(o, { v: 1, duration: 12, ease: 'none', repeat: -1, onUpdate: () => setP(o.v) })
    })
  })

  // Montaj rejimi: kadrlar ritm bilan almashadi
  useEffect(() => {
    if (mode !== 'cut') return
    const id = setInterval(() => {
      setShot((s) => (s + 1) % SHOTS.length)
      setFlash((f) => f + 1)
    }, 1100)
    return () => clearInterval(id)
  }, [mode])

  const dragSplit = (e: RPE) => {
    if (e.buttons !== 1 && e.type !== 'pointerdown') return
    const r = viewer.current!.getBoundingClientRect()
    setSplit(Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100)))
  }

  const playFx = (k: TransitionKind) => {
    transitions.play(k, '#00e5ff')
    setTimeout(() => setShot((s) => (s + 1) % SHOTS.length), 250)
  }

  const current = MODES.find((m) => m.id === mode)!
  const tc = (x: number) => {
    const s = x * 48
    return `01:00:${String(Math.floor(s)).padStart(2, '0')}:${String(Math.floor((s % 1) * 24)).padStart(2, '0')}`
  }

  return (
    <section id="media" ref={root} className="relative">
      <div className="media-pin relative flex min-h-svh items-center overflow-hidden px-4 py-24 md:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_30%,rgba(255,46,136,0.16),transparent),radial-gradient(40%_50%_at_90%_80%,rgba(255,138,0,0.14),transparent)]" />
        <div className="relative grid w-full items-center gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-12">
          {/* Chap: matn */}
          <div>
            <p className="kicker mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-[#ff2e88]" /> 03 · Media
            </p>
            <h2 data-split className="display text-[clamp(2.4rem,5vw,4.8rem)]">
              <Split text="Media" charClass="text-[#ff2e88]" />
              <br />
              <Split text="va Vizual" />
            </h2>
            <p data-reveal className="mt-5 max-w-md text-base leading-relaxed text-white/75">
              {TEXT.media.body}
            </p>
            <div data-stagger className="mt-8 grid max-w-md grid-cols-4 gap-3">
              <IconTile name="davinci" label="DaVinci" note="Rang" size={62} />
              <IconTile name="premiere" label="Premiere" note="Montaj" size={62} />
              <IconTile name="aftereffects" label="After Eff." note="Motion" size={62} />
              <IconTile name="capcut" label="CapCut" note="Tez edit" size={62} />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="chip transition"
                  style={mode === m.id ? { borderColor: m.color, background: `${m.color}22`, color: '#fff' } : undefined}
                >
                  <m.icon className="size-3.5" style={{ color: m.color }} /> {m.label}
                </button>
              ))}
            </div>
            <p className="mt-4 min-h-10 max-w-md font-mono text-xs text-white/50">→ {current.hint}</p>
          </div>

          {/* Oʻng: NLE oynasi */}
          <div data-reveal="clip" className="glass overflow-hidden !rounded-2xl !bg-[#0d0d13]/90">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-[11px] text-white/50">NUNU_SHOWREEL.drp</span>
              </div>
              <div className="hidden gap-1 sm:flex">
                {MODES.map((m) => (
                  <span
                    key={m.id}
                    className="rounded px-2 py-0.5 font-mono text-[10px] transition"
                    style={mode === m.id ? { background: m.color, color: '#000' } : { color: 'rgba(255,255,255,0.4)' }}
                  >
                    {m.page}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-px bg-white/5 md:grid-cols-[1.7fr_1fr]">
              {/* Viewer */}
              <div className="bg-[#08080c] p-3">
                <div
                  ref={viewer}
                  className="relative aspect-video overflow-hidden rounded-md bg-black"
                  onPointerDown={(e) => {
                    if (mode !== 'color') return
                    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
                    dragSplit(e)
                  }}
                  onPointerMove={(e) => mode === 'color' && dragSplit(e)}
                  data-cursor={mode === 'color' ? 'Drag' : undefined}
                  style={{ touchAction: mode === 'color' ? 'none' : undefined }}
                >
                  {SHOWREEL_URL && mode === 'cut' ? (
                    <video src={SHOWREEL_URL} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />
                  ) : mode === 'color' ? (
                    <>
                      <Scene variant="sunset" className="absolute inset-0 size-full" style={{ filter: gradeFilter(grade) }} />
                      <Scene
                        variant="sunset"
                        className="absolute inset-0 size-full"
                        style={{ filter: 'saturate(0.3) contrast(0.72) brightness(1.12)', clipPath: `inset(0 ${100 - split}% 0 0)` }}
                      />
                      <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_#fff]" style={{ left: `${split}%` }}>
                        <span className="absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-black/60 text-[10px] backdrop-blur">⇆</span>
                      </div>
                      <span className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px]">LOG</span>
                      <span className="absolute top-2 right-2 rounded bg-[#ff8a00] px-1.5 py-0.5 font-mono text-[10px] text-black">GRADED</span>
                    </>
                  ) : mode === 'motion' ? (
                    <>
                      <Scene variant="dream" className="absolute inset-0 size-full" />
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="motion-title pixel text-[clamp(2rem,6vw,4.5rem)] font-bold text-white [text-shadow:0_4px_0_#7c4dff,0_8px_30px_rgba(0,0,0,0.5)]">NUNU</div>
                      </div>
                      <span className="motion-diamond absolute top-1/2 left-1/2 size-4 rotate-45 bg-[#ffc400] shadow-[0_0_20px_#ffc400]" />
                    </>
                  ) : (
                    <Scene variant={SHOTS[shot]} className="absolute inset-0 size-full transition-transform duration-700" style={{ transform: `scale(${1.05 + (shot % 2) * 0.06})` }} />
                  )}
                  {mode === 'cut' && (
                    <>
                      <span key={flash} className="cut-flash absolute inset-0 bg-white" />
                      <span className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px]">SHOT 0{shot + 1}/03</span>
                    </>
                  )}
                  <span className="absolute right-2 bottom-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/80">{tc(p)}</span>
                  {/* safe-frame */}
                  <span className="pointer-events-none absolute inset-[6%] border border-white/15" />
                </div>
              </div>
              {/* Inspector */}
              <div className="min-h-[190px] bg-[#0b0b10] p-4">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: current.color }}>
                  <current.icon className="size-3.5" /> {current.page} · Inspector
                </div>
                {mode === 'color' ? (
                  <ColorPanel grade={grade} setGrade={setGrade as never} />
                ) : mode === 'motion' ? (
                  <MotionPanel />
                ) : mode === 'fx' ? (
                  <FxPanel onPlay={playFx} />
                ) : (
                  <div className="flex h-full flex-col justify-center gap-2 font-mono text-[11px] text-white/60">
                    {['Clip: Togʻ_quyosh.mov', 'Clip: Tungi_koʻl.mov', 'Clip: Tong_oʻrmon.mov'].map((c, i) => (
                      <div key={c} className={`flex items-center justify-between rounded border px-2 py-1.5 transition ${i === shot ? 'border-[#ff2e88] bg-[#ff2e88]/10 text-white' : 'border-white/5'}`}>
                        <span>{c}</span>
                        <span className="text-white/35">00:0{i + 1}:12</span>
                      </div>
                    ))}
                    <div className="mt-1 text-[10px] text-white/35">Blade (B) · Ripple delete · J-K-L</div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative border-t border-white/10 bg-[#09090d] px-3 pt-2 pb-3">
              <div className="mb-1.5 flex justify-between font-mono text-[9px] text-white/30">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className={i % 2 ? 'max-sm:hidden' : ''}>
                    01:00:{String(i * 6).padStart(2, '0')}
                  </span>
                ))}
              </div>
              <div className="space-y-1.5">
                {[
                  { t: 'V2', clips: [[2, 18, '#7c4dff', 'Title'], [52, 22, '#b388ff', 'NUNU ▸ motion'], [80, 16, '#00e5ff', 'FX']] },
                  { t: 'V1', clips: [[0, 24, '#ff2e88', 'Togʻ_quyosh'], [25, 24, '#ff8a00', 'Tungi_koʻl · grade'], [50, 24, '#c2185b', 'Tong_oʻrmon'], [75, 25, '#00838f', 'Final']] },
                  { t: 'A1', clips: [[0, 100, '#00e676', '']] },
                ].map((tr) => (
                  <div key={tr.t} className="flex items-center gap-2">
                    <span className="w-6 font-mono text-[9px] text-white/40">{tr.t}</span>
                    <div className="relative h-6 flex-1 rounded-sm bg-white/[0.03]">
                      {tr.clips.map(([l, w, c, n], i) => (
                        <span
                          key={i}
                          className="absolute inset-y-0 overflow-hidden rounded-sm border-l-2 px-1.5 font-mono text-[9px] leading-6 whitespace-nowrap text-white/90"
                          style={{ left: `${l}%`, width: `${w}%`, background: `${c}55`, borderColor: c as string }}
                        >
                          {tr.t === 'A1' ? (
                            <span className="flex h-full items-center gap-[2px]">
                              {Array.from({ length: 90 }).map((_, k) => (
                                <i key={k} className="w-[2px] shrink-0 bg-[#00e676]/70" style={{ height: `${20 + Math.abs(Math.sin(k * 0.7) * Math.cos(k * 0.23)) * 70}%` }} />
                              ))}
                            </span>
                          ) : (
                            n
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute top-0 bottom-0 ml-8" style={{ left: `calc(12px + (100% - 56px) * ${p})` }}>
                <span className="absolute -top-0 -left-[5px] border-x-[5px] border-t-[7px] border-x-transparent border-t-[#ff3b3b]" />
                <span className="absolute inset-y-0 w-px bg-[#ff3b3b] shadow-[0_0_8px_#ff3b3b]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .cut-flash { animation: cutflash .35s ease-out forwards; }
        @keyframes cutflash { 0% { opacity: .7 } 100% { opacity: 0 } }
        .motion-title { animation: mtitle 2.2s cubic-bezier(.7,0,.2,1) infinite; }
        @keyframes mtitle { 0% { transform: translateY(60%) scale(.7); opacity: 0; letter-spacing: .6em } 45%,80% { transform: none; opacity: 1; letter-spacing: 0 } 100% { transform: translateY(-40%) scale(1.1); opacity: 0 } }
        .motion-diamond { animation: mdia 2.2s cubic-bezier(.7,0,.2,1) infinite; }
        @keyframes mdia { 0% { transform: translate(-220px, 80px) rotate(45deg) } 80%,100% { transform: translate(200px, -90px) rotate(405deg) } }
      `}</style>
    </section>
  )
}
