export type Message = {
  id: number;
  description: string;
  type: string; //"warning" or "fault"
};

export type MessageCounter = {
  id: string;
  msg: Message;
  count: number;
};
