import { Outlet } from "react-router-dom";
import "styles/global.scss";
import styles from "./App.module.scss";
import { Sidebar } from "components/Sidebar/Sidebar";
import { IoRocketSharp } from "react-icons/io5";
import { GiRailRoad } from "react-icons/gi";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { MdScience } from "react-icons/md";
export const App = () => {
    return (
        <div className={styles.appWrapper}>
            <Sidebar
                items={[
                    { path: "vehicle", icon: <IoRocketSharp /> },
                    { path: "tube", icon: <GiRailRoad /> },
                    { path: "testing", icon: <MdScience /> },
                    { path: "cameras", icon: <BsFillCameraVideoFill /> },
                ]}
            />
            <Outlet />
        </div>
    );
};
