import { TabItem } from "layouts/TabLayout/TabItem";
import { TabLayout } from "layouts/TabLayout/TabLayout"

export const LogsColumn = () => {

    const logsColumnTabItems : TabItem[] = [
        {
            id: "logs",
            name: "Logs",
            icon: null,
            component: null
        }
    ];

    return <TabLayout tabs={logsColumnTabItems}/>
}
