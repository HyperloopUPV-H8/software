import { useSelector } from "react-redux";
import { useRef } from "react";
import { RootState } from "store";
import styles from "@components/ReceiveTable/ReceiveTable.module.scss";
import { Headers } from "@components/ReceiveTable/Headers/Headers";
import BoardSection from "@components/ReceiveTable/BoardSection/BoardSection";

export const ReceiveTable = () => {
  const boards = useSelector((state: RootState) => state.podData.boards);
  const boardsWrapper = useRef<HTMLDivElement>(null);

  return (
    <div id={styles.wrapper}>
      <Headers />
      <div className={styles.boards} ref={boardsWrapper}>
        {Object.values(boards).map((board) => {
          return (
            <BoardSection
              key={board.name}
              board={board}
              scrollContainer={boardsWrapper.current!}
            />
          );
        })}
      </div>
    </div>
  );
};
