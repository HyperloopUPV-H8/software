import styles from "./Pair.module.scss";
import { Button, NumericInput } from "../..";

export type PairType = readonly [number | null, number | null];

type Props = {
    initialPair: PairType;
    showRemove: boolean;
    onChange: (v: { index: number; value: number | null }) => void;
    onRemove: () => void;
};

export const Pair = ({
    initialPair,
    onChange,
    showRemove,
    onRemove,
}: Props) => {
    return (
        <div className={styles.pair}>
            <NumericInput
                key={0}
                value={initialPair[0]}
                onChange={(v) => onChange({ index: 0, value: v })}
                className={styles.input}
            />
            <NumericInput
                key={1}
                value={initialPair[1]}
                onChange={(v) => onChange({ index: 1, value: v })}
                className={styles.input}
            />
            {showRemove && (
                <Button
                    label="Remove"
                    onClick={onRemove}
                />
            )}
        </div>
    );
};
