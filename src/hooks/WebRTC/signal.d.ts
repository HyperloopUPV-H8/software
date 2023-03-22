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

enum SignalCode {
    Ok = 100,
    Timeout = 101,
    UnexpectedSignal = 110,
    CapacityFull = 120,
    MalformedSignal = 200,
    UnrecognizedSignal = 201,
    InvalidOfferSDP = 210,
    InvalidAnswerSDP = 220,
    InvalidCandidate = 230,
    InternalError = 300,
    FailUpdateLocalOffer = 310,
    FailUpdateLocalAnswer = 311,
    FailUpdateRemoteOffer = 320,
    FailUpdateRemoteAnswer = 321,
    FailAddCandidate = 330,
    FailCreateOffer = 340,
    FailCreateAnswer = 341,
    Other = 400,
}

type ClosePayload = {
    code: SignalCode
    reason?: string
};

type RejectPayload = {
    origin?: Signal<"offer" | "answer" | "candidate">
} & ClosePayload;
