import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Desk from "./Desk";

export default function Office({ desks, setSelectedDesk }) {
  return (
    <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Desks */}
      {desks.map((desk, index) => (
        <Desk
          key={desk.id}
          desk={desk}
          position={[index * 3 - 2, 0.2, 0]}
          onSelect={setSelectedDesk}
        />
      ))}

      <OrbitControls />
    </Canvas>
  );
}
