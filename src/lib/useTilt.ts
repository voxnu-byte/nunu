import { useCallback, useRef } from 'react'

// Sichqoncha ostida elementni 3D egish va yaltiroq nuqtasini (--mx/--my) siljitish
export function useTilt<T extends HTMLElement>(max = 10) {
  const cleanup = useRef<() => void>(undefined)
  return useCallback(
    (el: T | null) => {
      cleanup.current?.()
      if (!el || matchMedia('(pointer: coarse)').matches) return
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        el.style.transform = `perspective(700px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateZ(0)`
        el.style.setProperty('--mx', `${x * 100}%`)
        el.style.setProperty('--my', `${y * 100}%`)
      }
      const leave = () => {
        el.style.transform = ''
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      cleanup.current = () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    [max],
  )
}
