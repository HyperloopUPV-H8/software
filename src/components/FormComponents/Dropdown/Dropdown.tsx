import styles from "./Dropdown.module.scss";
import { Items } from "./Items/Items";
import { useState } from "react";
import { Header } from "./Header/Header";
import { useBoundingRect } from "hooks/useBounds";

type Props = {
    options: Array<string>;
    onChange: (value: string) => void;
};

export const Dropdown = ({ options, onChange }: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(options[0] ?? "");
    const [ref, rect] = useBoundingRect<HTMLDivElement>();
    return (
        <div
            className={styles.dropdownWrapper}
            ref={ref}
        >
            <Header
                value={selectedItem}
                onClick={() => setOpen((prev) => !prev)}
                isOpen={open}
            />
            {rect && (
                <Items
                    targetRect={rect}
                    visible={open}
                    options={options}
                    onItemClick={(value) => {
                        setSelectedItem(value);
                        onChange(value);
                        setOpen(false);
                    }}
                />
            )}
        </div>
    );
};
