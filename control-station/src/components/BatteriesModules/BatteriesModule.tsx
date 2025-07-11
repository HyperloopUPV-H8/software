import React from "react";
import styles from "./BatteriesModule.module.scss";

const BatteriesModule: React.FC<{ id: string | number }> = ({ id }) => {
  return (
    <div className={styles.boxContainer1}>
      <div className={styles.boxContainer2}>
        <article className={styles.titleDecorationModule}>
          <h2 className={styles.h2Module}>Module {id}</h2>
        </article>
        
        <div className={styles.flexCells}>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className={`${styles.cell} ${styles.green}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatteriesModule;

