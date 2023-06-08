export function parseId(idStr: string): { boardId: string; measId: string } {
    const index = idStr.indexOf("/");
    const boardId = idStr.substring(0, index);
    const measId = idStr.substring(index + 1);
    return { boardId, measId };
}
