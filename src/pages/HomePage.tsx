import styles from "@pages/HomePage.module.scss";

type Props = {
  children: React.ReactNode;
};
export const HomePage = ({ children }: Props) => {
  return <div id={styles.wrapper}>{children}</div>;
};
