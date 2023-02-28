import styles from "./AwaitElement.module.scss";
import { AnimatedEllipsis } from "./AnimatedEllipsis/AnimatedEllipsis";
export const AwaitElement = () => {
    return (
        <div className={styles.awaitElementWrapper}>
            Waiting <AnimatedEllipsis />
        </div>
    );
};
