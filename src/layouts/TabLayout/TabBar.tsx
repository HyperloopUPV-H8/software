import styles from "@layouts/TabLayout/TabBar.module.scss";
import { TabItem } from "@layouts/TabLayout/TabItem";
import { Tab } from "@layouts/TabLayout/Tab";
import React from "react";

type Props = {
  items: TabItem[];
  onTabClick: (id: string) => void;
};

export const TabBar = ({ items, onTabClick }: Props) => {
  return (
    <div id={styles.wrapper}>
      {items.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <Tab
              title={item.name}
              icon={item.icon}
              onClick={() => {
                onTabClick(item.id);
              }}
            ></Tab>
          </React.Fragment>
        );
      })}
    </div>
  );
};
