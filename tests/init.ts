import { defineScene, engine, Scene } from "../dist/index";

export async function startEngine(): Promise<void> {
    await engine.start();
}

@defineScene({ sceneName: "TestScene" })
class TestScene extends Scene {}
