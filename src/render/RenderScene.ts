import type { Scene } from "cassia-engine/scene";
import { ContainerRenderer } from "./define";
import type { RenderLayer } from "./RenderLayer";

export class RenderScene {
    private _renderer: ContainerRenderer;
    /**
     * @internal
     */
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

    private _renderLayers: RenderLayer[] = [];

    public addRenderLayer(renderLayer: RenderLayer): void {
        if (this._renderLayers.includes(renderLayer)) return;

        this._renderLayers.push(renderLayer);

        const layerRenderer = renderLayer.renderer;
        this._renderer.addChild(layerRenderer);
    }
    public removeRenderLayer(renderLayer: RenderLayer): void {
        const index = this._renderLayers.indexOf(renderLayer);
        if (index === -1) return;

        this._renderLayers.splice(index, 1);

        const layerRenderer = renderLayer.renderer;
        this._renderer.removeChild(layerRenderer);
    }

    public setRenderLayerIndex(renderLayer: RenderLayer, index: number): void {
        const currentIndex = this._renderLayers.indexOf(renderLayer);
        if (currentIndex === -1 || currentIndex === index) return;

        this._renderLayers.splice(currentIndex, 1);
        this._renderLayers.splice(index, 0, renderLayer);

        const layerRenderer = renderLayer.renderer;
        this._renderer.setChildIndex(layerRenderer, index);
    }

    public destroy(): void {
        this._renderer.destroy();
        this._renderer = null!;
    }
}
