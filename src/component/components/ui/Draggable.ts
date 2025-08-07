import { Component, defineComponent } from "cassia-engine/component";
import type { IGlobalPointerEvent, IPointerEvent } from "cassia-engine/input";
import { Vec2 } from "cassia-engine/math";

@defineComponent({
    componentName: "Draggable",
    useOnPointerDown: true,
    useOnGlobalPointerMove: true,
    useOnGlobalPointerUp: true,
})
export class Draggable extends Component {
    public horizontal: boolean = true;
    public vertical: boolean = true;

    private _isDown: boolean = false;

    private _isDragging: boolean = false;
    public get isDragging(): boolean {
        return this._isDragging;
    }

    private _lastPointerId: number = -1;
    private _lastDragPoint: Vec2 = Vec2.zero;

    public onPointerDown(event: IPointerEvent): void {
        this._isDown = true;

        this._lastPointerId = event.pointerId;
        this._lastDragPoint.set(event.worldPoint);
    }

    public onGlobalPointerMove(event: IGlobalPointerEvent): void {
        if (event.pointerId !== this._lastPointerId || !this._isDown) return;
        this._isDragging = true;

        const offset = event.worldPoint.subtract(this._lastDragPoint);

        if (this.horizontal) {
            this.node.setWorldPosition(this.node.getWorldPosition().x + offset.x, this.node.getWorldPosition().y);
        }
        if (this.vertical) {
            this.node.setWorldPosition(this.node.getWorldPosition().x, this.node.getWorldPosition().y + offset.y);
        }

        this._lastPointerId = event.pointerId;
        this._lastDragPoint.set(event.worldPoint);
    }

    public onGlobalPointerUp(event: IGlobalPointerEvent): void {
        if (event.pointerId !== this._lastPointerId || !this._isDown) return;

        this._isDown = false;
        this._isDragging = false;
    }
}
