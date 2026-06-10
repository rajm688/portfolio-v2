'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from 'next-themes';

// Register GSAP Plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// The curved path for our journey - extended deeply into the fog
const cameraCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(10, 0, -20),
  new THREE.Vector3(-12, 0, -40),
  new THREE.Vector3(15, 0, -60),
  new THREE.Vector3(-10, 0, -80),
  new THREE.Vector3(5, 0, -100),
  new THREE.Vector3(-5, 0, -120),
  new THREE.Vector3(10, 0, -140),
  new THREE.Vector3(-10, 0, -160),
  new THREE.Vector3(0, 0, -200) // Extends far beyond the camera's final stop
]);

function Track() {
  const points = useMemo(() => cameraCurve.getPoints(500), []);

  return (
    // @ts-ignore - React 19 TS type collision between Three.js <line> and SVG <line>
    <line frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      {/* Smooth glowing line */}
      <lineBasicMaterial color="#9333ea" linewidth={3} transparent opacity={0.8} />
    </line>
  );
}

function WaypointSpheres() {
  return (
    <>
      {/* Spawn waypoints along the camera's actual travel path */}
      {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((t, index) => {
        const pt = cameraCurve.getPointAt(t);
        return (
          <mesh key={index} position={pt}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
        );
      })}
    </>
  );
}

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  
  const [positions] = useMemo(() => {
    // 1000 particles (x, y, z)
    const pos = new Float32Array(3000);
    for (let i = 0; i < 1000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;      // X width
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;  // Y height
      pos[i * 3 + 2] = -Math.random() * 220 + 20;    // Z depth (extended down to -200)
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  const { theme } = useTheme();
  const starColor = theme === 'light' ? '#0284c7' : '#00f3ff';

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color={starColor} size={0.1} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

function CameraController() {
  const { camera } = useThree();
  const carRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === 'light';
  const carTailColor = isLight ? '#0284c7' : '#ff00ff';
  const carBodyColor = isLight ? '#0ea5e9' : '#9333ea'; // Secondary color
  const edgeColor = isLight ? '#bae6fd' : '#d8b4fe'; // Bright edge highlights

  useEffect(() => {
    // Initial camera position precisely on the track
    const initialPos = cameraCurve.getPointAt(0);
    camera.position.set(initialPos.x, initialPos.y + 2, initialPos.z);
    
    // Look directly ahead at the star
    const lookAtPos = cameraCurve.getPointAt(0.05);
    camera.lookAt(lookAtPos.x, lookAtPos.y + 2, lookAtPos.z);
    
    // Initialize car position
    if (carRef.current) {
      const initCarPos = cameraCurve.getPointAt(0.03);
      carRef.current.position.set(initCarPos.x, initCarPos.y, initCarPos.z);
      const initCarLookAt = cameraCurve.getPointAt(0.04);
      carRef.current.lookAt(initCarLookAt.x, initCarLookAt.y, initCarLookAt.z);
    }
    
    // Set up ScrollTrigger to animate camera along the curve
    const st = ScrollTrigger.create({
      trigger: "#main-scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => {
        // Limit camera progress to 80% of the curve.
        const progress = self.progress * 0.80;
        const position = cameraCurve.getPointAt(progress);
        camera.position.copy(position);
        camera.position.y += 2; // Offset height
        
        // Look ahead
        const lookAtProgress = Math.min(progress + 0.05, 1.0);
        const lookAtPos = cameraCurve.getPointAt(lookAtProgress);
        camera.lookAt(lookAtPos.x, lookAtPos.y + 2, lookAtPos.z);

        // Update Car Position
        if (carRef.current) {
          const carProgress = Math.min(progress + 0.03, 1.0);
          const carPos = cameraCurve.getPointAt(carProgress);
          carRef.current.position.set(carPos.x, carPos.y, carPos.z);
          
          const carLookAtProgress = Math.min(carProgress + 0.01, 1.0);
          const carLookAtPos = cameraCurve.getPointAt(carLookAtProgress);
          carRef.current.lookAt(carLookAtPos.x, carLookAtPos.y, carLookAtPos.z);
        }
      }
    });

    return () => {
      st.kill();
    };
  }, [camera]);

  return (
    <group ref={carRef}>
      {/* Car Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.4, 0.4, 3.0]} />
        <meshStandardMaterial color={carBodyColor} metalness={0.8} roughness={0.2} />
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1.4, 0.4, 3.0)]} />
          <lineBasicMaterial attach="material" color={edgeColor} linewidth={2} />
        </lineSegments>
      </mesh>
      {/* Car Cabin */}
      <mesh position={[0, 0.6, -0.3]}>
        <boxGeometry args={[1.0, 0.3, 1.5]} />
        <meshStandardMaterial color={carBodyColor} metalness={0.9} roughness={0.1} />
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1.0, 0.3, 1.5)]} />
          <lineBasicMaterial attach="material" color={edgeColor} linewidth={2} />
        </lineSegments>
      </mesh>
      {/* Headlights (-Z is front) */}
      <mesh position={[0, 0.3, -1.51]}>
        <boxGeometry args={[1.2, 0.05, 0.05]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>
      {/* Taillights (+Z is back) */}
      <mesh position={[0, 0.3, 1.51]}>
        <boxGeometry args={[1.2, 0.05, 0.05]} />
        <meshBasicMaterial color={carTailColor} />
      </mesh>
      {/* Wheels */}
      {[-0.7, 0.7].map((x, i) => 
        [-1.0, 1.0].map((z, j) => (
          <mesh key={`wheel-${i}-${j}`} position={[x, 0.2, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        ))
      )}
      {/* Neon Underglow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 3.2]} />
        <meshBasicMaterial color={carTailColor} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function ExperienceCanvas() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const bgColor = mounted && theme === 'light' ? '#f8fafc' : '#050505';
  // Brighter grid color for better visibility in dark mode
  const gridColor = mounted && theme === 'light' ? '#cbd5e1' : '#3a3a3a';

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="fixed inset-0 z-0 bg-bg-dark transition-colors duration-500">
      {/* Set antialias back to true to fix jagged edges and allow higher pixel ratio mapping */}
      <Canvas dpr={[1, 3]} gl={{ powerPreference: "high-performance", antialias: true }}>
        <fog attach="fog" args={[bgColor, 10, 50]} />
        <color attach="background" args={[bgColor]} />
        <ambientLight intensity={theme === 'light' ? 0.8 : 0.5} />
        <Track />
        <WaypointSpheres />
        <Starfield />
        <gridHelper args={[400, 100, gridColor, gridColor]} position={[0, -2, -100]} />
        <CameraController />
      </Canvas>
    </div>
  );
}
