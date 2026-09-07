import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

// ─── 1. Single Face Instance ───────────────────────────────────────────────────
interface FaceProps {
  url: string;
  index: number;
  totalCount: number;
  scrollProgress: React.MutableRefObject<number>;
  visibleStartTime: React.MutableRefObject<number>;
}

const FaceInstance: React.FC<FaceProps> = ({ url, index, totalCount, scrollProgress, visibleStartTime }) => {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null); // inner pivot for edge-flip

  const materialsRef = useRef<THREE.Material[]>([]);
  const originalColorsRef = useRef<THREE.Color[]>([]);

  // Clone the scene so each instance has independent transforms & materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    const mats: THREE.Material[] = [];
    const origCols: THREE.Color[] = [];
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const origMat = child.material as any;
        const mat = new THREE.MeshPhysicalMaterial({
          color: origMat.color ? origMat.color.clone() : new THREE.Color(1, 1, 1),
          map: origMat.map || null,
          normalMap: origMat.normalMap || null,
          roughnessMap: origMat.roughnessMap || null,
          metalnessMap: origMat.metalnessMap || null,
          roughness: 0.12, // Ultra-shiny polished metal surface
          metalness: 1.0,  // Pure chromium structure
          clearcoat: 1.0,  // Outer protective high-gloss lacquer
          clearcoatRoughness: 0.08,
          envMapIntensity: 3.2, // Boost reflections for deep contrast
          side: THREE.DoubleSide,
          
          // Awwwards-grade iridescence (oil-slick/rainbow color shift on metal edges)
          iridescence: 0.95,
          iridescenceIOR: 1.8,
          iridescenceThicknessRange: [100, 400],
        });
        
        child.material = mat;
        mats.push(mat);
        origCols.push(mat.color.clone());
      }
    });
    materialsRef.current = mats;
    originalColorsRef.current = origCols;
    return clone;
  }, [scene]);

  // ─── Radial Layout ──────────────────────────────────────────────────────────
  const angle = (index / totalCount) * Math.PI * 2 - Math.PI / 2;
  const radius = 0.6;

  // Final resting position (where the face stays after fly-in)
  const targetX = Math.cos(angle) * radius;
  const targetY = Math.sin(angle) * radius;
  const targetZ = 0;

  // Resting rotation: face outward tangentially + one full Y flip on arrival
  const targetRotZ = angle + Math.PI / 2;

  // Fly-in: start far away in the direction this face comes from
  const flyInDistance = 20;
  const startX = Math.cos(angle) * flyInDistance;
  const startY = Math.sin(angle) * flyInDistance;
  const startZ = -3 + Math.random() * 2;

  // Refs for smooth interpolation
  const currentPos = useRef(new THREE.Vector3(startX, startY, startZ));
  const currentRotY = useRef((Math.random() - 0.5) * 6); // random initial spin
  const currentRotZ = useRef(targetRotZ + (Math.random() - 0.5) * 2);

  useFrame((state) => {
    if (!groupRef.current) return;

    const rawTime = state.clock.getElapsedTime();
    // Offset time so animations start from when 3D becomes visible
    const time = visibleStartTime.current > 0 ? rawTime - visibleStartTime.current : 0;
    if (time < 0) return; // Not visible yet
    const progress = scrollProgress.current;

    // ─── A. Color Interpolation based on Scroll Progress (Services Section Morph) ───
    // Extremely fast transition to cyan-blue #00F2FE exactly within the Services section (fade in/out over 0.8% scroll range)
    let colorT = 0;
    if (progress >= 0.33 && progress <= 0.61) {
      if (progress < 0.338) {
        colorT = (progress - 0.33) / 0.008; // instant/snappy fade in
      } else if (progress > 0.602) {
        colorT = (0.61 - progress) / 0.008; // instant/snappy fade out
      } else {
        colorT = 1;
      }
    }

    const targetColor = new THREE.Color('#00F2FE');

    materialsRef.current.forEach((mat, i) => {
      if ('color' in mat && mat.color instanceof THREE.Color) {
        const origCol = originalColorsRef.current[i] || new THREE.Color(1, 1, 1);
        const baseCol = origCol.clone().lerp(targetColor, colorT);
        mat.color.copy(baseCol);
      }
    });

    // ─── B. Fly-in (first 2.5s) with a flip ──────────────────────────────────
    const flyDuration = 2.5;
    const flyT = Math.min(1, time / flyDuration);
    const baseFlyEase = 1 - Math.pow(1 - flyT, 3); // cubic ease-out

    // On start, hide the top two elements (index 3 and 4) until the user starts scrolling
    const isDelayed = index === 3 || index === 4;
    const scrollTrigger = isDelayed ? THREE.MathUtils.clamp(progress / 0.04, 0, 1) : 1.0;
    const flyEase = baseFlyEase * scrollTrigger;

    // Position: fly from far → rest position
    const goalX = THREE.MathUtils.lerp(startX, targetX, flyEase);
    const goalY = THREE.MathUtils.lerp(startY, targetY, flyEase);
    const goalZ = THREE.MathUtils.lerp(startZ, targetZ, flyEase);

    // ─── C. End-of-scroll Exit Loop Animation (progress > 0.82) ──────────
    let isExiting = false;
    let myProgress = 0;

    if (progress > 0.82) {
      isExiting = true;
      const t = (progress - 0.82) / 0.18; // remaining 18% of scroll
      const stagger = 0.08;
      const duration = 0.45;
      const myStart = index * stagger;
      myProgress = THREE.MathUtils.clamp((t - myStart) / duration, 0, 1);
    }

    let finalGoalX = goalX;
    let finalGoalY = goalY;
    let finalGoalZ = goalZ;
    let exitScale = 1.0;

    if (isExiting) {
      let pathX = 0;
      let pathY = 0;
      const verticalLift = myProgress * 1.5; // Smoothly lifts the entire trajectory up by 1.5 units
      const horizontalShift = myProgress * 2.2; // Smoothly shifts the entire trajectory right by 2.2 units

      if (myProgress < 0.7) {
        // Loop phase: theta from 0 to 2*PI (looping up and left, returning via bottom)
        const theta = (myProgress / 0.7) * Math.PI * 2;
        const width = 1.8;  // horizontal scale of the loop
        const height = 1.0; // vertical scale of the loop
        pathX = -width * (1.0 - Math.cos(theta)) + horizontalShift;
        pathY = height * Math.sin(theta) + verticalLift;
      } else {
        // Exit phase: tExit from 0 to 1 (shooting off screen to the right)
        const tExit = (myProgress - 0.7) / 0.3;
        const exitX = 8.0;  // offscreen right
        const exitY = -0.5; // offscreen middle-right (elevated)
        pathX = exitX * tExit + horizontalShift;
        pathY = exitY * tExit + verticalLift;
      }

      // Smoothly transition from circle position to path coordinates
      const offsetFactor = 1.0 - THREE.MathUtils.clamp(myProgress / 0.15, 0, 1);
      const screenX = pathX + targetX * offsetFactor;
      const screenY = pathY + targetY * offsetFactor;
      const screenZ = targetZ;

      // Compensate for parent rotation Y so the path is aligned with the screen/camera
      const parentRotY = Math.min(0.82, progress) * Math.PI * 4.5;
      const cosY = Math.cos(-parentRotY);
      const sinY = Math.sin(-parentRotY);
      
      // Rotate (screenX, screenZ) around Y by -parentRotY
      finalGoalX = screenX * cosY - screenZ * sinY;
      finalGoalY = screenY;
      finalGoalZ = screenX * sinY + screenZ * cosY;

      // Zoom out: scale up (increase size up to 4.5x) as we exit to cover the screen
      exitScale = 1.0 + THREE.MathUtils.clamp((myProgress - 0.5) / 0.5, 0, 1) * 3.5;
    }

    const baseLerp = 0.07;
    const lerpFactor = isExiting 
      ? THREE.MathUtils.lerp(baseLerp, 0.015, myProgress) 
      : baseLerp;

    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, finalGoalX, lerpFactor);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, finalGoalY, lerpFactor);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, finalGoalZ, lerpFactor);

    // Subtle idle bob
    const bob = Math.sin(time * 1.0 + index * 0.9) * 0.02;

    // ─── D. Repeating Pull-apart → Flip → Return → 5s Rest cycle ──────────
    const cycleStart = 4.5; // first cycle begins after fly-in + 2s pause
    const cycleDuration = 7.3;

    const timeSinceCycleStart = time - cycleStart;
    let pullAmount = 0;
    let flipRotation = 0;
    let zPunch = 0;
    let cycleFlipCount = 0;

    if (timeSinceCycleStart > 0 && !isExiting) {
      const cycleIndex = Math.floor(timeSinceCycleStart / cycleDuration);
      const cycleTime = timeSinceCycleStart % cycleDuration;
      cycleFlipCount = cycleIndex;

      // Card-specific start time based on stagger
      const flipStagger = 0.2;
      const myStart = index * flipStagger;
      const t = cycleTime - myStart;

      // Pull amount (smooth rise, hold, then fall)
      if (t >= 0 && t < 1.1) {
        if (t < 0.35) {
          // Rise phase (pull out)
          const tNorm = t / 0.35;
          pullAmount = tNorm * tNorm * (3 - 2 * tNorm);
        } else if (t < 0.75) {
          // Hold phase
          pullAmount = 1;
        } else {
          // Fall phase (return to place)
          const tNorm = (t - 0.75) / 0.35;
          pullAmount = 1 - tNorm * tNorm * (3 - 2 * tNorm);
        }
      }

      // Flip rotation and Z punch
      const flipStart = 0.15;
      const flipDuration = 0.7;

      if (t >= flipStart) {
        const timeSinceFlipStart = t - flipStart;
        const flipT = Math.min(1, timeSinceFlipStart / flipDuration);

        // Smooth cubic ease-in-out
        const flipEaseVal = flipT < 0.5
          ? 4 * flipT * flipT * flipT
          : 1 - Math.pow(-2 * flipT + 2, 3) / 2;

        flipRotation = flipEaseVal * Math.PI * 2;

        // Z-depth punch (peaks mid-flip)
        zPunch = Math.sin(flipT * Math.PI) * 0.3;
      }
    }

    // Apply pull outward along radial direction
    const pullOutDistance = 0.5;
    const pullOffsetX = Math.cos(angle) * pullOutDistance * pullAmount;
    const pullOffsetY = Math.sin(angle) * pullOutDistance * pullAmount;
    groupRef.current.position.x = currentPos.current.x + pullOffsetX;
    groupRef.current.position.y = currentPos.current.y + pullOffsetY + bob;
    groupRef.current.position.z = currentPos.current.z - zPunch;

    // Outer group: fly-in rotation + tangential tilt (stays fixed after fly-in)
    const flyInFlipY = flyEase * Math.PI * 2;
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, flyInFlipY, 0.12);

    let finalRotY = currentRotY.current;
    if (isExiting) {
      const parentRotY = 0.82 * Math.PI * 4.5;
      const targetLocalRotY = Math.PI * 2 - parentRotY;
      finalRotY = THREE.MathUtils.lerp(currentRotY.current, targetLocalRotY, myProgress);
    }

    currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, targetRotZ, 0.06);
    groupRef.current.rotation.set(0, finalRotY, currentRotZ.current);

    // Inner pivot: edge-flip (offset pivot so it rotates around right edge)
    if (pivotRef.current) {
      const pivotOffset = 0.3; // distance to edge
      let totalCycleFlipY = -((cycleFlipCount * Math.PI * 2) + flipRotation);

      if (isExiting) {
        totalCycleFlipY = THREE.MathUtils.lerp(totalCycleFlipY, 0, myProgress);
      }

      pivotRef.current.position.set(pivotOffset, 0, 0);
      pivotRef.current.rotation.set(0, totalCycleFlipY, 0);
    }

    // ─── E. Scale ────────────────────────────────────────────────────────────
    const baseScale = 0.13;
    const pulse = 1 + Math.sin(time * 0.8 + index * 1.5) * 0.02;
    const scaleEase = flyEase * baseScale * pulse * exitScale;
    groupRef.current.scale.setScalar(scaleEase);
  });

  return (
    <group ref={groupRef}>
      <group ref={pivotRef}>
        <group position={[-0.3, 0, 0]}>
          <primitive object={clonedScene} />
        </group>
      </group>
    </group>
  );
};

// Preload the model
const getModelPath = () => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/+$/, '')}/model.glb`;
};
const MODEL_URL = getModelPath();

// Preload the model
useGLTF.preload(MODEL_URL);

// ─── 2. Face Assembly (spins on scroll, subtle breathing bob) ─────────────────
interface FaceAssemblyProps {
  scrollProgress: React.MutableRefObject<number>;
  visibleStartTime: React.MutableRefObject<number>;
}

const FaceAssembly: React.FC<FaceAssemblyProps> = ({ scrollProgress, visibleStartTime }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentRotY = useRef(0);

  // The assembly spins on scroll, with a subtle breathing bob
  useFrame((state) => {
    if (!groupRef.current) return;
    const rawTime = state.clock.getElapsedTime();
    const time = visibleStartTime.current > 0 ? rawTime - visibleStartTime.current : 0;
    if (time < 0) return;
    const breathY = Math.sin(time * 0.6) * 0.03;

    // Spin on scroll (4.5 * PI across the entire scroll range for faster speed), locked at 0.82 progress at the end
    const effectiveProgress = Math.min(0.82, scrollProgress.current);
    const targetRotY = effectiveProgress * Math.PI * 4.5;
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY, 0.08);

    groupRef.current.position.set(0, breathY - 0.65, 0);
    groupRef.current.rotation.y = currentRotY.current;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 7 }).map((_, i) => (
        <FaceInstance
          key={i}
          url={MODEL_URL}
          index={i}
          totalCount={7}
          scrollProgress={scrollProgress}
          visibleStartTime={visibleStartTime}
        />
      ))}
    </group>
  );
};

// ─── 3. Main Export ────────────────────────────────────────────────────────────
export const Scroll3DCanvas: React.FC<{ isIntroFinished?: boolean }> = ({ isIntroFinished = false }) => {
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);

  // Bridge framer-motion MotionValue → mutable ref (avoids re-renders)
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => { scrollRef.current = v; });
    return unsub;
  }, [scrollYProgress]);

  const [fov, setFov] = useState(50);
  useEffect(() => {
    const onResize = () => setFov(window.innerWidth < 768 ? 65 : 50);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Delay 3D visibility until ALL hero elements have finished appearing
  const [show3D, setShow3D] = useState(false);
  const visibleStartTimeRef = useRef(0);
  useEffect(() => {
    if (isIntroFinished) {
      const timer = setTimeout(() => setShow3D(true), 2800);
      return () => clearTimeout(timer);
    }
  }, [isIntroFinished]);

  return (
    <div
      id="webgl"
      className="fixed pointer-events-none overflow-hidden bg-transparent transition-opacity duration-[1200ms] ease-in-out"
      style={{
        width: '100vw',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 15,
        opacity: show3D ? 1 : 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        dpr={1.25}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 3]} intensity={1.6} color="#00F2FE" />
        <directionalLight position={[-5, -3, 2]} intensity={1.2} color="#B600A8" />
        <pointLight position={[0, 0, 4]} intensity={0.7} color="#FFFFFF" />

        {/* Record the Three.js clock time when 3D becomes visible */}
        <VisibleTimeRecorder show3D={show3D} visibleStartTimeRef={visibleStartTimeRef} />

        <Suspense fallback={null}>
          <FaceAssembly scrollProgress={scrollRef} visibleStartTime={visibleStartTimeRef} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Helper component to record the Three.js clock time when 3D becomes visible
const VisibleTimeRecorder: React.FC<{
  show3D: boolean;
  visibleStartTimeRef: React.MutableRefObject<number>;
}> = ({ show3D, visibleStartTimeRef }) => {
  const recorded = useRef(false);
  useFrame((state) => {
    if (show3D && !recorded.current) {
      visibleStartTimeRef.current = state.clock.getElapsedTime();
      recorded.current = true;
    }
  });
  return null;
};

export default Scroll3DCanvas;

