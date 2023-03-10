import styles from "./StateOrders.module.scss";
import { BoardStateView } from "./BoardStateView/BoardStateView";
import { Window } from "components/Window/Window";
import { Orders } from "./Orders/Orders";
import { useBoardStateInfo } from "./useBoardStateInfo";

export const StateOrders = () => {
    const stateInfo = useBoardStateInfo();

    return (
        <Window title="State Actions">
            <main className={styles.stateActionsWrapper}>
                <BoardStateView
                    boardName="LCU"
                    state={stateInfo.state}
                />
                {stateInfo.actions.length > 0 && (
                    <Orders actions={stateInfo.actions} />
                )}
            </main>
        </Window>
    );
};
