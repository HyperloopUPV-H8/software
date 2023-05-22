import { HorizontalDivisions } from "./HorizontalDivisions/HorizontalDivisions";
import { VerticalDivisions } from "./VerticalDivisions/VerticalDivisions";

type Props = {
    viewBoxWidth: number;
    viewBoxHeight: number;
    verticalDivisions: number;
    horizontalDivisions: number;
};

const STROKE_WIDTH = 1;
const STROKE_OPACITY = 0.2;

export const Grid = ({
    viewBoxWidth,
    viewBoxHeight,
    verticalDivisions,
    horizontalDivisions,
}: Props) => {
    return (
        <g>
            <HorizontalDivisions
                divisions={horizontalDivisions}
                height={viewBoxHeight}
                strokeOpacity={STROKE_OPACITY}
                strokeWidth={STROKE_WIDTH}
            />

            <VerticalDivisions
                divisions={verticalDivisions}
                strokeOpacity={STROKE_OPACITY}
                strokeWidth={STROKE_WIDTH}
                width={viewBoxWidth}
            />
        </g>
    );
};
