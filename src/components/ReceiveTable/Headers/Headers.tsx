import styles from "@components/ReceiveTable/Headers/Headers.module.scss";
import "@components/ReceiveTable/TableStyles.scss";
export const Headers = () => {
  return (
    <div id={styles.wrapper} className="tableRow">
      <div>ID</div>
      <div>NAME</div>
      <div>HEX VALUE</div>
      <div>COUNT</div>
      <div>CYCLE TIME</div>
    </div>
  );
};
