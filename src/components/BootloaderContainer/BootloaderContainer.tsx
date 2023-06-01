import { Bootloader } from "./Bootloader/Bootloader";
import { useEffect, useState } from "react";
import { fetchBack } from "common";
import { config } from "common";

export const BootloaderContainer = () => {
    const [boards, setBoards] = useState<string[]>();

    useEffect(() => {
        const controller = new AbortController();

        fetchBack(config.paths.uploadableBoards, controller.signal).then(
            (value: string[]) => {
                setBoards(value);
            }
        );
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
