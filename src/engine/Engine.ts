import { AudioSystem } from "cassia-engine/audio";
import { ComponentManager } from "cassia-engine/component";
import { InputSystem } from "cassia-engine/input";
import { NodeManager } from "cassia-engine/node";
import { PhysicsSystem } from "cassia-engine/physics";
import { type IRenderSystemInitOptions, RenderSystem } from "cassia-engine/render";
import { ResourceSystem } from "cassia-engine/resource";
import { SceneManager } from "cassia-engine/scene";
import { StorageSystem } from "cassia-engine/storage";
import { TimeSystem } from "cassia-engine/time";
import { updateAllTweens } from "cassia-engine/tween";
import { msToSeconds } from "cassia-engine/utils";

export class Engine {
    private _storageSystem: StorageSystem;
    public get storageSystem(): StorageSystem {
        return this._storageSystem;
    }

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

    private _physicsSystem: PhysicsSystem;
    public get physicsSystem(): PhysicsSystem {
        return this._physicsSystem;
    }

    private _timeSystem: TimeSystem;
    public get timeSystem(): TimeSystem {
        return this._timeSystem;
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
        this._storageSystem = new StorageSystem();
        this._renderSystem = new RenderSystem();
        this._resourceSystem = new ResourceSystem();
        this._audioSystem = new AudioSystem();
        this._inputSystem = new InputSystem();
        this._physicsSystem = new PhysicsSystem();
        this._timeSystem = new TimeSystem();

        this._sceneManager = new SceneManager();
        this._nodeManager = new NodeManager();
        this._componentManager = new ComponentManager();
    }

    private _started: boolean = false;
    public get started(): boolean {
        return this._started;
    }

    private _now: number = 0;
    private _lastTime: number = 0;
    private _deltaTime: number = 0;
    /**
     * ms/毫秒
     */
    public get deltaTime(): number {
        return this._deltaTime;
    }
    /**
     * s/秒
     */
    public get dt(): number {
        return msToSeconds(this._deltaTime);
    }

    private _fixedTime: number = 0;

    private _fixedTimeStep: number = 1000 / 50;
    /**
     * ms/毫秒
     */
    public get fixedTimeStep(): number {
        return this._fixedTimeStep;
    }

    public async start(options: Partial<IEngineStartOptions> = {}): Promise<void> {
        if (this._started) return;
        this._started = true;

        try {
            this._storageSystem.init(options.storageId);

            await this._renderSystem.init({
                canvas: options.canvas,
                designSize: options.designSize,
                backgroundColor: options.backgroundColor,
            });

            this._inputSystem.init();

            if (options.enablePhysics) {
                await this._physicsSystem.init();
            }

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
        this._now = performance.now();
        this._deltaTime = this._now - this._lastTime;
        this._lastTime = this._now;

        this._sceneManager.createNextScene();

        this._timeSystem.updateAllTimers(this.dt);

        this._inputSystem.dispatchEvents();

        this._componentManager.callUpdateAllTimersComponents(this.dt);

        this._componentManager.callStartComponents();

        this._componentManager.callUpdateComponents(this.dt);

        {
            this._fixedTime += this._deltaTime;

            const count = Math.floor(this._fixedTime / this._fixedTimeStep);
            for (let i = 0; i < count; i++) {
                this._componentManager.callFixedUpdateComponents(this._fixedTimeStep);
            }

            this._fixedTime -= count * this._fixedTimeStep;
        }

        this._componentManager.callLateUpdateComponents(this.dt);

        updateAllTweens(this._now);

        this._physicsSystem.update();

        this._componentManager.clearDestroyedComponents();

        this._nodeManager.clearDestroyedNodes();

        this._sceneManager.currentScene?.clearDestroyedLayers();

        this._sceneManager.clearDestroyedScene();

        this._inputSystem.clearCache();

        this._renderSystem.render();
        this._renderSystem.clearDraw();

        requestAnimationFrame(this.update.bind(this));
    }
}

export interface IEngineStartOptions extends IRenderSystemInitOptions {
    storageId: string;

    enablePhysics: boolean;
}
