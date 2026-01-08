import { Text } from "@react-three/drei";
import { useState } from "react";

export default function Desk({ desk, position, onSelect, isActive }) {
  const [hovered, setHovered] = useState(false);

  const baseColor =
    desk.status === "online" ? "#22c55e" : "#6b7280";

  return (
    <group
      position={[
        position[0],
        position[1] + (hovered ? 0.08 : 0),
        position[2]
      ]}
      onClick={onSelect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Desk body */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <boxGeometry args={[1.5, 0.4, 1]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={isActive ? "#22c55e" : "#000000"}
          emissiveIntensity={isActive ? 0.6 : 0}
        />
      </mesh>

      {/* Desk owner name */}
      <Text
        position={[0, 0.9, 0]}
        fontSize={0.25}
        color={isActive ? "#bbf7d0" : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {desk.owner}
      </Text>

      {/* Desk light */}
      {desk.light && (
        <pointLight
          position={[0, 1.3, 0]}
          intensity={isActive ? 1.5 : 1}
          distance={3}
          color="#fff7cc"
        />
      )}
    </group>
  );
}
