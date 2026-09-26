import { useRef } from 'react'
import { Brain } from 'lucide-react'
import { TEXT } from '../../config'
import { gsap, useGsap } from '../../lib/motion'
import { BrandIcon } from '../../lib/icons'

// Tinch boʻlim: matn kinodagi subtitr kabi soʻzma-soʻz yonadi
export default function Truth() {
  const root = useRef<HTMLElement>(null)
  useGsap(root, (el) => {
    gsap.fromTo(
      el.querySelectorAll('.tw'),
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: el.querySelector('.truth-text'), start: 'top 75%', end: 'bottom 45%', scrub: true },
      },
    )
    gsap.fromTo('.flow-line', { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.3, scrollTrigger: { trigger: '.flow', start: 'top 80%' } })
  })

  return (
    <section id="haqiqat" ref={root} className="relative px-6 py-32 md:px-16 md:py-48">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_30%,rgba(255,255,255,0.05),transparent)]" />
      <div className="relative mx-auto max-w-4xl">
        <div className="mb-10 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full border border-[#ffc400]/50 text-lg">⚠️</span>
          <p className="kicker">07 · {TEXT.truth.title}</p>
        </div>
        <div className="truth-text space-y-8">
          {TEXT.truth.lines.map((line, i) => (
            <p key={i} className={`font-display leading-snug font-medium ${i === 1 ? 'text-[clamp(1.5rem,3.4vw,2.8rem)] text-white' : 'text-[clamp(1.15rem,2.4vw,1.9rem)] text-white/90'}`}>
              {line.split(' ').map((w, k) => (
                <span key={k} className="tw">
                  {w}{' '}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Notion → Anki → Xotira */}
        <div className="flow mt-20 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 md:gap-4">
          {[
            { node: <BrandIcon name="notion" size={30} />, t: 'Notion', s: 'Hujjatlashtirish', c: '#ffffff' },
            null,
            { node: <BrandIcon name="anki" size={30} />, t: 'Anki', s: 'Takrorlash', c: '#80c2ee' },
            null,
            { node: <Brain className="size-7 text-[#c6ff00]" />, t: 'Xotira', s: 'Esda qoladi', c: '#c6ff00' },
          ].map((n, i) =>
            n ? (
              <div key={i} data-reveal data-delay={i * 0.1} className="glass flex flex-col items-center gap-2 !rounded-2xl p-4 text-center md:p-6" style={{ boxShadow: `0 20px 50px -25px ${n.c}` }}>
                <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-black/40">{n.node}</span>
                <span className="font-display text-sm font-bold md:text-base">{n.t}</span>
                <span className="font-mono text-[10px] text-white/45">{n.s}</span>
              </div>
            ) : (
              <svg key={i} viewBox="0 0 60 12" className="w-8 md:w-16">
                <path className="flow-line" d="M0 6 H52 M46 1 L54 6 L46 11" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="200" />
              </svg>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
