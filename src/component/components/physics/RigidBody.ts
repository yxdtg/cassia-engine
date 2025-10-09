import RAPIER from "@dimforge/rapier2d-compat";
import { Component, defineComponent } from "cassia-engine/component";
import type { ColliderComponent } from "./colliders";
import { vec2, Vec2 } from "cassia-engine/math";
import { physicsSystem } from "cassia-engine";

export const RIGID_BODY_TYPE = {
    Dynamic: "dynamic",
    Fixed: "fixed",
    KinematicPositionBased: "kinematic-position-based",
    KinematicVelocityBased: "kinematic-velocity-based",
} as const;
export type RIGID_BODY_TYPE = (typeof RIGID_BODY_TYPE)[keyof typeof RIGID_BODY_TYPE];

@defineComponent({ componentName: "RigidBody" })
export class RigidBody extends Component {
    private _body: RAPIER.RigidBody | null = null;
    public get body(): RAPIER.RigidBody | null {
        return this._body;
    }

    public get colliderComponents(): ColliderComponent[] {
        const components: ColliderComponent[] = [];

        this.node.components.forEach((component) => {
            if (component.isColliderComponent) {
                components.push(component as ColliderComponent);
            }
        });
        return components;
    }

    protected onCreate(): void {
        const bodyDesc = this._getRigidBodyTypeDesc(this._bodyType);
        this._body = physicsSystem.createBody(this, bodyDesc);

        // 如果Collider在RigidBody之前创建，那么需要重新创建Collider
        this.colliderComponents.forEach((colliderComponent) => colliderComponent.reCreateCollider());

        this.node.physicsDirtyFlag = true;
    }

    protected onDestroy(): void {
        if (!this._body) return;

        // 刚体准备销毁了，重新创建Collider
        this.colliderComponents.forEach((colliderComponent) => colliderComponent.reCreateCollider());

        physicsSystem.destroyBody(this, this._body);

        this._body = null;
    }

    private _bodyType: RIGID_BODY_TYPE = RIGID_BODY_TYPE.Dynamic;
    public get bodyType(): RIGID_BODY_TYPE {
        return this._bodyType;
    }
    public set bodyType(value: RIGID_BODY_TYPE) {
        this._bodyType = value;
        this.applyBodyType();
    }

    /**
     * @internal
     */
    public applyBodyType(): void {
        if (!this._body) return console.warn("Body not found");

        const bodyType = this._getRigidBodyType(this._bodyType);
        this._body.setBodyType(bodyType, true);
    }

    private _gravityScale: number = 1;
    public get gravityScale(): number {
        return this._gravityScale;
    }
    public set gravityScale(value: number) {
        this._gravityScale = value;
        this.applyGravityScale();
    }

    /**
     * @internal
     */
    public applyGravityScale(): void {
        if (!this._body) return;

        this._body.setGravityScale(this._gravityScale, true);
    }

    private _linearDamping: number = 0;
    public get linearDamping(): number {
        return this._linearDamping;
    }
    public set linearDamping(value: number) {
        this._linearDamping = value;
        this.applyLineDamping();
    }

    /**
     * @internal
     */
    public applyLineDamping(): void {
        if (!this._body) return;

        this._body.setLinearDamping(this._linearDamping);
    }

    private _angularDamping: number = 0;
    public get angularDamping(): number {
        return this._angularDamping;
    }
    public set angularDamping(value: number) {
        this._angularDamping = value;
        this.applyAngularDamping();
    }

    /**
     * @internal
     */
    public applyAngularDamping(): void {
        if (!this._body) return;

        this._body.setAngularDamping(this._angularDamping);
    }

    public get linvel(): Vec2 {
        if (!this._body) return Vec2.zero;

        const linvel = this._body.linvel();
        return vec2(linvel.x, linvel.y);
    }
    public set linvel(value: Vec2) {
        if (!this._body) return;

        this._body.setLinvel({ x: value.x, y: value.y }, true);
    }

    public get linvelX(): number {
        return this.linvel.x;
    }
    public set linvelX(value: number) {
        this.linvel = vec2(value, this.linvel.y);
    }

    public get linvelY(): number {
        return this.linvel.y;
    }
    public set linvelY(value: number) {
        this.linvel = vec2(this.linvel.x, value);
    }

    public get angvel(): number {
        if (!this._body) return 0;

        return this._body.angvel();
    }
    public set angvel(value: number) {
        if (!this._body) return;

        this._body.setAngvel(value, true);
    }

    private _lockRotations: boolean = false;
    public get lockRotations(): boolean {
        return this._lockRotations;
    }
    public set lockRotations(value: boolean) {
        this._lockRotations = value;
        this.applyLockRotations();
    }

    /**
     * @internal
     */
    public applyLockRotations(): void {
        if (!this._body) return;

        this._body.lockRotations(this._lockRotations, true);
    }

    private _ccdEnabled: boolean = false;
    public get ccdEnabled(): boolean {
        return this._ccdEnabled;
    }
    public set ccdEnabled(value: boolean) {
        this._ccdEnabled = value;
        this.applyCcdEnabled();
    }

    /**
     * @internal
     */
    public applyCcdEnabled(): void {
        if (!this._body) return;

        this._body.enableCcd(this._ccdEnabled);
    }

    public resetForces(wakeUp: boolean = true): void {
        if (!this._body) return;

        this._body.resetForces(wakeUp);
    }
    public addForce(force: Vec2, wakeUp: boolean = true): void {
        if (!this._body) return;

        this._body.addForce({ x: force.x, y: force.y }, wakeUp);
    }
    public addTorque(torque: number, wakeUp: boolean = true): void {
        if (!this._body) return;

        this._body.addTorque(torque, wakeUp);
    }
    public addForceAtPoint(force: Vec2, point: Vec2, wakeUp: boolean = true): void {
        if (!this._body) return;

        this._body.addForceAtPoint({ x: force.x, y: force.y }, { x: point.x, y: point.y }, wakeUp);
    }
    public applyImpulse(impulse: Vec2, wakeUp: boolean = true): void {
        if (!this._body) return;

        this._body.applyImpulse({ x: impulse.x, y: impulse.y }, wakeUp);
    }
    public applyTorqueImpulse(torque: number, wakeUp: boolean = true): void {
        if (!this._body) return;

        this._body.applyTorqueImpulse(torque, wakeUp);
    }
    public applyImpulseAtPoint(impulse: Vec2, point: Vec2, wakeUp: boolean = true): void {
        if (!this._body) return;

        this._body.applyImpulseAtPoint({ x: impulse.x, y: impulse.y }, { x: point.x, y: point.y }, wakeUp);
    }

    private _getRigidBodyType(bodyType: RIGID_BODY_TYPE) {
        if (bodyType === RIGID_BODY_TYPE.Dynamic) return RAPIER.RigidBodyType.Dynamic;
        if (bodyType === RIGID_BODY_TYPE.Fixed) return RAPIER.RigidBodyType.Fixed;
        if (bodyType === RIGID_BODY_TYPE.KinematicPositionBased) return RAPIER.RigidBodyType.KinematicPositionBased;
        if (bodyType === RIGID_BODY_TYPE.KinematicVelocityBased) return RAPIER.RigidBodyType.KinematicVelocityBased;

        throw new Error(`Invalid body type ${bodyType}`);
    }
    private _getRigidBodyTypeDesc(bodyType: RIGID_BODY_TYPE): RAPIER.RigidBodyDesc {
        if (bodyType === RIGID_BODY_TYPE.Dynamic) return RAPIER.RigidBodyDesc.dynamic();
        if (bodyType === RIGID_BODY_TYPE.Fixed) return RAPIER.RigidBodyDesc.fixed();
        if (bodyType === RIGID_BODY_TYPE.KinematicPositionBased) return RAPIER.RigidBodyDesc.kinematicPositionBased();
        if (bodyType === RIGID_BODY_TYPE.KinematicVelocityBased) return RAPIER.RigidBodyDesc.kinematicVelocityBased();

        throw new Error(`Invalid body type ${bodyType}`);
    }
}
