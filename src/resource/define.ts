import type { SkeletonData } from "@esotericsoftware/spine-pixi-v8";
import type { Texture } from "pixi.js";
import type { Howl } from "howler";

export const RESOURCE_TYPE = {
    Texture: "texture",
    Audio: "audio",
    SpineSkeleton: "spine-skeleton",
    Text: "text",
    Json: "json",
    Binary: "binary",
} as const;
export type RESOURCE_TYPE = (typeof RESOURCE_TYPE)[keyof typeof RESOURCE_TYPE];

export interface ILoadResourceInfo<T extends RESOURCE_TYPE> {
    name: string;
    src: ResourceTypeSrcMap[T];
    options?: Partial<ResourceTypeOptionsMap[T]>;
}

export interface ResourceTypeSrcMap {
    [RESOURCE_TYPE.Texture]: string;
    [RESOURCE_TYPE.Audio]: string;
    [RESOURCE_TYPE.SpineSkeleton]: {
        skelSrc: string;
        atlasSrc: string;
        textureNames: string[];
    };
    [RESOURCE_TYPE.Text]: string;
    [RESOURCE_TYPE.Json]: string;
    [RESOURCE_TYPE.Binary]: string;
}

export const TEXTURE_SCALE_MODE = {
    Nearest: "nearest",
    Linear: "linear",
} as const;
export type TEXTURE_SCALE_MODE = (typeof TEXTURE_SCALE_MODE)[keyof typeof TEXTURE_SCALE_MODE];

export interface ResourceTypeOptionsMap {
    [RESOURCE_TYPE.Texture]: {
        scaleMode: TEXTURE_SCALE_MODE;
    };
    [RESOURCE_TYPE.Audio]: undefined;
    [RESOURCE_TYPE.SpineSkeleton]: undefined;
    [RESOURCE_TYPE.Text]: undefined;
    [RESOURCE_TYPE.Json]: undefined;
    [RESOURCE_TYPE.Binary]: undefined;
}

export interface ResourceTypeDataMap {
    [RESOURCE_TYPE.Texture]: Texture;
    [RESOURCE_TYPE.Audio]: Howl;
    [RESOURCE_TYPE.SpineSkeleton]: SkeletonData;
    [RESOURCE_TYPE.Text]: string;
    [RESOURCE_TYPE.Json]: Record<string, any>;
    [RESOURCE_TYPE.Binary]: Uint8Array;
}
