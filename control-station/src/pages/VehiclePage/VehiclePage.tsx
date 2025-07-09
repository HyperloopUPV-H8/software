/* import styles from './VehiclePage.module.scss';
import { Pagination } from 'components/Pagination/Pagination';
import { PageWrapper } from 'pages/PageWrapper/PageWrapper';
import { Outlet } from 'react-router-dom';
import { usePodDataUpdate } from 'hooks/usePodDataUpdate';
import { Connection, useConnections } from 'common';
import { LostConnectionContext } from 'services/connections';
import { OBCCUGeneralInfo } from './Boards/OBCCU/OBCCUGeneralInfo';

export const VehiclePage = () => {
    usePodDataUpdate();
    
    const connections = useConnections();

    return (
        <LostConnectionContext.Provider
             value={any(
                [...connections.boards, connections.backend],
                 isDisconnected
             )}
        >
            <PageWrapper title="Vehicle">
                <Outlet />
                <div className={styles.pagination_position}>
                    <Pagination routes={['data-1', 'data-2', 'guiBooster']} />
                </div>
            </PageWrapper>
        
        </LostConnectionContext.Provider>

    );
};

function isDisconnected(connection: Connection): boolean {
    return !connection.isConnected;
}

function all<T>(data: T[], condition: (value: T) => boolean): boolean {
    for (const value of data) {
        if (!condition(value)) {
            return false;
        }
    }
    return true;
}

function any<T>(data: T[], condition: (value: T) => boolean): boolean {
    for (const value of data) {
        if (condition(value)) {
            return true;
        }
    }
    return false;
}
 */