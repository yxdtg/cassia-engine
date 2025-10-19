import { defineComponent, Component } from "cassia-engine/component";
import type { ILastGlobalPointerEvent, IPointerEvent, IUIEvent } from "cassia-engine/input";
import { Node, NODE_EVENT_TYPE } from "cassia-engine/node";

@defineComponent({ componentName: "UIEvent", useEvents: ["PointerDown", "PointerUp", "LastGlobalPointerUp"] })
export class UIEvent extends Component {
    private _isPointerDown: boolean = false;
    private _lastPointerId: number = -1;

    private _doubleClickInterval: number = 0.5;
    private _doubleClickCount: number = 0;

    protected onPointerDown(event: IPointerEvent): void {
        this._isPointerDown = true;
        this._lastPointerId = event.pointerId;
    }

    protected onPointerUp(event: IPointerEvent): void {
        if (this._lastPointerId === event.pointerId && this._isPointerDown) {
            this._isPointerDown = false;
            this._lastPointerId = -1;

            const clickEvent: IUIEvent = {
                ...event,
                type: NODE_EVENT_TYPE.Click,
            };
            this.node.emit(clickEvent.type, clickEvent);

            this.removeAllTimers();

            this.addTimerOnce(() => {
                this._doubleClickCount = 0;
            }, this._doubleClickInterval);

            this._doubleClickCount++;
            if (this._doubleClickCount === 2) {
                this._doubleClickCount = 0;

                const doubleClickEvent: IUIEvent = {
                    ...event,
                    type: NODE_EVENT_TYPE.DoubleClick,
                };
                this.node.emit(doubleClickEvent.type, doubleClickEvent);
            }
        }
    }

    protected onLastGlobalPointerUp(event: ILastGlobalPointerEvent): void {
        this._isPointerDown = false;
        this._lastPointerId = -1;
    }
}
