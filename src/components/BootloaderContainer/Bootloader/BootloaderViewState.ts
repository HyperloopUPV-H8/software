export type BootloaderViewState =
    | EmptyState
    | SendState
    | AwaitingState
    | SuccessState
    | FailureState;

type EmptyState = {
    kind: "empty";
};

type SendState = {
    kind: "send";
    file: File;
};

type AwaitingState = {
    kind: "awaiting";
};

type SuccessState = {
    kind: "success";
};

type FailureState = {
    kind: "failure";
};
