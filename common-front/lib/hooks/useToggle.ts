import { useState } from "react";

export function useToggle(stateValue: boolean) {
    const [isToggeled, setIsToggeled] = useState(stateValue);

    const flip = () => setIsToggeled((prev) => !prev);

    return [isToggeled, flip] as const;
}
