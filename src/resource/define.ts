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
    options?: ILoadResourceInfoOptions;
}

export interface ILoadResourceInfoOptions {
    /**
     * @type RESOURCE_TYPE.Texture
     */
    pixelStyle?: boolean;

    /**
     * @type RESOURCE_TYPE.SpineSkeleton
     */
    atlasSrc?: string;
    /**
     * @type RESOURCE_TYPE.SpineSkeleton
     */
    textureNames?: string[];
}

export type ILoadTargetTypeResourceInfo = Omit<ILoadResourceInfo, "type">;

export interface IUnloadResourceInfo {
    type: RESOURCE_TYPE;
    name: string;
}
