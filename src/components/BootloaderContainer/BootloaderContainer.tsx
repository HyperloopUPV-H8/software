import { Bootloader } from "./Bootloader/Bootloader";
import { useEffect, useState } from "react";
import { fetchFromBackend } from "common";
import { config } from "common";

export const BootloaderContainer = () => {
    const [boards, setBoards] = useState<string[]>();

    useEffect(() => {
        const controller = new AbortController();

        fetchFromBackend(config.paths.uploadableBoards, controller.signal)
            .then((res: Response) => res.json())
            .then((value: string[]) => {
                setBoards(value);
            });
    }, []);

    if (boards) {
        return <Bootloader boards={boards} />;
    } else {
        return <>Fetching boards...</>;
    }
};
