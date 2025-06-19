import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'styles/global.scss';
import 'styles/scrollbars.scss';
import styles from './App.module.scss';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { ReactComponent as Wheel } from 'assets/svg/wheel.svg';
import { ReactComponent as Gui } from  'assets/svg/gui.svg';
import { ReactComponent as Cameras } from 'assets/svg/cameras.svg';
import { ReactComponent as TeamLogo } from 'assets/svg/team_logo.svg';
import { SplashScreen, WsHandlerProvider, useLoadBackend } from 'common';
import { ExitConfirmationDialog } from 'components/ExitConfirmationDialog';

const AppContent = ({ wsHandler }: { wsHandler: any }) => {
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [isShuttingDown, setIsShuttingDown] = useState(false);

    // Handle coordinated shutdown
    useEffect(() => {
        if (!wsHandler) return;

        let isUnloading = false;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isShuttingDown) return; // Already shutting down
            
            // Show browser's default confirmation
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave?';
            return 'Are you sure you want to leave?';
        };

        const handleUnload = () => {
            if (!isUnloading && wsHandler && !isShuttingDown) {
                isUnloading = true;
                // Send immediate shutdown signal
                wsHandler.post("lifecycle/shutdown", {
                    reason: "Browser window closed"
                });
            }
        };

        // Subscribe to shutdown response
        const shutdownSub = wsHandler.subscribe("lifecycle/shutdownResponse", {
            id: "shutdown-response",
            cb: (response: any) => {
                if (response.acknowledged) {
                    setIsShuttingDown(true);
                    setTimeout(() => {
                        window.close();
                    }, 100);
                }
            }
        });

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
            wsHandler.unsubscribe("lifecycle/shutdownResponse", "shutdown-response");
        };
    }, [wsHandler, isShuttingDown]);

    // Add WebSocket error handling
    useEffect(() => {
        if (!wsHandler?.ws) return;

        const originalOnError = wsHandler.ws.onerror;
        const originalOnClose = wsHandler.ws.onclose;

        wsHandler.ws.onerror = (event: any) => {
            console.error("WebSocket error:", event);
            if (!isShuttingDown) {
                setShowExitDialog(true);
            }
            originalOnError?.(event);
        };

        wsHandler.ws.onclose = (event: any) => {
            if (!isShuttingDown && !event.wasClean) {
                setShowExitDialog(true);
            }
            originalOnClose?.(event);
        };
    }, [wsHandler, isShuttingDown]);

    return (
        <>
            <Sidebar
                items={[
                    { path: '/vehicle', icon: <Wheel /> },
                    { path: '/cameras', icon: <Cameras /> },
                    { path: '/guiBooster', icon: <Gui /> }
                ]}
            />
            <Outlet />
            
            <ExitConfirmationDialog
                open={showExitDialog && !isShuttingDown}
                onConfirm={() => {
                    setIsShuttingDown(true);
                    wsHandler?.post("lifecycle/shutdown", {
                        reason: "User confirmed exit"
                    });
                    setShowExitDialog(false);
                }}
                onCancel={() => {
                    setShowExitDialog(false);
                    // Attempt reconnection
                    window.location.reload();
                }}
            />
        </>
    );
};

export const App = () => {
    const isProduction = import.meta.env.PROD;
    const loadBackend = useLoadBackend(isProduction);

    return (
        <div className={styles.appWrapper}>
            {loadBackend.state === 'fulfilled' && (
                <WsHandlerProvider handler={loadBackend.wsHandler}>
                    <AppContent wsHandler={loadBackend.wsHandler} />
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
