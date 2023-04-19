import styles from "./AnimatedFan.module.scss";
import { ReactComponent as Fan } from "assets/svg/fan.svg";

type Props = {
    rotate: boolean;
};

export const AnimatedFan = ({ rotate }: Props) => {
    return (
        <Fan className={`${styles.fanIcon} ${rotate ? styles.rotating : ""}`} />
    );
};
