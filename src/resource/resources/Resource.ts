import type { ILoadResourceInfo, RESOURCE_TYPE, ResourceTypeDataMap } from "../define";

export class Resource<T extends RESOURCE_TYPE> {
    private _type: T;
    public get type() {
        return this._type;
    }

    private _resourceInfo: ILoadResourceInfo<T>;
    public get resourceInfo() {
        return this._resourceInfo;
    }

    public get name() {
        return this._resourceInfo.name;
    }
    public get src() {
        return this._resourceInfo.src;
    }
    public get options() {
        return this._resourceInfo.options;
    }

    private _data: ResourceTypeDataMap[T];
    public get data() {
        return this._data;
    }

    constructor(type: T, resourceInfo: ILoadResourceInfo<T>, data: ResourceTypeDataMap[T]) {
        this._type = type;
        this._resourceInfo = resourceInfo;
        this._data = data;

        this.onInit();
    }
    protected onInit(): void {}
}
