"use client";

/* eslint-disable react/no-unknown-property */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { RootState } from "@react-three/fiber";
import type { IUniform } from "three";
import { Color, Mesh, ShaderMaterial } from "three";

/**
 * Keep the silk shader alive across tab sleeps and WebGL quirks:
 * - restart the r3f render loop when the tab/window is visible again
 * - remount after webglcontextrestored so Three.js state matches the GPU
 */
function SilkCanvasLifecycle({ onContextRestored }: { onContextRestored: () => void }) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
    };
    const onRestored = () => {
      onContextRestored();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, onContextRestored]);

  useEffect(() => {
    const kick = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }
      // Bump frame budget so `frameloop="always"` picks up after the loop went idle.
      invalidate(60);
    };
    kick();
    document.addEventListener("visibilitychange", kick);
    window.addEventListener("focus", kick);
    window.addEventListener("pageshow", kick);
    return () => {
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("focus", kick);
      window.removeEventListener("pageshow", kick);
    };
  }, [invalidate]);

  return null;
}

type NormalizedRGB = [number, number, number];

const hexToNormalizedRGB = (hex: string): NormalizedRGB => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
};

interface SilkUniforms {
  uSpeed: IUniform<number>;
  uScale: IUniform<number>;
  uNoiseIntensity: IUniform<number>;
  uColor: IUniform<Color>;
  uRotation: IUniform<number>;
  uTime: IUniform<number>;
  [key: string]: IUniform;
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

interface SilkPlaneProps {
  speed: number;
  scale: number;
  noiseIntensity: number;
  colorHex: string;
  rotation: number;
}

function SilkPlane({
  speed,
  scale,
  noiseIntensity,
  colorHex,
  rotation,
}: SilkPlaneProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  /** Own timeline; avoids freezes if the r3f / THREE clock stops advancing. */
  const timeRef = useRef(0);

  const uniforms = useMemo(
    (): SilkUniforms => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(colorHex)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, colorHex, rotation],
  );

  // Scale from viewport each frame; advance shader time via delta (stable even if
  // clock.elapsedTime glitches after tab background or GPU wake).
  useFrame((state: RootState, delta: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { width, height } = state.viewport;
    if (width > 0 && height > 0) {
      mesh.scale.set(width, height, 1);
    }

    const material =
      materialRef.current ??
      (mesh.material instanceof ShaderMaterial ? mesh.material : null);
    if (!material) return;

    timeRef.current += delta;
    material.uniforms.uTime.value = timeRef.current;
  });

  return (
    <mesh
      ref={meshRef}
      key={`${colorHex}-${speed}-${scale}-${noiseIntensity}-${rotation}`}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        depthTest={false}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
}

export function Silk({
  speed = 5,
  scale = 1,
  color = "#453268",
  noiseIntensity = 1.5,
  rotation = 0,
  className = "",
}: SilkProps) {
  /** Full remount after WebGL context restore (otherwise the hero can freeze on last frame). */
  const [canvasKey, setCanvasKey] = useState(0);
  const bumpCanvasKey = useCallback(() => {
    setCanvasKey((k) => k + 1);
  }, []);

  return (
    <div className={`absolute inset-0 bg-[#1a1028] ${className}`.trim()}>
      <Canvas
        key={canvasKey}
        className="h-full w-full touch-none"
        dpr={[1, 2]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: false,
          // "high-performance" can misbehave on some hybrid‑GPU setups; default is safer.
          powerPreference: "default",
        }}
      >
        <SilkCanvasLifecycle onContextRestored={bumpCanvasKey} />
        <SilkPlane
          speed={speed}
          scale={scale}
          noiseIntensity={noiseIntensity}
          colorHex={color}
          rotation={rotation}
        />
      </Canvas>
    </div>
  );
}

export default Silk;
