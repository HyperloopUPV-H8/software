import styles from "./TabBar.module.scss";
import { Tab } from "./Tab/Tab";
import { TabItem } from "layouts/TabLayout/TabItem";

type Props = {
    items: TabItem[];
    onTabClick: (tab: TabItem) => void;
    visibleTabId: string;
};

export const TabBar = ({ items, onTabClick, visibleTabId }: Props) => {
    return (
        <div className={styles.wrapper}>
            {items.map((item) => {
                return (
                    <Tab
                        key={item.id}
                        className={item.id == visibleTabId ? styles.active : ""}
                        name={item.name}
                        //FIXME: añadir icono
                        onClick={() => {
                            onTabClick(item);
                        }}
                    ></Tab>
                );
            })}
        </div>
    );
};
