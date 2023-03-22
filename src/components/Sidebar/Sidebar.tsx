import styles from "./Sidebar.module.scss";
import { SidebarItem, SidebarItemData } from "./SidebarItem/SidebarItem";
import { ReactComponent as TeamLogo } from "assets/svg/team_logo.svg";
import { Link, useLocation } from "react-router-dom";

type Props = {
    items: SidebarItemData[];
};

export const Sidebar = ({ items }: Props) => {
    const location = useLocation();
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
                            isActive={isInSubpath(item.path, location.pathname)}
                        />
                    );
                })}
            </div>
        </nav>
    );
};

function isInSubpath(itemPath: string, currentPath: string): boolean {
    return "/" + currentPath.split("/")[1] == itemPath;
}
