import styles from "components/Navbar/NavbarItem/NavbarItem.module.scss";
import { NavLink } from "react-router-dom";

export type NavbarItemData = {
    path: string;
    icon: string;
};

type Props = {
    item: NavbarItemData;
};

export const NavbarItem = ({ item }: Props) => {
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
