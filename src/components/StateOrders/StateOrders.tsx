import styles from "./StateOrders.module.scss";
import { BoardStateView } from "./BoardStateView/BoardStateView";
import { Window } from "components/Window/Window";
import { Orders } from "./Orders/Orders";
import { useBoardStateInfo } from "./useBoardStateInfo";

export const StateOrders = () => {
    const stateInfo = useBoardStateInfo();

    return (
        <Window title="State Actions">
            <main className={styles.stateOrdersWrapper}>
                <BoardStateView
                    boardName="LCU"
                    state={stateInfo.state}
                />
                {stateInfo.actions.length > 0 && (
                    <Orders orders={stateInfo.actions} />
                )}
            </main>
        </Window>
    );
};
