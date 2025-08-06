import type { Scene } from "./Scene";

export type ISceneConstructor = new (...args: any[]) => Scene;
