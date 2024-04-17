import { ChartId } from "components/ChartMenu/ChartMenu"
import styles from "components/ChartMenu/ChartMenu.module.scss"
import { Item } from "components/ChartMenu/Sidebar/Section/Subsection/Subsection/Items/Item/ItemView"
import Sidebar from "components/ChartMenu/Sidebar/Sidebar"
import { useLogStore } from "pages/LoggerPage/useLogStore"
import { DragEvent, useCallback, useState } from "react"
import { ChartElement } from "./ChartElement/ChartElement"

export const ChartMenu = () => {
    const openLogSession = useLogStore((state) => state.openLogSession)
    const logSessions = useLogStore((state) => state.logSessions)
    const logSession = logSessions.find((logSession) => logSession.name === openLogSession)
    const data = logSession ? Array.from(logSession.measurementLogs.keys()).sort() : []
    const sidebarItems: Item[] = data.map(measurement => ({
        id: measurement,
        name: measurement,
    }))

    const getDataFromLogSession = (measurement: ChartId) => {
        return logSession?.measurementLogs.get(measurement) || [];
    }

    const [charts, setCharts] = useState<ChartId[]>([]);

    const addChart = ((chartId: ChartId) => {
        setCharts([...charts, chartId]);
    });

    const removeChart = useCallback((chartId: ChartId) => {
        setCharts(prevCharts => prevCharts.filter(chart => chart !== chartId));
    }, []);
    
    const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        const id = ev.dataTransfer.getData("id");
        addChart(id);
    };

    return (
        <div className={styles.chartMenuWrapper}>
            <Sidebar items={sidebarItems}/>
            <div
                className={styles.chartListWrapper}
                onDrop={handleDrop}
                onDragEnter={(ev) => ev.preventDefault()}
                onDragOver={(ev) => ev.preventDefault()}
            >
                {charts.map((chart) => (
                    <ChartElement
                        key={chart}
                        chartId={chart}
                        removeChart={(chartId: ChartId) => removeChart(chartId)}
                        getDataFromLogSession={getDataFromLogSession}
                    />
                ))}
        </div>
        </div>
    )
}
