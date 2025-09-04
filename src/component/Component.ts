import type { IGlobalPointerEvent, IPointerEvent } from "cassia-engine/input";
import type { Node } from "cassia-engine/node";
import { ComponentManager } from "./ComponentManager";
import type { ColliderComponent } from "./components";
import { defineObjectGetter } from "cassia-engine/utils";
import { EventObject } from "cassia-engine/event";
import type { ITrackEntry } from "cassia-engine/render";

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

    /**
     * @internal
     */
    protected onCreate?(): void;

    protected onInit(): void {}

    protected onStart(): void {}
    protected onDestroy(): void {}

    protected onEnable(): void {}
    protected onDisable(): void {}

    protected onFixedUpdate(dt: number): void {}

    protected onUpdate(dt: number): void {}
    protected onLateUpdate(dt: number): void {}

    /**
     * defineComponent useOnPointerDown: true
     * @param event
     */
    protected onPointerDown?(event: IPointerEvent): void;
    /**
     * defineComponent useOnPointerMove: true
     * @param event
     */
    protected onPointerMove?(event: IPointerEvent): void;
    /**
     * defineComponent useOnPointerUp: true
     * @param event
     */
    protected onPointerUp?(event: IPointerEvent): void;

    /**
     * defineComponent useOnGlobalPointerDown: true
     * @param event
     */
    protected onGlobalPointerDown?(event: IGlobalPointerEvent): void;
    /**
     * defineComponent useOnGlobalPointerMove: true
     * @param event
     */
    protected onGlobalPointerMove?(event: IGlobalPointerEvent): void;
    /**
     * defineComponent useOnGlobalPointerUp: true
     * @param event
     */
    protected onGlobalPointerUp?(event: IGlobalPointerEvent): void;

    /**
     * defineComponent useOnCollisionEnter: true
     * @param selfCollider
     * @param otherCollider
     */
    protected onCollisionEnter?(selfCollider: ColliderComponent, otherCollider: ColliderComponent): void;
    /**
     * defineComponent useOnCollisionExit: true
     * @param selfCollider
     * @param otherCollider
     */
    protected onCollisionExit?(selfCollider: ColliderComponent, otherCollider: ColliderComponent): void;

    /**
     * defineComponent useOnSpineAnimationStart: true
     * @param trackEntry
     * @param trackIndex
     * @param animationName
     */
    protected onSpineAnimationStart?(trackEntry: ITrackEntry, trackIndex: number, animationName: string): void;
    /**
     * defineComponent useOnSpineAnimationEnd: true
     * @param trackEntry
     * @param trackIndex
     * @param animationName
     */
    protected onSpineAnimationEnd?(trackEntry: ITrackEntry, trackIndex: number, animationName: string): void;
    /**
     * defineComponent useOnSpineAnimationComplete: true
     * @param trackEntry
     * @param trackIndex
     * @param animationName
     */
    protected onSpineAnimationComplete?(trackEntry: ITrackEntry, trackIndex: number, animationName: string): void;
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

    /**
     * @internal
     */
    readonly useOnSpineAnimationStart?: boolean;
    /**
     * @internal
     */
    readonly useOnSpineAnimationEnd?: boolean;
    /**
     * @internal
     */
    readonly useOnSpineAnimationComplete?: boolean;

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

    /*************************** useOnSpineAnimation ***************************/
    useOnSpineAnimationStart?: boolean;
    useOnSpineAnimationEnd?: boolean;
    useOnSpineAnimationComplete?: boolean;

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
