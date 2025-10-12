import { Engine } from "./engine";
import { isBottomInput, isMobile } from "./utils";

export const engine = new Engine();

export const renderSystem = engine.renderSystem;
export const resourceSystem = engine.resourceSystem;
export const audioSystem = engine.audioSystem;
export const inputSystem = engine.inputSystem;
export const physicsSystem = engine.physicsSystem;
export const timeSystem = engine.timeSystem;
export const storageSystem = engine.storageSystem;

export const sceneManager = engine.sceneManager;
export const nodeManager = engine.nodeManager;
export const componentManager = engine.componentManager;

export const IS_MOBILE = isMobile();
export const IS_BOTTOM_INPUT = isBottomInput();

export * from "./math";
export * from "./utils";
export * from "./tween";
export * from "./storage";

export * from "./engine";

export * from "./render";
export * from "./input";
export * from "./resource";
export * from "./audio";
export * from "./physics";
export * from "./time";

export * from "./scene";
export * from "./layer";
export * from "./node";
export * from "./component";

export * from "./prefab";
