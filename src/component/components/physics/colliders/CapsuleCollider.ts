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

        const radius = this._radius * nodeWorldScale.x;
        const halfHeight = (this._height / 2) * nodeWorldScale.y;

        if (this.collider.radius() !== radius) {
            this.collider.setRadius(radius);
        }
        if (this.collider.halfHeight() !== halfHeight) {
            this.collider.setHalfHeight(halfHeight);
        }
    }

    /**
     * @internal
     */
    public updateSize(): void {
        this.applySize();
    }

    protected onCreateCollider(): RAPIER.Collider | null {
        const colliderDesc = RAPIER.ColliderDesc.capsule(0, 0);
        return physicsSystem.createCollider(this, colliderDesc);
    }
}
