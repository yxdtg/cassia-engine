import type { Scene } from "cassia-engine/scene";
import { ContainerRenderer } from "./define";
import type { RenderNode } from "./RenderNode";

export class RenderScene {
    private _renderer: ContainerRenderer;
    public get renderer(): ContainerRenderer {
        return this._renderer;
    }

    constructor(scene: Scene) {
        this._scene = scene;

        this._renderer = new ContainerRenderer();
    }

    private _scene: Scene;
    public get scene(): Scene {
        return this._scene;
    }

    private _renderNodes: RenderNode[] = [];

    public addRenderNode(renderNode: RenderNode): void {
        if (this._renderNodes.includes(renderNode)) return;
        this._renderNodes.push(renderNode);

        const nodeRenderer = renderNode.renderer;
        this._renderer.addChild(nodeRenderer);
    }
    public removeRenderNode(renderNode: RenderNode): void {
        const index = this._renderNodes.indexOf(renderNode);
        if (index === -1) return;
        this._renderNodes.splice(index, 1);

        const nodeRenderer = renderNode.renderer;
        this._renderer.removeChild(nodeRenderer);
    }

    public setRenderNodeIndex(renderNode: RenderNode, index: number): void {
        const currentIndex = this._renderNodes.indexOf(renderNode);
        if (currentIndex === -1 || currentIndex === index) return;

        this._renderNodes.splice(currentIndex, 1);
        this._renderNodes.splice(index, 0, renderNode);

        const nodeRenderer = renderNode.renderer;
        this._renderer.setChildIndex(nodeRenderer, index);
    }

    public destroy(): void {
        this._renderer.destroy();
        this._renderer = null!;
    }
}
