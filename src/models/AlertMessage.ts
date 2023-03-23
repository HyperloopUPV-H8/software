export type AlertMessage = FaultMessage | WarningMessage;

export type FaultMessage = {
    kind: "fault";
    msg: {
        valueName: string;
        violation: FaultViolation;
    };
};

export type FaultViolation =
    | OutOfBoundsViolation
    | UpperBoundViolation
    | LowerBoundViolation
    | EqualsViolation
    | NotEqualsViolation;

type OutOfBoundsViolation = {
    kind: "OUT_OF_BOUNDS";
    want: [number, number];
    got: number;
};

type UpperBoundViolation = {
    kind: "UPPER_BOUND";
    want: number;
    got: number;
};

type LowerBoundViolation = {
    kind: "LOWER_BOUND";
    want: number;
    got: number;
};

type EqualsViolation = {
    kind: "EQUALS";
    want: number;
    got: number;
};

type NotEqualsViolation = {
    kind: "NOT_EQUALS";
    want: number;
    got: number;
};

export type WarningMessage = {
    kind: "warning";
};
