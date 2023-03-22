import { Grid } from "./Grid/Grid";
import { RefObject } from "react";
type Props = {
    viewBoxWidth: number;
    viewBoxHeight: number;
    gridDivisions: number;
    chartRef: RefObject<SVGSVGElement>;
};

export const LinesWithGrid = ({
    gridDivisions,
    viewBoxWidth,
    viewBoxHeight,
    chartRef,
}: Props) => {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            preserveAspectRatio="none"
            fill="none"
            overflow={"visible"}
        >
            <Grid
                verticalDivisions={gridDivisions}
                horizontalDivisions={gridDivisions}
                viewBoxHeight={viewBoxHeight}
                viewBoxWidth={viewBoxWidth}
            ></Grid>
            <g ref={chartRef} />
        </svg>
    );
};
