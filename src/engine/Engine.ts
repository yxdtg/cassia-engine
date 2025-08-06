import { ResourceManager } from "cassia-engine/resource";
import { SceneManager } from "cassia-engine/scene";

export class Engine {
    private _resourceManager: ResourceManager;
    public get resourceManager(): ResourceManager {
        return this._resourceManager;
    }

    private _sceneManager: SceneManager;
    public get sceneManager(): SceneManager {
        return this._sceneManager;
    }

    constructor() {
        this._resourceManager = new ResourceManager();
        this._sceneManager = new SceneManager();
    }

    private _started: boolean = false;
    public async start(): Promise<void> {}
}
