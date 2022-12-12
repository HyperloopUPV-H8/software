export type Message = {
  listId: string;
  id: number;
  description: string;
  type: "warning" | "fault";
};
