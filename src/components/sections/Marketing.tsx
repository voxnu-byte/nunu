import { useRef } from 'react'
import { TrendingUp, Eye, MousePointerClick, Heart } from 'lucide-react'
import { TEXT } from '../../config'
import { gsap, Split, useGsap } from '../../lib/motion'
import { IconTile } from '../../lib/icons'

const KPIS = [
  { icon: Eye, label: 'Qamrov (reach)', to: 48200, suffix: '', color: '#c6ff00' },
  { icon: MousePointerClick, label: 'CTR', to: 3.8, suffix: '%', color: '#00e676', dec: 1 },
  { icon: Heart, label: 'Engagement', to: 7.2, suffix: '%', color: '#ff80ab', dec: 1 },
  { icon: TrendingUp, label: 'CPC', to: 0.12, suffix: '$', color: '#00e5ff', dec: 2 },
]

const LINE = 'M0 150 C 40 140, 60 120, 90 124 S 150 90, 180 96 S 240 60, 270 58 S 330 30, 360 36 S 420 12, 460 8'

export default function Marketing() {
  const root = useRef<HTMLElement>(null)
  useGsap(root, (el) => {
    const st = { trigger: el.querySelector('.dash'), start: 'top 75%' }
    const path = el.querySelector<SVGPathElement>('.dash-line')!
    const len = path.getTotalLength()
    gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', scrollTrigger: st })
    gsap.fromTo('.dash-area', { opacity: 0 }, { opacity: 1, duration: 1.5, delay: 0.8, scrollTrigger: st })
    gsap.fromTo('.dash-bar', { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'elastic.out(1,0.6)', stagger: 0.06, scrollTrigger: st })
    gsap.fromTo('.dash-donut', { strokeDashoffset: 251 }, { strokeDashoffset: 251 * 0.32, duration: 2, ease: 'power3.out', scrollTrigger: st })
    el.querySelectorAll<HTMLElement>('.kpi').forEach((k) => {
      const to = Number(k.dataset.to)
      const dec = Number(k.dataset.dec ?? 0)
      const o = { v: 0 }
      gsap.to(o, {
        v: to,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: st,
        onUpdate: () => (k.textContent = o.v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })),
      })
    })
  })

  return (
    <section id="marketing" ref={root} className="relative overflow-hidden px-6 py-28 md:px-16 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_20%_40%,rgba(198,255,0,0.1),transparent),radial-gradient(40%_50%_at_90%_70%,rgba(0,230,118,0.12),transparent)]" />
      <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="kicker mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-[#c6ff00]" /> 05 · Oʻsish
          </p>
          <h2 data-split className="display text-[clamp(2.4rem,6vw,5.5rem)]">
            <Split text="Marketing" charClass="text-[#c6ff00]" />
          </h2>
          <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
            {TEXT.marketing.body}
          </p>
          <div data-stagger className="mt-8 grid max-w-md grid-cols-4 gap-3">
            <IconTile name="instagram" label="Instagram" size={60} />
            <IconTile name="meta" label="Meta Ads" size={60} />
            <IconTile name="telegram" label="Telegram" size={60} />
            <IconTile name="tiktok" label="TikTok" size={60} />
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {['SMM', 'Target reklama', 'Kontent reja', 'Auditoriya tahlili'].map((c) => (
              <span key={c} className="chip">
                <span className="size-1.5 rounded-full bg-[#c6ff00]" /> {c}
              </span>
            ))}
          </div>
        </div>

        <div data-reveal className="dash glass p-5 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">Kampaniya paneli</div>
              <div className="mt-1 font-display text-lg font-bold">Kuzgi kampaniya · Target</div>
            </div>
            <span className="rounded-full border border-[#c6ff00]/40 bg-[#c6ff00]/10 px-3 py-1 font-mono text-[10px] text-[#c6ff00]">DEMO · oʻquv</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {KPIS.map((k) => (
              <div key={k.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <k.icon className="size-4" style={{ color: k.color }} />
                <div className="mt-2 font-display text-xl font-bold md:text-2xl">
                  {k.suffix === '$' && <span className="text-white/50">$</span>}
                  <span className="kpi" data-to={k.to} data-dec={k.dec}>
                    0
                  </span>
                  {k.suffix === '%' && <span className="text-white/50">%</span>}
                </div>
                <div className="mt-0.5 text-[11px] text-white/45">{k.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-[1.6fr_1fr]">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="mb-2 font-mono text-[10px] text-white/40">Qamrov · 30 kun</div>
              <svg viewBox="0 0 460 160" className="w-full">
                <defs>
                  <linearGradient id="dl" x1="0" x2="1">
                    <stop offset="0" stopColor="#00e676" />
                    <stop offset="1" stopColor="#c6ff00" />
                  </linearGradient>
                  <linearGradient id="da" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#c6ff00" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#c6ff00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[40, 80, 120].map((y) => (
                  <line key={y} x1="0" x2="460" y1={y} y2={y} stroke="#fff" strokeOpacity="0.05" />
                ))}
                <path className="dash-area" d={`${LINE} L460 160 L0 160Z`} fill="url(#da)" />
                <path className="dash-line" d={LINE} fill="none" stroke="url(#dl)" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px #c6ff0088)' }} />
                <circle cx="460" cy="8" r="5" fill="#c6ff00" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              <div className="flex items-end gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-3" style={{ height: 110 }}>
                {[30, 45, 38, 60, 52, 75, 90].map((h, i) => (
                  <span key={i} className="dash-bar flex-1 origin-bottom rounded-t" style={{ height: `${h}%`, background: i === 6 ? '#c6ff00' : 'rgba(198,255,0,0.3)' }} />
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <svg viewBox="0 0 100 100" className="size-16 -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="12" />
                  <circle className="dash-donut" cx="50" cy="50" r="40" fill="none" stroke="#00e676" strokeWidth="12" strokeDasharray="251" strokeLinecap="round" />
                </svg>
                <div className="text-[11px] leading-tight text-white/60">
                  <div className="font-display text-lg font-bold text-white">68%</div>
                  Mobil auditoriya
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
