import RAPIER from "@dimforge/rapier2d-compat";
import { defineComponent } from "cassia-engine/component";
import { Collider } from "./Collider";
import { physicsSystem } from "cassia-engine";

@defineComponent({ componentName: "CircleCollider" })
export class CircleCollider extends Collider {
    private _radius: number = 32;
    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
        this.applyRadius();
    }

    public applyRadius(): void {
        if (!this._collider) return;

        const nodeWorldScale = this.node.getWorldScale();

        const radius = this._radius * nodeWorldScale.x;
        this._collider.setRadius(radius);
    }

    public _onUpdateSize(): void {
        this.applyRadius();
    }

    protected _onCreateCollider(): RAPIER.Collider | null {
        const colliderDesc = RAPIER.ColliderDesc.ball(this._radius);
        return physicsSystem.createCollider(this, colliderDesc);
    }
}
