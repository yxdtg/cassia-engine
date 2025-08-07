import { Engine } from "./engine";

export const engine = new Engine();

export const renderSystem = engine.renderSystem;
export const resourceSystem = engine.resourceSystem;

export const sceneManager = engine.sceneManager;
export const nodeManager = engine.nodeManager;
export const componentManager = engine.componentManager;

export * from "./math";
export * from "./engine";
export * from "./input";
export * from "./resource";
export * from "./scene";
export * from "./node";
export * from "./component";
