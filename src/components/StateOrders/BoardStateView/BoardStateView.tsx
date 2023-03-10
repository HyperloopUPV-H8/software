import styles from "./BoardStateView.module.scss";
import { Badge } from "./Badge/Badge";

type Props = {
    boardName: string;
    state: string;
};

const stateToBadgeColor: Record<string, string> = {
    OPERATIONAL: "hsl(73, 68%, 40%)",
    FAULT: "hsl(0, 82%, 37%)",
    HEALTH_CHECK: "hsl(192, 28%, 40%)",
};

export const BoardStateView = ({ boardName, state }: Props) => {
    const badgeColor = stateToBadgeColor[state] ?? "hsl(0, 0%, 50%)";
    return (
        <div className={styles.boardStateWrapper}>
            {boardName} state
            <Badge
                color={badgeColor}
                label={state}
            />
        </div>
    );
};
