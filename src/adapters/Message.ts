export type Message = {
  id: number;
  description: string;
  type: "warning" | "fault";
};

export type MessageCounter = {
  id: string;
  msg: Message;
  count: number;
};
