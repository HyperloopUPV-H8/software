import { useState } from "react";
import { SplitLayout } from "layouts/SplitLayout/SplitLayout";
import { Orientation } from "hooks/useSplit/Orientation";
import { ReceiveColumn } from "pages/TestingPage/ReceiveColumn/ReceiveColumn";
import { OrderColumn } from "pages/TestingPage/OrderColumn/OrderColumn";
import { MessagesColumn } from "pages/TestingPage/MessagesColumn/MessagesColumn";
import { ChartsColumn } from "./ChartsColumn/ChartsColumn";
import styles from "pages/TestingPage/TestingPage.module.scss";
import incomingMessage from "assets/svg/incoming-message.svg";
import paperAirplane from "assets/svg/paper-airplane.svg";
import outgoingMessage from "assets/svg/outgoing-message.svg";
import chart from "assets/svg/chart.svg";
import { ChartInfo, ChartId } from "components/ChartMenu/ChartMenu";
import { MeasurementId } from "common";

export const TestingPage = () => {
  const [collapsed, setCollapsed] = useState({
    charts: false,
    receive: false,
    order: false,
    messages: false,
  });

  const [charts, setCharts] = useState<ChartInfo[]>([]);
  const [measurementsByChart, setMeasurementsByChart] = useState<Record<ChartId, MeasurementId[]>>({});

  const toggleCollapse = (key: keyof typeof collapsed) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const components = [
    {
      key: "charts" as const,
      icon: chart,
      component: <ChartsColumn charts={charts} setCharts={setCharts} measurementsByChart={measurementsByChart} setMeasurementsByChart={setMeasurementsByChart} />, // props nuevos
      collapsed: collapsed.charts,
    },
    {
      key: "receive" as const,
      icon: incomingMessage,
      component: <ReceiveColumn />,
      collapsed: collapsed.receive,
    },
    {
      key: "order" as const,
      icon: paperAirplane,
      component: <OrderColumn />,
      collapsed: collapsed.order,
    },
    {
      key: "messages" as const,
      icon: outgoingMessage,
      component: <MessagesColumn />,
      collapsed: collapsed.messages,
    },
  ];

  const visibleComponents = components.filter(c => !c.collapsed);

  return (
    <div id={styles.wrapper}>
      <div id={styles.body}>
        <div className="d-flex flex-row gap-2 p-2">
          {components.map(({ key }) => (
            <button
              key={key}
              className={`btn btn-sm btn-${collapsed[key] ? "outline-primary" : "primary"}`}
              onClick={() => toggleCollapse(key)}
            >
              {collapsed[key] ? `Mostrar ${key}` : `Ocultar ${key}`}
            </button>
          ))}
        </div>
       <SplitLayout
          key={visibleComponents.length}
          components={visibleComponents.map(({ component, icon }) => ({
            component,
            collapsedIcon: icon,
          }))}
          orientation={Orientation.HORIZONTAL}
        />
      </div>
    </div>
  );
};
