import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Pagination.module.scss";
import { PaginationItem } from "./PaginationItem/PaginationItem";

type Props = {
    routes: Array<string>;
};

export const Pagination = ({ routes }: Props) => {
    const [activeRoute, setActiveRoute] = useState(routes[0]);

    const navigate = useNavigate();

    useEffect(() => {
        navigate(activeRoute);
    }, [activeRoute]);

    return (
        <div className={styles.paginationWrapper}>
            {routes.map((route, index) => {
                return (
                    <PaginationItem
                        key={index}
                        pageNumber={index + 1}
                        isActive={route == activeRoute}
                        onClick={() => setActiveRoute(route)}
                    />
                );
            })}
        </div>
    );
};
