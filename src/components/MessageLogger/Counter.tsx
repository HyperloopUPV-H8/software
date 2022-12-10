import React from "react";
import styles from "@components/MessageLogger/Counter.module.scss";

interface Props {
  count: number;
}

export const Counter = ({ count }: Props) => {
  return <label className={styles.count}>{count}</label>;
};
