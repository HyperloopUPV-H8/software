import styles from "@components/ReceiveTable/BoardSection/BoardSection.module.scss";
import { Board } from "@models/PodData/Board";
import { Caret } from "@components/Caret/Caret";
import PacketRow from "@components/ReceiveTable/PacketRow/PacketRow";
import { memo, useState } from "react";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

type Props = {
  board: Board;
  scrollContainer: HTMLDivElement;
};

const BoardSection = ({ board, scrollContainer }: Props) => {
  let [isVisible, setIsVisible] = useState(true);
  let packetArr = Object.values(board.packets);
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Caret
          isOpen={isVisible}
          onClick={() => {
            setIsVisible((prevValue) => {
              return !prevValue;
            });
          }}
        />
        {<div className={styles.name}>{board.name}</div>}
      </div>
      {isVisible && (
        <div className={styles.packets}>
          <AutoSizer>
            {({ width, height }) => {
              return (
                <VariableSizeList
                  innerElementType={"div"}
                  itemData={packetArr}
                  itemCount={packetArr.length}
                  itemSize={(index) => {
                    return (
                      Object.keys(packetArr[index].measurements).length * 30 +
                      30
                    );
                  }}
                  width={width}
                  height={height}
                >
                  {({ data, index, style }) => {
                    return (
                      <PacketRow
                        key={data[index].id}
                        packet={data[index]}
                        style={style}
                        scrollContainer={scrollContainer}
                      ></PacketRow>
                    );
                  }}
                </VariableSizeList>
              );
            }}
          </AutoSizer>
        </div>
      )}
    </div>
  );
};

export default memo(BoardSection);
