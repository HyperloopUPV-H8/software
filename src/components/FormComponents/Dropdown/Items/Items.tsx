import styles from "./Items.module.scss";
import { Item } from "./Item/Item";
import { useItemsTop } from "./useItemsTop";

type Props = {
    options: Array<string>;
    onItemClick: (value: string) => void;
    visible: boolean;
    targetRect: DOMRect;
};

export const Items = ({ options, onItemClick, visible, targetRect }: Props) => {
    const [ref, top] = useItemsTop(targetRect);

    return (
        <div
            ref={ref}
            className={styles.itemsWrapper}
            style={{
                visibility: visible ? "visible" : "hidden",
                top: `${top}px`,
            }}
        >
            {options.map((option, index) => {
                return (
                    <Item
                        key={index}
                        value={option}
                        onClick={onItemClick}
                    />
                );
            })}
        </div>
    );
};
