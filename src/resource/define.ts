import {
    AtlasAttachmentLoader,
    SkeletonBinary,
    SkeletonJson,
    SpineTexture,
    type SkeletonData,
    type SpineOptions,
    type TextureAtlas,
} from "@esotericsoftware/spine-pixi-v8";
import { Howl } from "howler";
import { Assets, Texture } from "pixi.js";
import { resourceSystem } from "cassia-engine";

export const RESOURCE_TYPE = {
    Texture: "texture",
    Audio: "audio",
    SpineSkeleton: "spine-skeleton",
} as const;
export type RESOURCE_TYPE = (typeof RESOURCE_TYPE)[keyof typeof RESOURCE_TYPE];

export interface ILoadResourceInfo {
    name: string;
    type: RESOURCE_TYPE;
    src: string;
    options?: {
        /**
         * type: "texture"
         */
        pixelStyle?: boolean;

        /**
         * type: "spine-skeleton"
         */
        atlasUrl?: string;
        /**
         * type: "spine-skeleton"
         */
        textureNames?: string[];
    };
}

export type ILoadTargetTypeResourceInfo = Omit<ILoadResourceInfo, "type">;

export interface IUnloadResourceInfo {
    type: RESOURCE_TYPE;
    name: string;
}

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

export async function unloadAudio(audio: Howl): Promise<void> {
    try {
        audio.unload();
    } catch (e) {
        throw e;
    }
}

export async function loadSpineSkeleton(
    skelUrl: string,
    atlasUrl: string,
    textureNames: string[]
): Promise<SkeletonData> {
    try {
        const skelData = await Assets.load(skelUrl);
        const atlasData = await Assets.load(atlasUrl);

        const textures: Texture[] = [];

        textureNames.forEach((textureName) => {
            const textureResource = resourceSystem.getTexture(textureName);
            if (textureResource) {
                textures.push(textureResource.data);
            }
        });

        const skeletonData = parseSkeletonData(skelData, atlasData, textures);
        return skeletonData;
    } catch (e) {
        throw e;
    }
}

export async function unloadSpineSkeleton(skelUrl: string, atlasUrl: string): Promise<void> {
    try {
        await Assets.unload(skelUrl);
        await Assets.unload(atlasUrl);
    } catch (e) {
        throw e;
    }
}

function parseSkeletonData(
    skelData: Uint8Array,
    atlasData: TextureAtlas,
    textures: Texture[],
    options?: SpineOptions
): SkeletonData {
    let skeleton: SkeletonData = null!;
    atlasData.pages.forEach((page, index) => {
        const texture = textures[index];
        if (texture) {
            const spineTexture = SpineTexture.from(texture.source);
            page.setTexture(spineTexture);
        } else {
            console.warn(`Texture for page ${page.name} not found in provided images.`);
        }
    });

    const attachmentLoader = new AtlasAttachmentLoader(atlasData);
    let parser =
        skelData instanceof Uint8Array ? new SkeletonBinary(attachmentLoader) : new SkeletonJson(attachmentLoader);

    parser.scale = (options?.scale as number) ?? 1;
    skeleton = parser.readSkeletonData(skelData);

    return skeleton;
}
