import { Suspense, useRef, useState, useCallback, useMemo, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { RotateCcw, ZoomIn, Move } from 'lucide-react';
import * as THREE from 'three';
import './ModelViewer.css';

/* ────────────── Error Boundary ────────────── */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/* ────────────── Part data ────────────── */
interface PartInfo {
  name: string;
  description: string;
  color: string;
  emissive: string;
}

const PARTS: Record<string, PartInfo> = {
  chamber: {
    name: 'Filtration Chamber',
    description: 'Stainless steel housing for ethanol-compatible fuel filtration at 5-micron precision.',
    color: '#1a2a3a',
    emissive: '#00d4ff',
  },
  filter: {
    name: 'Mesh Filter',
    description: 'Multi-layer sintered mesh with 99.2% particle capture rate for E20 blends.',
    color: '#0d2818',
    emissive: '#00ff88',
  },
  plates: {
    name: 'Capacitive Grid',
    description: 'Parallel-plate capacitance sensor detecting ethanol-to-petrol ratio in real time.',
    color: '#2a1a0d',
    emissive: '#ffb800',
  },
  pins: {
    name: 'Water Sensor Pins',
    description: 'Conductivity-based probe detecting water contamination down to 0.05% volume.',
    color: '#1a1a2e',
    emissive: '#00d4ff',
  },
  thermistor: {
    name: 'Thermistor Module',
    description: 'NTC 10 kΩ sensor monitoring fuel temperature with ±0.5 °C accuracy.',
    color: '#2a0d1a',
    emissive: '#ff4060',
  },
};

/* ────────────── Loader ────────────── */
function Loader() {
  return (
    <Html center>
      <div className="model-loader">
        <div className="model-loader-spinner" />
        <p>Loading 3D Model…</p>
      </div>
    </Html>
  );
}

/* ────────────── Individual parts ────────────── */
interface PartProps {
  partKey: string;
  activePart: string | null;
  onSelect: (key: string | null) => void;
  onHover: (key: string | null) => void;
}

/* — Chamber (outer cylinder) — */
function Chamber({ partKey, activePart, onSelect, onHover }: PartProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const targetEmissiveIntensity = hovered || isActive ? 0.6 : 0.08;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissiveIntensity, 0.08);
  });

  return (
    <mesh
      ref={ref}
      position={[0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      <cylinderGeometry args={[1.3, 1.3, 3.8, 64, 1, true]} />
      <meshStandardMaterial
        color={info.color}
        emissive={info.emissive}
        emissiveIntensity={0.08}
        metalness={0.9}
        roughness={0.15}
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
      />
      {isActive && (
        <Html distanceFactor={8} position={[2.2, 1.2, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} />
            <h4>{info.name}</h4>
            <p>{info.description}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

/* — Filter mesh (internal mesh disc stack) — */
function FilterMesh({ partKey, activePart, onSelect, onHover }: PartProps) {
  const ref = useRef<THREE.Group>(null!);
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.85, 0.06, 16, 48]} />
          <meshStandardMaterial
            color={info.color}
            emissive={info.emissive}
            emissiveIntensity={hovered || isActive ? 0.7 : 0.12}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((rot, i) => (
        <mesh key={`strand-${i}`} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, rot]}>
          <cylinderGeometry args={[0.02, 0.02, 1.7, 8]} />
          <meshStandardMaterial
            color={info.color}
            emissive={info.emissive}
            emissiveIntensity={hovered || isActive ? 0.7 : 0.12}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      {isActive && (
        <Html distanceFactor={8} position={[2.2, 0, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} />
            <h4>{info.name}</h4>
            <p>{info.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* — Capacitive Plates — */
function CapacitivePlates({ partKey, activePart, onSelect, onHover }: PartProps) {
  const ref = useRef<THREE.Group>(null!);
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, -1.2, 0]}>
          <boxGeometry args={[0.04, 1.2, 0.9]} />
          <meshStandardMaterial
            color={info.color}
            emissive={info.emissive}
            emissiveIntensity={hovered || isActive ? 0.8 : 0.15}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}
      {[-0.4, 0, 0.4].map((z, i) => (
        <mesh key={`field-${i}`} position={[0, -1.2, z * 0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.66, 8]} />
          <meshStandardMaterial
            color={info.emissive}
            emissive={info.emissive}
            emissiveIntensity={hovered || isActive ? 1.2 : 0.3}
            transparent
            opacity={hovered || isActive ? 0.7 : 0.25}
          />
        </mesh>
      ))}
      {isActive && (
        <Html distanceFactor={8} position={[2.2, -1.2, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} />
            <h4>{info.name}</h4>
            <p>{info.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* — Water Sensor Pins — */
function WaterSensorPins({ partKey, activePart, onSelect, onHover }: PartProps) {
  const ref = useRef<THREE.Group>(null!);
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      {[-0.2, 0.2].map((x, i) => (
        <group key={i} position={[x, 1.3, 0.8]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
            <meshStandardMaterial
              color="#c0c0d0"
              emissive={info.emissive}
              emissiveIntensity={hovered || isActive ? 0.5 : 0.05}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial
              color={info.emissive}
              emissive={info.emissive}
              emissiveIntensity={hovered || isActive ? 1.0 : 0.2}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      {isActive && (
        <Html distanceFactor={8} position={[2.2, 1.3, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} />
            <h4>{info.name}</h4>
            <p>{info.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* — Thermistor (sphere) — */
function Thermistor({ partKey, activePart, onSelect, onHover }: PartProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const info = PARTS[partKey];
  const isActive = activePart === partKey;
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.15 + 0.35;
    const targetIntensity = hovered || isActive ? 1.0 : pulse;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, 0.08);
  });

  return (
    <mesh
      ref={ref}
      position={[-0.7, -0.5, 0.9]}
      onClick={(e) => { e.stopPropagation(); onSelect(isActive ? null : partKey); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(partKey); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color={info.color}
        emissive={info.emissive}
        emissiveIntensity={0.35}
        metalness={0.6}
        roughness={0.4}
      />
      {isActive && (
        <Html distanceFactor={8} position={[-1.6, 0.8, 0]} className="part-label-wrapper">
          <div className="part-label" style={{ borderColor: info.emissive }}>
            <div className="part-label-dot" style={{ background: info.emissive }} />
            <h4>{info.name}</h4>
            <p>{info.description}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

/* — Top & Bottom caps — */
function EndCaps() {
  return (
    <>
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.15, 64]} />
        <meshStandardMaterial color="#0e1a28" metalness={0.95} roughness={0.1} emissive="#00d4ff" emissiveIntensity={0.04} />
      </mesh>
      <mesh position={[0, -1.9, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.15, 64]} />
        <meshStandardMaterial color="#0e1a28" metalness={0.95} roughness={0.1} emissive="#00d4ff" emissiveIntensity={0.04} />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.6, 32]} />
        <meshStandardMaterial color="#0a1420" metalness={0.9} roughness={0.15} emissive="#00ff88" emissiveIntensity={0.06} />
      </mesh>
      <mesh position={[0, -2.25, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.6, 32]} />
        <meshStandardMaterial color="#0a1420" metalness={0.9} roughness={0.15} emissive="#00ff88" emissiveIntensity={0.06} />
      </mesh>
    </>
  );
}

/* — Ambient particles — */
function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 200;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.02} color="#00d4ff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ────────────── Main Scene ────────────── */
function Scene() {
  const [activePart, setActivePart] = useState<string | null>(null);
  const [, setHoveredPart] = useState<string | null>(null);

  const handleSelect = useCallback((key: string | null) => setActivePart(key), []);
  const handleHover = useCallback((key: string | null) => setHoveredPart(key), []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} color="#8090b0" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#e0f0ff" castShadow />
      <directionalLight position={[-3, -4, -3]} intensity={0.3} color="#00d4ff" />
      <pointLight position={[0, 3, 3]} intensity={0.6} color="#00ff88" distance={10} />
      <pointLight position={[0, -3, -3]} intensity={0.4} color="#ffb800" distance={8} />

      {/* Particles */}
      <Particles />

      {/* Floating assembly */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4} floatingRange={[-0.15, 0.15]}>
        <group rotation={[0.2, 0, 0]}>
          <EndCaps />
          <Chamber partKey="chamber" activePart={activePart} onSelect={handleSelect} onHover={handleHover} />
          <FilterMesh partKey="filter" activePart={activePart} onSelect={handleSelect} onHover={handleHover} />
          <CapacitivePlates partKey="plates" activePart={activePart} onSelect={handleSelect} onHover={handleHover} />
          <WaterSensorPins partKey="pins" activePart={activePart} onSelect={handleSelect} onHover={handleHover} />
          <Thermistor partKey="thermistor" activePart={activePart} onSelect={handleSelect} onHover={handleHover} />
        </group>
      </Float>

      {/* Controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={4}
        maxDistance={14}
        autoRotate
        autoRotateSpeed={0.6}
        makeDefault
      />
    </>
  );
}

/* ────────────── Fallback UI (if WebGL fails) ────────────── */
function FallbackViewer() {
  return (
    <div className="model-fallback">
      <div className="model-fallback-icon">⚠️</div>
      <p className="model-fallback-title">3D Viewer Unavailable</p>
      <p className="model-fallback-text">
        Your browser does not support WebGL. Please use a modern browser like Chrome, Firefox, or Edge.
      </p>
    </div>
  );
}

/* ────────────── Exported Component ────────────── */
const ModelViewer = () => {
  return (
    <section className="section model-section" id="3d-model">
      <div className="bg-glow model-glow" />
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge">Interactive Viewer</div>
          <h2 className="section-title">System Components</h2>
          <p className="section-subtitle">
            Explore the fuel filtration chamber in full 3D — click on parts to
            understand each sensor and its function.
          </p>
        </motion.div>

        <motion.div
          className="model-canvas-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <ModelErrorBoundary fallback={<FallbackViewer />}>
            <div className="model-canvas-container">
              <Canvas
                camera={{ position: [4, 3, 6], fov: 42 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
                onCreated={({ gl }) => {
                  gl.setClearColor(new THREE.Color('#06060b'), 0);
                }}
              >
                <Suspense fallback={<Loader />}>
                  <Scene />
                </Suspense>
              </Canvas>
            </div>
          </ModelErrorBoundary>

          {/* Controls legend */}
          <div className="model-controls">
            <div className="model-control-hint">
              <RotateCcw size={14} />
              <span>Drag to Rotate</span>
            </div>
            <div className="model-control-hint">
              <ZoomIn size={14} />
              <span>Scroll to Zoom</span>
            </div>
            <div className="model-control-hint">
              <Move size={14} />
              <span>Right-Click to Pan</span>
            </div>
          </div>

          {/* Parts legend */}
          <div className="model-legend">
            {Object.entries(PARTS).map(([key, info]) => (
              <div key={key} className="model-legend-item">
                <span className="model-legend-dot" style={{ background: info.emissive }} />
                <span>{info.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModelViewer;
