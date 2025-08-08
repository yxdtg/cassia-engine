import {
    type ILoadResourceInfo,
    type IUnloadResourceInfo,
    loadAudio,
    loadTexture,
    RESOURCE_TYPE,
    unloadAudio,
    unloadTexture,
} from "./define";
import { AudioResource, Resource, TextureResource } from "./resources";

export class ResourceSystem {
    constructor() {}

    private _typeToNameToResourceMap: Map<RESOURCE_TYPE, Map<string, Resource>> = new Map();

    public async loadResource(loadResourceInfo: ILoadResourceInfo): Promise<void> {
        try {
            const { name, type, src } = loadResourceInfo;

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
                        unloadAudio(resource.data);
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

    public getResource<T extends RESOURCE_TYPE>(type: T, name: string): IResourceTypeMap[T] | null {
        return (this._typeToNameToResourceMap.get(type)?.get(name) as IResourceTypeMap[T]) ?? null;
    }
    public getTextureResource(name: string): TextureResource | null {
        return this.getResource(RESOURCE_TYPE.Texture, name);
    }
    public getAudioResource(name: string): AudioResource | null {
        return this.getResource(RESOURCE_TYPE.Audio, name);
    }
}

interface IResourceTypeMap {
    [RESOURCE_TYPE.Texture]: TextureResource;
    [RESOURCE_TYPE.Audio]: AudioResource;
}
