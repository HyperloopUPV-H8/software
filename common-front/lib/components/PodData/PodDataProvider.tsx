import { ReactNode } from "react";
import { usePodData } from "./usePodData";

type Props = {
    children: ReactNode;
};

export const PodDataProvider = ({ children }: Props) => {
    // This hook sets up the subscription to podData/update
    usePodData();
    
    return <>{children}</>;
};