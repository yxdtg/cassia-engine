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
    public horizontalEnabled: boolean = true;
    public verticalEnabled: boolean = true;

    private _isDown: boolean = false;

    private _isDragging: boolean = false;
    public get isDragging(): boolean {
        return this._isDragging;
    }

    private _lastPointerId: number = -1;
    private _lastDragPoint: Vec2 = Vec2.zero;

    protected onPointerDown(event: IPointerEvent): void {
        if (!this.node.currentLayer) return;

        this._isDown = true;

        this._lastPointerId = event.pointerId;
        this._lastDragPoint.set(this.node.currentLayer.screenToLayer(event.screenPoint));
    }

    protected onGlobalPointerMove(event: IGlobalPointerEvent): void {
        if (!this.node.currentLayer) return;
        if (event.pointerId !== this._lastPointerId || !this._isDown) return;

        this._isDragging = true;

        const offset = this.node.currentLayer.screenToLayer(event.screenPoint).subtract(this._lastDragPoint);

        if (this.horizontalEnabled) {
            this.node.setLayerPosition(this.node.getLayerPosition().x + offset.x, this.node.getLayerPosition().y);
        }
        if (this.verticalEnabled) {
            this.node.setLayerPosition(this.node.getLayerPosition().x, this.node.getLayerPosition().y + offset.y);
        }

        this._lastPointerId = event.pointerId;
        this._lastDragPoint.set(this.node.currentLayer.screenToLayer(event.screenPoint));
    }

    protected onGlobalPointerUp(event: IGlobalPointerEvent): void {
        if (event.pointerId !== this._lastPointerId || !this._isDown) return;

        this._isDown = false;
        this._isDragging = false;
    }
}
