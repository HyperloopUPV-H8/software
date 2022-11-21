import { useEffect, useState } from "react";
import styles from "@layouts/TabLayout/TabLayout.module.scss";
import React from "react";
import { TabBar } from "@layouts/TabLayout/TabBar";
import { TabItem } from "@layouts/TabLayout/TabItem";

type Props = {
  items: TabItem[];
};

export const TabLayout = ({ items }: Props) => {
  let [visibleTab, setVisibleTab] = useState("");

  function handleClick(id: string) {
    setVisibleTab(id);
  }

  useEffect(() => {
    if (items.length > 0) {
      setVisibleTab(items[0].id);
    }
  }, []);

  return (
    <div id={styles.wrapper}>
      <TabBar items={items} onTabClick={handleClick} />
      <div id={styles.body}>
        <div id={styles.componentWrapper}>
          {items.map((item) => {
            if (visibleTab == item.id) {
              return (
                <React.Fragment key={item.id}>{item.component}</React.Fragment>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
