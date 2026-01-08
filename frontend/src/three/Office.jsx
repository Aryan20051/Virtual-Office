import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import Desk from "./Desk";
import Rain from "./Rain";

/* 🎥 Camera Controller */
function CameraController({ targetPos, lookAtPos }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(targetPos, 0.12);
    camera.lookAt(lookAtPos);
  });

  return null;
}

export default function Office({ desks, setSelectedDesk }) {
  // camera position + look target
  const [cameraTarget, setCameraTarget] = useState(
    new THREE.Vector3(0, 3, 6)
  );
  const [lookAtTarget, setLookAtTarget] = useState(
    new THREE.Vector3(0, 1, 0)
  );

  // track which desk is zoomed
  const [activeDeskId, setActiveDeskId] = useState(null);

  /* 🔁 Desk click handler (zoom IN / OUT) */
  const handleDeskSelect = (desk, position) => {
    // If same desk clicked again → zoom OUT
    if (activeDeskId === desk.id) {
      setActiveDeskId(null);
      setSelectedDesk(null);

      setCameraTarget(new THREE.Vector3(0, 3, 6));
      setLookAtTarget(new THREE.Vector3(0, 1, 0));
      return;
    }

    // Zoom IN to desk
    setActiveDeskId(desk.id);
    setSelectedDesk(desk);

    setCameraTarget(
      new THREE.Vector3(
        position[0],
        position[1] + 1.6,
        position[2] + 3
      )
    );

    setLookAtTarget(
      new THREE.Vector3(
        position[0],
        position[1] + 0.8,
        position[2]
      )
    );
  };

  return (
    <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
      {/* 🌙 Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* 🌧️ Atmosphere */}
      <Rain />

      {/* 🎥 Camera Logic */}
      <CameraController
        targetPos={cameraTarget}
        lookAtPos={lookAtTarget}
      />

      {/* 🧱 Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* 🪑 Desks */}
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

      {/* 🎮 Controls */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
