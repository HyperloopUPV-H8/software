import { Mark } from "components/ChartMenu/Chart/SVGLineChart/Axis/Mark/Mark";
import { useId } from "hooks/useId";

type Props = {
    minY: number;
    maxY: number;
    color: string;
    strokeWidth: string;
};
export const Axis = ({ minY, maxY, color, strokeWidth }: Props) => {
    const viewBoxWidth = 800;
    const viewBoxHeight = 550;
    const symbolId = useId();
    const numberOfMarks = 6;

    let verticalValues = [];
    for (let i = 0; i < numberOfMarks; i++) {
        verticalValues[i] = minY + ((maxY - minY) * i) / numberOfMarks;
    }

    return (
        <>
            <symbol
                id={symbolId}
                stroke={color}
                width="20rem"
                height="100%"
                strokeWidth={strokeWidth}
                vectorEffect={"non-scaling-stroke"}
                preserveAspectRatio="none"
                strokeLinecap="square"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                style={{ overflow: "visible" }}
            >
                {verticalValues.map((value, index) => {
                    const offset =
                        (viewBoxHeight / (numberOfMarks - 1)) * index;
                    return (
                        <Mark
                            key={index}
                            xPos={0}
                            yPos={viewBoxHeight - offset}
                            value={value}
                        ></Mark>
                    );
                })}
                <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={viewBoxHeight}
                    vectorEffect={"non-scaling-stroke"}
                ></line>
            </symbol>
            <use href={`#${symbolId}`} x="0" y="0" />
        </>
    );
};
