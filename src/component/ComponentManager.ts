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

    /**
     * @internal
     */
    public addComponent(component: Component): void {
        if (this._components.includes(component)) return;
        this._components.push(component);
    }

    /**
     * @internal
     */
    public callUpdateComponents(deltaTime: number): void {
        this._components.forEach((component) => component.onUpdate(deltaTime));
    }

    /**
     * @internal
     */
    public callFixedUpdateComponents(fixedTimeStep: number): void {
        this._components.forEach((component) => component.onFixedUpdate(fixedTimeStep));
    }

    /**
     * @internal
     */
    public callLateUpdateComponents(deltaTime: number): void {
        this._components.forEach((component) => component.onLateUpdate(deltaTime));
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
