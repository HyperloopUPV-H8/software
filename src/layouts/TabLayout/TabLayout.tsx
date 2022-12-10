import { useEffect, useState } from "react";
import styles from "@layouts/TabLayout/TabLayout.module.scss";
import React from "react";
import { TabBar } from "@layouts/TabLayout/TabBar/TabBar";
import { TabItem } from "@layouts/TabLayout/TabItem";

type Props = {
  items: TabItem[];
};

export const TabLayout = ({ items }: Props) => {
  let [visibleTabId, setVisibleTabId] = useState("");

  function handleClick(id: string) {
    setVisibleTabId(id);
  }

  useEffect(() => {
    if (items.length > 0) {
      setVisibleTabId(items[0].id);
    }
  }, []);

  return (
    <div id={styles.wrapper}>
      <TabBar
        items={items}
        onTabClick={handleClick}
        visibleTabId={visibleTabId}
      />
      <div id={styles.body}>
        <div id={styles.componentWrapper}>
          {items.map((item) => {
            return (
              <div
                key={item.id}
                className={styles.visibilityWrapper}
                style={{
                  display: visibleTabId == item.id ? "block" : "none",
                }}
              >
                {item.component}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
