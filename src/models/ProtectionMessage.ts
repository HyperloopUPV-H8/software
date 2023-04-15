export type ProtectionMessage = FaultMessage | WarningMessage;

export type FaultMessage = {
    id: string;
    count: number;
    kind: "fault";
    board: string;
    name: string;
    violation: Violation;
};

export type WarningMessage = {
    id: string;
    count: number;
    kind: "warning";
    board: string;
    name: string;
    violation: Violation;
};

export type Violation =
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
