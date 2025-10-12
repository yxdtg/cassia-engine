import { Sprite, Text, type Component, type IComponentConstructor } from "cassia-engine/component";
import { Node } from "cassia-engine/node";
import type { IWritablePropertiesOnly } from "cassia-engine/utils";

function instantiateNode(prefabNodeData: IPrefabNodeData): Node {
    const node = new Node(prefabNodeData.options);

    if (prefabNodeData.components) {
        prefabNodeData.components.forEach((prefabComponentData) =>
            node.addComponent(prefabComponentData.componentName, prefabComponentData.options)
        );
    }

    if (prefabNodeData.children) {
        prefabNodeData.children.forEach((childData) => {
            const child = instantiateNode(childData);
            child.parent = node;
        });
    }

    return node;
}

export function $node(prefabData: IPrefabData): Node {
    return instantiateNode(prefabData.node);
}

export function $prefab(name: string, prefabNodeData: IPrefabNodeData): IPrefabData {
    const prefabData: IPrefabData = {
        name,
        node: prefabNodeData,
    };
    return prefabData;
}

export function $component<T extends Component>(
    componentClass: IComponentConstructor<T>,
    options?: Partial<IWritablePropertiesOnly<T>>
): IPrefabComponentData;

export function $component<T extends Component>(
    componentName: string,
    options?: Partial<IWritablePropertiesOnly<T>>
): IPrefabComponentData;

export function $component<T extends Component>(
    componentClassOrName: IComponentConstructor<T> | string,
    options?: Partial<IWritablePropertiesOnly<T>>
): IPrefabComponentData {
    const componentName =
        typeof componentClassOrName === "string"
            ? componentClassOrName
            : (componentClassOrName.prototype as T).componentName;

    const componentData: IPrefabComponentData = {
        componentName: componentName,
        options,
    };
    return componentData;
}

export interface IPrefabData {
    name: string;
    node: IPrefabNodeData;
}

export interface IPrefabNodeData {
    options?: Partial<IWritablePropertiesOnly<Node>>;
    components?: IPrefabComponentData[];
    children?: IPrefabNodeData[];
}

export interface IPrefabComponentData<T extends Component = Component> {
    componentName: string;
    options?: Partial<IWritablePropertiesOnly<T>>;
}

/* 实验 */

$prefab("button", {
    components: [$component(Sprite, { textureName: "button" })],
    children: [
        {
            components: [$component(Text, { text: "Button" })],
        },
    ],
});
