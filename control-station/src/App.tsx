import { Outlet } from 'react-router-dom';
import 'styles/global.scss';
import 'styles/scrollbars.scss';
import styles from './App.module.scss';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { ReactComponent as Wheel } from 'assets/svg/wheel.svg';
import { ReactComponent as Arrow } from  'assets/svg/arrow.svg';
import { ReactComponent as Cameras } from 'assets/svg/cameras.svg';
import { ReactComponent as TeamLogo } from 'assets/svg/team_logo.svg';
import { ReactComponent as Batteries } from 'assets/svg/battery-filled.svg'
import { SplashScreen, WsHandlerProvider, useLoadBackend } from 'common';
import { useEffect } from 'react';

export const App = () => {
    const isProduction = import.meta.env.PROD;
    const loadBackend = useLoadBackend(isProduction);
    
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <div className={styles.appWrapper}>
            {loadBackend.state === 'fulfilled' && (
                <WsHandlerProvider handler={loadBackend.wsHandler}>
                    <Sidebar
                        items={[
                            { path: '/vehicle', icon: <Wheel /> },
                            { path: '/booster', icon: <Arrow /> },
                            { path: '/batteries', icon: <Batteries /> },
                            { path: '/cameras', icon: <Cameras /> }
                        ]}
                    />
                    <Outlet />
                </WsHandlerProvider>
            )}
            {loadBackend.state === 'pending' && (
                <SplashScreen>
                    <TeamLogo />
                </SplashScreen>
            )}
            {loadBackend.state === 'rejected' && (
                <div>{`${loadBackend.error}`}</div>
            )}
        </div>
    );
};
