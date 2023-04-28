import { useDispatch, useSelector } from "react-redux";
import styles from "./Header.module.scss";
import { RootState } from "store";
import { useSplit } from "hooks/useSplit/useSplit";
import { Orientation } from "hooks/useSplit/Orientation";
import { Separator } from "./Separator/Separator";
import { useEffect } from "react";
import { setColumnSizes } from "slices/columnsSlice";

export const Header = () => {
    const columns = useSelector((state: RootState) => state.columns);

    const [splitElements, handleMouseDown] = useSplit(
        [0.05, 0.05, 0.05, 0.05],
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
            <div
                className={styles.cell}
                style={{ flexBasis: columns[0] }}
            >
                ID
            </div>
            <Separator onMouseDown={(ev) => handleMouseDown(0, ev)}></Separator>
            <div
                className={styles.cell}
                style={{ flexBasis: columns[1] }}
            >
                NAME
            </div>
            <Separator onMouseDown={(ev) => handleMouseDown(1, ev)}></Separator>
            <div
                className={styles.cell}
                style={{ flexBasis: columns[2] }}
            >
                COUNT
            </div>
            <Separator onMouseDown={(ev) => handleMouseDown(2, ev)}></Separator>
            <div
                className={styles.cell}
                style={{ flexBasis: columns[3] }}
            >
                CYCLE (units)
            </div>
        </div>
    );
};
