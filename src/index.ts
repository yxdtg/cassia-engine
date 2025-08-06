import { Engine } from "./engine";
import type { ResourceManager } from "./resource";
import type { SceneManager } from "./scene";

export const engine: Engine = new Engine();
export const resourceManager: ResourceManager = engine.resourceManager;
export const sceneManager: SceneManager = engine.sceneManager;

export * from "./math";
export * from "./engine";
export * from "./resource";
export * from "./scene";
export * from "./node";
