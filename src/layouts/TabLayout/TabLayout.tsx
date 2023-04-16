import styles from "layouts/TabLayout/TabLayout.module.scss";
import { TabItem } from "layouts/TabLayout/TabItem";
import { Header } from "layouts/TabLayout/Header/Header";
import { useTabs } from "./useTabs";
type Props = {
    items: TabItem[];
};

export const TabLayout = ({ items }: Props) => {
    const [tabs, visibleTab, setVisibleTab] = useTabs(items);

    function handleClick(tab: TabItem) {
        setVisibleTab(tab);
    }

    return (
        <div className={`${styles.tabLayoutWrapper} island`}>
            <Header
                items={tabs}
                visibleTab={visibleTab}
                handleClick={handleClick}
            />
            <div className={styles.body}>
                <div className={styles.componentWrapper}>
                    {tabs.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className={styles.visibilityWrapper}
                                style={{
                                    display:
                                        visibleTab.id == item.id
                                            ? "flex"
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
