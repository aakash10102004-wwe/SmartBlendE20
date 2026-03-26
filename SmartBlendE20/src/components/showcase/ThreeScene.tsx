import { Suspense, useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ══════════════════════════════════════════
   PARTS DATA (duplicated for isolation — 
   this file should be self-contained to 
   avoid pulling Three.js into main bundle)
   ══════════════════════════════════════════ */
interface PartInfo {
  name: string;
  description: string;
  color: string;
  emissive: string;
}

const PARTS: Record<string, PartInfo> = {
  chamber: { name: 'Filtration Chamber', description: 'Stainless steel housing for ethanol-compatible fuel filtration at 5-micron precision.', color: '#1a2a3a', emissive: '#00d4ff' },
  filter: { name: 'Mesh Filter', description: 'Multi-layer sintered mesh with 99.2% particle capture rate for E20 blends.', color: '#0d2818', emissive: '#00ff88' },
  plates: { name: 'Capacitive Grid', description: 'Parallel-plate capacitance sensor detecting ethanol-to-petrol ratio in real time.', color: '#2a1a0d', emissive: '#ffb800' },
  pins: { name: 'Water Sensor Pins', description: 'Conductivity-based probe detecting water contamination down to 0.05% volume.', color: '#1a1a2e', emissive: '#00d4ff' },
  thermistor: { name: 'Thermistor Module', description: 'NTC 10 kΩ sensor monitoring fuel temperature with ±0.5 °C accuracy.', color: '#2a0d1a', emissive: '#ff4060' },
};

/* ── Shared props ── */
interface PartProps {
  partKey: string;
  activePart: string | null;
  onSelect: (key: string | null) => void;
  onHover: (key: string | null) => void;
}

/* ── Chamber ── */
function Chamber({ partKey, activePart, onSelect, onHover }: PartProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hovered || isActive ? 0.6 : 0.08, 0.08);
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      <cylinderGeometry args={[1.3, 1.3, 3.8, 32, 1, true]} />
      <meshStandardMaterial color={info.color} emissive={info.emissive} emissiveIntensity={0.08}
        metalness={0.9} roughness={0.15} transparent opacity={0.35} side={THREE.DoubleSide} />
      {isActive && (
        <Html distanceFactor={8} position={[2.2, 1.2, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} /><h4>{info.name}</h4><p>{info.description}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

/* ── Filter ── */
function FilterMesh({ partKey, activePart, onSelect, onHover }: PartProps) {
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);
  const ei = hovered || isActive ? 0.7 : 0.12;

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.85, 0.06, 8, 32]} />
          <meshStandardMaterial color={info.color} emissive={info.emissive} emissiveIntensity={ei} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((rot, i) => (
        <mesh key={`s-${i}`} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, rot]}>
          <cylinderGeometry args={[0.02, 0.02, 1.7, 6]} />
          <meshStandardMaterial color={info.color} emissive={info.emissive} emissiveIntensity={ei} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {isActive && (
        <Html distanceFactor={8} position={[2.2, 0, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} /><h4>{info.name}</h4><p>{info.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Capacitive Plates ── */
function CapacitivePlates({ partKey, activePart, onSelect, onHover }: PartProps) {
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, -1.2, 0]}>
          <boxGeometry args={[0.04, 1.2, 0.9]} />
          <meshStandardMaterial color={info.color} emissive={info.emissive} emissiveIntensity={hovered || isActive ? 0.8 : 0.15} metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
      {isActive && (
        <Html distanceFactor={8} position={[2.2, -1.2, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} /><h4>{info.name}</h4><p>{info.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Water Sensor Pins ── */
function WaterSensorPins({ partKey, activePart, onSelect, onHover }: PartProps) {
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      {[-0.2, 0.2].map((x, i) => (
        <group key={i} position={[x, 1.3, 0.8]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
            <meshStandardMaterial color="#c0c0d0" emissive={info.emissive} emissiveIntensity={hovered || isActive ? 0.5 : 0.05} metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={info.emissive} emissive={info.emissive} emissiveIntensity={hovered || isActive ? 1 : 0.2} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {isActive && (
        <Html distanceFactor={8} position={[2.2, 1.3, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} /><h4>{info.name}</h4><p>{info.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Thermistor ── */
function ThermistorPart({ partKey, activePart, onSelect, onHover }: PartProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.15 + 0.35;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hovered || isActive ? 1.0 : pulse, 0.08);
  });

  return (
    <mesh ref={ref} position={[-0.7, -0.5, 0.9]}
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={info.color} emissive={info.emissive} emissiveIntensity={0.35} metalness={0.6} roughness={0.4} />
      {isActive && (
        <Html distanceFactor={8} position={[-1.6, 0.8, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} /><h4>{info.name}</h4><p>{info.description}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

/* ── End caps ── */
function EndCaps() {
  return (
    <>
      <mesh position={[0, 1.9, 0]}><cylinderGeometry args={[1.35, 1.35, 0.15, 32]} /><meshStandardMaterial color="#0e1a28" metalness={0.95} roughness={0.1} emissive="#00d4ff" emissiveIntensity={0.04} /></mesh>
      <mesh position={[0, -1.9, 0]}><cylinderGeometry args={[1.35, 1.35, 0.15, 32]} /><meshStandardMaterial color="#0e1a28" metalness={0.95} roughness={0.1} emissive="#00d4ff" emissiveIntensity={0.04} /></mesh>
      <mesh position={[0, 2.25, 0]}><cylinderGeometry args={[0.25, 0.25, 0.6, 16]} /><meshStandardMaterial color="#0a1420" metalness={0.9} roughness={0.15} emissive="#00ff88" emissiveIntensity={0.06} /></mesh>
      <mesh position={[0, -2.25, 0]}><cylinderGeometry args={[0.25, 0.25, 0.6, 16]} /><meshStandardMaterial color="#0a1420" metalness={0.9} roughness={0.15} emissive="#00ff88" emissiveIntensity={0.06} /></mesh>
    </>
  );
}

/* ── Particles ── */
function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      p[i * 3] = (Math.random() - 0.5) * 8;
      p[i * 3 + 1] = (Math.random() - 0.5) * 8;
      p[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, []);

  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.02; });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.02} color="#00d4ff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ── Loader ── */
function Loader3D() {
  return (
    <Html center>
      <div className="model-loader">
        <div className="model-loader-spinner" />
        <p>Loading 3D Model…</p>
      </div>
    </Html>
  );
}

/* ── Scene ── */
function Scene3D() {
  const [activePart, setActivePart] = useState<string | null>(null);
  const [, setHoveredPart] = useState<string | null>(null);
  const hs = useCallback((k: string | null) => setActivePart(k), []);
  const hh = useCallback((k: string | null) => setHoveredPart(k), []);

  return (
    <>
      <ambientLight intensity={0.3} color="#8090b0" />
      <directionalLight position={[5, 8, 5]} intensity={1.0} color="#e0f0ff" />
      <directionalLight position={[-3, -4, -3]} intensity={0.25} color="#00d4ff" />
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#00ff88" distance={10} />
      <Particles />
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4} floatingRange={[-0.15, 0.15]}>
        <group rotation={[0.2, 0, 0]}>
          <EndCaps />
          <Chamber partKey="chamber" activePart={activePart} onSelect={hs} onHover={hh} />
          <FilterMesh partKey="filter" activePart={activePart} onSelect={hs} onHover={hh} />
          <CapacitivePlates partKey="plates" activePart={activePart} onSelect={hs} onHover={hh} />
          <WaterSensorPins partKey="pins" activePart={activePart} onSelect={hs} onHover={hh} />
          <ThermistorPart partKey="thermistor" activePart={activePart} onSelect={hs} onHover={hh} />
        </group>
      </Float>
      <OrbitControls enablePan enableZoom enableRotate minDistance={4} maxDistance={14} autoRotate autoRotateSpeed={0.6} makeDefault />
    </>
  );
}

/* ══════════════════════════════════════════
   EXPORTED CANVAS COMPONENT
   ══════════════════════════════════════════ */
export default function ThreeCanvas({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      camera={{ position: [4, 3, 6], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#06060b'), 0);
        onReady();
      }}
    >
      <Suspense fallback={<Loader3D />}>
        <Scene3D />
      </Suspense>
    </Canvas>
  );
}
