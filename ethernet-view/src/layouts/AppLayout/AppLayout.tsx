
import { Outlet} from "react-router-dom"
import styles from "./AppLayout.module.scss"
import Testing from "assets/svg/testing.svg"
import Logger from "assets/svg/logger.svg"
import { Navbar } from "components/Navbar/Navbar"

export const AppLayout = () => {

    return (
        <div className={styles.appLayout}>
            <Navbar items={[
                {
                    path: "/",
                    icon: Testing
                },
                {
                    path: "/logger",
                    icon: Logger
                }
            ]}/>
            
            <Outlet />
        </div>
    )
}
