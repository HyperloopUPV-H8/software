import { Grid } from "./Grid/Grid";
import { RefObject } from "react";

type Props = {
    width?: string;
    height?: string;
    showGrid?: boolean;
    viewBoxWidth: number;
    viewBoxHeight: number;
    gridDivisions: number;
    chartRef: RefObject<SVGSVGElement>;
};

export const LinesWithGrid = ({
    width = "100%",
    height = "100%",
    showGrid = true,
    gridDivisions,
    viewBoxWidth,
    viewBoxHeight,
    chartRef,
}: Props) => {
    return (
        <div style={{ flex: "1 1 0" }}>
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                preserveAspectRatio="none"
                fill="none"
                style={{ overflow: "hidden" }}
            >
                {showGrid && (
                    <Grid
                        verticalDivisions={gridDivisions}
                        horizontalDivisions={gridDivisions}
                        viewBoxHeight={viewBoxHeight}
                        viewBoxWidth={viewBoxWidth}
                    ></Grid>
                )}
                <g
                    ref={chartRef}
                    style={{ overflow: "hidden" }}
                />
            </svg>
        </div>
    );
};
