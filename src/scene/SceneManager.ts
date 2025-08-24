import { renderSystem } from "cassia-engine";
import type { Scene, ISceneConstructor } from "./Scene";

export class SceneManager {
    private static _nameToSceneClassMap: Map<string, ISceneConstructor> = new Map();

    /**
     * @internal
     * @param sceneClass
     */
    public static defineScene(sceneClass: ISceneConstructor): void {
        const sceneClassPrototype = sceneClass.prototype as Scene;
        const sceneName = sceneClassPrototype.sceneName;

        this._nameToSceneClassMap.set(sceneName, sceneClass);
    }

    public static getSceneClass(sceneName: string): ISceneConstructor | null {
        return this._nameToSceneClassMap.get(sceneName) ?? null;
    }
    public static getSceneClasses(): ISceneConstructor[] {
        return Array.from(this._nameToSceneClassMap.values());
    }

    private _currentScene: Scene | null = null;
    public get currentScene(): Scene | null {
        return this._currentScene;
    }

    private _nextSceneClass: ISceneConstructor | null = null;

    public loadScene(sceneClass: ISceneConstructor): void;
    public loadScene(sceneName: string): void;
    public loadScene(sceneClassOrName: ISceneConstructor | string): void;
    public loadScene(sceneClassOrName: ISceneConstructor | string): void {
        const sceneClass =
            typeof sceneClassOrName === "string" ? SceneManager.getSceneClass(sceneClassOrName) : sceneClassOrName;
        if (!sceneClass || !(sceneClass.prototype as Scene | null)?.sceneName)
            return console.error(`Scene "${sceneClassOrName}" is not defined.`);
        this._nextSceneClass = sceneClass;

        this._currentScene?.destroyAllLayers();
    }

    /**
     * @internal
     */
    public createNextScene(): void {
        if (!this._nextSceneClass) return;

        const scene = new this._nextSceneClass();
        this._currentScene = scene;

        const renderScene = this._currentScene.renderScene;
        renderSystem.setRenderScene(renderScene);

        this._currentScene["onInit"]();

        this._nextSceneClass = null;
    }
}
