import { Orientation } from "hooks/useSplit/Orientation";
import { SplitLayout } from "layouts/SplitLayout/SplitLayout";
import { ChartsColumn } from "pages/LoggerPage/ChartsColumn/ChartsColumn";
import chart from "assets/svg/chart.svg"

export const LoggerPage = () => {
    return (
        <SplitLayout
            components={[
                {
                    component: <ChartsColumn />,
                    collapsedIcon: chart,
                },
            ]}
            orientation={Orientation.HORIZONTAL}
        ></SplitLayout>
    );
};
