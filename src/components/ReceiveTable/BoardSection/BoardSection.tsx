import styles from "@components/ReceiveTable/BoardSection/BoardSection.module.scss";
import { Board } from "@models/PodData/Board";
import PacketRow from "@components/ReceiveTable/PacketRow/PacketRow";
import { memo } from "react";

type Props = {
  board: Board;
};

const BoardSection = ({ board }: Props) => {
  return (
    <>
      <tr className={styles.row}>
        <td className={styles.name} colSpan={5}>
          {board.name}
        </td>
      </tr>
      {Object.values(board.packets).map((packet) => {
        return <PacketRow key={packet.id} packet={packet}></PacketRow>;
      })}
    </>
  );
};

export default memo(BoardSection);
