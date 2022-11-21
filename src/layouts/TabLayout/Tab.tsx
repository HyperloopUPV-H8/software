import styles from "@layouts/TabLayout/Tab.module.scss";
import { TabEdge } from "@layouts/TabLayout/TabEdge";
type Props = {
  title: string;
  icon?: React.ReactNode;
  onClick: () => void;
};

export const Tab = ({ title, icon, onClick }: Props) => {
  return (
    <div id={styles.wrapper} onClick={onClick}>
      <TabEdge id={styles.firstEdge} />
      <div id={styles.content}>
        <div id={styles.label}>
          <div id={styles.icon}>{icon}</div>
          <div id={styles.title}>{title}</div>
        </div>
      </div>
      <TabEdge id={styles.secondEdge} />
    </div>
  );
};
