import { Board } from "common";
import styles from "./BoardView.module.scss";
import { PacketView } from "./PacketView/PacketView";
import { useState } from "react";
import { Header } from "./Header/Header";
import { memo } from "react";

type Props = {
    board: Board;
};

export const BoardView = memo(({ board }: Props) => {
    const [open, setOpen] = useState(true);

    return (
        <div className={styles.boardView}>
            <Header
                name={board.name}
                open={open}
                onClick={() => setOpen((prev) => !prev)}
            ></Header>
            {open &&
                Object.values(board.packets).map((packet) => {
                    return (
                        <PacketView
                            key={packet.id}
                            packet={packet}
                        />
                    );
                })}
        </div>
    );
});
