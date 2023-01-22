import styles from "components/ChartMenu/Chart/SVGLineChart/Axis/Mark/Mark.module.scss";

type Props = {
    xPos: number;
    yPos: number;
    value: number;
};

export const Mark = ({ xPos, yPos, value }: Props) => {
    const markLength = 10;
    return (
        <g>
            <line
                x1={xPos}
                y1={yPos}
                x2={xPos + markLength}
                y2={yPos}
                vectorEffect={"non-scaling-stroke"}
            ></line>

            <text
                x={xPos - 18}
                y={yPos + 9}
                className={styles.text}
                textAnchor={"end"}
            >
                {value.toFixed(1)}
            </text>
        </g>
    );
};
