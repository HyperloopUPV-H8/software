import styles from "components/Sidebar/SidebarItem/SidebarItem.module.scss";
import { NavLink } from "react-router-dom";

export type SidebarItemData = {
    path: string;
    icon: string;
};

type Props = {
    item: SidebarItemData;
};

export const SidebarItem = ({ item }: Props) => {
    return (
        <NavLink
            to={item.path}
            className={({isActive}) => isActive ? styles.active : ""}
        >
            <div className={styles.iconWrapper}>
                <img src={item.icon} alt="icon" />
            </div>
        </NavLink>
    );
};
