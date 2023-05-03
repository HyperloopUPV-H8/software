import { Grid } from "./Grid/Grid";
import { RefObject } from "react";
type Props = {
    width?: string;
    height?: string;
    viewBoxWidth: number;
    viewBoxHeight: number;
    gridDivisions: number;
    chartRef: RefObject<SVGSVGElement>;
};

export const LinesWithGrid = ({
    width = "100%",
    height = "100%",
    gridDivisions,
    viewBoxWidth,
    viewBoxHeight,
    chartRef,
}: Props) => {
    return (
        <svg
            width={width}
            height={height}
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
