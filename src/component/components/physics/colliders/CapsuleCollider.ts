import RAPIER from "@dimforge/rapier2d-compat";
import { physicsSystem } from "cassia-engine";
import { defineComponent } from "cassia-engine/component";
import { Size } from "cassia-engine/math";
import { Collider } from "./Collider";

@defineComponent({ componentName: "CapsuleCollider" })
export class CapsuleCollider extends Collider {
    private _radius: number = 32;
    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
        this.applySize();
    }

    private _height: number = Size.defaultHeight;
    public get height(): number {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
        this.applySize();
    }

    public applySize(): void {
        if (!this._collider) return;

        const nodeWorldScale = this.node.getWorldScale();

        const halfHeight = (this._height / 2) * nodeWorldScale.y;

        this._collider.setRadius(this._radius);
        this._collider.setHalfHeight(halfHeight);
    }

    public _onUpdateSize(): void {
        this.applySize();
    }

    protected _onCreateCollider(): RAPIER.Collider | null {
        const colliderDesc = RAPIER.ColliderDesc.capsule(0, 0);
        return physicsSystem.createCollider(this, colliderDesc);
    }
}
