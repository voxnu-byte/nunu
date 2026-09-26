import { ArrowUpRight } from 'lucide-react'
import { LINKS, PERSON } from '../../config'
import { BrandIcon, ICONS } from '../../lib/icons'
import { Pixel } from '../../lib/pixel'

const CARDS = [
  { key: 'telegram', icon: 'telegram', title: 'Telegram', ...LINKS.telegram },
  { key: 'email', icon: 'gmail', title: 'Email', ...LINKS.email },
  { key: 'github', icon: 'github', title: 'GitHub', ...LINKS.github },
  { key: 'instagram', icon: 'instagram', title: 'Instagram', ...LINKS.instagram },
]

export default function Contact() {
  return (
    <section id="aloqa" className="relative overflow-hidden px-6 pt-28 pb-40 md:px-16 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(255,196,0,0.12),transparent)]" />
      <p className="kicker mb-6 text-center">09 · Aloqa</p>
      <a href={LINKS.telegram.url} target="_blank" rel="noreferrer" data-cursor="Yozish" className="group block text-center">
        <h2 className="display text-[clamp(3rem,11vw,10rem)] transition-all duration-700">
          <span className="grad-text inline-block pb-2 transition-transform duration-500 [--grad:linear-gradient(90deg,#ffc400,#ff8a00,#ff2e88)] group-hover:-rotate-2">Birga</span>{' '}
          <span className="inline-block">ishlaymizmi?</span>
        </h2>
      </a>

      <div data-stagger className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => {
          const accent = ICONS[c.icon].accent
          return (
            <a
              key={c.key}
              href={c.url}
              target={c.url.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              data-magnetic
              className="group glass flex items-center gap-4 !rounded-2xl p-4 transition-colors hover:border-white/30"
              style={{ ['--accent' as string]: accent }}
            >
              <span
                className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 transition-transform group-hover:scale-110"
                style={{ background: `radial-gradient(circle at 50% 0%, ${accent}55, #111 70%)`, boxShadow: `0 10px 30px -12px ${accent}` }}
              >
                <BrandIcon name={c.icon} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-white/45">{c.title}</span>
                <span className="block truncate text-sm font-semibold">{c.label}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </a>
          )
        })}
      </div>

      <div className="mt-32 flex flex-col items-center gap-4 text-center">
        <span className="display text-6xl tracking-[0.3em] text-white/90 md:text-8xl">FIN</span>
        <div className="flex items-center gap-2">
          <Pixel name="mountain" size={18} />
          <span className="font-mono text-[11px] tracking-[0.25em] text-white/40">
            © {new Date().getFullYear()} {PERSON.nick} · {PERSON.name}
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/25">React · Three.js · GSAP bilan qurilgan</span>
      </div>
    </section>
  )
}
