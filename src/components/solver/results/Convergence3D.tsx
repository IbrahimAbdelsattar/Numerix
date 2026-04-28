import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Stars, Text } from "@react-three/drei";
import type { SolverResult } from "../hooks/useSolver";
import { useMemo } from "react";
import * as THREE from "three";

interface Props { result: SolverResult; }

export function Convergence3D({ result }: Props) {
  if (result.kind !== "root") return null;

  const iters = result.data.iterations;
  const root = result.data.root;

  // Generate 3D path data: (x: estimate, y: error log, z: iteration)
  const pathPoints = useMemo(() => {
    return iters.map((it: any) => {
      const x = it.xr ?? it.xnew ?? 0;
      const y = Math.max(0, 10 + Math.log10(Math.max(it.absError, 1e-10))); // Scale error to reasonable height
      const z = it.n * 1.5; // Spread out iterations
      return new THREE.Vector3(x, y, z);
    });
  }, [iters]);

  // Determine bounds to center camera
  const center = useMemo(() => {
    if (pathPoints.length === 0) return new THREE.Vector3(0, 0, 0);
    const sum = pathPoints.reduce((acc, p) => acc.add(p), new THREE.Vector3(0, 0, 0));
    return sum.divideScalar(pathPoints.length);
  }, [pathPoints]);

  return (
    <div className="glass h-[400px] rounded-xl overflow-hidden relative">
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <p className="text-xs font-semibold text-white/90">3D Convergence Path</p>
        <p className="text-[10px] text-white/60">X: Estimate | Y: Error Magnitude | Z: Iteration</p>
      </div>
      <Canvas camera={{ position: [center.x + 10, center.y + 10, center.z + 10], fov: 45 }}>
        <color attach="background" args={["#050A14"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        <OrbitControls target={center} autoRotate autoRotateSpeed={1} />

        {/* Axes */}
        <axesHelper args={[20]} />

        {/* Path Line */}
        {pathPoints.length > 1 && (
          <Line
            points={pathPoints}
            color="#3B82F6"
            lineWidth={3}
            transparent
            opacity={0.8}
          />
        )}

        {/* Points */}
        {pathPoints.map((p, i) => {
          const isLast = i === pathPoints.length - 1;
          const color = isLast && result.data.converged ? "#10B981" : "#06B6D4";
          return (
            <mesh key={i} position={p}>
              <sphereGeometry args={[isLast ? 0.4 : 0.2, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isLast ? 2 : 0.5} />
            </mesh>
          );
        })}

        {/* Final Root Marker */}
        {root !== null && pathPoints.length > 0 && (
          <group position={pathPoints[pathPoints.length - 1].clone().add(new THREE.Vector3(0, 1, 0))}>
            <Text color="#10B981" fontSize={0.6} anchorX="center" anchorY="middle">
              {`Root: ${root.toFixed(4)}`}
            </Text>
          </group>
        )}
      </Canvas>
    </div>
  );
}
