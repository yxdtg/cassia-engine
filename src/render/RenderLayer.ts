import type { Layer } from "cassia-engine/layer";
import { ContainerRenderer } from "./define";
import type { RenderNode } from "./RenderNode";
import { vec2, Vec2 } from "cassia-engine/math";

export class RenderLayer {
    private _renderer: ContainerRenderer;
    public get renderer(): ContainerRenderer {
        return this._renderer;
    }

    constructor(layer: Layer) {
        this._layer = layer;

        this._renderer = new ContainerRenderer();
    }

    private _layer: Layer;
    public get layer(): Layer {
        return this._layer;
    }

    public screenToLayer(screenPoint: Vec2): Vec2 {
        const layerPoint = this._renderer.toLocal({ x: screenPoint.x, y: screenPoint.y });
        return vec2(layerPoint.x, layerPoint.y);
    }
    public layerToScreen(layerPoint: Vec2): Vec2 {
        const screenPoint = this._renderer.toGlobal({ x: layerPoint.x, y: layerPoint.y });
        return vec2(screenPoint.x, screenPoint.y);
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
