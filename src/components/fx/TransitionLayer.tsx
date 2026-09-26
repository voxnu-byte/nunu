import { useEffect, useRef } from 'react'
import { gsap, reducedMotion, transitions } from '../../lib/motion'

// Montajdagi haqiqiy perehodlar: flash, light leak, glitch, whip-pan, iris.
// Boʻlim almashganda qisqa (0.4–1s) overley sifatida oʻynaydi, scrollni toʻsmaydi.
export default function TransitionLayer() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    let running: gsap.core.Timeline | null = null

    const off = transitions.on((kind, color) => {
      if (reducedMotion()) return
      running?.progress(1)
      const tl = gsap.timeline()
      running = tl
      if (kind === 'flash') {
        tl.fromTo(q('.t-flash'), { opacity: 0 }, { opacity: 0.85, duration: 0.06 }).to(q('.t-flash'), {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
        })
      } else if (kind === 'leak') {
        tl.set(q('.t-leak'), { opacity: 1 })
          .fromTo(
            q('.t-leak span'),
            { xPercent: -140, scale: 0.8 },
            { xPercent: 160, scale: 1.3, duration: 1.3, ease: 'power2.inOut', stagger: 0.12 },
          )
          .to(q('.t-leak'), { opacity: 0, duration: 0.3 }, '-=0.3')
      } else if (kind === 'glitch') {
        const bars = q('.t-glitch i')
        tl.set(q('.t-glitch'), { opacity: 1 })
        for (let k = 0; k < 6; k++) {
          tl.set(bars, {
            top: () => `${Math.random() * 100}%`,
            height: () => `${2 + Math.random() * 10}%`,
            x: () => (Math.random() - 0.5) * 120,
            opacity: () => (Math.random() > 0.3 ? 0.9 : 0),
          }).to({}, { duration: 0.05 })
        }
        tl.set(q('.t-glitch'), { opacity: 0 })
      } else if (kind === 'whip') {
        tl.set(q('.t-whip'), { opacity: 1, background: `linear-gradient(90deg, transparent, ${color}, #fff, ${color}, transparent)` })
          .fromTo(q('.t-whip'), { xPercent: -120 }, { xPercent: 120, duration: 0.55, ease: 'power3.inOut' })
          .set(q('.t-whip'), { opacity: 0 })
      } else if (kind === 'iris') {
        tl.set(q('.t-iris'), { opacity: 1, borderColor: color })
          .fromTo(q('.t-iris'), { scale: 0 }, { scale: 3.2, duration: 0.9, ease: 'expo.out' })
          .to(q('.t-iris'), { opacity: 0, duration: 0.3 }, '-=0.4')
      }
    })
    return () => {
      off()
      running?.kill()
    }
  }, [])

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-[65] overflow-hidden" aria-hidden>
      <div className="t-flash absolute inset-0 bg-white opacity-0" />
      <div className="t-leak absolute inset-0 opacity-0 mix-blend-screen">
        <span className="absolute top-[-20%] left-0 h-[140%] w-[60%] rounded-full bg-[radial-gradient(closest-side,#ff8a00cc,#ff2e8866,transparent)] blur-3xl" />
        <span className="absolute top-[10%] left-0 h-[90%] w-[45%] rounded-full bg-[radial-gradient(closest-side,#ffd54fcc,#ff5f5f55,transparent)] blur-3xl" />
      </div>
      <div className="t-glitch absolute inset-0 opacity-0 mix-blend-screen">
        {Array.from({ length: 7 }).map((_, i) => (
          <i
            key={i}
            className="absolute left-0 w-full"
            style={{ background: i % 2 ? '#00e5ff' : '#ff2e88', mixBlendMode: 'difference' }}
          />
        ))}
      </div>
      <div className="t-whip absolute top-0 left-0 h-full w-[80%] opacity-0 mix-blend-overlay blur-2xl" />
      <div className="t-iris absolute top-1/2 left-1/2 -mt-[50vmax] -ml-[50vmax] size-[100vmax] rounded-full border-[6px] opacity-0" />
    </div>
  )
}
