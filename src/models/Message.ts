export type Message = {
    listId: string;
    id: number;
    description: string;
    count: number;
    type: "warning" | "fault";
};
