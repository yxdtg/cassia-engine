import type { ISceneConstructor } from "./define";
import type { Scene } from "./Scene";

export class SceneManager {
    private _scene: Scene | null = null;
    public get scene(): Scene | null {
        return this._scene;
    }

    public loadScene(sceneClass: ISceneConstructor): void {
        try {
            const scene = new sceneClass();
            this._scene = scene;
        } catch (e) {
            console.error(e);
        }
    }
}
