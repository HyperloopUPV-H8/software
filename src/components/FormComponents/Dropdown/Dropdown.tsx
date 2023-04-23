import styles from "./Dropdown.module.scss";
import { Items } from "./Items/Items";
import { useState } from "react";
import { Header } from "./Header/Header";
// import { useBounds } from "hooks/useBounds";

type Props = {
    options: Array<string>;
    onChange: (value: string) => void;
};

export const Dropdown = ({ options, onChange }: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(
        options[0] ?? "No options"
    );
    // const [ref, rect] = useBounds<HTMLDivElement>();

    const isEnabled = options.length > 0;

    return (
        <div
            className={styles.dropdownWrapper}
            // ref={ref}
        >
            <Header
                value={selectedItem}
                onClick={() => setOpen((prev) => !prev)}
                isOpen={open}
                isEnabled={isEnabled}
            />
            {/* {rect && isEnabled && (
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
            )} */}
        </div>
    );
};
