import styles from "./BackgroundArc.module.scss";
import { Arc } from "../Arc/Arc";
import { useId } from "react";
type Props = React.ComponentProps<typeof Arc>;

export const BackgroundArc = ({
    percentage,
    radius,
    strokeWidth,
    sweep,
    className,
}: Props) => {
    const id = useId();

    return (
        <>
            <defs>
                <mask id={id}>
                    <Arc
                        sweep={sweep}
                        radius={radius}
                        strokeWidth={strokeWidth}
                        percentage={percentage}
                        className={styles.maskArc}
                    ></Arc>
                </mask>
            </defs>

            <foreignObject
                x="0"
                y="0"
                width="100%"
                height="100%"
                mask={`url(#${id})`}
            >
                <div
                    className={className}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </foreignObject>
        </>
    );
};
