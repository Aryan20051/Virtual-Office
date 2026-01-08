import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Rain({ count = 400 }) {
    const rainRef = useRef();

    // Create raindrop positions
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20; // x
        positions[i * 3 + 1] = Math.random() * 10;     // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }

    useFrame(() => {
        const pos = rainRef.current.geometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
            pos[i * 3 + 1] -= 0.15; // fall speed

            // reset drop to top
            if (pos[i * 3 + 1] < 0) {
                pos[i * 3 + 1] = 10;
            }
        }

        rainRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={rainRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#9ca3af"
                size={0.05}
                transparent
                opacity={0.6}
            />
        </points>
    );
}
