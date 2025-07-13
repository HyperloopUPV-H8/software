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
const STROKE_OPACITY_DARK = 0.1;

export const Grid = ({
    viewBoxWidth,
    viewBoxHeight,
    verticalDivisions,
    horizontalDivisions,
}: Props) => {
    // Check if dark mode is active
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const strokeColor = isDarkMode ? 'white' : 'black';
    const strokeOpacity = isDarkMode ? STROKE_OPACITY_DARK : STROKE_OPACITY;
    
    return (
        <g>
            <HorizontalDivisions
                divisions={horizontalDivisions}
                height={viewBoxHeight}
                strokeOpacity={strokeOpacity}
                strokeWidth={STROKE_WIDTH}
                strokeColor={strokeColor}
            />

            <VerticalDivisions
                divisions={verticalDivisions}
                strokeOpacity={strokeOpacity}
                strokeWidth={STROKE_WIDTH}
                width={viewBoxWidth}
                strokeColor={strokeColor}
            />
        </g>
    );
};
