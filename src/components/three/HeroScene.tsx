// Three.js hero scene: particle network + rotating sine sphere + perspective grid + floating equation glyphs.
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function useReducedQuality() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function ParticleNetwork() {
  const ref = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const reduced = useReducedQuality();
  const COUNT = reduced ? 60 : 220;

  const { positions, lineGeo } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    // build connections (only lines for closer points)
    const linePos: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = pos[i*3] - pos[j*3];
        const dy = pos[i*3+1] - pos[j*3+1];
        const dz = pos[i*3+2] - pos[j*3+2];
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < 1.6) {
          linePos.push(pos[i*3], pos[i*3+1], pos[i*3+2], pos[j*3], pos[j*3+1], pos[j*3+2]);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    return { positions: pos, lineGeo };
  }, [COUNT]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.05;
    if (ref.current) ref.current.rotation.y = t;
    if (lineRef.current) lineRef.current.rotation.y = t;
  });

  return (
    <group>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={"#3B82F6"} transparent opacity={0.9} sizeAttenuation />
      </points>
      <lineSegments ref={lineRef} geometry={lineGeo}>
        <lineBasicMaterial color={"#8B5CF6"} transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}

function SineSphere() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.18;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.2;
    }
  });
  const curves = useMemo(() => {
    const arr: THREE.BufferGeometry[] = [];
    for (let k = 0; k < 14; k++) {
      const pts: THREE.Vector3[] = [];
      const phase = (k / 14) * Math.PI * 2;
      for (let i = 0; i <= 120; i++) {
        const t = (i / 120) * Math.PI * 2;
        const r = 2.4;
        const x = r * Math.cos(t) * Math.cos(phase);
        const y = r * Math.sin(t);
        const z = r * Math.cos(t) * Math.sin(phase);
        pts.push(new THREE.Vector3(x, y, z));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      arr.push(g);
    }
    return arr;
  }, []);
  // Use THREE.Line directly to avoid JSX <line> collision with SVG types.
  const lines = useMemo(() => curves.map((g, i) => {
    const mat = new THREE.LineBasicMaterial({ color: i % 2 === 0 ? "#3B82F6" : "#06B6D4", transparent: true, opacity: 0.32 });
    return new THREE.Line(g, mat);
  }), [curves]);
  return (
    <group ref={ref} position={[0, 0, -1]}>
      {lines.map((l, i) => <primitive key={i} object={l} />)}
    </group>
  );
}

function FloatingGlyph({ char, position, color = "#94A3B8", size = 0.6 }: { char: string; position: [number, number, number]; color?: string; size?: number }) {
  const ref = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.3 + Math.random() * 0.4, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * speed + offset) * 0.4;
      ref.current.rotation.y = clock.elapsedTime * 0.3;
    }
  });
  return (
    <group ref={ref} position={position}>
      <Text fontSize={size} color={color} anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor="#1e3a8a">
        {char}
      </Text>
    </group>
  );
}

export function HeroScene({ className = "" }: { className?: string }) {
  const reduced = useReducedQuality();
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 7], fov: 60 }}
      dpr={reduced ? 1 : [1, 2]}
      gl={{ antialias: !reduced, alpha: true }}>
      <color attach="background" args={["#050A14"]} />
      <fog attach="fog" args={["#050A14", 8, 18]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#3B82F6" />
      <pointLight position={[-5, -3, 2]} intensity={0.6} color="#8B5CF6" />

      <ParticleNetwork />
      <SineSphere />

      <FloatingGlyph char="∫" position={[-4, 1.6, 0]} color="#3B82F6" size={0.9} />
      <FloatingGlyph char="Σ" position={[4, 1.2, 0]} color="#8B5CF6" size={0.9} />
      <FloatingGlyph char="√" position={[-3.6, -1.6, 0]} color="#06B6D4" size={0.7} />
      <FloatingGlyph char="∂" position={[3.3, -1.4, 0]} color="#94A3B8" size={0.7} />
      <FloatingGlyph char="π" position={[-1.4, 2.3, -1]} color="#3B82F6" size={0.6} />
      <FloatingGlyph char="∇" position={[1.6, -2.4, 1]} color="#8B5CF6" size={0.6} />
      {!reduced && <>
        <FloatingGlyph char="ε" position={[-2.4, 0.4, 1]} color="#06B6D4" size={0.5} />
        <FloatingGlyph char="ƒ" position={[2.6, 0.2, 1]} color="#94A3B8" size={0.5} />
        <FloatingGlyph char="x" position={[0, -2, -1]} color="#3B82F6" size={0.5} />
      </>}

      {/* Receding grid plane */}
      <gridHelper args={[40, 40, "#1e3a8a", "#0f1d3a"]} position={[0, -4, -2]} rotation={[0, 0, 0]} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.4} enableRotate={false} />
    </Canvas>
  );
}
