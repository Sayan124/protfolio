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
      <pointLight position={[2.8, 2.2, 4]} intensity={35} color="#8affcf" />
      <pointLight position={[-3, -1.8, 2]} intensity={20} color="#667dff" />
      <Float speed={reducedMotion ? 0 : 1.15} rotationIntensity={reducedMotion ? 0 : 0.12} floatIntensity={reducedMotion ? 0 : 0.3}>
        <NeuralCore onSignal={onSignal} reducedMotion={reducedMotion} />
      </Float>
      <Sparkles count={48} scale={5.6} size={1.3} speed={reducedMotion ? 0 : 0.22} opacity={0.48} color="#a5ffe0" />
    </Canvas>
  );
}
