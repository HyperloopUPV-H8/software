import styles from "./ViolationView.module.scss";
import { Violation } from "common";

type Props = {
    violation: Violation;
    className: string;
};

export const ViolationView = ({ violation, className }: Props) => {
    const ViolationText = getViolationText(violation);

    return (
        <span className={`${className} ${styles.violationView}`}>
            {ViolationText}
        </span>
    );
};

function getViolationText(violation: Violation) {
    switch (violation.kind) {
        case "OUT_OF_BOUNDS":
            return (
                <>
                    <span>
                        {" "}
                        Want: [{violation.want[0]}, {violation.want[1]}]
                    </span>{" "}
                    <span>Got: {violation.got}</span>
                </>
            );
        case "UPPER_BOUND":
            return (
                <>
                    <span>
                        Want: x {"<"} {violation.want}
                    </span>{" "}
                    <span>Got: {violation.got}</span>
                </>
            );
        case "LOWER_BOUND":
            return (
                <>
                    <span>
                        Want: x {">"} {violation.want}
                    </span>{" "}
                    <span>Got: {violation.got}</span>
                </>
            );
        case "EQUALS":
            return (
                <>
                    <span>Mustn't be {violation.got}</span>
                </>
            );
        case "NOT_EQUALS":
            return (
                <>
                    <span>
                        Must be {violation.want} but is {violation.got}
                    </span>
                </>
            );
    }
}
