import { useSelector } from "react-redux";
import Sidebar from "@components/ChartMenu/Sidebar/Sidebar";
import styles from "@components/ChartMenu/ChartMenu.module.scss";
import { selectNumericPodDataNames } from "@slices/podDataSlice";
import lodash from "lodash";
import { ChartList } from "@components/ChartMenu/ChartList/ChartList";
import { TreeNode } from "@components/ChartMenu/TreeNode";

export const ChartMenu = () => {
    const boardNodes = useSelector(selectNumericPodDataNames, lodash.isEqual);
    return (
        <div className={styles.wrapper}>
            <Sidebar boardNodes={boardNodes} />
            <ChartList></ChartList>
        </div>
    );
};
