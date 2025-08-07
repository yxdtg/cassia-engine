/**
 * 事件信息接口
 */
export interface IEventInfo<M> {
    type: keyof M;
    callback: M[keyof M];
    target?: any;
}

/**
 * 事件对象类
 */
export class EventObject<M extends Record<keyof M, any> = any> {
    private _eventsMap: Map<keyof M, IEventInfo<M>[]> = new Map();
    /**
     * 注册事件
     * @param type 事件类型
     * @param callback 事件回调函数
     * @param target 上下文目标
     */
    public on<T extends keyof M>(type: T, callback: M[T], target: any = null): void {
        const event: IEventInfo<M> = {
            type: type,
            callback: callback,
            target: target,
        };

        const events = this._eventsMap.get(type);
        if (events) {
            events.push(event);
        } else {
            this._eventsMap.set(type, [event]);
        }
    }

    /**
     * 注销事件
     * @param type 事件类型
     * @param callback 事件回调函数
     * @param target 上下文目标
     */
    public off<T extends keyof M>(type: T, callback: M[T], target: any = null): void {
        const events = this._eventsMap.get(type);
        if (!events) return;

        const index = events.findIndex((event) => event.callback === callback && event.target === target);
        if (index !== -1) events.splice(index, 1);
    }

    /**
     * 发射事件
     * @param type 事件类型
     * @param data 参数 可多个
     */
    public emit<T extends keyof M>(type: T, ...data: Parameters<M[T]>): void {
        const events = this._eventsMap.get(type);
        if (!events) return;

        for (const event of events) {
            if (event.target) {
                event.callback.call(event.target, ...data);
            } else {
                event.callback(...data);
            }
        }
    }

    /**
     * 获取指定事件类型的所有事件
     * @param type 事件类型
     * @returns 所有事件
     */
    public getEvents(type: keyof M): IEventInfo<M>[] {
        return this._eventsMap.get(type) ?? [];
    }
}
