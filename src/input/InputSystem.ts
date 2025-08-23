import { renderSystem, sceneManager } from "cassia-engine";
import { vec2, Vec2 } from "cassia-engine/math";
import { Node } from "cassia-engine/node";

/**
 * 原生指针事件
 */
export const NATIVE_POINTER_EVENT = {
    PointerDown: "pointerdown",
    PointerMove: "pointermove",
    PointerUp: "pointerup",
} as const;
export type NATIVE_POINTER_EVENT = (typeof NATIVE_POINTER_EVENT)[keyof typeof NATIVE_POINTER_EVENT];

export class InputSystem {
    /**
     * @internal
     */
    public init(): void {
        this._initPointerEvent();
        this._initKeyboardEvent();
    }

    private _pointerEvents: IPointerEvent[] = [];
    public get pointerEvents(): IPointerEvent[] {
        return this._pointerEvents;
    }

    private _globalPointerEvents: IGlobalPointerEvent[] = [];
    public get globalPointerEvents(): IGlobalPointerEvent[] {
        return this._globalPointerEvents;
    }

    private _isGlobalPointerDown: boolean = false;
    public get isGlobalPointerDown(): boolean {
        return this._isGlobalPointerDown;
    }

    private _isGlobalPointerMove: boolean = false;
    public get isGlobalPointerMove(): boolean {
        return this._isGlobalPointerMove;
    }

    private _isGlobalPointerUp: boolean = false;
    public get isGlobalPointerUp(): boolean {
        return this._isGlobalPointerUp;
    }

    private _initPointerEvent(): void {
        window.addEventListener("blur", () => {});

        for (const key in NATIVE_POINTER_EVENT) {
            const nativePointerEventName = NATIVE_POINTER_EVENT[key as keyof typeof NATIVE_POINTER_EVENT];
            window.addEventListener(nativePointerEventName, this._onNativePointerEvent.bind(this));
        }
    }
    private _onNativePointerEvent(event: PointerEvent): void {
        const canvasParent = renderSystem.canvasParent;

        if (event.type === NATIVE_POINTER_EVENT.PointerDown) {
            if (!isPointInElement(event.x, event.y, canvasParent)) return;
        }

        const clientX = event.clientX - canvasParent.getClientRects()[0].x;
        const clientY = event.clientY - canvasParent.getClientRects()[0].y;

        Object.defineProperty(event, "clientX", { value: clientX });
        Object.defineProperty(event, "clientY", { value: clientY });

        const eventPoint = this.getEventPointByNativeEvent(event);

        const pointerEventType = this._getPointerEventTypeByNativeEventType(event.type as NATIVE_POINTER_EVENT);
        const globalPointerEventType = this._getGlobalPointerEventTypeByNativeEventType(
            event.type as NATIVE_POINTER_EVENT
        );

        const hitNode = this.getHitNode(eventPoint.screenPoint);

        const globalPointerEvent: IGlobalPointerEvent = {
            pointerId: event.pointerId,
            type: globalPointerEventType,
            target: hitNode,

            ...eventPoint,

            button: event.button,

            source: event,
        };
        this._globalPointerEvents.push(globalPointerEvent);

        if (globalPointerEvent.type === GLOBAL_POINTER_EVENT_TYPE.GlobalPointerDown) {
            this._isGlobalPointerDown = true;
        } else {
            if (globalPointerEvent.type === GLOBAL_POINTER_EVENT_TYPE.GlobalPointerMove) {
                this._isGlobalPointerMove = true;
            } else {
                if (globalPointerEvent.type === GLOBAL_POINTER_EVENT_TYPE.GlobalPointerUp) {
                    this._isGlobalPointerUp = true;
                }
            }
        }

        if (hitNode) {
            const pointerEvent: IPointerEvent = {
                pointerId: event.pointerId,
                type: pointerEventType,
                target: hitNode,

                ...eventPoint,

                bubbling: true,
                stopPropagation: () => {
                    pointerEvent.bubbling = false;
                },

                button: event.button,

                source: event,
            };
            this._pointerEvents.push(pointerEvent);
        }
    }

    /**
     * @internal
     */
    public dispatchEvents(): void {
        const currentScene = sceneManager.currentScene;

        if (currentScene) {
            this._globalPointerEvents.forEach((globalPointerEvent) => {
                currentScene.layers.forEach((layer) => {
                    const layerFlatNodes = layer.getFlatNodes();
                    layerFlatNodes.forEach((node) => node.emit(globalPointerEvent.type, globalPointerEvent));
                });
            });
        }
        this._globalPointerEvents.length = 0;

        this._pointerEvents.forEach((pointerEvent) => {
            if (pointerEvent.target) {
                pointerEvent.target.dispatchPointerEvent(pointerEvent);
            }
        });
        this._pointerEvents.length = 0;
    }

    private _getPointerEventTypeByNativeEventType(nativePointerEvent: NATIVE_POINTER_EVENT): POINTER_EVENT_TYPE {
        if (nativePointerEvent === NATIVE_POINTER_EVENT.PointerDown) return POINTER_EVENT_TYPE.PointerDown;
        if (nativePointerEvent === NATIVE_POINTER_EVENT.PointerMove) return POINTER_EVENT_TYPE.PointerMove;
        if (nativePointerEvent === NATIVE_POINTER_EVENT.PointerUp) return POINTER_EVENT_TYPE.PointerUp;
        throw new Error(`${nativePointerEvent} unknown native pointer event`);
    }
    private _getGlobalPointerEventTypeByNativeEventType(
        nativePointerEvent: NATIVE_POINTER_EVENT
    ): GLOBAL_POINTER_EVENT_TYPE {
        if (nativePointerEvent === NATIVE_POINTER_EVENT.PointerDown) return GLOBAL_POINTER_EVENT_TYPE.GlobalPointerDown;
        if (nativePointerEvent === NATIVE_POINTER_EVENT.PointerMove) return GLOBAL_POINTER_EVENT_TYPE.GlobalPointerMove;
        if (nativePointerEvent === NATIVE_POINTER_EVENT.PointerUp) return GLOBAL_POINTER_EVENT_TYPE.GlobalPointerUp;
        throw new Error(`${nativePointerEvent} unknown native pointer event`);
    }

    private _keyboardCodeDownSet: Set<KEYBOARD_CODE> = new Set();
    private _keyboardCodeHoldSet: Set<KEYBOARD_CODE> = new Set();
    private _keyboardCodeUpSet: Set<KEYBOARD_CODE> = new Set();

    public isKeyboardDown(code: KEYBOARD_CODE): boolean {
        return this._keyboardCodeDownSet.has(code);
    }
    public isKeyboardHold(code: KEYBOARD_CODE): boolean {
        return this._keyboardCodeHoldSet.has(code);
    }
    public isKeyboardUp(code: KEYBOARD_CODE): boolean {
        return this._keyboardCodeUpSet.has(code);
    }

    private _initKeyboardEvent(): void {
        window.addEventListener("blur", () => {
            this._keyboardCodeHoldSet.clear();
        });

        window.addEventListener("keydown", (event: KeyboardEvent) => {
            const code = event.code as any;

            if (event.repeat) return;

            if (!this._keyboardCodeDownSet.has(code)) {
                this._keyboardCodeDownSet.add(code);
            }

            if (!this._keyboardCodeHoldSet.has(code)) {
                this._keyboardCodeHoldSet.add(code);
            }
        });

        window.addEventListener("keyup", (event: KeyboardEvent) => {
            const code = event.code as any;

            if (this._keyboardCodeHoldSet.has(code)) {
                this._keyboardCodeHoldSet.delete(code);
            }

            if (!this._keyboardCodeUpSet.has(code)) {
                this._keyboardCodeUpSet.add(code);
            }
        });
    }

    /**
     * @internal
     */
    public clearCache(): void {
        this._isGlobalPointerDown = false;
        this._isGlobalPointerMove = false;
        this._isGlobalPointerUp = false;

        this._keyboardCodeDownSet.clear();
        this._keyboardCodeUpSet.clear();
    }

    public getHitNode(screenPoint: Vec2): Node | null {
        return this.getHitNodes(screenPoint).at(-1) ?? null;
    }
    public getHitNodes(screenPoint: Vec2): Node[] {
        const currentScene = sceneManager.currentScene;
        if (!currentScene) return [];

        const addToHitNodes = (node: Node, layerPoint: Vec2, hitNodes: Node[]): void => {
            if (!node.active) return;

            if (node.interactive && node.hitTest(layerPoint)) {
                hitNodes.push(node);
            }

            node.children.forEach((child) => addToHitNodes(child, layerPoint, hitNodes));
        };

        const hitNodes: Node[] = [];

        currentScene.layers.forEach((layer) => {
            layer.nodes.forEach((node) => {
                const layerPoint = node.currentLayer?.screenToLayer(screenPoint);
                if (!layerPoint) return;

                addToHitNodes(node, layerPoint, hitNodes);
            });
        });

        return hitNodes;
    }

    /**
     * @internal
     * @param event
     * @returns
     */
    public getEventPointByNativeEvent(event: PointerEvent): IEventPoint {
        const screenPointer = this.getScreenPointByNativeEvent(event);

        const eventPoint: IEventPoint = {
            screenPoint: screenPointer,
            screenX: screenPointer.x,
            screenY: screenPointer.y,
        };
        return eventPoint;
    }

    /**
     * @internal
     * @param event
     * @returns
     */
    public getScreenPointByNativeEvent(event: PointerEvent): Vec2 {
        return vec2(event.clientX, event.clientY);
    }
}

export const POINTER_EVENT_TYPE = {
    PointerDown: "pointer-down",
    PointerMove: "pointer-move",
    PointerUp: "pointer-up",
} as const;
export type POINTER_EVENT_TYPE = (typeof POINTER_EVENT_TYPE)[keyof typeof POINTER_EVENT_TYPE];

export const GLOBAL_POINTER_EVENT_TYPE = {
    GlobalPointerDown: "global-pointer-down",
    GlobalPointerMove: "global-pointer-move",
    GlobalPointerUp: "global-pointer-up",
} as const;
export type GLOBAL_POINTER_EVENT_TYPE = (typeof GLOBAL_POINTER_EVENT_TYPE)[keyof typeof GLOBAL_POINTER_EVENT_TYPE];

export interface IEventPoint {
    screenPoint: Vec2;
    screenX: number;
    screenY: number;

    // worldPoint: Vec2;
    // worldX: number;
    // worldY: number;
}

export interface IPointerEvent extends IEventPoint {
    pointerId: number;
    type: POINTER_EVENT_TYPE;
    target: Node;

    bubbling: boolean;
    stopPropagation: () => void;

    button: MOUSE_BUTTON | number;

    source: PointerEvent;
}

export interface IGlobalPointerEvent extends IEventPoint {
    pointerId: number;
    type: GLOBAL_POINTER_EVENT_TYPE;
    target: Node | null;

    button: MOUSE_BUTTON | number;

    source: PointerEvent;
}

/**
 * 鼠标按键枚举
 */
export const MOUSE_BUTTON = {
    /**
     * 左键
     */
    Left: 0,
    /**
     * 中键
     */
    Middle: 1,
    /**
     * 右键
     */
    Right: 2,
} as const;
export type MOUSE_BUTTON = (typeof MOUSE_BUTTON)[keyof typeof MOUSE_BUTTON];

/**
 * 键盘码枚举
 */
export const KEYBOARD_CODE = {
    // 字母键
    KeyA: "KeyA",
    KeyB: "KeyB",
    KeyC: "KeyC",
    KeyD: "KeyD",
    KeyE: "KeyE",
    KeyF: "KeyF",
    KeyG: "KeyG",
    KeyH: "KeyH",
    KeyI: "KeyI",
    KeyJ: "KeyJ",
    KeyK: "KeyK",
    KeyL: "KeyL",
    KeyM: "KeyM",
    KeyN: "KeyN",
    KeyO: "KeyO",
    KeyP: "KeyP",
    KeyQ: "KeyQ",
    KeyR: "KeyR",
    KeyS: "KeyS",
    KeyT: "KeyT",
    KeyU: "KeyU",
    KeyV: "KeyV",
    KeyW: "KeyW",
    KeyX: "KeyX",
    KeyY: "KeyY",
    KeyZ: "KeyZ",

    // 数字键
    Digit0: "Digit0",
    Digit1: "Digit1",
    Digit2: "Digit2",
    Digit3: "Digit3",
    Digit4: "Digit4",
    Digit5: "Digit5",
    Digit6: "Digit6",
    Digit7: "Digit7",
    Digit8: "Digit8",
    Digit9: "Digit9",

    // 功能键
    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    F10: "F10",
    F11: "F11",
    F12: "F12",

    // 控制键
    Backspace: "Backspace",
    Tab: "Tab",
    Enter: "Enter",
    ShiftLeft: "ShiftLeft",
    ShiftRight: "ShiftRight",
    ControlLeft: "ControlLeft",
    ControlRight: "ControlRight",
    AltLeft: "AltLeft",
    AltRight: "AltRight",
    MetaLeft: "MetaLeft",
    MetaRight: "MetaRight",
    CapsLock: "CapsLock",
    Escape: "Escape",
    Space: "Space",
    PageUp: "PageUp",
    PageDown: "PageDown",
    End: "End",
    Home: "Home",
    ArrowLeft: "ArrowLeft",
    ArrowUp: "ArrowUp",
    ArrowRight: "ArrowRight",
    ArrowDown: "ArrowDown",
    PrintScreen: "PrintScreen",
    ScrollLock: "ScrollLock",
    Pause: "Pause",

    // 小键盘键
    Numpad0: "Numpad0",
    Numpad1: "Numpad1",
    Numpad2: "Numpad2",
    Numpad3: "Numpad3",
    Numpad4: "Numpad4",
    Numpad5: "Numpad5",
    Numpad6: "Numpad6",
    Numpad7: "Numpad7",
    Numpad8: "Numpad8",
    Numpad9: "Numpad9",
    NumpadMultiply: "NumpadMultiply",
    NumpadAdd: "NumpadAdd",
    NumpadSubtract: "NumpadSubtract",
    NumpadDecimal: "NumpadDecimal",
    NumpadDivide: "NumpadDivide",
    NumpadEnter: "NumpadEnter",

    // 其他键
    Insert: "Insert",
    Delete: "Delete",
    ContextMenu: "ContextMenu",
    NumLock: "NumLock",
    AudioVolumeMute: "AudioVolumeMute",
    AudioVolumeDown: "AudioVolumeDown",
    AudioVolumeUp: "AudioVolumeUp",
    MediaTrackNext: "MediaTrackNext",
    MediaTrackPrevious: "MediaTrackPrevious",
    MediaStop: "MediaStop",
    MediaPlayPause: "MediaPlayPause",
    Semicolon: "Semicolon",
    Equal: "Equal",
    Comma: "Comma",
    Minus: "Minus",
    Period: "Period",
    Slash: "Slash",
    Backquote: "Backquote",
    BracketLeft: "BracketLeft",
    Backslash: "Backslash",
    BracketRight: "BracketRight",
    Quote: "Quote",
} as const;
export type KEYBOARD_CODE = (typeof KEYBOARD_CODE)[keyof typeof KEYBOARD_CODE];

/**
 * 注意如果是event 则必须要 event.x 和 event.y 而不是 event.clientX 和 event.clientY 特别注意
 * @param x 如果是event 必须要event.x
 * @param y 如果是event 必须要event.y
 * @param element
 * @returns
 */
export function isPointInElement(x: number, y: number, element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
        x >= rect.left + window.scrollX &&
        x <= rect.right + window.scrollX &&
        y >= rect.top + window.scrollY &&
        y <= rect.bottom + window.scrollY
    );
}
