import RAPIER from "@dimforge/rapier2d-compat";
import { physicsSystem } from "cassia-engine";
import { defineComponent } from "cassia-engine/component";
import { Size } from "cassia-engine/math";
import { Collider } from "./Collider";

@defineComponent({ componentName: "BoxCollider" })
export class BoxCollider extends Collider {
    private _size: Size = Size.default;
    public get size(): Size {
        return this._size;
    }
    public set size(value: Size) {
        this._size = value;
        this.applySize();
    }

    public get width(): number {
        return this._size.width;
    }
    public set width(value: number) {
        this._size.width = value;
        this.applySize();
    }

    public get height(): number {
        return this._size.height;
    }
    public set height(value: number) {
        this._size.height = value;
        this.applySize();
    }

    /**
     * @internal
     */
    public applySize(): void {
        if (!this._collider) return;

        const nodeWorldScale = this.node.getWorldScale();

        const halfWidth = (this._size.width / 2) * nodeWorldScale.x;
        const halfHeight = (this._size.height / 2) * nodeWorldScale.y;

        this._collider.setHalfExtents({ x: halfWidth, y: halfHeight });
    }

    /**
     * @internal
     */
    public _onUpdateSize(): void {
        this.applySize();
    }

    protected _onCreateCollider(): RAPIER.Collider | null {
        const colliderDesc = RAPIER.ColliderDesc.cuboid(0, 0);
        return physicsSystem.createCollider(this, colliderDesc);
    }
}
