import React from "react";
import styles from "layouts/SplitLayout/SplitLayout.module.scss";
import { useSplit } from "hooks/useSplit/useSplit";
import { Component } from "layouts/SplitLayout/Component/Component";
import { Separator } from "layouts/SplitLayout/Separator/Separator";
import { Orientation } from "hooks/useSplit/Orientation";

type Props = {
    components: React.ReactNode[];
    orientation?: Orientation;
};

//TODO: not rerender elements that dont resize
export const SplitLayout = ({
    components,
    orientation = Orientation.HORIZONTAL,
}: Props) => {
    const minSizes = components.map(() => 0.2);
    const [splitElements, onSeparatorMouseDown] = useSplit(
        minSizes,
        orientation
    );

    return (
        <div
            className={styles.wrapper}
            style={{
                flexDirection:
                    orientation == Orientation.HORIZONTAL ? "row" : "column",
            }}
        >
            {components.map((component, index) => {
                return (
                    <React.Fragment key={index}>
                        <Component
                            component={component}
                            normalizedLength={splitElements[index].length}
                        />
                        {index < components.length - 1 && (
                            <Separator
                                orientation={orientation}
                                onMouseDown={(ev) =>
                                    onSeparatorMouseDown(index, ev)
                                }
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
