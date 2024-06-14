import styles from "./BreakVisualizer.module.scss"
import breakContracted from "assets/svg/break-contracted.svg"
import breakExtended from "assets/svg/break-extended.svg"

interface Props {
    active: boolean,
    rotation: "left" | "right" | "top" | "bottom"
}

export const BreakVisualizer = ({
    active,
    rotation
}: Props) => {

    let rotationDegrees;
    switch(rotation) {
        case "left":
            rotationDegrees = "rotate(-90deg)";
            break;
        case "right":
            rotationDegrees = "rotate(90deg)";
            break;
        case "top":
            rotationDegrees = "rotate(0deg)";
            break;
        case "bottom":
            rotationDegrees = "rotate(180deg)";
            break;
    }

    return (
        <div
            className={styles.breakVisualizerWrapper}
            style={{
                transform: rotationDegrees
            }}
        >
            <img src={active ? breakExtended : breakContracted} alt="Break Visualizer" />
        </div>   
    )
}
