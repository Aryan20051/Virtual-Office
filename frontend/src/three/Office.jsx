import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import Desk from "./Desk";
import Rain from "./Rain";

/* 🌌 SKY */
function Sky({ isNight }) {
  const skyRef = useRef();
  const sunRef = useRef();

  useFrame(() => {
    const targetY = isNight ? -20 : 20;
    sunRef.current.position.y +=
      (targetY - sunRef.current.position.y) * 0.05;

    const targetColor = new THREE.Color(
      isNight ? "#020617" : "#7dd3fc"
    );
    skyRef.current.material.color.lerp(targetColor, 0.02);
  });

  return (
    <>
      <mesh ref={skyRef} scale={120}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide} color="#020617" />
      </mesh>

      <mesh ref={sunRef} position={[30, isNight ? -20 : 20, -50]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          emissive={isNight ? "#e5e7eb" : "#fde047"}
          emissiveIntensity={1.5}
          color={isNight ? "#e5e7eb" : "#fde047"}
        />
        <pointLight
          intensity={isNight ? 0.3 : 1}
          distance={120}
          color={isNight ? "#c7d2fe" : "#fde047"}
        />
      </mesh>
    </>
  );
}

/* 🌆 CITY BACKDROP */
function CityBackdrop({ isNight }) {
  const groupRef = useRef();

  useFrame(() => {
    // subtle breathing motion
    groupRef.current.position.x =
      Math.sin(Date.now() * 0.0001) * 0.2;
  });

  return (
    <group ref={groupRef} position={[0, 0, -12]}>
      {Array.from({ length: 40 }).map((_, i) => {
        const height = Math.random() * 4 + 2;
        return (
          <mesh
            key={i}
            position={[
              i - 20,
              height / 2,
              Math.random() * -2
            ]}
          >
            <boxGeometry args={[0.8, height, 1]} />
            <meshStandardMaterial
              color={isNight ? "#020617" : "#9ca3af"}
              emissive={isNight ? "#1e293b" : "#000000"}
              emissiveIntensity={isNight ? 0.4 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* 🎥 CAMERA */
function CameraController({ targetPos, lookAtPos }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(targetPos, 0.04);
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
      <Sky isNight={isNight} />
      <CityBackdrop isNight={isNight} />

      <ambientLight intensity={isNight ? 0.35 : 0.7} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={isNight ? 0.6 : 1}
        color={isNight ? "#a5b4fc" : "#ffffff"}
      />

      <Rain />

      <CameraController
        targetPos={cameraTarget}
        lookAtPos={lookAtTarget}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={isNight ? "#020617" : "#e5e7eb"}
        />
      </mesh>

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

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        dampingFactor={0.08}
        enableDamping
        minDistance={4}
        maxDistance={12}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />

    </Canvas>
  );
}
