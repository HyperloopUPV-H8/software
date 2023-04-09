import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PaginationItem.module.scss";

type Props = {
    pageNumber: number;
    isActive: boolean;
    onClick: () => void;
};

export const PaginationItem = ({ isActive, pageNumber, onClick }: Props) => {
    return (
        <div
            className={`${styles.paginationItemWrapper} ${
                isActive ? styles.active : ""
            }`}
            onClick={onClick}
        >
            {pageNumber}
        </div>
    );
};
