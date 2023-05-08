import { useDispatch, useSelector } from "react-redux";
import styles from "./Header.module.scss";
import { RootState } from "store";
import { useSplit } from "hooks/useSplit/useSplit";
import { Orientation } from "hooks/useSplit/Orientation";
import { Separator } from "./Separator/Separator";
import { useEffect } from "react";
import { setColumnSizes } from "slices/columnsSlice";

type Props = {
    items: string[];
};

const MINIMUM_ITEM_SIZE = 0.05;

export const Header = ({ items }: Props) => {
    const columns = useSelector((state: RootState) => state.columns);

    const [splitElements, handleMouseDown] = useSplit(
        new Array(items.length).fill(MINIMUM_ITEM_SIZE),
        Orientation.HORIZONTAL
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            setColumnSizes(
                splitElements.map((element) => `${element.length * 100}%`)
            )
        );
    }, [splitElements]);

    return (
        <div className={styles.header}>
            {items.map((item, index) => {
                if (index < items.length - 1) {
                    return (
                        <CellWithSeparator
                            key={index}
                            label={item}
                            flexBasis={columns[index]}
                            onMouseDown={(ev) => handleMouseDown(index, ev)}
                        />
                    );
                }

                return (
                    <CellWithoutSeparator
                        key={index}
                        label={item}
                        flexBasis={columns[index]}
                    />
                );
            })}
        </div>
    );
};

const CellWithSeparator = ({
    label,
    flexBasis,
    onMouseDown,
}: {
    label: string;
    flexBasis: string;
    onMouseDown: (ev: React.MouseEvent) => void;
}) => {
    return (
        <>
            <div
                className={styles.cell}
                style={{ flexBasis: flexBasis }}
            >
                {label}
            </div>
            <Separator onMouseDown={(ev) => onMouseDown(ev)}></Separator>
        </>
    );
};

const CellWithoutSeparator = ({
    label,
    flexBasis,
}: {
    label: string;
    flexBasis: string;
}) => {
    return (
        <div
            className={styles.cell}
            style={{ flexBasis: flexBasis }}
        >
            {label}
        </div>
    );
};
