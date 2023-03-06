import { FaultViolation } from "models/AlertMessage";
type Props = {
    className?: string;
    violation: FaultViolation;
};
export const WantView = ({ violation, className = "" }: Props) => {
    return (
        <span className={`${className}`}>
            {violation.kind == "OUT_OF_BOUNDS" &&
                `[${violation.want[0]}, ${violation.want[1]}]`}{" "}
            {violation.kind != "OUT_OF_BOUNDS" && violation.want}
        </span>
    );
};
