import { useEffect, useReducer } from "react";
import styles from "./ExpandablePairs.module.scss";
import { Pair, PairType } from "./Pair/Pair";
import { Button } from "..";
import { nanoid } from "@reduxjs/toolkit";

type Props = {
    leftColumnName: string;
    rightColumnName: string;
    value: PairType[];
    onChange: (v: PairType[]) => void;
};

type State = { id: string; pair: PairType }[];

type Action = AddPair | UpdatePair | RemovePair;

type AddPair = {
    type: "add_pair";
};

type UpdatePair = {
    type: "update_pair";
    payload: { id: string; newValue: { index: number; value: number | null } };
};

type RemovePair = {
    type: "remove_pair";
    payload: string;
};

function reducer(state: State, action: Action) {
    switch (action.type) {
        case "add_pair":
            return [...state, { id: nanoid(), pair: [null, null] as const }];
        case "update_pair":
            return state.map((item) => {
                if (item.id == action.payload.id) {
                    if (action.payload.newValue.index == 0) {
                        return {
                            id: item.id,
                            pair: [
                                action.payload.newValue.value,
                                item.pair[1],
                            ] as const,
                        };
                    } else {
                        return {
                            id: item.id,
                            pair: [
                                item.pair[0],
                                action.payload.newValue.value,
                            ] as const,
                        };
                    }
                }

                return item;
            });
        case "remove_pair":
            return state.filter((item) => item.id != action.payload);
    }
}

export const ExpandablePairs = ({
    leftColumnName,
    rightColumnName,
    value,
    onChange,
}: Props) => {
    const [items, dispatch] = useReducer(reducer, value, (value) =>
        value.map((pair) => ({ id: nanoid(), pair: pair }))
    );

    useEffect(() => {
        onChange(items.map((item) => item.pair));
    }, [items]);

    return (
        <div className={styles.expandablePairs}>
            <div className={styles.name}>{leftColumnName}</div>
            <div className={styles.name}>{rightColumnName}</div>
            {items.map((item) => (
                <Pair
                    key={item.id}
                    showRemove={items.length > 1}
                    initialPair={item.pair}
                    onChange={(v) =>
                        dispatch({
                            type: "update_pair",
                            payload: { id: item.id, newValue: v },
                        })
                    }
                    onRemove={() =>
                        dispatch({ type: "remove_pair", payload: item.id })
                    }
                />
            ))}
            <Button
                className={styles.addBtn}
                label="Add row"
                onClick={() => dispatch({ type: "add_pair" })}
            />
        </div>
    );
};
