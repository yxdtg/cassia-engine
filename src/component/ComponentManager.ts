import { type Node, NODE_EVENT_TYPE } from "cassia-engine/node";
import type { Component, IComponentConstructor } from "./Component";

export class ComponentManager {
    private static _nameToComponentClassMap: Map<string, IComponentConstructor> = new Map();

    /**
     * @internal
     * @param componentClass
     */
    public static defineComponent(componentClass: IComponentConstructor): void {
        const componentClassPrototype = componentClass.prototype as Component;
        const componentName = componentClassPrototype.componentName;

        this._nameToComponentClassMap.set(componentName, componentClass);
    }

    public static getComponentClass(componentName: string): IComponentConstructor | null {
        return this._nameToComponentClassMap.get(componentName) ?? null;
    }
    public static getComponentClasses(): IComponentConstructor[] {
        return Array.from(this._nameToComponentClassMap.values());
    }

    private _components: Component[] = [];
    /**
     * @internal
     */
    public get components(): Component[] {
        return this._components;
    }

    private _unStartedComponents: Component[] = [];

    /**
     * @internal
     */
    public addUnStartedComponent(component: Component): void {
        if (this._unStartedComponents.includes(component)) return;

        this._unStartedComponents.push(component);
    }

    /**
     * @internal
     */
    public callStartComponents(): void {
        this._unStartedComponents.forEach((component) => {
            if (canExecuteComponent(component)) {
                component["onStart"]();
            }
        });

        this._components.push(...this._unStartedComponents);

        this._unStartedComponents.length = 0;
    }

    /**
     * @internal
     */
    public callUpdateAllTimersComponents(dt: number): void {
        this._components.forEach((component) => {
            if (canExecuteComponent(component)) {
                component.timeObject.updateAllTimers(dt);
            }
        });
    }

    /**
     * @internal
     */
    public callUpdateComponents(dt: number): void {
        this._components.forEach((component) => {
            if (canExecuteComponent(component)) {
                component["onUpdate"](dt);
            }
        });
    }

    /**
     * @internal
     */
    public callFixedUpdateComponents(fixedTimeStep: number): void {
        this._components.forEach((component) => {
            if (canExecuteComponent(component)) {
                component["onFixedUpdate"](fixedTimeStep);
            }
        });
    }

    /**
     * @internal
     */
    public callLateUpdateComponents(dt: number): void {
        this._components.forEach((component) => {
            if (canExecuteComponent(component)) {
                component["onLateUpdate"](dt);
            }
        });
    }

    private _destroyedComponents: Component[] = [];
    /**
     * @internal
     */
    public addDestroyedComponent(component: Component): void {
        if (this._destroyedComponents.includes(component)) return;

        this._destroyedComponents.push(component);

        component.destroy();
    }

    /**
     * @internal
     */
    public clearDestroyedComponents(): void {
        this._destroyedComponents.forEach((component) => {
            if (component.destroyed) {
                unregisterComponentOnUse(component);

                component["onDestroy"]();

                delete (component.node.comp as any)[component.componentName];

                const nodeComponentIndex = component.node.components.indexOf(component);
                component.node.components.splice(nodeComponentIndex, 1);

                const index = this._components.indexOf(component);
                this._components.splice(index, 1);
            }
        });
        this._destroyedComponents.length = 0;
    }
}

export function canExecuteComponent(component: Component): boolean {
    if (!component.enabled) return false;

    let node: Node | null = component.node;

    let active = true;

    while (node) {
        if (!node.active) {
            active = false;
            break;
        }

        node = node.parent;
    }

    if (active) return true;
    return false;
}

export function registerComponentOnUse(component: Component): void {
    if (component.useEvents) {
        component.useEvents.forEach((use) => {
            const nodeEventKey = use;
            const nodeEventValue = NODE_EVENT_TYPE[nodeEventKey];

            const componentMethodName = `on${nodeEventKey}` as const;
            const componentMethod = component[componentMethodName];

            if (nodeEventValue && componentMethod) {
                component.node.on(nodeEventValue, componentMethod, component);
            }
        });
    }
}

function unregisterComponentOnUse(component: Component): void {
    if (component.useEvents) {
        component.useEvents.forEach((use) => {
            const nodeEventKey = use;
            const nodeEventValue = NODE_EVENT_TYPE[nodeEventKey];

            const componentMethodName = `on${nodeEventKey}` as const;
            const componentMethod = component[componentMethodName];

            if (nodeEventValue && componentMethod) {
                component.node.off(nodeEventValue, componentMethod, component);
            }
        });
    }
}
