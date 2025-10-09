import type { Layer } from "cassia-engine/layer";
import { RenderScene } from "cassia-engine/render";
import { SceneManager } from "./SceneManager";
import { defineObjectGetter } from "cassia-engine/utils";

export class Scene {
    private _renderScene: RenderScene;
    /**
     * @internal
     */
    public get renderScene(): RenderScene {
        return this._renderScene;
    }

    constructor() {
        this._renderScene = new RenderScene(this);
    }

    protected onInit(): void {}

    private _layers: Layer[] = [];
    public get layers(): Layer[] {
        return this._layers;
    }

    public addLayer(layer: Layer): void {
        if (this._layers.includes(layer)) return;

        this._layers.push(layer);

        const renderLayer = layer.renderLayer;
        this._renderScene.addRenderLayer(renderLayer);
    }

    public removeLayer(layer: Layer): void {
        const index = this._layers.indexOf(layer);
        if (index === -1) return;

        this._layers.splice(index, 1);

        const renderLayer = layer.renderLayer;
        this._renderScene.removeRenderLayer(renderLayer);
    }

    public getLayer(layerName: string): Layer | null;
    public getLayer(layerIndex: number): Layer | null;
    public getLayer(layerNameOrIndex: string | number): Layer | null;
    public getLayer(layerNameOrIndex: string | number): Layer | null {
        if (typeof layerNameOrIndex === "string")
            return this._layers.find((layer) => layer.layerName === layerNameOrIndex) ?? null;

        if (typeof layerNameOrIndex === "number") return this._layers[layerNameOrIndex] ?? null;

        return null;
    }

    public getLayerIndex(layer: Layer): number {
        return this._layers.indexOf(layer);
    }

    public setLayerIndex(layer: Layer, index: number): void {
        if (index < 0 || index >= this._layers.length) return;

        const currentIndex = this._layers.indexOf(layer);
        if (currentIndex === -1 || currentIndex === index) return;

        this._layers.splice(currentIndex, 1);
        this._layers.splice(index, 0, layer);

        const renderLayer = layer.renderLayer;
        this._renderScene.setRenderLayerIndex(renderLayer, index);
    }

    private _destroyed: boolean = false;
    public get destroyed(): boolean {
        return this._destroyed;
    }

    public destroy(): void {
        if (this._destroyed) return;

        this._destroyed = true;

        for (let i = this._layers.length - 1; i >= 0; i--) {
            const layer = this._layers[i];
            layer.destroy();
        }
    }

    /**
     * @internal
     */
    public destroyRenderer(): void {
        if (!this._destroyed) return;

        this._renderScene.destroy();
    }

    private _destroyedLayers: Layer[] = [];

    /**
     * @internal
     */
    public addDestroyedLayer(layer: Layer): void {
        if (this._destroyedLayers.includes(layer)) return;

        this._destroyedLayers.push(layer);
    }
    /**
     * @internal
     */
    public clearDestroyedLayers(): void {
        this._destroyedLayers.forEach((layer) => {
            this.removeLayer(layer);

            layer.destroyRenderer();
        });
        this._destroyedLayers.length = 0;
    }
}

export interface Scene {
    readonly sceneName: string;
}

export interface IDefineSceneOptions {
    sceneName: string;
}

export type ISceneConstructor<T extends Scene = Scene> = new () => T;

export function defineScene<T extends Scene>(options: IDefineSceneOptions): Function {
    return function (constructor: ISceneConstructor<T>) {
        const sceneClassPrototype = constructor.prototype as T;
        const sceneName = options.sceneName;

        if (sceneName.length === 0) throw new Error("sceneName is empty");

        defineObjectGetter(sceneClassPrototype, "sceneName", sceneName);

        SceneManager.defineScene(constructor);
    };
}
