import styles from "./Navbar.module.scss";
import { NavbarItem, NavbarItemData } from "./NavbarItem/NavbarItem";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

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
                {items.map((item, index) => {
                    return (
                        <NavbarItem
                            key={index}
                            item={item}
                            pageShown={pageShown}
                            setPageShown={setPageShown}
                        />
                    );
                })}
            </div>
            <div className={styles.spacer} />
            <ThemeToggle />
        </nav>
    );
};
