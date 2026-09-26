import { lazy, Suspense, useRef } from 'react'
import { ArrowDown, Send } from 'lucide-react'
import { PERSON, TEXT, LINKS } from '../../config'
import { gsap, Split, useGsap } from '../../lib/motion'
import { Pixel } from '../../lib/pixel'

const VoxelWorld = lazy(() => import('../three/VoxelWorld'))

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const progress = useRef(0)

  useGsap(
    root,
    () => {
      if (!ready) return
      const intro = gsap.timeline({ delay: 0.1 })
      intro
        .fromTo('.hero-nick .split-char', { yPercent: 120, rotate: 12 }, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07 })
        .fromTo('.hero-title .split-char', { yPercent: 110, opacity: 0, filter: 'blur(10px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out', stagger: 0.025 }, '-=0.8')
        .fromTo('.hero-fade', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.1 }, '-=0.7')

      gsap.to(progress, {
        current: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true },
      })
      gsap.to('.hero-copy', {
        yPercent: -30,
        opacity: 0,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '25% top', scrub: true },
      })
      gsap.fromTo(
        '.hero-mid',
        { opacity: 0, scale: 1.25, filter: 'blur(12px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: '22% top', end: '38% top', scrub: true },
        },
      )
      gsap.to('.hero-fadeout', {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '46% top', end: 'bottom bottom', scrub: true },
      })
    },
    [ready],
  )

  return (
    <section id="hero" ref={root} className="relative h-[240vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Osmon + quyosh (3D togʻlar orqasida) */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#070b1e_0%,#241a4d_32%,#7a3a6e_52%,#e0766a_68%,#ffb071_80%)]" />
        <div className="absolute top-[40%] left-1/2 size-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff3d1_0%,#ffcf7a_35%,#ff8a5c_60%,transparent_72%)] opacity-90 blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_20%_12%,#fff,transparent),radial-gradient(1px_1px_at_70%_8%,#fff,transparent),radial-gradient(1.5px_1.5px_at_85%_22%,#fff,transparent),radial-gradient(1px_1px_at_40%_18%,#fff,transparent),radial-gradient(1px_1px_at_10%_28%,#fff,transparent),radial-gradient(1px_1px_at_58%_26%,#fff,transparent)] opacity-70" />

        <Suspense fallback={null}>{ready && <VoxelWorld progress={progress} />}</Suspense>

        {/* pastki qorongʻilik — keyingi boʻlimga silliq oʻtish */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#07070a] to-transparent" />

        <div className="hero-copy pointer-events-none absolute inset-0 flex flex-col items-center justify-start bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,rgba(10,6,24,0.55),transparent_75%)] px-4 pt-[14vh] text-center md:pt-[12vh]">
          <div className="hero-fade mb-4 flex items-center gap-3 rounded-full border border-white/15 bg-black/25 px-4 py-1.5 backdrop-blur-md">
            <span className="size-2 animate-pulse rounded-full bg-[#5fbf3a] shadow-[0_0_10px_#5fbf3a]" />
            <span className="font-mono text-[11px] tracking-[0.2em] text-white/85 uppercase">Jamoaga qoʻshilishga tayyor</span>
          </div>
          <h1 className="hero-nick pixel overflow-hidden pb-7 text-[clamp(5rem,20vw,15rem)] leading-[0.85] font-bold">
            <Split
              text={PERSON.nick}
              className="inline-block text-white"
              charClass="[text-shadow:0_5px_0_#e0766a,0_10px_0_#7a3a6e,0_15px_0_#241a4d,0_22px_40px_rgba(0,0,0,0.45)]"
            />
          </h1>
          <p className="hero-fade mt-2 font-mono text-xs tracking-[0.45em] text-white/80 uppercase md:text-sm">{PERSON.name}</p>
          <h2 className="hero-title display mt-6 text-[clamp(1.6rem,4.4vw,3.6rem)] text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.35)]">
            {TEXT.hero.title.map((t, i) => (
              <Split key={t} text={t} className="mx-2 inline-block" charClass={i === 2 ? 'text-[#c6ff00]' : ''} />
            ))}
          </h2>
          <p className="hero-fade mt-5 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">{TEXT.hero.lead}</p>
          <p className="hero-fade mt-3 font-mono text-[11px] text-white/60 md:text-xs">// {TEXT.hero.mono}</p>
          <div className="hero-fade pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#yol"
              data-magnetic
              className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.6)] transition-colors hover:bg-[#c6ff00]"
            >
              Skillarni koʻrish <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href={LINKS.telegram.url}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              className="flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white"
            >
              <Send className="size-4" /> Bogʻlanish
            </a>
          </div>
        </div>

        {/* Scrollda chiqadigan oʻrta yozuv (kamera togʻlar ustidan uchayotganda) */}
        <div className="hero-mid pointer-events-none absolute inset-0 grid place-items-center px-4 text-center opacity-0">
          <div>
            <div className="mb-4 flex justify-center gap-3">
              {['monitor', 'clapper', 'star', 'chart', 'glove'].map((s) => (
                <span key={s} className="float-y grid size-12 place-items-center border-2 border-white/30 bg-black/35 backdrop-blur-sm md:size-14" style={{ animationDelay: `${Math.random()}s` }}>
                  <Pixel name={s} size={28} />
                </span>
              ))}
            </div>
            <p className="display text-[clamp(2rem,6vw,5rem)] text-white [text-shadow:0_6px_40px_rgba(0,0,0,0.5)]">
              Togʻ choʻqqisi —<br />
              <span className="grad-text [--grad:linear-gradient(90deg,#ffd54f,#ff8a00,#ff2e88)]">bir qadamdan boshlanadi.</span>
            </p>
          </div>
        </div>
        <div className="hero-fadeout pointer-events-none absolute inset-0 bg-[#07070a] opacity-0" />

        <div className="hero-copy hero-fade absolute bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70 md:bottom-28">
          <span className="relative h-9 w-5 rounded-full border-2 border-white/60">
            <span className="absolute top-1.5 left-1/2 h-2 w-0.5 -translate-x-1/2 animate-bounce rounded bg-white" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em]">SCROLL</span>
        </div>
      </div>
    </section>
  )
}
