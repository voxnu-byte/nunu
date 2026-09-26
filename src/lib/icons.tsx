import {
  siAnki,
  siCplusplus,
  siCss,
  siDavinciresolve,
  siGithub,
  siGmail,
  siGnubash,
  siGoogleads,
  siGoogleanalytics,
  siHtml5,
  siInstagram,
  siJavascript,
  siKdenlive,
  siLinux,
  siLinuxmint,
  siMeta,
  siNotion,
  siPython,
  siTelegram,
  siTiktok,
} from 'simple-icons'
import { Scissors, Sparkles, Target, Megaphone, Wand2, Film, Palette, Layers } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTilt } from './useTilt'

type SimpleIcon = { path: string; hex: string; title: string }

type IconDef = { accent: string; fg?: string; node: ReactNode }

const path = (d: string, fill: string) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill={fill} aria-hidden>
    <path d={d} />
  </svg>
)

const fromSimple = (ic: SimpleIcon, accent?: string, fg?: string): IconDef => {
  const a = accent ?? `#${ic.hex}`
  return { accent: a, fg: fg ?? a, node: path(ic.path, fg ?? a) }
}

const adobe = (letters: string, fg: string): ReactNode => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
    <rect x="1.2" y="2.2" width="21.6" height="19.6" rx="4.6" fill="#00005b" stroke={fg} strokeWidth="1.1" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="9.6"
      fontWeight="800"
      fontFamily="Inter Variable, Inter, sans-serif"
      fill={fg}
      letterSpacing="-0.3"
    >
      {letters}
    </text>
  </svg>
)

const lucide = (C: typeof Sparkles, color: string): ReactNode => (
  <C width="100%" height="100%" color={color} strokeWidth={1.8} aria-hidden />
)

export const ICONS: Record<string, IconDef> = {
  linux: fromSimple(siLinux),
  mint: fromSimple(siLinuxmint),
  windows: {
    accent: '#3a96dd',
    node: path('M2 3.2 10.4 2v9.4H2zM11.6 1.8 22 .4v11H11.6zM2 12.6h8.4V22L2 20.8zM11.6 12.6H22v11l-10.4-1.4z', '#3a96dd'),
  },
  python: fromSimple(siPython, '#4b8bbe', '#ffd43b'),
  javascript: fromSimple(siJavascript),
  cpp: fromSimple(siCplusplus, '#659ad2', '#659ad2'),
  html: fromSimple(siHtml5),
  css: fromSimple(siCss, '#8a5cf6', '#a78bfa'),
  telegram: fromSimple(siTelegram),
  bash: fromSimple(siGnubash),
  davinci: fromSimple(siDavinciresolve, '#ff6a3d', '#ffffff'),
  premiere: { accent: '#9999ff', node: adobe('Pr', '#9999ff') },
  aftereffects: { accent: '#d291ff', node: adobe('Ae', '#d291ff') },
  capcut: { accent: '#e8e8e8', node: lucide(Scissors, '#ffffff') },
  kdenlive: fromSimple(siKdenlive),
  instagram: fromSimple(siInstagram, '#ff2e88', '#ff5fa2'),
  meta: fromSimple(siMeta),
  tiktok: fromSimple(siTiktok, '#25f4ee', '#ffffff'),
  googleads: fromSimple(siGoogleads),
  analytics: fromSimple(siGoogleanalytics),
  github: fromSimple(siGithub, '#a78bfa', '#ffffff'),
  gmail: fromSimple(siGmail),
  notion: fromSimple(siNotion, '#ffffff', '#ffffff'),
  anki: fromSimple(siAnki),
  sparkles: { accent: '#b388ff', node: lucide(Sparkles, '#d1b3ff') },
  wand: { accent: '#ff80ab', node: lucide(Wand2, '#ff9ec0') },
  target: { accent: '#c6ff00', node: lucide(Target, '#c6ff00') },
  megaphone: { accent: '#00e676', node: lucide(Megaphone, '#4dffa0') },
  film: { accent: '#ff2e88', node: lucide(Film, '#ff6aa8') },
  palette: { accent: '#ff8a00', node: lucide(Palette, '#ffae4d') },
  layers: { accent: '#ff2e88', node: lucide(Layers, '#ff6aa8') },
}

export function BrandIcon({ name, size = 24 }: { name: string; size?: number }) {
  const ic = ICONS[name]
  if (!ic) return null
  return <span style={{ width: size, height: size, display: 'inline-block' }}>{ic.node}</span>
}

// Premium "shisha" ikonka plitkasi: brend rangida yorugʻlik, 3D egilish, yaltiroq
export function IconTile({
  name,
  label,
  size = 76,
  note,
}: {
  name: string
  label: string
  size?: number
  note?: string
}) {
  const ic = ICONS[name]
  const tilt = useTilt<HTMLDivElement>(14)
  if (!ic) return null
  return (
    <div className="icon-tile group" data-cursor="Koʻrish" style={{ ['--accent' as string]: ic.accent }}>
      <div
        ref={tilt}
        className="icon-tile__box"
        style={{ width: size, height: size, borderRadius: size * 0.26 }}
      >
        <span className="icon-tile__glare" />
        <span className="icon-tile__icon" style={{ width: size * 0.5, height: size * 0.5 }}>
          {ic.node}
        </span>
      </div>
      <span className="icon-tile__label">{label}</span>
      {note && <span className="icon-tile__note">{note}</span>}
    </div>
  )
}
