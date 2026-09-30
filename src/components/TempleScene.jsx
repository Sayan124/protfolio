import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Cedar({ position, scale = 1, tone = 0 }) {
  const greens = ['#101c1b', '#13201f', '#172522'];
  return <group position={position} scale={scale}>
    <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.08, 0.13, 1.6, 6]} /><meshStandardMaterial color="#191918" roughness={1} /></mesh>
    {[0, 1, 2, 3].map((n) => <mesh key={n} position={[0, 1.1 + n * 0.47, 0]}><coneGeometry args={[0.68 - n * 0.105, 1.25 - n * 0.1, 7]} /><meshStandardMaterial color={greens[(tone + n) % greens.length]} roughness={0.96} flatShading /></mesh>)}
  </group>;
}

function Lantern({ position, onSignal, side }) {
  const glow = useRef();
  useFrame(({ clock }) => { if (glow.current) glow.current.intensity = 1.2 + Math.sin(clock.elapsedTime * 2.1 + side) * 0.22; });
  return <group position={position} onClick={(event) => { event.stopPropagation(); onSignal('LANTERN / LIT'); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
    <mesh position={[0, 0.66, 0]}><boxGeometry args={[0.45, 0.62, 0.42]} /><meshStandardMaterial color="#342923" emissive="#8b301f" emissiveIntensity={0.25} roughness={0.7} /></mesh>
    <mesh position={[0, 0.66, 0.22]}><planeGeometry args={[0.26, 0.42]} /><meshBasicMaterial color="#f5b66d" transparent opacity={0.78} /></mesh>
    <mesh position={[0, 1.02, 0]}><coneGeometry args={[0.36, 0.19, 4]} /><meshStandardMaterial color="#28221f" roughness={0.8} /></mesh>
    <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.05, 0.08, 0.42, 5]} /><meshStandardMaterial color="#2a2521" /></mesh>
    <pointLight ref={glow} position={[0, 0.7, 0.32]} color="#ff9a59" intensity={1.3} distance={4} decay={2} />
  </group>;
}

function Gateway({ onSignal }) {
  return <group position={[1.55, 0, -2.4]} rotation={[0, -0.12, 0]}>
    <mesh position={[-1.9, 1.5, 0]}><boxGeometry args={[0.28, 3, 0.32]} /><meshStandardMaterial color="#3c201c" roughness={0.8} /></mesh>
    <mesh position={[1.9, 1.5, 0]}><boxGeometry args={[0.28, 3, 0.32]} /><meshStandardMaterial color="#3c201c" roughness={0.8} /></mesh>
    <mesh position={[0, 3.04, 0]}><boxGeometry args={[4.8, 0.34, 0.55]} /><meshStandardMaterial color="#672e26" roughness={0.72} /></mesh>
    <mesh position={[0, 2.66, 0.04]}><boxGeometry args={[4.2, 0.11, 0.36]} /><meshStandardMaterial color="#3c211d" roughness={0.75} /></mesh>
    <mesh position={[-0.28, 3.27, -0.02]} rotation={[0, 0, -0.035]}><boxGeometry args={[5.55, 0.2, 0.64]} /><meshStandardMaterial color="#73352a" roughness={0.72} /></mesh>
    <mesh position={[0, 2.52, -0.04]}><boxGeometry args={[4.05, 0.08, 0.38]} /><meshStandardMaterial color="#1a1717" roughness={0.9} /></mesh>
    <Lantern position={[-2.55, 0.1, 0.15]} side={0} onSignal={onSignal} />
    <Lantern position={[2.55, 0.1, 0.15]} side={1} onSignal={onSignal} />
  </group>;
}

function SceneContents({ onSignal, reducedMotion }) {
  const world = useRef();
  const { pointer } = useThree();
  const trees = useMemo(() => Array.from({ length: 22 }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const depth = -6.5 + (i % 11) * 0.58;
    const spread = 4.4 + (i % 4) * 0.72;
    return { position: [side * spread, -0.16, depth], scale: 0.72 + ((i * 17) % 5) * 0.13, tone: i % 3 };
  }), []);
  useFrame((_, delta) => {
    if (!world.current || reducedMotion) return;
    world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, pointer.x * 0.035, 2.2, delta);
    world.current.rotation.x = THREE.MathUtils.damp(world.current.rotation.x, -pointer.y * 0.012, 2.2, delta);
  });
  return <>
    <color attach="background" args={['#090c0c']} />
    <fog attach="fog" args={['#090c0c', 8, 20]} />
    <ambientLight intensity={0.42} color="#929d9c" />
    <directionalLight position={[-5, 7, 4]} color="#80908d" intensity={1.05} />
    <pointLight position={[1.5, 2.8, -3]} color="#c44e32" intensity={1.7} distance={8} />
    <group ref={world}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, -3]}><planeGeometry args={[40, 40]} /><meshStandardMaterial color="#101515" roughness={0.95} /></mesh>
      <mesh position={[0, -0.1, -3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.15, 14]} /><meshStandardMaterial color="#242526" roughness={0.76} /></mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, -0.085, 2.5 - i * 2.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.0 + i * 0.28, 0.04]} /><meshBasicMaterial color="#4b4140" transparent opacity={0.44} /></mesh>)}
      {trees.map((tree, i) => <Cedar key={i} {...tree} />)}
      <Gateway onSignal={onSignal} />
    </group>
  </>;
}

export default function TempleScene({ onSignal, reducedMotion }) {
  return <Canvas camera={{ position: [0, 3.25, 10], fov: 40 }} dpr={[1, 1.35]} gl={{ alpha: false, antialias: true, powerPreference: 'low-power' }}>
    <SceneContents onSignal={onSignal} reducedMotion={reducedMotion} />
  </Canvas>;
}
