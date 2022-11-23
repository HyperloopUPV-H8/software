import { Direction, SplitLayout } from "@layouts/SplitLayout/SplitLayout";
import { ReceiveColumn } from "@pages/HomePage/ReceiveColumn";
import { TransmitColumn } from "@pages/HomePage/TransmitColumn";
import { MessagesColumn } from "@pages/HomePage/MessagesColumn";
import styles from "@pages/HomePage/HomePage.module.scss";
export const HomePage = () => {
  return (
    <SplitLayout
      components={[<ReceiveColumn />, <TransmitColumn />, <MessagesColumn />]}
      direction={Direction.HORIZONTAL}
    ></SplitLayout>
  );
};
