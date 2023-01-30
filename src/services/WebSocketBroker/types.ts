export type Callback = (msg: any) => void;

export type BackendMessage<T = any> = {
    type: string;
    msg: T;
};
