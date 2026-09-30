import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import NeuralCore from './NeuralCore.jsx';

export default function CoreScene({ onSignal, reducedMotion }) {
  return (
    <Canvas
      className="core-canvas"
      camera={{ position: [0, 0, 7.1], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      fallback={<div className="canvas-fallback" />}
    >
      <ambientLight intensity={1.2} />
      <pointLight position={[2.8, 2.2, 4]} intensity={27} color="#dfe7ff" />
      <pointLight position={[-3, -1.8, 2]} intensity={17} color="#aebbf1" />
      <Float speed={reducedMotion ? 0 : 0.7} rotationIntensity={reducedMotion ? 0 : 0.08} floatIntensity={reducedMotion ? 0 : 0.18}>
        <NeuralCore onSignal={onSignal} reducedMotion={reducedMotion} />
      </Float>
      <Sparkles count={32} scale={5.2} size={0.9} speed={reducedMotion ? 0 : 0.14} opacity={0.34} color="#d4dcff" />
    </Canvas>
  );
}
