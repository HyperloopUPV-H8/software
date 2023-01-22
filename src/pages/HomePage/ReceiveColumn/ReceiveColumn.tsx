import styles from "pages/HomePage/ReceiveColumn.module.scss";
import { ReceiveTable } from "components/ReceiveTable/ReceiveTable";
import { BiLineChart } from "react-icons/bi";
import { TabLayout } from "layouts/TabLayout/TabLayout";
import { nanoid } from "nanoid";
import { HiInboxArrowDown } from "react-icons/hi2";
import { ChartMenu } from "components/ChartMenu/ChartMenu";

export const ReceiveColumn = () => {
    return (
        <TabLayout
            items={[
                {
                    id: nanoid(),
                    name: "Packets",
                    icon: <HiInboxArrowDown />,
                    component: <ReceiveTable />,
                },
                {
                    id: nanoid(),
                    name: "Charts",
                    icon: <BiLineChart />,
                    component: <ChartMenu />,
                },
            ]}
        ></TabLayout>
    );
};
