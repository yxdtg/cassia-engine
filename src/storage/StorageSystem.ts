import { deserializationData, serializationData } from "cassia-engine/utils";

export class StorageSystem {
    private _id: string = "";
    public get id(): string {
        return this._id;
    }

    private _localData: Record<string, any> = {};
    public get localData(): Record<string, any> {
        return this._localData;
    }

    /**
     * @internal
     */
    public init(id?: string): void {
        this._id = id ?? "cassia-engine-storage";

        const item = this._readLocal();
        if (item) {
            try {
                this._localData = deserializationData(item);
                if (typeof this._localData !== "object") {
                    this._localData = {};
                    this._saveLocal();
                }
            } catch (e) {
                this._localData = {};
                this._saveLocal();
            }
        } else {
            this._localData = {};
            this._saveLocal();
        }
    }
    private _readLocal(): string | null {
        return window.localStorage.getItem(this._id);
    }
    private _saveLocal(): void {
        window.localStorage.setItem(this._id, serializationData(this._localData));
    }

    public hasLocal(key: string): boolean {
        return key in this._localData;
    }

    public getLocal(key: string): any {
        return this._localData[key];
    }

    public setLocal(key: string, value: any): void {
        this._localData[key] = value;
        this._saveLocal();
    }

    public deleteLocal(key: string): void {
        delete this._localData[key];
        this._saveLocal();
    }

    public clearLocal(): void {
        this._localData = {};
        this._saveLocal();
    }
}
