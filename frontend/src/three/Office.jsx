import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Desk from "./Desk";

export default function Office({ desks, setSelectedDesk }) {
  return (
    <Canvas
      camera={{ position: [0, 3, 6], fov: 50 }}
      style={{ background: "#0f172a" }}
    >
      {/* Lights */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Desks */}
      {desks.map((desk, index) => (
        <Desk
          key={desk.id}
          desk={desk}
          position={[index * 3 - 2, 1.1, -1.5]}
          onSelect={setSelectedDesk}
        />
      ))}

      <OrbitControls />
    </Canvas>
  );
}
