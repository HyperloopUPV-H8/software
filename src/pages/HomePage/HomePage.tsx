import { Direction, SplitLayout } from "@layouts/SplitLayout/SplitLayout";
import { ReceiveColumn } from "@pages/HomePage/ReceiveColumn/ReceiveColumn";
import { TransmitColumn } from "@pages/HomePage/TransmitColumn/TransmitColumn";
import { MessagesColumn } from "@pages/HomePage/MessagesColumn/MessagesColumn";
import { Header } from "@pages/HomePage/Header/Header";
import styles from "@pages/HomePage/HomePage.module.scss";

export const HomePage = () => {
  return (
    <div id={styles.wrapper}>
      <Header />
      <div id={styles.body}>
        <SplitLayout
          components={[
            <ReceiveColumn />,
            <TransmitColumn />,
            // <MessagesColumn />,
          ]}
          direction={Direction.HORIZONTAL}
          initialPortions={[0.5, 0.5]}
        ></SplitLayout>
      </div>
    </div>
  );
};
