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

    public onCreate(): void {}

    public onStart(): void {}
    public onDestroy(): void {}

    public onFixedUpdate(dt: number): void {}

    public onUpdate(dt: number): void {}
    public onLateUpdate(dt: number): void {}
}

export interface Component {
    readonly componentName: string;
}

export type IComponentConstructor<T extends Component = Component> = new (node: Node) => T;

export interface IDefineComponentOptions {
    componentName: string;
}

export function defineComponent<T extends Component>(options: IDefineComponentOptions): Function {
    return function (constructor: IComponentConstructor<T>) {
        const componentClassPrototype = constructor.prototype as Component;

        const componentName = options.componentName;

        if (componentName.length === 0) throw new Error("componentName is empty");

        Object.defineProperty(componentClassPrototype, "componentName", {
            get(): string {
                return componentName;
            },
        });

        ComponentManager.defineComponent(constructor);
    };
}
