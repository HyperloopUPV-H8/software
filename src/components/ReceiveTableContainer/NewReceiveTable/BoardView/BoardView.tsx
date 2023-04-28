import { Board } from "common";
import styles from "./BoardView.module.scss";
import { PacketView } from "./PacketView/PacketView";
import { Caret } from "components/Caret/Caret";
import { useState } from "react";
import { Header } from "./Header/Header";

type Props = {
    board: Board;
};

export const BoardView = ({ board }: Props) => {
    const [open, setOpen] = useState(false);

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
                            packetId={packet.id}
                        />
                    );
                })}
        </div>
    );
};
