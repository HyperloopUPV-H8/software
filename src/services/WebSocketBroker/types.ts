export type Callback = (msg: any) => void;

export type BackendMessage<T = any> = {
    topic: string;
    msg: T;
};
