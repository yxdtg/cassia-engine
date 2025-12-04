import type { IGlobalPointerEvent, ILastGlobalPointerEvent, IPointerEvent, IUIEvent } from "cassia-engine/input";
import type { Node, NODE_EVENT_TYPE } from "cassia-engine/node";
import { ComponentManager } from "./ComponentManager";
import type { ColliderComponent } from "./components";
import { defineObjectGetter, type ValueOf } from "cassia-engine/utils";
import { EventObject } from "cassia-engine/event";
import type { ITrackEntry } from "cassia-engine/render";
import { TimeObject } from "cassia-engine/time";

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
     *
     * @param event
     */
    protected onPointerDown?(event: IPointerEvent): void;
    /**
     *
     * @param event
     */
    protected onPointerMove?(event: IPointerEvent): void;
    /**
     *
     * @param event
     */
    protected onPointerUp?(event: IPointerEvent): void;

    /**
     *
     * @param event
     */
    protected onGlobalPointerDown?(event: IGlobalPointerEvent): void;
    /**
     *
     * @param event
     */
    protected onGlobalPointerMove?(event: IGlobalPointerEvent): void;
    /**
     *
     * @param event
     */
    protected onGlobalPointerUp?(event: IGlobalPointerEvent): void;

    /**
     *
     * @param event
     */
    protected onLastGlobalPointerDown?(event: ILastGlobalPointerEvent): void;
    /**
     *
     * @param event
     */
    protected onLastGlobalPointerMove?(event: ILastGlobalPointerEvent): void;
    /**
     *
     * @param event
     */
    protected onLastGlobalPointerUp?(event: ILastGlobalPointerEvent): void;

    /**
     *
     * @param event
     */
    protected onClick?(event: IUIEvent): void;
    /**
     *
     * @param event
     */
    protected onDoubleClick?(event: IUIEvent): void;

    /**
     *
     * @param selfCollider
     * @param otherCollider
     */
    protected onCollisionEnter?(selfCollider: ColliderComponent, otherCollider: ColliderComponent): void;
    /**
     *
     * @param selfCollider
     * @param otherCollider
     */
    protected onCollisionExit?(selfCollider: ColliderComponent, otherCollider: ColliderComponent): void;

    /**
     *
     * @param trackEntry
     * @param trackIndex
     * @param animationName
     */
    protected onSpineAnimationStart?(trackEntry: ITrackEntry, trackIndex: number, animationName: string): void;
    /**
     *
     * @param trackEntry
     * @param trackIndex
     * @param animationName
     */
    protected onSpineAnimationEnd?(trackEntry: ITrackEntry, trackIndex: number, animationName: string): void;
    /**
     *
     * @param trackEntry
     * @param trackIndex
     * @param animationName
     */
    protected onSpineAnimationComplete?(trackEntry: ITrackEntry, trackIndex: number, animationName: string): void;

    private _timeObject: TimeObject = new TimeObject();
    /**
     * @internal
     */
    public get timeObject(): TimeObject {
        return this._timeObject;
    }

    public addTimer(...args: Parameters<TimeObject["addTimer"]>): ReturnType<TimeObject["addTimer"]> {
        return this._timeObject.addTimer(...args);
    }
    public addTimerOnce(...args: Parameters<TimeObject["addTimerOnce"]>): ReturnType<TimeObject["addTimerOnce"]> {
        return this._timeObject.addTimerOnce(...args);
    }

    public removeTimer(...args: Parameters<TimeObject["removeTimer"]>): ReturnType<TimeObject["removeTimer"]> {
        return this._timeObject.removeTimer(...args);
    }
    public removeAllTimers(
        ...args: Parameters<TimeObject["removeAllTimers"]>
    ): ReturnType<TimeObject["removeAllTimers"]> {
        return this._timeObject.removeAllTimers(...args);
    }
}

export interface Component {
    readonly componentName: string;

    /**
     * @internal
     */
    readonly useEvents?: ValueOf<typeof NODE_EVENT_TYPE>[];

    /**
     * @internal
     */
    readonly requireComponents?: IRequireComponent[];

    readonly isRenderComponent?: boolean;
    readonly isColliderComponent?: boolean;
}

export type ComponentConstructor<T extends Component = Component> = new (node: Node) => T;

export type IRequireComponent = ComponentConstructor | string;

export interface IDefineComponentOptions {
    /** componentName */
    componentName: string;

    useEvents?: ValueOf<typeof NODE_EVENT_TYPE>[];

    requireComponents?: IRequireComponent[];

    // isTypeComponent
    isRenderComponent?: boolean;
    isColliderComponent?: boolean;
}

export function defineComponent<T extends Component>(options: IDefineComponentOptions): Function {
    return function (constructor: ComponentConstructor<T>) {
        const componentClassPrototype = constructor.prototype as Component;

        if (options.componentName.length === 0) throw new Error("defineComponent error: componentName is empty");

        for (const key in options) {
            const value = (options as any)[key];
            if (value !== undefined) {
                defineObjectGetter(componentClassPrototype, key, value);
            }
        }

        ComponentManager.defineComponent(constructor);
    };
}
