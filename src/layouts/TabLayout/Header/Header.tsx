import styles from "./Header.module.scss";
import { TabBar } from "./TabBar/TabBar";
import { TabItem } from "layouts/TabLayout/TabItem";

type Props = {
    items: TabItem[];
    visibleTab: TabItem;
    handleClick: (tab: TabItem) => void;
};

export const Header = ({ items, visibleTab, handleClick }: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.name}>{visibleTab.name}</div>
            {items.length > 1 && (
                <TabBar
                    items={items}
                    onTabClick={handleClick}
                    visibleTabId={visibleTab.id}
                />
            )}
        </div>
    );
};
