import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import Desk from "./Desk";
import Rain from "./Rain";

function CameraController({ targetPos, lookAtPos }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(targetPos, 0.12);
    camera.lookAt(lookAtPos);
  });

  return null;
}

export default function Office({ desks, setSelectedDesk, isNight }) {
  const [cameraTarget, setCameraTarget] = useState(
    new THREE.Vector3(0, 3, 6)
  );
  const [lookAtTarget, setLookAtTarget] = useState(
    new THREE.Vector3(0, 1, 0)
  );
  const [activeDeskId, setActiveDeskId] = useState(null);

  const handleDeskSelect = (desk, position) => {
    if (activeDeskId === desk.id) {
      setActiveDeskId(null);
      setSelectedDesk(null);
      setCameraTarget(new THREE.Vector3(0, 3, 6));
      setLookAtTarget(new THREE.Vector3(0, 1, 0));
      return;
    }

    setActiveDeskId(desk.id);
    setSelectedDesk(desk);

    setCameraTarget(
      new THREE.Vector3(position[0], position[1] + 1.6, position[2] + 3)
    );
    setLookAtTarget(
      new THREE.Vector3(position[0], position[1] + 0.8, position[2])
    );
  };

  return (
    <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
      {/* 🌗 Lighting reacts to mode */}
      <ambientLight intensity={isNight ? 0.35 : 0.7} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={isNight ? 0.6 : 1}
        color={isNight ? "#a5b4fc" : "#ffffff"}
      />

      {/* 🌧️ Rain feels better at night */}
      <Rain />

      <CameraController
        targetPos={cameraTarget}
        lookAtPos={lookAtTarget}
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={isNight ? "#111827" : "#374151"}
        />
      </mesh>

      {/* Desks */}
      {desks.map((desk, index) => {
        const position = [index * 3 - 2, 1.1, -1.5];

        return (
          <Desk
            key={desk.id}
            desk={desk}
            position={position}
            isActive={activeDeskId === desk.id}
            onSelect={() => handleDeskSelect(desk, position)}
          />
        );
      })}

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
