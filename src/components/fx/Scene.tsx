import { useMemo, type CSSProperties } from 'react'

// Togʻ manzaralari "kadrlari" — rasm fayllarisiz, SVG orqali chiziladi.
export type SceneVariant = 'sunset' | 'night' | 'morning' | 'dream'

const VARIANTS: Record<
  SceneVariant,
  { sky: [string, string, string]; sun: string; sunY: number; ridges: string[]; water: string; stars?: boolean; aurora?: boolean; clouds?: boolean; pines?: string }
> = {
  sunset: {
    sky: ['#1d1442', '#b8487a', '#ffb070'],
    sun: '#ffe0a3',
    sunY: 210,
    ridges: ['#7a3a6e', '#4c2358', '#2a1438', '#140a1f'],
    water: '#2a1438',
  },
  night: {
    sky: ['#02030f', '#0b1a3a', '#1f3a6b'],
    sun: '#e8f0ff',
    sunY: 80,
    ridges: ['#5a6f9a', '#3a4a70', '#1e2848', '#0b1024'],
    water: '#0b1024',
    stars: true,
    aurora: true,
  },
  morning: {
    sky: ['#6fb8ff', '#b8e0ff', '#fff3d6'],
    sun: '#fffbe8',
    sunY: 120,
    ridges: ['#9fb8d8', '#6f9a7a', '#3f7a4a', '#1f4a2a'],
    water: '#3f7aa8',
    clouds: true,
    pines: '#1a3d24',
  },
  dream: {
    sky: ['#2a0f4a', '#ff5fa2', '#ffd1a8'],
    sun: '#ffffff',
    sunY: 170,
    ridges: ['#b388ff', '#7c4dff', '#4a1f9a', '#1f0a45'],
    water: '#1f0a45',
    stars: true,
  },
}

function ridge(seed: number, base: number, amp: number) {
  let d = `M0 360 L0 ${base}`
  for (let x = 0; x <= 640; x += 10) {
    const y =
      base -
      amp *
        (0.55 * Math.abs(Math.sin(x * 0.009 + seed)) +
          0.3 * Math.sin(x * 0.023 + seed * 2.1) +
          0.15 * Math.sin(x * 0.061 + seed * 3.7))
    d += ` L${x} ${y.toFixed(1)}`
  }
  return d + ' L640 360 Z'
}

export default function Scene({
  variant,
  className,
  style,
  title,
}: {
  variant: SceneVariant
  className?: string
  style?: CSSProperties
  title?: string
}) {
  const v = VARIANTS[variant]
  const id = `sc-${variant}`
  const shapes = useMemo(
    () => ({
      ridges: v.ridges.map((_, i) => ridge(i * 1.7 + variant.length, 170 + i * 45, 110 - i * 18)),
      stars: Array.from({ length: 70 }, (_, i) => [(i * 97) % 640, (i * 53) % 190, (i % 3) * 0.4 + 0.5]),
    }),
    [v.ridges, variant],
  )
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" className={className} style={style} role="img" aria-label={title ?? `Togʻ manzarasi (${variant})`}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={v.sky[0]} />
          <stop offset="0.6" stopColor={v.sky[1]} />
          <stop offset="1" stopColor={v.sky[2]} />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor={v.sun} />
          <stop offset="0.35" stopColor={v.sun} stopOpacity="0.9" />
          <stop offset="1" stopColor={v.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-fog`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={v.sky[2]} stopOpacity="0" />
          <stop offset="1" stopColor={v.sky[2]} stopOpacity="0.55" />
        </linearGradient>
        <filter id={`${id}-blur`}>
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width="640" height="360" fill={`url(#${id}-sky)`} />
      {v.stars && shapes.stars.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.4 + (i % 5) * 0.12} />)}
      {v.aurora && (
        <path d="M-20 120 C120 40 220 150 340 80 S560 30 660 110 L660 160 C540 90 420 170 320 130 S120 110 -20 170Z" fill="#36ffb0" opacity="0.35" filter={`url(#${id}-blur)`} />
      )}
      <circle cx="420" cy={v.sunY} r="90" fill={`url(#${id}-sun)`} />
      <circle cx="420" cy={v.sunY} r="26" fill={v.sun} />
      {v.clouds && (
        <g fill="#fff" opacity="0.85">
          <rect x="60" y="60" width="90" height="14" rx="7" />
          <rect x="90" y="48" width="60" height="16" rx="8" />
          <rect x="470" y="90" width="110" height="14" rx="7" />
        </g>
      )}
      {shapes.ridges.map((d, i) => (
        <g key={i}>
          <path d={d} fill={v.ridges[i]} />
          {i === 0 && <path d={d} fill="#fff" opacity="0.12" style={{ clipPath: 'inset(0 0 70% 0)' }} />}
          {i < 2 && <rect y={120 + i * 45} width="640" height="240" fill={`url(#${id}-fog)`} opacity={0.6 - i * 0.2} />}
        </g>
      ))}
      {v.pines &&
        Array.from({ length: 16 }, (_, i) => {
          const x = 20 + i * 40 + (i % 3) * 7
          const y = 300 + (i % 4) * 8
          const h = 34 + (i % 3) * 10
          return <path key={i} d={`M${x} ${y - h} L${x - 11} ${y} L${x + 11} ${y}Z`} fill={v.pines} />
        })}
      <rect y="318" width="640" height="42" fill={v.water} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={380 - i * 10} y={324 + i * 8} width={80 + i * 20} height="2" fill={v.sun} opacity={0.5 - i * 0.1} />
      ))}
    </svg>
  )
}
