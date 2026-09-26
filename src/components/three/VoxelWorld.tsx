import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { SPRITES } from '../../lib/pixel'

// ---------- Shovqin (noise) — togʻ relyefi uchun ----------
function makeNoise(seed = 7) {
  const perm = new Uint8Array(512)
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  const grad = (h: number, x: number, y: number) => {
    const g = h & 7
    const u = g < 4 ? x : y
    const v = g < 4 ? y : x
    return (g & 1 ? -u : u) + (g & 2 ? -2 * v : 2 * v)
  }
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const noise = (x: number, y: number) => {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    const u = fade(x)
    const v = fade(y)
    const a = perm[X] + Y
    const b = perm[X + 1] + Y
    const l1 = THREE.MathUtils.lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u)
    const l2 = THREE.MathUtils.lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u)
    return THREE.MathUtils.lerp(l1, l2, v) * 0.5
  }
  const fbm = (x: number, y: number, o = 5) => {
    let t = 0
    let amp = 1
    let f = 1
    let norm = 0
    for (let i = 0; i < o; i++) {
      t += noise(x * f, y * f) * amp
      norm += amp
      amp *= 0.5
      f *= 2
    }
    return t / norm
  }
  return { fbm, rnd }
}

const W = 124
const D = 112
const Z0 = 0.76
const WATER = 3

function heightAt(fbm: (x: number, y: number, o?: number) => number, x: number, z: number) {
  const mf = THREE.MathUtils.clamp((-z - 8) / 42, 0, 1) // orqaga borgan sari togʻ balandroq
  const ridged = 1 - Math.abs(fbm(x * 0.03 + 11, z * 0.03 - 4, 4))
  let h = fbm(x * 0.05, z * 0.05) * 7 + 5
  h += Math.pow(ridged, 2.4) * 19 * mf * mf
  h += mf * 5
  const valley = Math.exp(-((x + Math.sin(z * 0.1) * 6) ** 2) / 70) * (1 - mf)
  h -= valley * 6
  return Math.max(1, Math.floor(h))
}

type Block = { x: number; y: number; z: number; c: THREE.Color }

function buildWorld() {
  const { fbm, rnd } = makeNoise(42)
  const H: number[][] = []
  for (let i = 0; i < W; i++) {
    H[i] = []
    for (let j = 0; j < D; j++) H[i][j] = heightAt(fbm, i - W / 2, j - D * Z0)
  }
  const blocks: Block[] = []
  const col = (hex: string, jitter = 0.06) => {
    const c = new THREE.Color(hex)
    const hsl = { h: 0, s: 0, l: 0 }
    c.getHSL(hsl)
    c.setHSL(hsl.h, hsl.s, THREE.MathUtils.clamp(hsl.l + (rnd() - 0.5) * jitter * 2, 0, 1))
    return c
  }
  const trees: [number, number, number][] = []
  for (let i = 0; i < W; i++) {
    for (let j = 0; j < D; j++) {
      const h = H[i][j]
      const nb = Math.min(
        H[i - 1]?.[j] ?? h,
        H[i + 1]?.[j] ?? h,
        H[i][j - 1] ?? h,
        H[i][j + 1] ?? h,
      )
      const from = Math.max(0, Math.min(h, nb + 1) - (h <= WATER ? 0 : 1))
      const x = i - W / 2
      const z = j - D * Z0
      for (let y = from; y <= h; y++) {
        const top = y === h
        let hex: string
        if (h >= 23 && (top || y >= 25)) hex = '#f4f7ff'
        else if (h >= 15) hex = y >= h - 1 && h >= 20 && rnd() > 0.4 ? '#e9eef8' : rnd() > 0.5 ? '#8c919b' : '#7a7f89'
        else if (h <= WATER + 1) hex = '#dcc58e'
        else if (top) hex = rnd() > 0.5 ? '#5cbf3c' : rnd() > 0.5 ? '#4fae33' : '#6ccb46'
        else hex = y < h - 3 ? '#7a7f89' : '#8b5a2b'
        blocks.push({ x, y, z, c: col(hex) })
      }
      if (h > WATER + 2 && h < 13 && rnd() > 0.975 && z < 8 && z > -34 && Math.abs(x) < 58) trees.push([x, h + 1, z])
    }
  }
  // Daraxtlar
  for (const [x, y, z] of trees) {
    const t = 3 + Math.floor(rnd() * 2)
    for (let k = 0; k < t; k++) blocks.push({ x, y: y + k, z, c: col('#6b4423') })
    const leaf = rnd() > 0.5 ? '#2e7d32' : '#388e3c'
    for (let dx = -1; dx <= 1; dx++)
      for (let dz = -1; dz <= 1; dz++)
        for (let dy = 0; dy < 2; dy++) {
          if (Math.abs(dx) + Math.abs(dz) === 2 && dy === 1) continue
          blocks.push({ x: x + dx, y: y + t - 1 + dy, z: z + dz, c: col(leaf, 0.08) })
        }
    blocks.push({ x, y: y + t + 1, z, c: col(leaf, 0.08) })
  }
  return blocks
}

function Terrain() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const blocks = useMemo(buildWorld, [])
  useLayoutEffect(() => {
    const m = ref.current!
    const o = new THREE.Object3D()
    blocks.forEach((b, i) => {
      o.position.set(b.x, b.y, b.z)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      m.setColorAt(i, b.c)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [blocks])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, blocks.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.9} metalness={0} />
    </instancedMesh>
  )
}

function Water() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = WATER + 0.35 + Math.sin(clock.elapsedTime * 0.8) * 0.05
  })
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, WATER + 0.35, D * (0.5 - Z0)]}>
      <planeGeometry args={[W, D]} />
      <meshStandardMaterial color="#3d8bff" transparent opacity={0.72} roughness={0.08} metalness={0.3} />
    </mesh>
  )
}

function Clouds() {
  const group = useRef<THREE.Group>(null)
  const clouds = useMemo(() => {
    const { rnd } = makeNoise(9)
    return Array.from({ length: 11 }, () => ({
      x: (rnd() - 0.5) * 140,
      y: 34 + rnd() * 8,
      z: -80 + rnd() * 80,
      parts: Array.from({ length: 3 + Math.floor(rnd() * 3) }, () => [
        (rnd() - 0.5) * 10,
        rnd() * 1.2,
        (rnd() - 0.5) * 5,
        4 + rnd() * 6,
        2 + rnd() * 3,
      ]),
    }))
  }, [])
  useFrame((_, dt) => {
    group.current?.children.forEach((c) => {
      c.position.x += dt * 1.2
      if (c.position.x > 70) c.position.x = -70
    })
  })
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]}>
          {c.parts.map(([x, y, z, w, d], k) => (
            <mesh key={k} position={[x, y, z]}>
              <boxGeometry args={[w, 1.2, d]} />
              <meshBasicMaterial color="#ffc9b8" transparent opacity={0.9} fog={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function Fireflies({ count = 260 }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, speeds } = useMemo(() => {
    const { rnd } = makeNoise(3)
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rnd() - 0.5) * 80
      positions[i * 3 + 1] = 4 + rnd() * 22
      positions[i * 3 + 2] = -30 + rnd() * 60
      speeds[i] = 0.3 + rnd()
    }
    return { positions, speeds }
  }, [count])
  useFrame(({ clock }) => {
    const p = ref.current!.geometry.attributes.position as THREE.BufferAttribute
    const t = clock.elapsedTime
    for (let i = 0; i < count; i++) {
      p.array[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.006
      p.array[i * 3] += Math.cos(t * 0.3 * speeds[i] + i) * 0.004
    }
    p.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        color="#ffd9a0"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Pixel sprite → Three.js tekstura (Minecraft uslubidagi "tushgan buyum" bloklari uchun)
function spriteTexture(name: string, bg: string) {
  const rows = SPRITES[name]
  const size = 16
  const cv = document.createElement('canvas')
  cv.width = cv.height = size
  const ctx = cv.getContext('2d')!
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.fillRect(0, 0, size, 1)
  ctx.fillRect(0, 0, 1, size)
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillRect(0, size - 1, size, 1)
  ctx.fillRect(size - 1, 0, 1, size)
  const pal: Record<string, string> = {
    K: '#15151b', E: '#2b2b3a', W: '#ffffff', w: '#cfd8dc', S: '#9aa0aa', s: '#6b7079', G: '#5fbf3a',
    g: '#3f8f2a', R: '#ff3b3b', r: '#b71c1c', B: '#29b6f6', b: '#0277bd', C: '#4dd0e1', c: '#00838f',
    L: '#c6ff00', M: '#ff2e88', P: '#e0ccff', p: '#7c4dff', N: '#b0703a', n: '#6d3a1a', Y: '#ffd54f',
  }
  const ox = Math.floor((size - rows[0].length) / 2)
  const oy = Math.floor((size - rows.length) / 2)
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === '.') return
      ctx.fillStyle = pal[ch] ?? '#fff'
      ctx.fillRect(ox + x, oy + y, 1, 1)
    }),
  )
  const tex = new THREE.CanvasTexture(cv)
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.NearestFilter
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const ITEMS = [
  { sprite: 'monitor', bg: '#0b3b4a', glow: '#00e5ff', pos: [-27, 15, 4] },
  { sprite: 'clapper', bg: '#4a0b2a', glow: '#ff2e88', pos: [-19, 24, -10] },
  { sprite: 'star', bg: '#2a1650', glow: '#b388ff', pos: [30, 40, -46] },
  { sprite: 'chart', bg: '#10361f', glow: '#00e676', pos: [19, 24, -10] },
  { sprite: 'glove', bg: '#4a0d10', glow: '#ff1744', pos: [27, 15, 4] },
] as const

function SkillBlocks({ progress }: { progress: { current: number } }) {
  const refs = useRef<(THREE.Group | null)[]>([])
  const textures = useMemo(() => ITEMS.map((it) => spriteTexture(it.sprite, it.bg)), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const p = progress.current
    refs.current.forEach((g, i) => {
      if (!g) return
      const [x, y, z] = ITEMS[i].pos
      const spread = 1 + p * 1.4
      g.position.set(x * spread, y + Math.sin(t * 1.4 + i) * 0.6 + p * 10, z + p * 10)
      g.rotation.y = t * 0.6 + i
      g.rotation.x = Math.sin(t * 0.8 + i) * 0.15
    })
  })
  return (
    <>
      {ITEMS.map((it, i) => (
        <group key={it.sprite} ref={(el) => void (refs.current[i] = el)}>
          <mesh>
            <boxGeometry args={[2.4, 2.4, 2.4]} />
            <meshStandardMaterial map={textures[i]} emissive={it.glow} emissiveIntensity={0.22} roughness={0.6} />
          </mesh>
          <pointLight color={it.glow} intensity={18} distance={10} />
        </group>
      ))}
    </>
  )
}

function Rig({ progress }: { progress: { current: number } }) {
  const { camera, pointer } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    const p = progress.current
    const tx = pointer.x * 3
    const ty = 19 + pointer.y * 1.5 + p * 26
    const tz = 40 - p * 26
    camera.position.x += (tx - camera.position.x) * 0.05
    camera.position.y += (ty - camera.position.y) * 0.05
    camera.position.z += (tz - camera.position.z) * 0.08
    look.set(0, 17 - p * 16, -70)
    camera.lookAt(look)
  })
  return null
}

export default function VoxelWorld({ progress }: { progress: { current: number } }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, mobile ? 1.25 : 1.6]}
        camera={{ position: [0, 19, 40], fov: mobile ? 64 : 50, near: 0.5, far: 300 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#c9707a', 80, 260]} />
        <hemisphereLight args={['#ffe2c4', '#2c2240', 1.1]} />
        <directionalLight position={[-40, 50, 30]} intensity={2.4} color="#ffc28a" />
        <directionalLight position={[40, 20, -40]} intensity={0.9} color="#9b8cff" />
        <Terrain />
        <Water />
        <Clouds />
        <Fireflies count={mobile ? 120 : 260} />
        <SkillBlocks progress={progress} />
        <Rig progress={progress} />
      </Canvas>
    </div>
  )
}
