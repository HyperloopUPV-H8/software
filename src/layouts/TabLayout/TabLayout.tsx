import { useEffect, useState } from "react";
import styles from "layouts/TabLayout/TabLayout.module.scss";
import { TabItem } from "layouts/TabLayout/TabItem";
import { Header } from "layouts/TabLayout/Header/Header";

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
        <div className={`${styles.tabLayoutWrapper} island`}>
            <Header
                items={items}
                visibleTab={visibleTab}
                handleClick={handleClick}
            />
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
