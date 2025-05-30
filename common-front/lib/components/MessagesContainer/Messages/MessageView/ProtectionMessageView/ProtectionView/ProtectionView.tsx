import { ProtectionMessage } from "../../../../../..";
import styles from "./ProtectionView.module.scss";

type Props = {
    protection: ProtectionMessage;
};

const DECIMALS = 2;

export const ProtectionView = ({ protection }: Props) => {
    const ProtectionText = getProtectionText(protection);

    return <div className={styles.protectionView}>{ProtectionText}</div>;
};

function getProtectionText(protection: ProtectionMessage) {
    switch (protection.payload.kind) {
        case "OUT_OF_BOUNDS":
            return (
                <>
                    <span>
                        {" "}
                        Want: [{protection.payload.data.bounds[0].toFixed(
                            DECIMALS
                        )}, {protection.payload.data.bounds[1].toFixed(DECIMALS)}]
                    </span>{" "}
                    <span>Got: {protection.payload.data.value.toFixed(DECIMALS)}</span>
                </>
            );
        case "UPPER_BOUND":
            return (
                <>
                    <span>
                        Want: [{protection.name}] {"<"} {protection.payload.data.bound.toFixed(DECIMALS)}
                    </span>{" "}
                    <span>Got: {protection.payload.data.value.toFixed(DECIMALS)}</span>
                </>
            );
        case "LOWER_BOUND":
            return (
                <>
                    <span>
                        Want: [{protection.name}] {">"} {protection.payload.data.bound.toFixed(DECIMALS)}
                    </span>{" "}
                    <span>Got: {protection.payload.data.value.toFixed(DECIMALS)}</span>
                </>
            );
        case "EQUALS":
            return (
                <>
                    <span>
                        Mustn't be {protection.payload.data.value.toFixed(DECIMALS)}
                    </span>
                </>
            );
        case "NOT_EQUALS":
            return (
                <>
                    <span>
                        Must be {protection.payload.data.want.toFixed(DECIMALS)} but is{" "}
                        {protection.payload.data.value.toFixed(DECIMALS)}
                    </span>
                </>
            );
        case "TIME_ACCUMULATION":
            return (
                <span>
                    Value was {protection.payload.data.value.toFixed(DECIMALS)} for{" "}
                    {protection.payload.data.timelimit.toFixed(DECIMALS)} seconds
                </span>
            );
        case "ERROR_HANDLER":
            return <span>{protection.payload.data}</span>;
    }
}
