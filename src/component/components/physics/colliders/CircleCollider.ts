import RAPIER from "@dimforge/rapier2d-compat";
import { defineComponent } from "cassia-engine/component";
import { ColliderComponent } from "./ColliderComponent";
import { physicsSystem } from "cassia-engine";

@defineComponent({ componentName: "CircleCollider" })
export class CircleCollider extends ColliderComponent {
    private _radius: number = 32;
    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
        this.applyRadius();
    }

    /**
     * @internal
     */
    public applyRadius(): void {
        if (!this.collider) return;

        const nodeWorldScale = this.node.getLayerScale();

        const radius = this._radius * nodeWorldScale.x;

        if (this.collider.radius() !== radius) {
            this.collider.setRadius(radius);
        }
    }

    /**
     * @internal
     */
    public override updateSize(): void {
        this.applyRadius();
    }

    protected override onCreateCollider(): RAPIER.Collider | null {
        const colliderDesc = RAPIER.ColliderDesc.ball(this._radius);
        return physicsSystem.createCollider(this, colliderDesc);
    }
}
