import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'
import type { TransitionKind } from '../config'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
export const isTouch = () => matchMedia('(pointer: coarse)').matches

// GSAP animatsiyalarini komponent ichida xavfsiz ishga tushirish (unmountda tozalanadi)
export function useGsap(scope: RefObject<HTMLElement | null>, fn: (self: HTMLElement) => void, deps: unknown[] = []) {
  useLayoutEffect(() => {
    if (!scope.current) return
    const ctx = gsap.context(() => fn(scope.current!), scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// Matnni harflarga boʻlish: har bir soʻz sinmaydi, harflar alohida animatsiyalanadi
export function Split({
  text,
  className,
  charClass = '',
}: {
  text: string
  className?: string
  charClass?: string
}) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(w).map((c, ci) => (
            <span key={ci} className={`split-char ${charClass}`}>
              {c}
            </span>
          ))}
          {wi < words.length - 1 && <span className="split-char">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

// ---- Perehodlar shinasi: istalgan joydan perehod chaqirish ----
type Listener = (k: TransitionKind, color: string) => void
const listeners = new Set<Listener>()
export const transitions = {
  play(kind: TransitionKind, color = '#ffffff') {
    listeners.forEach((l) => l(kind, color))
  },
  on(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

// Sahifadagi [data-split] sarlavhalar va [data-reveal] bloklarini scrollda ochish
export function initReveals() {
  if (reducedMotion()) return () => {}
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
      const chars = el.querySelectorAll('.split-char')
      gsap.fromTo(
        chars,
        { yPercent: 110, rotateX: -80, opacity: 0, filter: 'blur(8px)' },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.018,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        },
      )
    })
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      const kind = el.dataset.reveal
      const from =
        kind === 'clip'
          ? { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 }
          : kind === 'left'
            ? { x: -60, opacity: 0 }
            : { y: 50, opacity: 0 }
      const to =
        kind === 'clip' ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 } : { x: 0, y: 0, opacity: 1 }
      gsap.fromTo(el, from, {
        ...to,
        duration: 1.2,
        ease: 'expo.out',
        delay: Number(el.dataset.delay ?? 0),
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    })
    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((el) => {
      gsap.fromTo(
        el.children,
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'back.out(1.6)',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        },
      )
    })
  })
  return () => ctx.revert()
}
