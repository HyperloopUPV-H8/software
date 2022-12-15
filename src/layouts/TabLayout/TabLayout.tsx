import { useEffect, useState } from "react";
import styles from "@layouts/TabLayout/TabLayout.module.scss";
import { TabBar } from "@layouts/TabLayout/TabBar/TabBar";
import { TabItem } from "@layouts/TabLayout/TabItem";
type Props = {
    items: TabItem[];
};

export const TabLayout = ({ items }: Props) => {
    //TODO: fails if item length == 0
    let [visibleTab, setVisibleTab] = useState(items[0]);

    function handleClick(tab: TabItem) {
        setVisibleTab(tab);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <div className={styles.name}>{visibleTab.name}</div>
                {items.length > 1 && (
                    <TabBar
                        items={items}
                        onTabClick={handleClick}
                        visibleTabId={visibleTab.id}
                    />
                )}
            </div>
            <div className={styles.body}>
                <div className={styles.componentWrapper}>
                    {items.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className={styles.visibilityWrapper}
                                style={{
                                    display:
                                        visibleTab.id == item.id
                                            ? "block"
                                            : "none",
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
