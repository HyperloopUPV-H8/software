import styles from "./BoardStateView.module.scss";
import { Badge } from "./Badge/Badge";
import { BoardState } from "../StateOrdersType";

type Props = {
    boardName: string;
    state: BoardState;
};

const stateToBadgeColor: Record<BoardState, string> = {
    OPERATIONAL: "hsl(73, 68%, 40%)",
    FAULT: "hsl(0, 82%, 37%)",
    HEALTH_CHECK: "hsl(192, 28%, 40%)",
};

export const BoardStateView = ({ boardName, state }: Props) => {
    return (
        <div className={styles.boardStateWrapper}>
            {boardName} state
            <Badge
                color={stateToBadgeColor[state]}
                label={state}
            />
        </div>
    );
};
