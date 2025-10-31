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
import { RESOURCE_TYPE, type ILoadResourceInfo, type ResourceTypeOptionsMap } from "./define";
import {
    AudioResource,
    Resource,
    SpineSkeletonResource,
    TextureResource,
    TextResource,
    JsonResource,
    BinaryResource,
} from "./resources";

export class ResourceSystem {
    private _typeToNameToResourceMap: Map<RESOURCE_TYPE, Map<string, Resource<any>>> = new Map();

    private async _loadResource<T extends RESOURCE_TYPE>(
        type: T,
        loadResourceInfo: ILoadResourceInfo<T>
    ): Promise<void> {
        try {
            const { name } = loadResourceInfo;

            const fnMap = {
                [RESOURCE_TYPE.Texture]: async (): Promise<TextureResource> => {
                    try {
                        const info = loadResourceInfo as ILoadResourceInfo<typeof RESOURCE_TYPE.Texture>;
                        const texture = await loadTexture(info.src);

                        const resource = new TextureResource(RESOURCE_TYPE.Texture, info, texture);
                        return resource;
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.Audio]: async (): Promise<AudioResource> => {
                    try {
                        const info = loadResourceInfo as ILoadResourceInfo<typeof RESOURCE_TYPE.Audio>;
                        const audio = await loadAudio(info.src);

                        const resource = new AudioResource(RESOURCE_TYPE.Audio, info, audio);
                        return resource;
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.SpineSkeleton]: async (): Promise<SpineSkeletonResource> => {
                    try {
                        const info = loadResourceInfo as ILoadResourceInfo<typeof RESOURCE_TYPE.SpineSkeleton>;
                        const spineSkeleton = await loadSpineSkeleton(
                            info.src.skelSrc,
                            info.src.atlasSrc,
                            info.src.textureNames
                        );

                        const resource = new SpineSkeletonResource(RESOURCE_TYPE.SpineSkeleton, info, spineSkeleton);
                        return resource;
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.Text]: async (): Promise<TextResource> => {
                    try {
                        const info = loadResourceInfo as ILoadResourceInfo<typeof RESOURCE_TYPE.Text>;
                        const text = await loadText(info.src);

                        const resource = new TextResource(RESOURCE_TYPE.Text, info, text);
                        return resource;
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.Json]: async (): Promise<JsonResource> => {
                    try {
                        const info = loadResourceInfo as ILoadResourceInfo<typeof RESOURCE_TYPE.Json>;
                        const json = await loadJson(info.src);

                        const resource = new JsonResource(RESOURCE_TYPE.Json, info, json);
                        return resource;
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.Binary]: async (): Promise<BinaryResource> => {
                    try {
                        const info = loadResourceInfo as ILoadResourceInfo<typeof RESOURCE_TYPE.Binary>;
                        const binary = await loadBinary(info.src);

                        const resource = new BinaryResource(RESOURCE_TYPE.Binary, info, binary);
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
    public async loadResources<T extends RESOURCE_TYPE>(
        type: T,
        loadResourceInfos: ILoadResourceInfo<T>[],
        options?: Partial<ResourceTypeOptionsMap[T]>
    ): Promise<void> {
        try {
            for (const loadResourceInfo of loadResourceInfos) {
                if (options) {
                    if (!loadResourceInfo.options) {
                        loadResourceInfo.options = {} as any;
                    }

                    const loadResourceInfoOptions = { ...loadResourceInfo.options };

                    loadResourceInfo.options = { ...options, ...loadResourceInfoOptions };
                }

                await this._loadResource(type, loadResourceInfo);
            }
        } catch (e) {
            throw e;
        }
    }

    private async _unloadResource<T extends RESOURCE_TYPE>(type: T, name: string): Promise<void> {
        try {
            const nameToResourceMap = this._typeToNameToResourceMap.get(type);
            if (!nameToResourceMap) return;

            const resource = nameToResourceMap.get(name);
            if (!resource) return;

            const fnMap = {
                [RESOURCE_TYPE.Texture]: async (): Promise<void> => {
                    try {
                        const src = (resource as TextureResource).src;
                        await unloadTexture(src);
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.Audio]: async (): Promise<void> => {
                    try {
                        const data = (resource as AudioResource).data;
                        await unloadAudio(data);
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.SpineSkeleton]: async (): Promise<void> => {
                    try {
                        const src = (resource as SpineSkeletonResource).src;
                        await unloadSpineSkeleton(src.skelSrc, src.atlasSrc);
                    } catch (e) {
                        throw e;
                    }
                },
                [RESOURCE_TYPE.Text]: async (): Promise<void> => {},
                [RESOURCE_TYPE.Json]: async (): Promise<void> => {},
                [RESOURCE_TYPE.Binary]: async (): Promise<void> => {},
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
    public async unloadResources<T extends RESOURCE_TYPE>(type: T, names: string[]): Promise<void> {
        try {
            for (const name of names) {
                await this._unloadResource(type, name);
            }
        } catch (e) {
            throw e;
        }
    }

    public getResource<T extends RESOURCE_TYPE>(type: T, name: string): ResourceTypeMap[T] | null {
        return (this._typeToNameToResourceMap.get(type)?.get(name) as ResourceTypeMap[T]) ?? null;
    }
    public getResources<T extends RESOURCE_TYPE>(type: T, names: string[]): ResourceTypeMap[T][] {
        const resources: ResourceTypeMap[T][] = [];

        names.forEach((name) => {
            const resource = this.getResource(type, name);
            if (resource) {
                resources.push(resource);
            }
        });

        return resources;
    }
    public getAllResources<T extends RESOURCE_TYPE>(type: T): ResourceTypeMap[T][] {
        const nameToResourceMap = this._typeToNameToResourceMap.get(type);
        if (!nameToResourceMap) return [];

        return Array.from(nameToResourceMap.values()) as ResourceTypeMap[T][];
    }
}

interface ResourceTypeMap {
    [RESOURCE_TYPE.Texture]: TextureResource;
    [RESOURCE_TYPE.Audio]: AudioResource;
    [RESOURCE_TYPE.SpineSkeleton]: SpineSkeletonResource;
    [RESOURCE_TYPE.Text]: TextResource;
    [RESOURCE_TYPE.Json]: JsonResource;
    [RESOURCE_TYPE.Binary]: BinaryResource;
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
            const textureResource = resourceSystem.getResource(RESOURCE_TYPE.Texture, textureName);
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

async function loadText(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const text = await response.text();
        return text;
    } catch (e) {
        throw e;
    }
}

async function loadJson(url: string): Promise<any> {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (e) {
        throw e;
    }
}

async function loadBinary(url: string): Promise<Uint8Array> {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        return data;
    } catch (e) {
        throw e;
    }
}
