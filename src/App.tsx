import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { SECTIONS } from './config'
import { gsap, initReveals, reducedMotion, ScrollTrigger, transitions } from './lib/motion'
import Preloader from './components/fx/Preloader'
import Cursor from './components/fx/Cursor'
import Viewfinder from './components/fx/Viewfinder'
import TransitionLayer from './components/fx/TransitionLayer'
import Hero from './components/sections/Hero'
import Journey from './components/sections/Journey'
import Code from './components/sections/Code'
import Media from './components/sections/Media'
import AI from './components/sections/AI'
import Marketing from './components/sections/Marketing'
import Sport from './components/sections/Sport'
import Truth from './components/sections/Truth'
import Goal from './components/sections/Goal'
import Contact from './components/sections/Contact'

export default function App() {
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(0)
  const lenis = useRef<Lenis | null>(null)
  const done = useCallback(() => setReady(true), [])

  // Silliq scroll (Lenis) + GSAP ScrollTrigger bilan sinxron
  useEffect(() => {
    // Intro har doim boshidan koʻrinsin (brauzer eski scroll joyini tiklamasin)
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (reducedMotion()) return
    const l = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenis.current = l
    if (import.meta.env.DEV) (window as unknown as { __lenis: Lenis }).__lenis = l
    l.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
    }
  }, [])

  useEffect(() => {
    if (ready) lenis.current?.start()
    else lenis.current?.stop()
  }, [ready])

  // Boʻlim almashganda: hotbar yangilanadi va montaj perehodi oʻynaydi
  useEffect(() => {
    if (!ready) return
    const cleanupReveals = initReveals()
    let last = 0
    const triggers = SECTIONS.map((s, i) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (!self.isActive) return
          setActive(i)
          const now = performance.now()
          if (i > 0 && now - last > 900) transitions.play(s.transition, s.color)
          last = now
        },
      }),
    )
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      clearTimeout(refresh)
      triggers.forEach((t) => t.kill())
      cleanupReveals()
    }
  }, [ready])

  // Ichki #havolalar ham silliq scroll qilsin
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!a) return
      e.preventDefault()
      const id = a.getAttribute('href')!
      lenis.current ? lenis.current.scrollTo(id, { duration: 1.6 }) : document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const jump = (i: number) => {
    const target = `#${SECTIONS[i].id}`
    lenis.current ? lenis.current.scrollTo(target, { duration: 1.8 }) : document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {!ready && <Preloader onDone={done} />}
      <Cursor />
      <TransitionLayer />
      {ready && <Viewfinder active={active} onJump={jump} />}
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />
      <main id="app-main">
        <Hero ready={ready} />
        <Journey />
        <Code />
        <Media />
        <AI />
        <Marketing />
        <Sport />
        <Truth />
        <Goal />
        <Contact />
      </main>
    </>
  )
}
