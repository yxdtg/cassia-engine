import { Engine } from "./engine";
import type { RenderSystem } from "./render";
import type { ResourceManager } from "./resource";
import type { SceneManager } from "./scene";
import type { NodeManager } from "./node";
import type { ComponentManager } from "./component";

export const engine: Engine = new Engine();
export const renderSystem: RenderSystem = engine.renderSystem;
export const resourceManager: ResourceManager = engine.resourceManager;
export const sceneManager: SceneManager = engine.sceneManager;
export const nodeManager: NodeManager = engine.nodeManager;
export const componentManager: ComponentManager = engine.componentManager;

export * from "./math";
export * from "./engine";
export * from "./resource";
export * from "./scene";
export * from "./node";
export * from "./component";
