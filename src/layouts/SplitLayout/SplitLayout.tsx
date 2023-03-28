import React from "react";
import styles from "layouts/SplitLayout/SplitLayout.module.scss";
import { useSplitLayoutHandler } from "layouts/SplitLayout/useSplitLayoutHandler";
import { Component } from "layouts/SplitLayout/Component/Component";
import { Separator } from "layouts/SplitLayout/Separator/Separator";
import { Direction } from "layouts/SplitLayout/Direction";

type Props = {
    components: React.ReactNode[];
    direction?: Direction;
};

export const SplitLayout = ({
    components,
    direction = Direction.HORIZONTAL,
}: Props) => {
    const minSizes = components.map(() => 0.2);
    const [splitElements, handleSeparatorMouseDown] = useSplitLayoutHandler(
        components.length,
        minSizes,
        direction
    );
    return (
        <div
            className={styles.wrapper}
            style={{
                flexDirection:
                    direction == Direction.HORIZONTAL ? "row" : "column",
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
                                index={index}
                                direction={direction}
                                handleSeparatorMouseDown={
                                    handleSeparatorMouseDown
                                }
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
