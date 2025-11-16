import { clearAllTweens, Layer, renderSystem, timeSystem } from "cassia-engine";
import type { Scene, SceneConstructor } from "./Scene";

export class SceneManager {
    private static _nameToSceneClassMap: Map<string, SceneConstructor> = new Map();

    /**
     * @internal
     * @param sceneClass
     */
    public static defineScene(sceneClass: SceneConstructor): void {
        const sceneClassPrototype = sceneClass.prototype as Scene;
        const sceneName = sceneClassPrototype.sceneName;

        this._nameToSceneClassMap.set(sceneName, sceneClass);
    }

    public static getSceneClass(sceneName: string): SceneConstructor | null {
        return this._nameToSceneClassMap.get(sceneName) ?? null;
    }
    public static getSceneClasses(): SceneConstructor[] {
        return Array.from(this._nameToSceneClassMap.values());
    }

    private _currentScene: Scene | null = null;
    public get currentScene(): Scene | null {
        return this._currentScene;
    }

    private _nextSceneClass: SceneConstructor | null = null;

    public loadScene(sceneClass: SceneConstructor, clean?: boolean): void;
    public loadScene(sceneName: string, clean?: boolean): void;
    public loadScene(sceneClassOrName: SceneConstructor | string, clean?: boolean): void;
    public loadScene(sceneClassOrName: SceneConstructor | string, clean: boolean = false): void {
        const sceneClass =
            typeof sceneClassOrName === "string" ? SceneManager.getSceneClass(sceneClassOrName) : sceneClassOrName;
        if (!sceneClass || !(sceneClass.prototype as Scene | null)?.sceneName)
            return console.error(`Scene "${sceneClassOrName}" is not defined.`);

        this._nextSceneClass = sceneClass;

        if (clean) {
            timeSystem.removeAllTimers();
            clearAllTweens();
        }

        this._currentScene?.destroy();
    }

    /**
     * @internal
     */
    public createNextScene(): void {
        if (!this._nextSceneClass || this._currentScene) return;

        this._currentScene = new this._nextSceneClass();
        renderSystem.setRenderScene(this._currentScene.renderScene);

        if (this._currentScene.presetLayerNames) {
            this._currentScene.presetLayerNames.forEach((name) => {
                const layer = new Layer(name);
                this._currentScene?.addLayer(layer);
            });
        }

        this._currentScene["onInit"]();
        this._nextSceneClass = null;
    }

    /**
     * @internal
     */
    public clearDestroyedScene(): void {
        if (!this._currentScene?.destroyed) return;

        this._currentScene.destroyRenderer();
        this._currentScene = null;
    }
}
