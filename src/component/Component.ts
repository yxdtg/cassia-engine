import type { IGlobalPointerEvent, IPointerEvent } from "cassia-engine/input";
import type { Node } from "cassia-engine/node";
import { ComponentManager } from "./ComponentManager";
import type { ColliderComponent } from "./components";
import { defineObjectGetter } from "cassia-engine/utils";
import { EventObject } from "cassia-engine/event";

export class Component<M extends Record<keyof M, any> = any> extends EventObject<M> {
    private _node: Node;
    public get node(): Node {
        return this._node;
    }

    constructor(node: Node) {
        super();

        this._node = node;
    }

    private _enabled: boolean = true;
    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        const isChanged = this._enabled !== value;
        this._enabled = value;

        if (isChanged && this.node.active) {
            if (this._enabled) {
                this.onEnable();
            } else {
                this.onDisable();
            }
        }
    }

    private _destroyed: boolean = false;
    public get destroyed(): boolean {
        return this._destroyed;
    }
    /**
     * @internal
     */
    public destroy(): void {
        this._destroyed = true;
    }

    public onInit(): void {}

    public onStart(): void {}
    public onDestroy(): void {}

    public onEnable(): void {}
    public onDisable(): void {}

    public onFixedUpdate(dt: number): void {}

    public onUpdate(dt: number): void {}
    public onLateUpdate(dt: number): void {}

    /**
     * defineComponent useOnPointerDown: true
     * @param event
     */
    public onPointerDown(event: IPointerEvent): void {}
    /**
     * defineComponent useOnPointerMove: true
     * @param event
     */
    public onPointerMove(event: IPointerEvent): void {}
    /**
     * defineComponent useOnPointerUp: true
     * @param event
     */
    public onPointerUp(event: IPointerEvent): void {}

    /**
     * defineComponent useOnGlobalPointerDown: true
     * @param event
     */
    public onGlobalPointerDown(event: IGlobalPointerEvent): void {}
    /**
     * defineComponent useOnGlobalPointerMove: true
     * @param event
     */
    public onGlobalPointerMove(event: IGlobalPointerEvent): void {}
    /**
     * defineComponent useOnGlobalPointerUp: true
     * @param event
     */
    public onGlobalPointerUp(event: IGlobalPointerEvent): void {}

    /**
     * defineComponent useOnCollisionEnter: true
     * @param selfCollider
     * @param otherCollider
     */
    public onCollisionEnter(selfCollider: ColliderComponent, otherCollider: ColliderComponent): void {}
    /**
     * defineComponent useOnCollisionExit: true
     * @param selfCollider
     * @param otherCollider
     */
    public onCollisionExit(selfCollider: ColliderComponent, otherCollider: ColliderComponent): void {}
}

export interface Component {
    readonly componentName: string;

    /**
     * @internal
     */
    readonly useOnPointerDown?: boolean;
    /**
     * @internal
     */
    readonly useOnPointerMove?: boolean;
    /**
     * @internal
     */
    readonly useOnPointerUp?: boolean;

    /**
     * @internal
     */
    readonly useOnGlobalPointerDown?: boolean;
    /**
     * @internal
     */
    readonly useOnGlobalPointerMove?: boolean;
    /**
     * @internal
     */
    readonly useOnGlobalPointerUp?: boolean;

    /**
     * @internal
     */
    readonly useOnCollisionEnter?: boolean;
    /**
     * @internal
     */
    readonly useOnCollisionExit?: boolean;

    readonly isRenderComponent?: boolean;
    readonly isColliderComponent?: boolean;
}

export type IComponentConstructor<T extends Component = Component> = new (node: Node) => T;

export interface IDefineComponentOptions {
    /*************************** componentName ***************************/
    componentName: string;

    /*************************** useOnPointer ***************************/
    useOnPointerDown?: boolean;
    useOnPointerMove?: boolean;
    useOnPointerUp?: boolean;

    /*************************** useOnGlobalPointer ***************************/
    useOnGlobalPointerDown?: boolean;
    useOnGlobalPointerMove?: boolean;
    useOnGlobalPointerUp?: boolean;

    /*************************** useOnCollision ***************************/

    useOnCollisionEnter?: boolean;
    useOnCollisionExit?: boolean;

    /*************************** isTypeComponent ***************************/
    isRenderComponent?: boolean;
    isColliderComponent?: boolean;
}

export function defineComponent<T extends Component>(options: IDefineComponentOptions): Function {
    return function (constructor: IComponentConstructor<T>) {
        const componentClassPrototype = constructor.prototype as Component;
        const componentName = options.componentName;

        if (componentName.length === 0) throw new Error("componentName is empty");

        for (const key in options) {
            const value = (options as any)[key];
            if (value !== undefined) {
                defineObjectGetter(componentClassPrototype, key, value);
            }
        }

        ComponentManager.defineComponent(constructor);
    };
}
