import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh, MeshPhongMaterial } from "three";

const MAX_XDISTANCE = 22;
const MIN_XDISTANCE = 10;
const MAX_CANVAS_X = 3;

type Props = {
    xDistance: number;
};

function calculatePositionX(xDistance: number) {
    if (xDistance >= 10) {
        return (
            ((xDistance - MIN_XDISTANCE) * MAX_CANVAS_X) /
            (MAX_XDISTANCE - MIN_XDISTANCE)
        );
    } else {
        return 0;
    }
}

export function VehicleRepresentation({ xDistance }: Props) {
    const meshRef = useRef<Mesh>(null!);
    const positionX = useRef(calculatePositionX(xDistance));
    const model = useGLTF("./pod_simplified.glb");

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const timeScale = 2.5;
        const amplitude = 0.1;
        meshRef.current.rotation.y = amplitude * Math.sin(t * timeScale);
        meshRef.current.rotation.z = amplitude * Math.cos(t * timeScale);
        meshRef.current.rotation.x = amplitude * Math.sin(t * timeScale);

        //FIXME: useSpring for the animations
        if (meshRef.current.position.y < positionX.current) {
            meshRef.current.translateY(0.02);
        } else if (meshRef.current.position.y > positionX.current) {
            meshRef.current.translateY(-0.02);
        }
    });

    useEffect(() => {
        positionX.current = calculatePositionX(xDistance);
    }, [xDistance]);

    return (
        <mesh scale={3} ref={meshRef}>
            <primitive object={model.scene} />
        </mesh>
    );
}
