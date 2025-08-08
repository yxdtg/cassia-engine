import { renderSystem } from "cassia-engine";
import type { Scene, ISceneConstructor } from "./Scene";

export class SceneManager {
    private _scene: Scene | null = null;
    public get scene(): Scene | null {
        return this._scene;
    }

    public loadScene(sceneClass: ISceneConstructor): void {
        try {
            const scene = new sceneClass();

            const renderScene = scene.renderScene;
            renderSystem.setRenderScene(renderScene);

            this._scene = scene;
        } catch (e) {
            console.error(e);
        }
    }
}
