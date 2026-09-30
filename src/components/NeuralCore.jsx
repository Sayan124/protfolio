import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 62;

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function makeNetwork() {
  const random = seededRandom(7841);
  const points = Array.from({ length: NODE_COUNT }, () => {
    const y = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const radius = 1.45 * Math.sqrt(1 - y * y) * (0.74 + random() * 0.26);
    return new THREE.Vector3(Math.cos(angle) * radius, y * 1.45, Math.sin(angle) * radius);
  });
  const segments = [];
  points.forEach((point, i) => {
    const nearest = points.map((other, j) => ({ j, distance: point.distanceToSquared(other) }))
      .filter(({ j }) => j > i)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
    nearest.forEach(({ j }) => segments.push(point.x, point.y, point.z, points[j].x, points[j].y, points[j].z));
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3));
  return { points, geometry };
}

function EnergyPulse({ reducedMotion }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current && !reducedMotion) {
      const scale = 0.92 + Math.sin(clock.elapsedTime * 1.3) * 0.055;
      ref.current.scale.setScalar(scale);
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.49, 4]} />
      <meshPhysicalMaterial color="#a4ffe2" emissive="#39f4b2" emissiveIntensity={2.4} roughness={0.17} metalness={0.14} clearcoat={1} clearcoatRoughness={0.12} />
    </mesh>
  );
}

function ConnectionNodes({ points, onSignal }) {
  return <>{points.map((point, index) => (
    <mesh
      key={index}
      position={point}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; onSignal(`NODE ${String(index + 1).padStart(2, '0')}`); }}
      onPointerOut={() => { document.body.style.cursor = ''; onSignal('LISTENING'); }}
      onClick={(event) => { event.stopPropagation(); onSignal(`NODE ${String(index + 1).padStart(2, '0')} / ACTIVE`); }}
    >
      <sphereGeometry args={[index % 7 === 0 ? 0.057 : 0.034, 12, 12]} />
      <meshBasicMaterial color={index % 7 === 0 ? '#c9ffe9' : '#70e9c2'} />
    </mesh>
  ))}</>;
}

export default function NeuralCore({ onSignal, reducedMotion }) {
  const group = useRef();
  const { pointer, viewport } = useThree();
  const network = useMemo(makeNetwork, []);
  const compact = viewport.width < 5;

  useFrame((_, delta) => {
    if (!group.current) return;
    if (!reducedMotion) group.current.rotation.y += delta * 0.105;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.y * 0.2, 3, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -pointer.x * 0.13, 3, delta);
  });

  return (
    <group ref={group} scale={compact ? 0.8 : 1}>
      <ConnectionNodes points={network.points} onSignal={onSignal} />
      <lineSegments geometry={network.geometry}>
        <lineBasicMaterial color="#55d6ac" transparent opacity={0.23} />
      </lineSegments>
      <mesh>
        <torusGeometry args={[1.69, 0.004, 6, 120]} />
        <meshBasicMaterial color="#75e8be" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[0.75, 0.2, -0.58]}>
        <torusGeometry args={[1.84, 0.003, 6, 120]} />
        <meshBasicMaterial color="#8295ff" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[0.2, 1.2, 0.4]}>
        <torusGeometry args={[1.56, 0.0025, 6, 120]} />
        <meshBasicMaterial color="#87b6ff" transparent opacity={0.2} />
      </mesh>
      <EnergyPulse reducedMotion={reducedMotion} />
    </group>
  );
}
