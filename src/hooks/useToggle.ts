import { useState } from "react"

export function useToggle() {
    const [isToggeled, setIsToggeled] = useState<boolean>(false)

    const flip = () => setIsToggeled(prev => !prev)

    return [isToggeled, flip] as const;
}