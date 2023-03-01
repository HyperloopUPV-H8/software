import styles from "./Sidebar.module.scss";
import { SidebarItem, SidebarItemData } from "./SidebarItem/SidebarItem";
import { ReactComponent as TeamLogo } from "assets/svg/teamLogo.svg";
import { Link, useLocation } from "react-router-dom";
type Props = {
    items: SidebarItemData[];
};

export const Sidebar = ({ items }: Props) => {
    const location = useLocation();
    console.log(location);
    return (
        <nav className={styles.sidebarWrapper}>
            <Link to={"/"}>
                <TeamLogo className={styles.logo} />
            </Link>
            <div className={styles.separator} />
            <div className={styles.items}>
                {items.map((item) => {
                    return (
                        <SidebarItem
                            key={item.path}
                            item={item}
                            isActive={"/" + item.path == location.pathname}
                        />
                    );
                })}
            </div>
        </nav>
    );
};
