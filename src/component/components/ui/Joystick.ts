import { Component, defineComponent } from "cassia-engine/component";
import type { IGlobalPointerEvent, IPointerEvent } from "cassia-engine/input";
import { Vec2 } from "cassia-engine/math";
import { Node, NODE_EVENT_TYPE } from "cassia-engine/node";

@defineComponent({ componentName: "Joystick", useOnGlobalPointerMove: true, useOnGlobalPointerUp: true })
export class Joystick extends Component {
    private _rockerNode: Node | null = null;
    public get rockerNode(): Node | null {
        return this._rockerNode;
    }
    public setRockerNode(node: Node): void {
        this._rockerNode = node;
        this._rockerNode.on(NODE_EVENT_TYPE.PointerDown, this._onRockerPointerDown, this);
    }

    public onDestroy(): void {
        if (this._rockerNode) {
            this._rockerNode.off(NODE_EVENT_TYPE.PointerDown, this._onRockerPointerDown, this);
        }
    }

    public horizontal: boolean = true;
    public vertical: boolean = true;

    private _isDown: boolean = false;

    private _isDragging: boolean = false;
    public get isDragging(): boolean {
        return this._isDragging;
    }

    private _vector: Vec2 = Vec2.zero;
    public get vector(): Vec2 {
        return this._vector;
    }

    private _angle: number = 0;
    public get angle(): number {
        return this._angle;
    }

    private _lastPointerId: number = -1;

    private _onRockerPointerDown(event: IPointerEvent): void {
        if (!this._rockerNode) return;

        this._isDown = true;

        this._lastPointerId = event.pointerId;
    }

    public onGlobalPointerMove(event: IGlobalPointerEvent): void {
        if (!this._rockerNode) return;

        if (event.pointerId !== this._lastPointerId || !this._isDown) return;
        this._isDragging = true;

        const offset = event.worldPoint.subtract(this.node.position);
        const normalizedOffset = offset.normalized();
        const distance = Math.min(Vec2.distance(event.worldPoint, this.node.position), this.node.width / 2);

        this._vector.set(normalizedOffset);
        this._angle = this._vector.toDegrees();

        if (this.horizontal) {
            this._rockerNode.x = normalizedOffset.x * distance;
        }
        if (this.vertical) {
            this._rockerNode.y = normalizedOffset.y * distance;
        }

        this._lastPointerId = event.pointerId;
    }
    public onGlobalPointerUp(event: IGlobalPointerEvent): void {
        if (!this._rockerNode) return;

        if (event.pointerId !== this._lastPointerId || !this._isDown) return;

        this._rockerNode.setPosition(0, 0);

        this._isDown = false;
        this._isDragging = false;
    }
}
