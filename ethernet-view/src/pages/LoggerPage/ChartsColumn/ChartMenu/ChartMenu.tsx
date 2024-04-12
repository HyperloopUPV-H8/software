import styles from "components/ChartMenu/ChartMenu.module.scss"
import Sidebar from "components/ChartMenu/Sidebar/Sidebar"
import { useLogStore } from "pages/LoggerPage/useLogStore"

export const ChartMenu = () => {
    const openLogSession = useLogStore((state) => state.openLogSession)
    const logSessions = useLogStore((state) => state.logSessions)
    const logSession = logSessions.find((logSession) => logSession.name === openLogSession)
    const sidebarItems = logSession ? Array.from(logSession.measurementLogs.keys()) : []

    return (
        <div className={styles.chartMenuWrapper}>
            <Sidebar elements={sidebarItems}/>
        </div>
    )
}
