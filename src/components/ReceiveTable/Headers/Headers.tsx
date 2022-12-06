import styles from "@components/ReceiveTable/Headers/Headers.module.scss";
export const Headers = () => {
  return (
    <thead id={styles.headers}>
      <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>HEX VALUE</th>
        <th>COUNT</th>
        <th>CYCLE TIME</th>
      </tr>
    </thead>
  );
};
