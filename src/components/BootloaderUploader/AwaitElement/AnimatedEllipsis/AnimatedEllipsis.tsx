import { useInterval } from "hooks/useInterval";
import { useState, useEffect } from "react";

export const AnimatedEllipsis = () => {
    const [points, setPoints] = useState(["."]);

    useInterval(() => {
        setPoints((prevPoints) => {
            return new Array((prevPoints.length % 3) + 1).fill(".");
        });
    }, 800);

    return <span>{points}</span>;
};
