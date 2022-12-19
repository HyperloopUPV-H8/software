export class SplitLayoutEventHandler {
    public onSeparatorMouseDown: (
        separatorIndex: number,
        ev: React.MouseEvent
    ) => void = () => {};

    public onSeparatorMove: (clientX: number, clientY: number) => void =
        () => {};

    public handleSeperatorMouseDown = (
        separatorIndex: number,
        ev: React.MouseEvent
    ) => {
        ev.preventDefault();
        this.onSeparatorMouseDown(separatorIndex, ev);
        document.addEventListener("mousemove", this.handleDocumentMove);
        document.addEventListener("mouseup", this.handleDocumentMouseUp);
    };

    private handleDocumentMove = (ev: MouseEvent) => {
        ev.preventDefault();
        this.onSeparatorMove(ev.clientX, ev.clientY);
    };

    private handleDocumentMouseUp = (ev: MouseEvent) => {
        ev.preventDefault();
        document.removeEventListener("mousemove", this.handleDocumentMove);
        document.removeEventListener("mouseup", this.handleDocumentMouseUp);
    };
}
