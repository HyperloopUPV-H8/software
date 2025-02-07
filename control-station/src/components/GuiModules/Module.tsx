import React from "react";
import styles from "./Module.module.scss";

interface ModuleProps {
    id: string | number;
}
const Module: React.FC<ModuleProps> = ({ id }) => {
    const cells = Array.from({ length: 48 }, (_, index) => (
        <div key={index} className={styles.cells}></div>
    ));

    return (
        <div className={styles.boxContainer1}>
            <div className={styles.boxContainer2}>
                <article className={styles.titleDecorationModule}>
                    <h2 className={styles.h2Module}>Module {id}</h2>
                </article>
                <div className={styles.boxContainer3}>
                    <div className={styles.voltajeContainer}>
                        <h3 className={styles.h3}>Voltaje</h3>
                        <p className={styles.p}>max </p>
                        <p className={styles.p}>min </p>
                        <p className={styles.p}>mean </p>
                    </div>
                    <div className={styles.intensityContainer}>
                        <h3 className={styles.h3}>Intensity</h3>
                        <p className={styles.p}>max </p>
                        <p className={styles.p}>min </p>
                    </div>
                </div>
            </div>
            <div className={styles.flexCells}>{cells}</div>
        </div>
    );
};

export default Module;
