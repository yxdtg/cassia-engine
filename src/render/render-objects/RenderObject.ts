import type { RenderComponent } from "cassia-engine/component";
import type { Node } from "cassia-engine/node";
import type { ContainerRenderer } from "../define";
import type { RenderNode } from "../RenderNode";

export class RenderObject<T extends RenderComponent = any> {
    protected _component: T;
    public get component(): T {
        return this._component;
    }

    protected _node: Node;
    public get node(): Node {
        return this._node;
    }

    protected _renderNode: RenderNode;
    protected _renderContainer: ContainerRenderer;

    constructor(component: T) {
        this._component = component;
        this._node = this._component.node;

        this._renderNode = this._node.renderNode;
        this._renderContainer = this._renderNode.renderContainer;

        this._onRenderCreate();

        this._applySizeAndColor();
    }
    protected _onRenderCreate(): void {}

    public applyEnabled(): void {
        const enabled = this._component.enabled;
        this._renderContainer.visible = enabled;
    }

    protected _applySizeAndColor(): void {
        this._renderNode.applySize();
        this._renderNode.applyColor();
    }

    public destroy(): void {
        for (let i = this._renderContainer.children.length - 1; i >= 0; i--) {
            const child = this._renderContainer.children[i];
            child.destroy();
        }
    }
}
