import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// Gologramma kabi tovlanuvchi, shakli oʻzgarib turuvchi shar (shader)
const vert = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  varying vec3 vN;
  varying vec3 vPos;
  vec3 hash3(vec3 p){ p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6))); return -1.0 + 2.0*fract(sin(p)*43758.5453); }
  float noise(vec3 p){
    vec3 i = floor(p); vec3 f = fract(p); vec3 u = f*f*(3.0-2.0*f);
    return mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)), dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                   mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)), dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
               mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)), dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                   mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)), dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
  }
  void main(){
    float n = noise(normal*1.6 + uTime*0.35) * (0.32 + uHover*0.25) + noise(normal*4.0 - uTime*0.5)*0.06;
    vec3 p = position + normal * n;
    vN = normalize(normalMatrix * normal);
    vPos = (modelViewMatrix * vec4(p,1.0)).xyz;
    gl_Position = projectionMatrix * vec4(vPos,1.0);
  }
`
const frag = /* glsl */ `
  uniform float uTime;
  varying vec3 vN;
  varying vec3 vPos;
  void main(){
    vec3 v = normalize(-vPos);
    float fres = pow(1.0 - max(dot(vN, v), 0.0), 2.2);
    float t = dot(vN, vec3(0.3,0.8,0.5)) * 2.0 + uTime*0.25;
    vec3 a = vec3(0.63,1.0,0.9);
    vec3 b = vec3(0.70,0.53,1.0);
    vec3 c = vec3(1.0,0.5,0.67);
    vec3 col = mix(mix(a,b,0.5+0.5*sin(t)), c, 0.5+0.5*sin(t*1.7+1.0));
    col = col*0.55 + fres*vec3(1.0);
    gl_FragColor = vec4(col, 0.95);
  }
`

function Blob() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const hover = useRef(0)
  const [h, setH] = useState(false)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uHover: { value: 0 } }), [])
  useFrame(({ clock, pointer }, dt) => {
    uniforms.uTime.value = clock.elapsedTime
    hover.current += ((h ? 1 : 0) - hover.current) * Math.min(1, dt * 4)
    uniforms.uHover.value = hover.current
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.2
      mesh.current.rotation.x = pointer.y * 0.3
      mesh.current.rotation.z = pointer.x * 0.2
    }
  })
  return (
    <mesh ref={mesh} onPointerOver={() => setH(true)} onPointerOut={() => setH(false)}>
      <icosahedronGeometry args={[1.35, 64]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent />
    </mesh>
  )
}

export default function AIBlob() {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className="absolute inset-0" data-cursor="Hover">
      <Canvas frameloop={visible ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <Blob />
      </Canvas>
    </div>
  )
}
