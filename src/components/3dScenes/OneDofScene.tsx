import { Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Vehicle } from "./Vehicle/Vehicle";

type Props = {
    y: number;
    rotX: number;
    rotY: number;
    rotZ: number;
};

export function OneDofScene({ y, rotX, rotY, rotZ }: Props) {
    return (
        <Canvas style={{ flex: "1 1 0", width: "auto" }}>
            <PerspectiveCamera
                makeDefault
                position={[7, 5, 6]}
                fov={60}
            />
            <OrbitControls />
            <ambientLight intensity={0.1} />
            <directionalLight
                color="white"
                position={[15, 20, 10]}
                intensity={0.8}
            />
            <Grid
                args={[30, 30]}
                sectionColor="#ee7623"
                fadeDistance={20}
                infiniteGrid
            />
            <Vehicle
                y={y}
                rotX={rotX}
                rotY={rotY}
                rotZ={rotZ}
            />
        </Canvas>
    );
}
