export type Message = FaultMessage | WarningMessage | ErrorMessage;

type AbstractMessage = {
    id: string;
    count: number;
    board: string;
    name: string;
    timestamp: Timestamp;
};

type ErrorMessage = AbstractMessage & {
    kind: "error";
    protection: {
        kind: "error";
        data: string;
    };
};

type FaultMessage = AbstractMessage & {
    kind: "fault";
    protection: Protection;
};

type WarningMessage = AbstractMessage & {
    kind: "warning";
    protection: Protection;
};

export type Protection =
    | OutOfBounds
    | UpperBound
    | LowerBound
    | Equals
    | NotEquals
    | Timelimit;

type OutOfBounds = {
    kind: "OUT_OF_BOUNDS";
    data: {
        bounds: [number, number];
        value: number;
    };
};

type UpperBound = {
    kind: "UPPER_BOUND";
    data: {
        bound: number;
        value: number;
    };
};

type LowerBound = {
    kind: "LOWER_BOUND";
    data: {
        bound: number;
        value: number;
    };
};

type Equals = {
    kind: "EQUALS";
    data: {
        value: number;
    };
};

type NotEquals = {
    kind: "NOT_EQUALS";
    data: {
        want: number;
        value: number;
    };
};

type Timelimit = {
    kind: "TIME_ACCUMULATION";
    data: {
        value: number;
        timelimit: number;
    };
};

export type Timestamp = {
    counter: number;
    second: number;
    minute: number;
    hour: number;
    day: number;
    month: number;
    year: number;
};
