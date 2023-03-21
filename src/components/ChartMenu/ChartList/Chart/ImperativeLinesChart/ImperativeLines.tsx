import styles from "./ImperativeLines.module.scss";
import { useMultipleLinesUpdate } from "./useMultipleLinesUpdate";
import { LineDescription } from "./line";
import { Grid } from "../LinesChart/LinesWithGrid/Grid/Grid";
import { useId } from "react";
import { VerticalAxis } from "../LinesChart/VerticalAxis/VerticalAxis";

const viewBoxWidth = 1000;
const viewBoxHeight = 1000;
const VERTICAL_DIVISIONS = 7;
type Props = {
    lineDescriptions: Array<LineDescription>;
};

export const ImperativeLines = ({ lineDescriptions }: Props) => {
    const { ref, min, max } = useMultipleLinesUpdate(
        viewBoxWidth,
        viewBoxHeight,
        200,
        lineDescriptions
    );

    return (
        <div className={styles.imperativeChartWrapper}>
            <VerticalAxis
                divisions={VERTICAL_DIVISIONS}
                min={min}
                max={max}
            />
            <svg
                className={styles.svg}
                width="100%"
                height="100%"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                fill="none"
                overflow={"visible"}
            >
                <Grid
                    x={0}
                    verticalDivisions={VERTICAL_DIVISIONS}
                    horizontalDivisions={8}
                    viewBoxHeight={viewBoxHeight}
                    viewBoxWidth={viewBoxWidth}
                ></Grid>
                <g ref={ref} />
            </svg>
        </div>
    );
};
