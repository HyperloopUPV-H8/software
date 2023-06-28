import { animated, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Mesh } from "three";

type Props = {
    y: number;
    rotX: number;
    rotY: number;
    rotZ: number;
};

export function Vehicle({ y, rotX, rotY, rotZ }: Props) {
    const meshRef = useRef<Mesh>(null!);
    const valueRef = useRef({ y, rotX, rotY, rotZ });

    const model = useGLTF("./pod_simplified.glb");

    const [springs, setSprings] = useSpring(() => ({
        y: y,
        rotX: rotX,
        rotY: rotY,
        rotZ: rotZ,
        config: {
            mass: 3,
            tension: 15,
            friction: 10,
            precision: 0.00001,
        },
    }));

    useEffect(() => {
        valueRef.current = { y, rotX, rotY, rotZ };
        setSprings({ y, rotX, rotY, rotZ });
    }, [y, rotX, rotY, rotZ]);

    return (
        <animated.mesh
            scale={3}
            ref={meshRef}
            position-y={springs.y}
            rotation-x={springs.rotX}
            rotation-y={springs.rotY}
            rotation-z={springs.rotZ}
        >
            <primitive object={model.scene} />
        </animated.mesh>
    );
}
