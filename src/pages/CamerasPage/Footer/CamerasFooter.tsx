//import React from "react";
//import "./Footer.css";
import styles from "./CamerasFooter.module.scss";
import { Information } from "./Information";
import { Tube } from "./Tube";

export const CamerasFooter = () => {
    return (
        <div className={styles.cameraFooter}>
            <div className={styles.info}>
                <Information />
            </div>

            <div className={styles.tube}>
                <Tube />
            </div>
        </div>
    );
};
