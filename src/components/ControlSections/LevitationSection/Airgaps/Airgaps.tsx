import styles from "./Airgaps.module.scss";
import { AirgapRow } from "./AirgapRow/AirgapRow";
import { LevitationData } from "../../PCUSection/PCUData";

type Props = Pick<
    LevitationData,
    | "airgap_1"
    | "airgap_2"
    | "airgap_3"
    | "airgap_4"
    | "slave_airgap_5"
    | "slave_airgap_6"
    | "slave_airgap_7"
    | "slave_airgap_8"
> & {
    className: string;
};

export const Airgaps = ({
    airgap_1,
    airgap_2,
    airgap_3,
    airgap_4,
    slave_airgap_5,
    slave_airgap_6,
    slave_airgap_7,
    slave_airgap_8,
    className,
}: Props) => {
    return (
        <div className={`${styles.airgapsWrapper} ${className}`}>
            <AirgapRow
                ems1={airgap_1}
                hems1={airgap_2}
                hems2={airgap_3}
                ems2={airgap_4}
            />
            <AirgapRow
                ems1={slave_airgap_5}
                hems1={slave_airgap_6}
                hems2={slave_airgap_7}
                ems2={slave_airgap_8}
            />
        </div>
    );
};
