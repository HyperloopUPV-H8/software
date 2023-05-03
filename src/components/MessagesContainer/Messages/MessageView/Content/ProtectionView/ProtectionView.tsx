import styles from "./ProtectionView.module.scss";
import { Protection } from "common";

type Props = {
    protection: Protection;
    className: string;
};

export const ProtectionView = ({ protection, className }: Props) => {
    const ProtectionText = getProtectionText(protection);

    return (
        <div className={`${className} ${styles.protectionView}`}>
            {ProtectionText}
        </div>
    );
};

function getProtectionText(protection: Protection) {
    switch (protection.kind) {
        case "OUT_OF_BOUNDS":
            return (
                <>
                    <span>
                        {" "}
                        Want: [{protection.data.bounds[0]},{" "}
                        {protection.data.bounds[1]}]
                    </span>{" "}
                    <span>Got: {protection.data.value}</span>
                </>
            );
        case "UPPER_BOUND":
            return (
                <>
                    <span>
                        Want: x {"<"} {protection.data.bound}
                    </span>{" "}
                    <span>Got: {protection.data.value}</span>
                </>
            );
        case "LOWER_BOUND":
            return (
                <>
                    <span>
                        Want: x {">"} {protection.data.bound}
                    </span>{" "}
                    <span>Got: {protection.data.value}</span>
                </>
            );
        case "EQUALS":
            return (
                <>
                    <span>Mustn't be {protection.data.value}</span>
                </>
            );
        case "NOT_EQUALS":
            return (
                <>
                    <span>
                        Must be {protection.data.want} but is{" "}
                        {protection.data.value}
                    </span>
                </>
            );
    }
}
