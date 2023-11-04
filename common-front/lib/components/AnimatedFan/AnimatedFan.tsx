import styles from "./AnimatedFan.module.scss";
import { ReactComponent as Fan } from "../../assets/icons/fan.svg";

type Props = {
    rotate: boolean;
    className?: string;
};

export const AnimatedFan = ({ rotate, className = "" }: Props) => {
    return (
        <Fan
            className={`${styles.fan} ${
                rotate ? styles.rotating : ""
            } ${className}`}
        />
    );
};
