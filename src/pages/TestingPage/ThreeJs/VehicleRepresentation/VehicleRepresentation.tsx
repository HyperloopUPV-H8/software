import { animated, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import THREE, { Mesh, MeshPhongMaterial, Vector3 } from "three";

const MAX_YDISTANCE = 22;
const MIN_YDISTANCE = 10;
const MAX_CANVAS_X = 3;

type Props = {
    yDistance: number;
};

function calculatePositionY(yDistance: number) {
    if (yDistance >= 10) {
        return (
            ((yDistance - MIN_YDISTANCE) * MAX_CANVAS_X) /
            (MAX_YDISTANCE - MIN_YDISTANCE)
        );
    } else {
        return 0;
    }
}

export function VehicleRepresentation({ yDistance }: Props) {
    const meshRef = useRef<Mesh>(null!);
    const positionYRef = useRef(calculatePositionY(yDistance));

    const model = useGLTF("./pod_simplified.glb");
    const spring = useSpring({
        from: { positionX: 0, positionY: 0, positionZ: 0 },
        to: { positionX: 0, positionY: positionYRef.current, positionZ: 0 },
        config: { duration: 1000 },
    });

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const timeScale = 2.5;
        const amplitude = 0.1;
        meshRef.current.rotation.y = amplitude * Math.sin(t * timeScale);
        meshRef.current.rotation.z = amplitude * Math.cos(t * timeScale);
        meshRef.current.rotation.x = amplitude * Math.sin(t * timeScale);
    });

    useEffect(() => {
        positionYRef.current = calculatePositionY(yDistance);
    }, [yDistance]);

    return (
        <animated.mesh
            scale={3}
            ref={meshRef}
            position-x={spring.positionX}
            position-y={spring.positionY}
            position-z={spring.positionZ}
        >
            <primitive object={model.scene} />
        </animated.mesh>
    );
}
