import type { RenderComponent } from "cassia-engine/component";
import { Node } from "cassia-engine/node";
import { ContainerRenderer } from "../define";
import { RenderNode } from "../RenderNode";

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

    protected _applySizeAndColor(): void {
        this._renderNode.applySize();
        this._renderNode.applyColor();
    }
}
