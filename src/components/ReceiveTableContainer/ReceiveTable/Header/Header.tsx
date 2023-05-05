import { useDispatch, useSelector } from "react-redux";
import styles from "./Header.module.scss";
import { RootState } from "store";
import { useSplit } from "hooks/useSplit/useSplit";
import { Orientation } from "hooks/useSplit/Orientation";
import { Separator } from "./Separator/Separator";
import { useEffect } from "react";
import { setColumnSizes } from "slices/columnsSlice";
import { Fragment } from "react";

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
                        <Fragment key={index}>
                            <div
                                className={styles.cell}
                                style={{ flexBasis: columns[index] }}
                            >
                                {item}
                            </div>
                            <Separator
                                onMouseDown={(ev) => handleMouseDown(index, ev)}
                            ></Separator>
                        </Fragment>
                    );
                } else {
                    return (
                        <div
                            key={index}
                            className={styles.cell}
                            style={{ flexBasis: columns[index] }}
                        >
                            {item}
                        </div>
                    );
                }
            })}
        </div>
    );
};
