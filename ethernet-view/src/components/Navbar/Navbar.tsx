import styles from "./Navbar.module.scss";
import { ReactComponent as TeamLogo } from "assets/svg/team_logo.svg";
import { Link } from "react-router-dom";
import { NavbarItem, NavbarItemData } from "./NavbarItem/NavbarItem";

type Props = {
    items: NavbarItemData[];
};

export const Navbar = ({ items }: Props) => {
    return (
        <nav className={styles.navbarWrapper}>
            <Link to={"/"}>
                <TeamLogo className={styles.logo} />
            </Link>
            <div className={styles.separator} />
            <div className={styles.items}>
                {items.map((item) => {
                    return (
                        <NavbarItem
                            key={item.path}
                            item={item}
                        />
                    );
                })}
            </div>
        </nav>
    );
};
