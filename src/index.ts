import { Engine } from "./engine";

export const engine = new Engine();

export const renderSystem = engine.renderSystem;
export const resourceSystem = engine.resourceSystem;
export const audioSystem = engine.audioSystem;
export const inputSystem = engine.inputSystem;
export const physicsSystem = engine.physicsSystem;

export const sceneManager = engine.sceneManager;
export const nodeManager = engine.nodeManager;
export const componentManager = engine.componentManager;

export * from "./math";
export * from "./utils";

export * from "./engine";

export * from "./input";
export * from "./resource";
export * from "./audio";
export * from "./physics";

export * from "./scene";
export * from "./node";
export * from "./component";
