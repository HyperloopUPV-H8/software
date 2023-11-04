import styles from "./MultipleTags.module.scss";
import { Separator } from "./Separator/Separator";
import React from "react";
type Props = {
    tags: React.ReactNode[];
    className?: string;
};

export const MultipleTags = ({ tags, className = "" }: Props) => {
    return (
        <article className={`${styles.multipleTagsWrapper} ${className}`}>
            {tags.map((tag, index, arr) => {
                return (
                    <React.Fragment key={index}>
                        {tag}
                        {/* FIXME: el separator no es 100% height a menos que el height del padre sea definite */}
                        {index < arr.length - 1 && <Separator />}
                    </React.Fragment>
                );
            })}
        </article>
    );
};
