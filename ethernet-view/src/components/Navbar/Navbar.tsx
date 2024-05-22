import styles from "./Navbar.module.scss";
import { NavbarItem, NavbarItemData } from "./NavbarItem/NavbarItem";

type Props = {
    items: NavbarItemData[];
    pageShown: string;
    setPageShown: (page: string) => void;
};

export const Navbar = ({ items, pageShown, setPageShown }: Props) => {
    return (
        <nav className={styles.navbarWrapper}>
            <div className={styles.separator} />
            <div className={styles.items}>
                {items.map((item) => {
                    return (
                        <NavbarItem
                            item={item}
                            pageShown={pageShown}
                            setPageShown={setPageShown}
                        />
                    );
                })}
            </div>
        </nav>
    );
};
