import React from "react";
import styles from "@components/MessageLogger/Counter/Counter.module.scss";

interface Props {
  count: number;
  className: string;
}

export const Counter = ({ count, className }: Props) => {
  return <div className={`${styles.count} ${className}`}>{count}</div>;
};
