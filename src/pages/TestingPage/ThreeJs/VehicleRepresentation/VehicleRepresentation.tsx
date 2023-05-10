import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, MeshPhongMaterial } from "three";

export function VehicleRepresentation() {
    const meshRef = useRef<Mesh>(null!);
    const model = useGLTF("./pod_simplified.glb");

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const timeScale = 2.5;
        const amplitude = 0.1;
        meshRef.current.rotation.y = amplitude * Math.sin(t * timeScale);
        meshRef.current.rotation.z = amplitude * Math.cos(t * timeScale);
        meshRef.current.rotation.x = amplitude * Math.sin(t * timeScale);
    });

    return (
        <mesh scale={3} ref={meshRef}>
            <primitive object={model.scene} />
        </mesh>
    );
}
