import RAPIER from "@dimforge/rapier2d-compat";
import { physicsSystem } from "cassia-engine";
import { defineComponent } from "cassia-engine/component";
import { Size } from "cassia-engine/math";
import { ColliderComponent } from "./ColliderComponent";

@defineComponent({ componentName: "CapsuleCollider" })
export class CapsuleCollider extends ColliderComponent {
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

    /**
     * @internal
     */
    public applySize(): void {
        if (!this.collider) return;

        const nodeWorldScale = this.node.getLayerScale();

        const halfHeight = (this._height / 2) * nodeWorldScale.y;

        this.collider.setRadius(this._radius);
        this.collider.setHalfHeight(halfHeight);
    }

    /**
     * @internal
     */
    public _onUpdateSize(): void {
        this.applySize();
    }

    protected onCreateCollider(): RAPIER.Collider | null {
        const colliderDesc = RAPIER.ColliderDesc.capsule(0, 0);
        return physicsSystem.createCollider(this, colliderDesc);
    }
}
