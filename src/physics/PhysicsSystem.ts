import RAPIER from "@dimforge/rapier2d-compat";
import { NODE_EVENT_TYPE, renderSystem } from "cassia-engine";
import { ColliderComponent, RigidBody } from "cassia-engine/component";
import { color, iVec2, vec2, Vec2 } from "cassia-engine/math";

export class PhysicsSystem {
    public debug: boolean = false;

    private _gravity = iVec2(0, -98.1);
    private _world: RAPIER.World = null!;

    /**
     * @internal
     * @returns
     */
    public async init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            RAPIER.init()
                .then(() => {
                    this._world = new RAPIER.World(this._gravity);
                    resolve();
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    private _rigidBodyComponents: RigidBody[] = [];
    private _colliderComponents: ColliderComponent[] = [];

    private _colliderToColliderComponentMap: Map<RAPIER.Collider, ColliderComponent> = new Map();

    /**
     * @internal
     * @param rigidBodyComponent
     * @param bodyDesc
     * @returns
     */
    public createBody(rigidBodyComponent: RigidBody, bodyDesc: RAPIER.RigidBodyDesc): RAPIER.RigidBody | null {
        if (this._rigidBodyComponents.includes(rigidBodyComponent)) return null;

        this._rigidBodyComponents.push(rigidBodyComponent);
        return this._world.createRigidBody(bodyDesc);
    }
    /**
     * @internal
     * @param rigidBodyComponent
     * @param body
     * @returns
     */
    public destroyBody(rigidBodyComponent: RigidBody, body: RAPIER.RigidBody): void {
        const index = this._rigidBodyComponents.indexOf(rigidBodyComponent);
        if (index === -1) return;

        this._rigidBodyComponents.splice(index, 1);
        this._world.removeRigidBody(body);
    }

    /**
     * @internal
     * @param colliderComponent
     * @param colliderDesc
     * @returns
     */
    public createCollider(
        colliderComponent: ColliderComponent,
        colliderDesc: RAPIER.ColliderDesc
    ): RAPIER.Collider | null {
        if (this._colliderComponents.includes(colliderComponent)) return null;

        let collider: RAPIER.Collider;
        const rigidBodyComponent = colliderComponent.getRigidBodyComponent();
        if (rigidBodyComponent) {
            const body = rigidBodyComponent.body;
            if (!body) {
                console.warn("RigidBodyComponent has no body");
                return null;
            }

            // Add to body
            collider = this._world.createCollider(colliderDesc, body);
        } else {
            // Add to world
            collider = this._world.createCollider(colliderDesc);
        }

        this._colliderComponents.push(colliderComponent);
        this._colliderToColliderComponentMap.set(collider, colliderComponent);

        return collider;
    }
    /**
     * @internal
     * @param colliderComponent
     * @param collider
     * @returns
     */
    public destroyCollider(colliderComponent: ColliderComponent, collider: RAPIER.Collider): void {
        const index = this._colliderComponents.indexOf(colliderComponent);
        if (index === -1) return;

        this._colliderComponents.splice(index, 1);
        this._colliderToColliderComponentMap.delete(collider);

        this._world.removeCollider(collider, true);
    }

    private _syncNodeToBody(): void {
        for (const colliderComponent of this._colliderComponents) {
            const collider = colliderComponent.collider;
            if (!collider) continue;

            colliderComponent.updateSize();

            const node = colliderComponent.node;
            const nodeWorldPosition = node.getLayerPosition();
            const nodeWorldRotation = node.getLayerRotation();

            const offset = colliderComponent.offset;

            const rigidBodyComponent = colliderComponent.getRigidBodyComponent();
            if (rigidBodyComponent) {
                collider.setTranslationWrtParent({ x: offset.x, y: offset.y });
            } else {
                collider.setTranslation({
                    x: nodeWorldPosition.x + offset.x,
                    y: nodeWorldPosition.y + offset.y,
                });
                collider.setRotation(nodeWorldRotation);
            }
        }

        for (const rigidBodyComponent of this._rigidBodyComponents) {
            const body = rigidBodyComponent.body;
            if (!body) continue;

            const node = rigidBodyComponent.node;
            const nodeWorldPosition = node.getLayerPosition();
            const nodeWorldRotation = node.getLayerRotation();

            body.setTranslation({ x: nodeWorldPosition.x, y: nodeWorldPosition.y }, true);
            body.setRotation(nodeWorldRotation, true);
        }
    }

    private _syncBodyToNode(): void {
        for (const colliderComponent of this._colliderComponents) {
            const node = colliderComponent.node;

            const rigidBodyComponent = colliderComponent.getRigidBodyComponent();
            if (!rigidBodyComponent) {
                const collider = colliderComponent.collider;
                if (!collider) continue;

                const offset = colliderComponent.offset;

                const colliderPosition = collider.translation();
                const colliderRotation = collider.rotation();

                node.setLayerPosition(colliderPosition.x - offset.x, colliderPosition.y - offset.y);
                node.setLayerRotation(colliderRotation);
            }
        }

        for (const rigidBodyComponent of this._rigidBodyComponents) {
            const body = rigidBodyComponent.body;
            if (!body) continue;

            const bodyPosition = body.translation();
            const bodyRotation = body.rotation();

            const node = rigidBodyComponent.node;
            node.setLayerPosition(bodyPosition.x, bodyPosition.y);
            node.setLayerRotation(bodyRotation);
        }
    }

    private _drawDebug(): void {
        const { vertices, colors } = this._world.debugRender();
        for (let i = 0; i < vertices.length / 4; i += 1) {
            const drawVertices: Vec2[] = [
                vec2(vertices[i * 4], vertices[i * 4 + 1]),
                vec2(vertices[i * 4 + 2], vertices[i * 4 + 3]),
            ];
            renderSystem.drawPolygon(drawVertices, color(0, 255, 0));
        }
    }

    /**
     * @internal
     */
    public update(): void {
        if (!this._world) return;

        this._syncNodeToBody();

        const eventQueue = new RAPIER.EventQueue(true);
        this._world.step(eventQueue);

        eventQueue.drainCollisionEvents((handle1, handle2, started) => {
            const colliderAId = handle1;
            const colliderBId = handle2;

            const colliderA = this._world.getCollider(colliderAId);
            const colliderB = this._world.getCollider(colliderBId);

            const colliderComponentA = this._colliderToColliderComponentMap.get(colliderA);
            const colliderComponentB = this._colliderToColliderComponentMap.get(colliderB);

            if (!colliderComponentA || !colliderComponentB || colliderComponentA === colliderComponentB) return;

            const nodeA = colliderComponentA.node;
            const nodeB = colliderComponentB.node;

            if (started) {
                nodeA.emit(NODE_EVENT_TYPE.CollisionEnter, colliderComponentA, colliderComponentB);
                nodeB.emit(NODE_EVENT_TYPE.CollisionEnter, colliderComponentB, colliderComponentA);
            } else {
                nodeA.emit(NODE_EVENT_TYPE.CollisionExit, colliderComponentA, colliderComponentB);
                nodeB.emit(NODE_EVENT_TYPE.CollisionExit, colliderComponentB, colliderComponentA);
            }
        });

        this._syncBodyToNode();

        if (this.debug) {
            this._drawDebug();
        }
    }
}
