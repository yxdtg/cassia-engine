import type { RenderComponent } from "cassia-engine/component";
import type { Node } from "cassia-engine/node";
import type { ContainerRenderer } from "../define";
import type { RenderNode } from "../RenderNode";

export class RenderObject<T extends RenderComponent = any> {
    private _component: T;
    public get component(): T {
        return this._component;
    }

    private _node: Node;
    public get node(): Node {
        return this._node;
    }

    private _renderNode: RenderNode;
    public get renderNode(): RenderNode {
        return this._renderNode;
    }

    private _renderContainer: ContainerRenderer;
    public get renderContainer(): ContainerRenderer {
        return this._renderContainer;
    }

    constructor(component: T) {
        this._component = component;
        this._node = this._component.node;

        this._renderNode = this._node.renderNode;
        this._renderContainer = this._renderNode.renderContainer;

        this.onRenderCreate();

        this.applySizeAndColor();
    }
    protected onRenderCreate(): void {}

    public applyEnabled(): void {
        const enabled = this._component.enabled;
        this._renderContainer.visible = enabled;
    }

    protected applySizeAndColor(): void {
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
