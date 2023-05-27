import { Bootloader } from "./Bootloader/Bootloader";
import { useEffect, useState } from "react";
import { fetchFromBackend } from "services/fetch";

export const BootloaderContainer = () => {
    const [boards, setBoards] = useState<string[]>();

    useEffect(() => {
        const controller = new AbortController();

        fetchFromBackend(
            import.meta.env.VITE_UPLOADABLE_BOARDS_PATH,
            controller.signal
        )
            .then((res: Response) => res.json())
            .then((value: string[]) => {
                setBoards(value);
            });

        return () => {
            controller.abort();
        };
    }, []);

    if (boards) {
        return <Bootloader boards={boards} />;
    } else {
        return <>Fetching boards...</>;
    }
};
