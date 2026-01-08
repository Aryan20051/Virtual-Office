import { Text } from "@react-three/drei";

export default function Desk({ desk, position, onSelect }) {
  const color =
    desk.status === "online" ? "#22c55e" : "#6b7280";

  return (
    <group
      position={position}
      onClick={() => {
        console.log("Desk clicked:", desk);
        onSelect(desk);
      }}
    >
      {/* Desk body (SCALED UP + LIFTED) */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <boxGeometry args={[1.5, 0.4, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Desk owner name (MOVED UP + BIGGER) */}
      <Text
        position={[0, 0.9, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {desk.owner}
      </Text>

      {/* Desk light (SLIGHTLY HIGHER) */}
      {desk.light && (
        <pointLight
          position={[0, 1.2, 0]}
          intensity={1}
          distance={3}
          color="#fff7cc"
        />
      )}
    </group>
  );
}
