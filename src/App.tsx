import { Outlet } from "react-router-dom";
import "styles/global.scss";
import "styles/scrollbars.scss";
import styles from "./App.module.scss";
import { Sidebar } from "components/Sidebar/Sidebar";
import { ReactComponent as Wheel } from "assets/svg/wheel.svg";
import { ReactComponent as Tube } from "assets/svg/tube.svg";
import { ReactComponent as Testing } from "assets/svg/testing.svg";
import { ReactComponent as Cameras } from "assets/svg/cameras.svg";

export const App = () => {
    return (
        <div className={styles.appWrapper}>
            <Sidebar
                items={[
                    { path: "/vehicle", icon: <Wheel /> },
                    { path: "/tube", icon: <Tube /> },
                    { path: "/testing", icon: <Testing /> },
                    { path: "/cameras", icon: <Cameras /> },
                ]}
            />
            <Outlet />
        </div>
    );
};
