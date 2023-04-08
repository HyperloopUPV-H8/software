import styles from "./Items.module.scss";
import { Item } from "./Item/Item";
import { useItemsTop } from "./useItemsTop";
import { animated, useSpring } from "@react-spring/web";

type Props = {
    options: Array<string>;
    onItemClick: (value: string) => void;
    visible: boolean;
    targetRect: DOMRect;
};

export const Items = ({ options, onItemClick, visible, targetRect }: Props) => {
    const springs = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        reset: true,
        config: {
            mass: 1,
            tension: 1100,
            clamp: true,
        },
    });

    const [ref, top] = useItemsTop(targetRect);

    return (
        <animated.div
            ref={ref}
            className={styles.itemsWrapper}
            style={{
                ...springs,
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
        </animated.div>
    );
};
