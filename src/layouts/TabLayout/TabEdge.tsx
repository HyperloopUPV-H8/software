import styles from "@layouts/TabLayout/TabEdge.module.scss";

type Props = {
  id?: string;
};

export const TabEdge = ({ id }: Props) => {
  return <div id={id} className={styles.tabEdge} />;
};
