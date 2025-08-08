import { AudioSystem } from "cassia-engine/audio";
import { ComponentManager } from "cassia-engine/component";
import { InputSystem } from "cassia-engine/input";
import { NodeManager } from "cassia-engine/node";
import { RenderSystem } from "cassia-engine/render";
import { ResourceSystem } from "cassia-engine/resource";
import { SceneManager } from "cassia-engine/scene";

export class Engine {
    private _renderSystem: RenderSystem;
    public get renderSystem(): RenderSystem {
        return this._renderSystem;
    }

    private _resourceSystem: ResourceSystem;
    public get resourceSystem(): ResourceSystem {
        return this._resourceSystem;
    }

    private _audioSystem: AudioSystem;
    public get audioSystem(): AudioSystem {
        return this._audioSystem;
    }

    private _inputSystem: InputSystem;
    public get inputSystem(): InputSystem {
        return this._inputSystem;
    }

    private _sceneManager: SceneManager;
    public get sceneManager(): SceneManager {
        return this._sceneManager;
    }

    private _nodeManager: NodeManager;
    public get nodeManager(): NodeManager {
        return this._nodeManager;
    }

    private _componentManager: ComponentManager;
    public get componentManager(): ComponentManager {
        return this._componentManager;
    }

    constructor() {
        this._renderSystem = new RenderSystem();
        this._resourceSystem = new ResourceSystem();
        this._audioSystem = new AudioSystem();
        this._inputSystem = new InputSystem();

        this._sceneManager = new SceneManager();
        this._nodeManager = new NodeManager();
        this._componentManager = new ComponentManager();
    }

    private _started: boolean = false;
    public get started(): boolean {
        return this._started;
    }

    private _paused: boolean = false;
    public get paused(): boolean {
        return this._paused;
    }

    private _lastTime: number = 0;
    private _deltaTime: number = 0;
    public get deltaTime(): number {
        return this._deltaTime;
    }
    public get dt(): number {
        return this.deltaTime;
    }

    private _fixedTime: number = 0;

    private _fixedTimeStep: number = 1 / 50;
    public get fixedTimeStep(): number {
        return this._fixedTimeStep;
    }

    public async start(): Promise<void> {
        if (this._started) return;
        this._started = true;

        try {
            await this._renderSystem.init();
            this._inputSystem.init();

            this._lastTime = performance.now();
            requestAnimationFrame(this.update.bind(this));
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * @internal
     */
    public update(): void {
        if (!this._paused) {
            this._deltaTime = (performance.now() - this._lastTime) / 1000;
            this._lastTime = performance.now();

            this._componentManager.callStartComponents();

            this._componentManager.callUpdateComponents(this._deltaTime);

            {
                this._fixedTime += this._deltaTime;

                const count = Math.floor(this._fixedTime / this._fixedTimeStep);
                for (let i = 0; i < count; i++) {
                    this._componentManager.callFixedUpdateComponents(this._fixedTimeStep);
                }

                this._fixedTime -= count * this._fixedTimeStep;
            }

            this._componentManager.callLateUpdateComponents(this._deltaTime);

            this._componentManager.clearDestroyedComponents();

            this._nodeManager.clearDestroyedNodes();

            this._inputSystem.clearKeyboardCodeCache();
        }

        this._renderSystem.render();
        this._renderSystem.clearDraw();

        requestAnimationFrame(this.update.bind(this));
    }
}
