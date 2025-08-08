export class TimeSystem {
    private _timers: ITimerInfo[] = [];

    public addTimer(callback: ITimerCallback, intervalTime: number = 0, options: Partial<IAddTimerOptions> = {}): void {
        const targetCount = options.targetCount ?? -1;
        const firstDelay = options.firstDelay ?? 0;
        const target = options.target ?? null;

        const timer: ITimerInfo = {
            callback: callback,
            target: target,

            intervalTime: intervalTime,
            currentTime: 0,

            targetCount: targetCount,
            currentCount: 0,

            firstDelay: firstDelay,
            isFirst: true,
        };
        this._timers.push(timer);
    }

    public addTimerOnce(callback: ITimerCallback, delay: number = 0, target: any = null): void {
        this.addTimer(callback, delay, { targetCount: 1, target: target });
    }

    public removeTimer(callback: Function, target: any = null): void {
        const index = this._timers.findIndex((timer) => timer.callback === callback && timer.target === target);
        if (index === -1) return;
        this._timers.splice(index, 1);
    }
    public removeTimers(): void {
        this._timers.length = 0;
    }

    public updateTimers(deltaTime: number): void {
        this._updateFrameTimers();

        const unremoveTimers: ITimerInfo[] = [];

        const timers = [...this._timers];
        timers.forEach((timer) => {
            timer.currentTime += deltaTime;

            let intervalTime = timer.intervalTime;
            if (timer.isFirst) {
                timer.isFirst = false;
                intervalTime += timer.firstDelay;
            }

            if (timer.currentTime >= intervalTime) {
                timer.currentTime = 0;
                timer.currentCount++;

                const isDone = timer.currentCount === timer.targetCount;
                const options: IJzTimerCallbackOptions = {
                    currentCount: timer.currentCount,
                    targetCount: timer.targetCount,
                    isDone: isDone,
                };

                if (timer.target) {
                    timer.callback.call(timer.target, options);
                } else {
                    timer.callback(options);
                }

                if (isDone) {
                    unremoveTimers.push(timer);
                }
            }
        });

        unremoveTimers.forEach((timer) => {
            const index = this._timers.indexOf(timer);
            if (index === -1) return;

            this._timers.splice(index, 1);
        });
    }

    private _frameTimers: IFrameTimerInfo[] = [];
    public addFrameTimer(callback: () => void, frame: number = 1, target: any = null): void {
        const frameTimer: IFrameTimerInfo = {
            callback: callback,
            target: target,

            currentFrame: 0,
            targetFrame: frame,
        };
        this._frameTimers.push(frameTimer);
    }

    private _updateFrameTimers(): void {
        const unremoveFrameTimers: IFrameTimerInfo[] = [];

        const frameTimers = [...this._frameTimers];

        frameTimers.forEach((frameTimer) => {
            frameTimer.currentFrame++;
            if (frameTimer.currentFrame >= frameTimer.targetFrame) {
                unremoveFrameTimers.push(frameTimer);

                if (frameTimer.target) {
                    frameTimer.callback.call(frameTimer.target);
                } else {
                    frameTimer.callback();
                }
            }
        });

        unremoveFrameTimers.forEach((frameTimer) => {
            const index = this._frameTimers.indexOf(frameTimer);
            if (index === -1) return;

            this._frameTimers.splice(index, 1);
        });
    }
}

export interface IJzTimerCallbackOptions {
    /**
     * 当前是第几次执行
     */
    currentCount: number;
    /**
     * 目标次数 (总共需要执行的次数，-1为无限循环)
     */
    targetCount: number;
    /**
     * 是否已完成
     */
    isDone: boolean;
}

export interface IAddTimerOptions {
    targetCount: number;
    firstDelay: number;
    target: any;
}

/**
 * 计时器回调函数
 */
export type ITimerCallback = (options: IJzTimerCallbackOptions) => void;

/**
 * 计时器
 */
export interface ITimerInfo {
    callback: ITimerCallback;
    target?: any;

    intervalTime: number;
    currentTime: number;

    targetCount: number;
    currentCount: number;

    firstDelay: number;
    isFirst: boolean;
}

export interface IFrameTimerInfo {
    callback: () => void;
    target?: any;

    currentFrame: number;
    targetFrame: number;
}
