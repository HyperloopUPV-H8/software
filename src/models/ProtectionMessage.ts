export type ProtectionMessage = {
    id: string;
    count: number;
    kind: "fault" | "warning";
    board: string;
    name: string;
    violation: Violation;
    timestamp: Timestamp;
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

export type Timestamp = {
    counter: number;
    seconds: number;
    minutes: number;
    hours: number;
    day: number;
    month: number;
    year: number;
};
