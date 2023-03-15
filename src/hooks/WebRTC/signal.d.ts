type Signal<Kind extends SignalKinds> = {
    signal: Kind,
    payload: SignalPayloadMap[Kind]
}

type SignalHandles = {
    [kind in SignalKinds]: (signal: Signal<kind>) => void
}

type SignalKinds = "offer" | "answer" | "candidate" | "reject" | "close" | "keepalive"
type SignalPayloadMap = {
    "offer": RTCSessionDescriptionInit,
    "answer": RTCSessionDescriptionInit,
    "candidate": RTCIceCandidateInit,
    "reject": RejectPayload,
    "close": ClosePayload,
    "keepalive": number,
}

type SignalCode =
    100
    | 101
    | 110
    | 120
    | 200
    | 201
    | 210
    | 211
    | 220
    | 221
    | 230
    | 300
    | 310
    | 311
    | 320
    | 321
    | 330
    | 340
    | 341
    | 400;

type ClosePayload = {
    code: SignalCode
    reason?: string
};

type RejectPayload = {
    origin?: Signal<"offer" | "answer" | "candidate">
} & ClosePayload;
