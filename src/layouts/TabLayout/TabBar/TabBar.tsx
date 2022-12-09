import styles from "@layouts/TabLayout/TabBar/TabBar.module.scss";
import { TabItem } from "@layouts/TabLayout/TabItem";
import { Tab } from "@layouts/TabLayout/Tab/Tab";
import React from "react";

type Props = {
  items: TabItem[];
  onTabClick: (id: string) => void;
  visibleTabId: string;
};

export const TabBar = ({ items, onTabClick, visibleTabId }: Props) => {
  return (
    <div id={styles.wrapper}>
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className={item.id != visibleTabId ? styles.inactive : ""}
          >
            <Tab
              title={item.name}
              //FIXME: añadir icono
              onClick={() => {
                onTabClick(item.id);
              }}
            ></Tab>
          </div>
        );
      })}
    </div>
  );
};
