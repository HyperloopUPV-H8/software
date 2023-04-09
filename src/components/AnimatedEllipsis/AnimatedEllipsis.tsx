import { useInterval } from "hooks/useInterval";
import { useState, useEffect } from "react";

export const AnimatedEllipsis = () => {
    const [points, setPoints] = useState(["."]);

    useInterval(() => {
        setPoints((prevPoints) => {
            return new Array((prevPoints.length + 1) % 4).fill(".");
        });
    }, 800);

    // The span around {points} is needed so that there is not whitespace
    // between the word that comes before and the ellipsis
    return <span>{points}</span>;
};
