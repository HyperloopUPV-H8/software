import styles from './VehiclePage.module.scss';
import { Pagination } from 'components/Pagination/Pagination';
import { PageWrapper } from 'pages/PageWrapper/PageWrapper';
import { Outlet } from 'react-router-dom';
import { useEmergencyOrders } from 'hooks/useEmergencyOrders';

export const VehiclePage = () => {
    useEmergencyOrders();

    return (
        <PageWrapper title="Vehicle">
            <Outlet />
            <div className={styles.pagination_position}>
                <Pagination routes={['data-1', 'data-2', 'controls']} />
            </div>
        </PageWrapper>
    );
};
