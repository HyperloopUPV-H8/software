import styles from "./VehiclePage.module.scss";

import { Pagination } from "components/Pagination/Pagination";
import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { Outlet } from "react-router-dom";
import { useOrders } from "useOrders";

export const VehiclePage = () => {
    useOrders();

    return (
        <PageWrapper title="Vehicle">
            <div className={styles.contentWrapper}>
                <Outlet />
                <Pagination routes={["first", "second"]} />
            </div>
        </PageWrapper>
    );
};
