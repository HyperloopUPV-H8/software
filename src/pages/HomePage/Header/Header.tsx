import styles from "@pages/HomePage/Header/Header.module.scss";
import { LogMenu } from "@pages/HomePage/Header/LogMenu/LogMenu";
import { NPFDropdown } from "@pages/HomePage/Header/NPFDropdown/NPFDropdown";
export const Header = () => {
  return (
    <div id={styles.wrapper}>
      <div id={styles.title}>
        <img
          id={styles.logo}
          src="src/public/images/logo-white.png"
          alt="Logo HyperloopUPV"
        />
        <div id={styles.name}>Ethernet View</div>
      </div>
      <div id={styles.tools}>
        <LogMenu />
        <NPFDropdown />
      </div>
    </div>
  );
};
