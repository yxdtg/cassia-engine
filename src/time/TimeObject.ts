export class TimeObject {
    private _timerDatas: ITimerData[] = [];
    private _timerIdCount: number = 0;
    protected nextTimerId(): string {
        const id = this._timerIdCount++;
        return `id-${id}`;
    }

    public addTimer(
        callback: ITimerCallback,
        interval: number = 0,
        target: object | null = null,
        targetCount: number = -1
    ): string {
        const timerData: ITimerData = {
            id: this.nextTimerId(),

            callback: callback,
            target: target,

            currentTime: 0,
            interval: interval,

            currentCount: 0,
            targetCount: targetCount,
        };
        this._timerDatas.push(timerData);

        return timerData.id;
    }
    public addTimerOnce(callback: ITimerCallback, delay: number = 0, target: object | null = null): string {
        return this.addTimer(callback, delay, target, 1);
    }

    public removeTimer(callback: ITimerCallback, target: object | null): void;
    public removeTimer(id: string): void;
    public removeTimer(callbackOrId: ITimerCallback | string, target: object | null): void;
    public removeTimer(callbackOrId: ITimerCallback | string, target: object | null = null): void {
        const index =
            typeof callbackOrId === "function"
                ? this._timerDatas.findIndex(
                      (timerData) => timerData.callback === callbackOrId && timerData.target === target
                  )
                : this._timerDatas.findIndex((timerData) => timerData.id === callbackOrId);
        if (index === -1) return;
        this._timerDatas.splice(index, 1);
    }
    public removeAllTimers(): void {
        this._timerDatas.length = 0;
    }

    public updateAllTimers(dt: number): void {
        const removeTimerDatas: ITimerData[] = [];
        const timerDatas = [...this._timerDatas];

        timerDatas.forEach((timerData) => {
            timerData.currentTime += dt;

            if (timerData.currentTime >= timerData.interval) {
                timerData.currentTime -= timerData.interval;

                timerData.currentCount++;
                const isDone = timerData.currentCount === timerData.targetCount;
                if (isDone) {
                    removeTimerDatas.push(timerData);
                }

                const options: ITimerCallbackOptions = {
                    currentCount: timerData.currentCount,
                    targetCount: timerData.targetCount,
                    isDone: isDone,
                };
                if (timerData.target) {
                    timerData.callback.call(timerData.target, options);
                } else {
                    timerData.callback(options);
                }
            }
        });

        removeTimerDatas.forEach((timerData) => {
            const index = this._timerDatas.indexOf(timerData);
            if (index === -1) return;
            this._timerDatas.splice(index, 1);
        });
    }
}

export interface ITimerData {
    id: string;

    callback: ITimerCallback;
    target: object | null;

    currentTime: number;
    interval: number;

    currentCount: number;
    targetCount: number;
}

export type ITimerCallback = (options: ITimerCallbackOptions) => void;

export interface ITimerCallbackOptions {
    currentCount: number;
    targetCount: number;
    isDone: boolean;
}
