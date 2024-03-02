import styles from "./Header.module.scss";
import { TabBar } from "./TabBar/TabBar";
import { TabItem } from "layouts/TabLayout/TabItem";

type Props = {
    tabs: TabItem[];
    visibleTab: TabItem;
    handleClick: (tab: TabItem) => void;
};

export const Header = ({ tabs, visibleTab, handleClick }: Props) => {
    return (
        <div className={styles.headerWrapper}>
            <div className={styles.name}>{visibleTab.name}</div>
            {tabs.length > 1 && (
                <TabBar
                    tabs={tabs}
                    onTabClick={handleClick}
                    visibleTabId={visibleTab.id}
                />
            )}
        </div>
    );
};
