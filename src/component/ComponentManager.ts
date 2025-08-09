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
                component.onStart();
            }
        });

        this._components.push(...this._unStartedComponents);

        this._unStartedComponents.length = 0;
    }

    /**
     * @internal
     */
    public callUpdateComponents(deltaTime: number): void {
        this._components.forEach((component) => {
            if (canExecuteComponent(component)) {
                component.onUpdate(deltaTime);
            }
        });
    }

    /**
     * @internal
     */
    public callFixedUpdateComponents(fixedTimeStep: number): void {
        this._components.forEach((component) => {
            if (canExecuteComponent(component)) {
                component.onFixedUpdate(fixedTimeStep);
            }
        });
    }

    /**
     * @internal
     */
    public callLateUpdateComponents(deltaTime: number): void {
        this._components.forEach((component) => {
            if (canExecuteComponent(component)) {
                component.onLateUpdate(deltaTime);
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
                // off Use onPointerDown, onPointerMove, onPointerUp
                {
                    if (component.useOnPointerDown) {
                        component.node.off(NODE_EVENT_TYPE.PointerDown, component.onPointerDown, component);
                    }
                    if (component.useOnPointerMove) {
                        component.node.off(NODE_EVENT_TYPE.PointerMove, component.onPointerMove, component);
                    }
                    if (component.useOnPointerUp) {
                        component.node.off(NODE_EVENT_TYPE.PointerUp, component.onPointerUp, component);
                    }
                }
                // off Use onGlobalPointerDown, onGlobalPointerMove, onGlobalPointerUp
                {
                    if (component.useOnGlobalPointerDown) {
                        component.node.off(NODE_EVENT_TYPE.GlobalPointerDown, component.onGlobalPointerDown, component);
                    }
                    if (component.useOnGlobalPointerMove) {
                        component.node.off(NODE_EVENT_TYPE.GlobalPointerMove, component.onGlobalPointerMove, component);
                    }
                    if (component.useOnGlobalPointerUp) {
                        component.node.off(NODE_EVENT_TYPE.GlobalPointerUp, component.onGlobalPointerUp, component);
                    }
                }
                // off Use onCollisionEnter, onCollisionExit
                {
                    if (component.useOnCollisionEnter) {
                        component.node.off(NODE_EVENT_TYPE.CollisionEnter, component.onCollisionEnter, component);
                    }
                    if (component.useOnCollisionExit) {
                        component.node.off(NODE_EVENT_TYPE.CollisionExit, component.onCollisionExit, component);
                    }
                }

                component.onDestroy();

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
