import styles from "components/ChartMenu/Chart/SVGLineChart/SVGLineChart.module.scss";
import { LineFigure as LineFigureElement } from "components/ChartMenu/ChartElement";
import { Lines } from "components/ChartMenu/Chart/SVGLineChart/Lines/Lines";
import { Axis } from "components/ChartMenu/Chart/SVGLineChart/Axis/Axis";
import { getMultipleVectorsLimits } from "utils/math";
import { useEffect, useRef } from "react";
type Props = {
    lineFigures: Map<string, LineFigureElement>;
};

export const SVGLineChart = ({ lineFigures }: Props) => {
    const viewBoxWidth = 500;
    const viewBoxHeight = 500;
    const minOfLines = useRef(Infinity);
    const maxOfLines = useRef(-Infinity);

    useEffect(() => {
        const vectors = Array.from(lineFigures.values()).map(
            (figure) => figure.vector
        );
        [minOfLines.current, maxOfLines.current] =
            getMultipleVectorsLimits(vectors);
    }, [lineFigures]);

    return (
        <div className={styles.wrapper}>
            <svg width="100%" height="100%" className={styles.svg} fill="none">
                <Lines
                    lineFigures={lineFigures}
                    minOfLines={minOfLines.current}
                    maxOfLines={maxOfLines.current}
                    viewBoxHeight={viewBoxHeight}
                    viewBoxWidth={viewBoxWidth}
                ></Lines>

                <Axis
                    strokeWidth="1px"
                    color="black"
                    minY={minOfLines.current}
                    maxY={maxOfLines.current}
                ></Axis>
            </svg>
        </div>
    );
};
