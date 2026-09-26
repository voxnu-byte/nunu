import { useEffect, useRef, useState } from 'react'
import { gsap, isTouch } from '../../lib/motion'

// Nuqta + orqasidan ergashuvchi halqa. [data-cursor="Matn"] ustida kattalashib, yozuv chiqaradi.
// [data-magnetic] elementlar kursorga tortiladi.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => !isTouch())

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('has-cursor')
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.08 })
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.08 })
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })
    let magnet: HTMLElement | null = null

    const move = (e: PointerEvent) => {
      xd(e.clientX)
      yd(e.clientY)
      xr(e.clientX)
      yr(e.clientY)
      const t = e.target as HTMLElement
      const withLabel = t.closest<HTMLElement>('[data-cursor]')
      const hover = t.closest('a, button, [data-cursor]')
      setLabel(withLabel?.dataset.cursor ?? '')
      gsap.to(ring.current, {
        scale: withLabel ? 2.6 : hover ? 1.7 : 1,
        backgroundColor: withLabel ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0)',
        duration: 0.35,
      })
      const m = t.closest<HTMLElement>('[data-magnetic]')
      if (m !== magnet && magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
      magnet = m
      if (m) {
        const r = m.getBoundingClientRect()
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.3,
          y: (e.clientY - (r.top + r.height / 2)) * 0.3,
          duration: 0.4,
        })
      }
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.body.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 z-[90] -mt-5 -ml-5 grid size-10 place-items-center rounded-full border border-white/70 mix-blend-difference"
      >
        <span className="font-mono text-[5px] font-bold tracking-wider text-black uppercase">{label}</span>
      </div>
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-[91] -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-white mix-blend-difference"
      />
    </>
  )
}
