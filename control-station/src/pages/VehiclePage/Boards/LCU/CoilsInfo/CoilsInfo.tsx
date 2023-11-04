import styles from "./CoilsInfo.module.scss";
import { CoilData } from "./CoilInfo/CoilData";
import { CoilInfo } from "./CoilInfo/CoilInfo";

type Props = {
    coilsData: CoilData[];
    className?: string;
};

export const CoilsInfo = ({ coilsData, className = "" }: Props) => {
    return (
        <div className={`${styles.coilsInfoWrapper} ${className}`}>
            {coilsData.map((data, index) => {
                return (
                    <CoilInfo
                        key={index}
                        coilData={data}
                    />
                );
            })}
        </div>
    );
};
