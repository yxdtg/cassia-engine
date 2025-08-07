import type { IGlobalPointerEvent, IPointerEvent } from "cassia-engine/input";
import type { Node } from "cassia-engine/node";
import { ComponentManager } from "./ComponentManager";

export class Component {
    private _node: Node;
    public get node(): Node {
        return this._node;
    }

    constructor(node: Node) {
        this._node = node;
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

    public onGlobalPointerDown(event: IGlobalPointerEvent): void {}
    public onGlobalPointerMove(event: IGlobalPointerEvent): void {}
    public onGlobalPointerUp(event: IGlobalPointerEvent): void {}
}

export interface Component {
    readonly componentName: string;

    readonly useOnPointerDown: boolean;
    readonly useOnPointerMove: boolean;
    readonly useOnPointerUp: boolean;

    readonly useOnGlobalPointerDown: boolean;
    readonly useOnGlobalPointerMove: boolean;
    readonly useOnGlobalPointerUp: boolean;
}

export type IComponentConstructor<T extends Component = Component> = new (node: Node) => T;

export interface IDefineComponentOptions {
    componentName: string;

    useOnPointerDown?: boolean;
    useOnPointerMove?: boolean;
    useOnPointerUp?: boolean;

    useOnGlobalPointerDown?: boolean;
    useOnGlobalPointerMove?: boolean;
    useOnGlobalPointerUp?: boolean;
}

export function defineComponent<T extends Component>(options: IDefineComponentOptions): Function {
    return function (constructor: IComponentConstructor<T>) {
        const componentClassPrototype = constructor.prototype as Component;
        const componentName = options.componentName;

        const useOnPointerDown = options.useOnPointerDown ?? false;
        const useOnPointerMove = options.useOnPointerMove ?? false;
        const useOnPointerUp = options.useOnPointerUp ?? false;

        const useOnGlobalPointerDown = options.useOnGlobalPointerDown ?? false;
        const useOnGlobalPointerMove = options.useOnGlobalPointerMove ?? false;
        const useOnGlobalPointerUp = options.useOnGlobalPointerUp ?? false;

        if (componentName.length === 0) throw new Error("componentName is empty");

        Object.defineProperty(componentClassPrototype, "componentName", {
            get(): string {
                return componentName;
            },
        });

        Object.defineProperty(componentClassPrototype, "useOnPointerDown", {
            get(): boolean {
                return useOnPointerDown;
            },
        });
        Object.defineProperty(componentClassPrototype, "useOnPointerMove", {
            get(): boolean {
                return useOnPointerMove;
            },
        });
        Object.defineProperty(componentClassPrototype, "useOnPointerUp", {
            get(): boolean {
                return useOnPointerUp;
            },
        });

        Object.defineProperty(componentClassPrototype, "useOnGlobalPointerDown", {
            get(): boolean {
                return useOnGlobalPointerDown;
            },
        });
        Object.defineProperty(componentClassPrototype, "useOnGlobalPointerMove", {
            get(): boolean {
                return useOnGlobalPointerMove;
            },
        });
        Object.defineProperty(componentClassPrototype, "useOnGlobalPointerUp", {
            get(): boolean {
                return useOnGlobalPointerUp;
            },
        });

        ComponentManager.defineComponent(constructor);
    };
}
