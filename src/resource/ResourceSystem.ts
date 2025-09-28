import {
    AtlasAttachmentLoader,
    SkeletonBinary,
    SkeletonJson,
    SpineTexture,
    type SkeletonData,
    type SpineOptions,
    type TextureAtlas,
} from "@esotericsoftware/spine-pixi-v8";
import { resourceSystem } from "cassia-engine";
import { Howl } from "howler";
import { Assets, Texture } from "pixi.js";
import {
    RESOURCE_TYPE,
    type ILoadResourceInfo,
    type ILoadResourceInfoOptions,
    type ILoadTargetTypeResourceInfo,
    type IUnloadResourceInfo,
} from "./define";
import { AudioResource, Resource, SpineSkeletonResource, TextureResource } from "./resources";

export class ResourceSystem {
    constructor() {}

    private _typeToNameToResourceMap: Map<RESOURCE_TYPE, Map<string, Resource>> = new Map();

    public async loadResource(loadResourceInfo: ILoadResourceInfo): Promise<void> {
        try {
            const { name, type, src, options } = loadResourceInfo;

            const fnMap = {
                [RESOURCE_TYPE.Texture]: async (): Promise<TextureResource> => {
                    try {
                        const texture = await loadTexture(src);
                        const resource = new TextureResource(loadResourceInfo, texture);
                        return resource;
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.Audio]: async (): Promise<AudioResource> => {
                    try {
                        const audio = await loadAudio(src);
                        const resource = new AudioResource(loadResourceInfo, audio);
                        return resource;
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.SpineSkeleton]: async (): Promise<SpineSkeletonResource> => {
                    try {
                        const atlasSrc = options?.atlasSrc;
                        const textureNames = options?.textureNames;
                        if (!atlasSrc || !textureNames || textureNames.length === 0)
                            throw new Error("Invalid options for SpineSkeletonResource");

                        const spineSkeleton = await loadSpineSkeleton(src, atlasSrc, textureNames);
                        const resource = new SpineSkeletonResource(loadResourceInfo, spineSkeleton);
                        return resource;
                    } catch (e) {
                        throw e;
                    }
                },
            } as const;

            if (fnMap[type]) {
                const resource = await fnMap[type]();

                const nameToResourceMap = this._typeToNameToResourceMap.get(type);
                if (nameToResourceMap) {
                    nameToResourceMap.set(name, resource);
                } else {
                    const newNameToResourceMap = new Map();
                    newNameToResourceMap.set(name, resource);

                    this._typeToNameToResourceMap.set(type, newNameToResourceMap);
                }
            } else {
                console.error(`Unsupported resource type: ${type}`);
            }
        } catch (e) {
            throw e;
        }
    }
    public async loadResources(loadResourceInfos: ILoadResourceInfo[]): Promise<void> {
        try {
            for (const loadResourceInfo of loadResourceInfos) {
                await this.loadResource(loadResourceInfo);
            }
        } catch (e) {
            throw e;
        }
    }

    public async loadTypeResources(
        type: RESOURCE_TYPE,
        loadTargetTypeResourceInfos: ILoadTargetTypeResourceInfo[],
        options: ILoadResourceInfoOptions = {}
    ): Promise<void> {
        try {
            const loadResourceInfos = loadTargetTypeResourceInfos.map((loadTargetTypeResourceInfo) => {
                const { options: loadTargetTypeResourceInfoOptions, ...loadTargetTypeResourceInfoArgs } =
                    loadTargetTypeResourceInfo;

                const loadResourceInfo: ILoadResourceInfo = {
                    type: type,
                    options: {
                        ...options,
                        ...loadTargetTypeResourceInfoOptions,
                    },
                    ...loadTargetTypeResourceInfoArgs,
                };
                return loadResourceInfo;
            });

            await this.loadResources(loadResourceInfos);
        } catch (e) {
            throw e;
        }
    }

    public async loadTextures(
        loadTextureResourceInfos: ILoadTargetTypeResourceInfo[],
        options: ILoadResourceInfoOptions = {}
    ): Promise<void> {
        try {
            await this.loadTypeResources(RESOURCE_TYPE.Texture, loadTextureResourceInfos, options);
        } catch (e) {
            throw e;
        }
    }

    public async loadAudios(
        loadAudioResourceInfos: ILoadTargetTypeResourceInfo[],
        options: ILoadResourceInfoOptions = {}
    ): Promise<void> {
        try {
            await this.loadTypeResources(RESOURCE_TYPE.Audio, loadAudioResourceInfos, options);
        } catch (e) {
            throw e;
        }
    }

    public async loadSpineSkeletons(
        loadSpineSkeletonResourceInfos: ILoadTargetTypeResourceInfo[],
        options: ILoadResourceInfoOptions = {}
    ): Promise<void> {
        try {
            await this.loadTypeResources(RESOURCE_TYPE.SpineSkeleton, loadSpineSkeletonResourceInfos, options);
        } catch (e) {
            throw e;
        }
    }

    public async unloadResource(unloadResourceInfo: IUnloadResourceInfo): Promise<void> {
        try {
            const { name, type } = unloadResourceInfo;

            const nameToResourceMap = this._typeToNameToResourceMap.get(type);
            if (!nameToResourceMap) return;

            const resource = nameToResourceMap.get(name);
            if (!resource) return;

            const fnMap = {
                [RESOURCE_TYPE.Texture]: async (): Promise<void> => {
                    try {
                        await unloadTexture(resource.src);
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.Audio]: async (): Promise<void> => {
                    try {
                        await unloadAudio(resource.data);
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.SpineSkeleton]: async (): Promise<void> => {
                    try {
                        await unloadSpineSkeleton(resource.src, resource.options!.atlasSrc!);
                    } catch (e) {
                        throw e;
                    }
                },
            } as const;

            if (fnMap[type]) {
                await fnMap[type]();

                nameToResourceMap.delete(name);
            } else {
                console.error(`Unsupported resource type: ${type}`);
            }
        } catch (e) {
            throw e;
        }
    }

    public async unloadResources(unloadResourceInfos: IUnloadResourceInfo[]): Promise<void> {
        try {
            for (const unloadResourceInfo of unloadResourceInfos) {
                await this.unloadResource(unloadResourceInfo);
            }
        } catch (e) {
            throw e;
        }
    }

    public async unloadTypeResources(type: RESOURCE_TYPE, names: string[]): Promise<void> {
        try {
            const unloadResourceInfos = names.map((name) => {
                const unloadResourceInfo: IUnloadResourceInfo = {
                    type: type,
                    name: name,
                };
                return unloadResourceInfo;
            });

            await this.unloadResources(unloadResourceInfos);
        } catch (e) {
            throw e;
        }
    }

    public async unloadTextures(names: string[]): Promise<void> {
        try {
            await this.unloadTypeResources(RESOURCE_TYPE.Texture, names);
        } catch (e) {
            throw e;
        }
    }

    public async unloadAudios(names: string[]): Promise<void> {
        try {
            await this.unloadTypeResources(RESOURCE_TYPE.Audio, names);
        } catch (e) {
            throw e;
        }
    }

    public async unloadSpineSkeletons(names: string[]): Promise<void> {
        try {
            await this.unloadTypeResources(RESOURCE_TYPE.SpineSkeleton, names);
        } catch (e) {
            throw e;
        }
    }

    public getResource<T extends RESOURCE_TYPE>(type: T, name: string): IResourceTypeMap[T] | null {
        return (this._typeToNameToResourceMap.get(type)?.get(name) as IResourceTypeMap[T]) ?? null;
    }

    public getTexture(name: string): TextureResource | null {
        return this.getResource(RESOURCE_TYPE.Texture, name);
    }

    public getAudio(name: string): AudioResource | null {
        return this.getResource(RESOURCE_TYPE.Audio, name);
    }

    public getSpineSkeleton(name: string): SpineSkeletonResource | null {
        return this.getResource(RESOURCE_TYPE.SpineSkeleton, name);
    }

    public getTypeAllResources<T extends RESOURCE_TYPE>(type: T): IResourceTypeMap[T][] {
        const nameToResourceMap = this._typeToNameToResourceMap.get(type);
        if (!nameToResourceMap) return [];

        return Array.from(nameToResourceMap.values()) as IResourceTypeMap[T][];
    }

    public getAllTextures(): TextureResource[] {
        return this.getTypeAllResources(RESOURCE_TYPE.Texture);
    }

    public getAllAudios(): AudioResource[] {
        return this.getTypeAllResources(RESOURCE_TYPE.Audio);
    }

    public getAllSpineSkeletons(): SpineSkeletonResource[] {
        return this.getTypeAllResources(RESOURCE_TYPE.SpineSkeleton);
    }
}

interface IResourceTypeMap {
    [RESOURCE_TYPE.Texture]: TextureResource;
    [RESOURCE_TYPE.Audio]: AudioResource;
    [RESOURCE_TYPE.SpineSkeleton]: SpineSkeletonResource;
}

async function loadTexture(url: string): Promise<Texture> {
    try {
        const texture = await Assets.load(url);
        return texture;
    } catch (e) {
        throw e;
    }
}

async function unloadTexture(url: string): Promise<void> {
    try {
        await Assets.unload(url);
    } catch (e) {
        throw e;
    }
}

function loadAudio(url: string): Promise<Howl> {
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

async function unloadAudio(audio: Howl): Promise<void> {
    try {
        audio.unload();
    } catch (e) {
        throw e;
    }
}

async function loadSpineSkeleton(skelUrl: string, atlasUrl: string, textureNames: string[]): Promise<SkeletonData> {
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

async function unloadSpineSkeleton(skelUrl: string, atlasUrl: string): Promise<void> {
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
