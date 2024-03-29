import { ChartsColumn } from "pages/LoggerPage/ChartsColumn/ChartsColumn";
import { LogsColumn } from "./LogsColumn/LogsColumn";
import { SplitLayout } from "layouts/SplitLayout/SplitLayout";

export const LoggerPage = () => {
    return (
        <SplitLayout 
            components={[
                {
                    component: <LogsColumn />,
                    collapsedIcon: ""
                },
                {
                    component: <ChartsColumn />,
                    collapsedIcon: ""
                }
            ]}
            initialLengths={[0.3, 0.7]}
        />
    );
};
