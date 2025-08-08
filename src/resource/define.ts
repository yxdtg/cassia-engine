import { Assets, Texture } from "pixi.js";
import { Howl } from "howler";

export interface ILoadResourceInfo {
    name: string;
    type: RESOURCE_TYPE;
    src: string;
}

export interface IUnloadResourceInfo {
    type: RESOURCE_TYPE;
    name: string;
}

export const RESOURCE_TYPE = {
    Texture: "texture",
} as const;
export type RESOURCE_TYPE = (typeof RESOURCE_TYPE)[keyof typeof RESOURCE_TYPE];

export async function loadTexture(url: string): Promise<Texture> {
    try {
        const texture = await Assets.load(url);
        return texture;
    } catch (e) {
        throw e;
    }
}
export async function unloadTexture(url: string): Promise<void> {
    try {
        await Assets.unload(url);
    } catch (e) {
        throw e;
    }
}

export function loadAudio(url: string): Promise<Howl> {
    return new Promise((resolve, reject) => {
        try {
            const audio = new Howl({
                src: [url],
            });
            audio.on("load", () => {
                resolve(audio);
            });
            audio.on("loaderror", (id, error) => {
                reject(error);
            });
        } catch (e) {
            reject(e);
        }
    });
}
