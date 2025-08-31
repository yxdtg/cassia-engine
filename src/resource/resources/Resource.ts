import type { ILoadResourceInfo, RESOURCE_TYPE } from "../define";

export class Resource<T = any> {
    private _resourceInfo: ILoadResourceInfo;
    public get resourceInfo(): ILoadResourceInfo {
        return this._resourceInfo;
    }

    public get name(): string {
        return this._resourceInfo.name;
    }
    public get type(): RESOURCE_TYPE {
        return this._resourceInfo.type;
    }
    public get src(): string {
        return this._resourceInfo.src;
    }
    public get options() {
        return this._resourceInfo.options;
    }

    private _data: T;
    public get data(): T {
        return this._data;
    }

    constructor(resourceInfo: ILoadResourceInfo, data: T) {
        this._resourceInfo = resourceInfo;
        this._data = data;

        this.onInit();
    }
    protected onInit(): void {}
}
