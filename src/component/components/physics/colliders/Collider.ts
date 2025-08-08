import RAPIER from "@dimforge/rapier2d-compat";
import { physicsSystem } from "cassia-engine";
import { Component, defineComponent } from "cassia-engine/component";
import { Vec2 } from "cassia-engine/math";
import { RigidBody } from "../RigidBody";

@defineComponent({ componentName: "Collider", isCollider: true })
export class Collider extends Component {
    public getRigidBodyComponent(): RigidBody | null {
        const rigidBody = this.node.getComponent(RigidBody);
        if (rigidBody && rigidBody.body && !rigidBody.destroyed) return rigidBody;
        return null;
    }

    protected _collider: RAPIER.Collider | null = null;
    public get collider(): RAPIER.Collider | null {
        return this._collider;
    }

    public offset: Vec2 = Vec2.zero;

    public get offsetX(): number {
        return this.offset.x;
    }
    public set offsetX(value: number) {
        this.offset.x = value;
    }

    public get offsetY(): number {
        return this.offset.y;
    }
    public set offsetY(value: number) {
        this.offset.y = value;
    }

    private _density: number = 1;
    public get density(): number {
        return this._density;
    }
    public set density(value: number) {
        this._density = value;
        this.applyDensity();
    }

    public applyDensity(): void {
        if (!this._collider) return;
        this._collider.setDensity(this._density);
    }

    private _friction: number = 0.2;
    public get friction(): number {
        return this._friction;
    }
    public set friction(value: number) {
        this._friction = value;
        this.applyFriction();
    }

    public applyFriction(): void {
        if (!this._collider) return;
        this._collider.setFriction(this._friction);
    }

    private _restitution: number = 0;
    public get restitution(): number {
        return this._restitution;
    }
    public set restitution(value: number) {
        this._restitution = value;
        this.applyRestitution();
    }

    public applyRestitution(): void {
        if (!this._collider) return;
        this._collider.setRestitution(this._restitution);
    }

    private _isSensor: boolean = false;
    public get isSensor(): boolean {
        return this._isSensor;
    }
    public set isSensor(value: boolean) {
        this._isSensor = value;
        this.applyIsSensor();
    }

    public applyIsSensor(): void {
        if (!this._collider) return;
        this._collider.setSensor(this._isSensor);
    }

    /**
     * @internal
     */
    public _onUpdateSize(): void {
        throw new Error("not implemented");
    }

    public onInit(): void {
        this._createCollider();
    }
    public onDestroy(): void {
        this._destroyCollider();
    }

    protected _onCreateCollider(): RAPIER.Collider | null {
        throw new Error("not implemented");
    }

    private _createCollider(): void {
        const collider = this._onCreateCollider();
        if (!collider) return console.warn("Failed to create collider");

        this._collider = collider;
        this._collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

        this.applyDensity();
        this.applyFriction();
        this.applyRestitution();
        this.applyIsSensor();
    }
    private _destroyCollider(): void {
        if (!this._collider) return;

        physicsSystem.destroyCollider(this, this._collider);
        this._collider = null;
    }

    public reCreateCollider(): void {
        this._destroyCollider();
        this._createCollider();
    }
}
