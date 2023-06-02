import styles from "./VehiclePage.module.scss";

import { Pagination } from "components/Pagination/Pagination";
import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { Outlet } from "react-router-dom";

export const VehiclePage = () => {
    return (
        <PageWrapper title="Vehicle">
            <div className={styles.contentWrapper}>
                <Outlet />
                <Pagination routes={["1", "2"]} />
            </div>
        </PageWrapper>
    );
};
