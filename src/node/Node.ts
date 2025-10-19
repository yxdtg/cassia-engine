import { componentManager, Layer, nodeManager, renderSystem, sceneManager } from "cassia-engine";
import {
    type ColliderComponent,
    type Component,
    ComponentManager,
    type IComponentConstructor,
    registerComponentOnUse,
} from "cassia-engine/component";
import { EventObject } from "cassia-engine/event";
import {
    GLOBAL_POINTER_EVENT_TYPE,
    type IGlobalPointerEvent,
    type ILastGlobalPointerEvent,
    type IPointerEvent,
    type IUIEvent,
    LAST_GLOBAL_POINTER_EVENT_TYPE,
    POINTER_EVENT_TYPE,
    UI_EVENT_TYPE,
} from "cassia-engine/input";
import { BooleanPair, Color, type IVec2, Mathf, Size, vec2, Vec2 } from "cassia-engine/math";
import { COLLISION_EVENT_TYPE } from "cassia-engine/physics";
import type { ITrackEntry } from "cassia-engine/render";
import { RenderNode } from "cassia-engine/render";
import type { Scene } from "cassia-engine/scene";
import { SPINE_ANIMATION_EVENT_TYPE } from "cassia-engine/spine";
import type { IWritablePropertiesOnly } from "cassia-engine/utils";

export const NODE_EVENT_TYPE = {
    ...POINTER_EVENT_TYPE,
    ...GLOBAL_POINTER_EVENT_TYPE,
    ...LAST_GLOBAL_POINTER_EVENT_TYPE,
    ...UI_EVENT_TYPE,
    ...COLLISION_EVENT_TYPE,
    ...SPINE_ANIMATION_EVENT_TYPE,
} as const;
export type NODE_EVENT_TYPE = (typeof NODE_EVENT_TYPE)[keyof typeof NODE_EVENT_TYPE];

interface INodeEventTypeMap {
    [NODE_EVENT_TYPE.PointerDown]: (event: IPointerEvent) => void;
    [NODE_EVENT_TYPE.PointerMove]: (event: IPointerEvent) => void;
    [NODE_EVENT_TYPE.PointerUp]: (event: IPointerEvent) => void;

    [NODE_EVENT_TYPE.GlobalPointerDown]: (event: IGlobalPointerEvent) => void;
    [NODE_EVENT_TYPE.GlobalPointerMove]: (event: IGlobalPointerEvent) => void;
    [NODE_EVENT_TYPE.GlobalPointerUp]: (event: IGlobalPointerEvent) => void;

    [NODE_EVENT_TYPE.LastGlobalPointerDown]: (event: ILastGlobalPointerEvent) => void;
    [NODE_EVENT_TYPE.LastGlobalPointerMove]: (event: ILastGlobalPointerEvent) => void;
    [NODE_EVENT_TYPE.LastGlobalPointerUp]: (event: ILastGlobalPointerEvent) => void;

    [NODE_EVENT_TYPE.Click]: (event: IUIEvent) => void;
    [NODE_EVENT_TYPE.DoubleClick]: (event: IUIEvent) => void;

    [NODE_EVENT_TYPE.CollisionEnter]: (selfCollider: ColliderComponent, otherCollider: ColliderComponent) => void;
    [NODE_EVENT_TYPE.CollisionExit]: (selfCollider: ColliderComponent, otherCollider: ColliderComponent) => void;

    [NODE_EVENT_TYPE.SpineAnimationStart]: (trackEntry: ITrackEntry, trackIndex: number, animationName: string) => void;
    [NODE_EVENT_TYPE.SpineAnimationEnd]: (trackEntry: ITrackEntry, trackIndex: number, animationName: string) => void;
    [NODE_EVENT_TYPE.SpineAnimationComplete]: (
        trackEntry: ITrackEntry,
        trackIndex: number,
        animationName: string
    ) => void;
}

export class Node extends EventObject<INodeEventTypeMap> {
    private _renderNode: RenderNode;
    /**
     * @internal
     */
    public get renderNode(): RenderNode {
        return this._renderNode;
    }

    constructor(options?: Partial<IWritablePropertiesOnly<Node>>) {
        super();

        this._renderNode = new RenderNode(this);

        if (options) {
            for (const key in options) {
                (this as any)[key] = (options as any)[key];
            }
        }

        this.applySize();
        this.applyColor();
    }

    /**
     * @internal
     */
    public physicsDirtyFlag: boolean = false;

    private _name: string = "";
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    private _active: boolean = true;
    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        const isChanged = this._active !== value;
        this._active = value;

        if (isChanged) {
            if (this._active) {
                for (const component of this._components) {
                    component["onEnable"]();
                }
            } else {
                for (const component of this._components) {
                    component["onDisable"]();
                }
            }
        }

        this.applyActive();
    }

    /**
     * @internal
     */
    public applyActive(): void {
        this._renderNode.applyActive();
    }

    private _interactive: boolean = true;
    public get interactive(): boolean {
        return this._interactive;
    }
    public set interactive(value: boolean) {
        this._interactive = value;
    }

    /*************************** position ***************************/
    private _position: Vec2 = Vec2.zero;
    public get position(): Vec2 {
        return this._position;
    }
    public set position(value: Vec2) {
        this._position.set(value);
        this.applyPosition();
    }

    public get x(): number {
        return this._position.x;
    }
    public set x(value: number) {
        this._position.x = value;
        this.applyPosition();
    }

    public get y(): number {
        return this._position.y;
    }
    public set y(value: number) {
        this._position.y = value;
        this.applyPosition();
    }

    public setPosition(vec2?: Vec2): void;
    public setPosition(x?: number, y?: number): void;
    public setPosition(vec2OrX?: Vec2 | number, y?: number): void;
    public setPosition(...args: any[]): void {
        this._position.set(...args);
        this.applyPosition();
    }

    /**
     * @internal
     */
    public applyPosition(): void {
        this._renderNode.applyPosition();

        this.physicsDirtyFlag = true;
    }

    /*************************** size ***************************/
    private _size: Size = Size.default;
    public get size(): Size {
        return this._size;
    }
    public set size(value: Size) {
        this._size.set(value);
        this.applySize();
    }

    public get width(): number {
        return this._size.width;
    }
    public set width(value: number) {
        this._size.width = value;
        this.applySize();
    }

    public get height(): number {
        return this._size.height;
    }
    public set height(value: number) {
        this._size.height = value;
        this.applySize();
    }

    public setSize(size?: Size): void;
    public setSize(width?: number, height?: number): void;
    public setSize(sizeOrWidth?: Size | number, height?: number): void;
    public setSize(...args: any[]): void {
        this._size.set(...args);
        this.applySize();
    }

    /**
     * @internal
     */
    public applySize(): void {
        this._renderNode.applySize();
        this.applyAnchor();
    }

    /*************************** scale ***************************/
    private _scale: Vec2 = Vec2.one;
    public get scale(): Vec2 {
        return this._scale;
    }
    public set scale(value: Vec2) {
        this._scale.set(value);
        this.applyScale();
    }

    public get scaleX(): number {
        return this._scale.x;
    }
    public set scaleX(value: number) {
        this._scale.x = value;
        this.applyScale();
    }

    public get scaleY(): number {
        return this._scale.y;
    }
    public set scaleY(value: number) {
        this._scale.y = value;
        this.applyScale();
    }

    public setScale(vec2?: Vec2): void;
    public setScale(x?: number, y?: number): void;
    public setScale(vec2OrX?: Vec2 | number, y?: number): void;
    public setScale(...args: any[]): void {
        this._scale.set(...args);
        this.applyScale();
    }

    /**
     * @internal
     */
    public applyScale(): void {
        this._renderNode.applyScale();
    }

    /*************************** anchor ***************************/
    private _anchor: Vec2 = Vec2.half;
    public get anchor(): Vec2 {
        return this._anchor;
    }
    public set anchor(value: Vec2) {
        this._anchor.set(value);
        this.applyAnchor();
    }

    public get anchorX(): number {
        return this._anchor.x;
    }
    public set anchorX(value: number) {
        this._anchor.x = value;
        this.applyAnchor();
    }

    public get anchorY(): number {
        return this._anchor.y;
    }
    public set anchorY(value: number) {
        this._anchor.y = value;
        this.applyAnchor();
    }

    public setAnchor(vec2?: Vec2): void;
    public setAnchor(x?: number, y?: number): void;
    public setAnchor(vec2OrX?: Vec2 | number, y?: number): void;
    public setAnchor(...args: any[]): void {
        this._anchor.set(...args);
        this.applyAnchor();
    }

    /**
     * @internal
     */
    public applyAnchor(): void {
        this._renderNode.applyAnchor();
    }

    /*************************** rotation ***************************/
    private _rotation: number = 0;
    public get rotation(): number {
        return this._rotation;
    }
    public set rotation(value: number) {
        this._rotation = value;
        this.applyRotation();
    }

    /**
     * @internal
     */
    public applyRotation(): void {
        this._renderNode.applyRotation();

        this.physicsDirtyFlag = true;
    }

    /*************************** angle ***************************/
    public get angle(): number {
        return Mathf.radiansToDegrees(this._rotation);
    }
    public set angle(value: number) {
        this.rotation = Mathf.degreesToRadians(value);
    }

    /*************************** flip ***************************/
    private _flip: BooleanPair = BooleanPair.false;
    public get flip(): BooleanPair {
        return this._flip;
    }
    public set flip(value: BooleanPair) {
        this._flip.set(value);
        this.applyFlip();
    }

    public get flipX(): boolean {
        return this._flip.x;
    }
    public set flipX(value: boolean) {
        this._flip.x = value;
        this.applyFlip();
    }

    public get flipY(): boolean {
        return this._flip.y;
    }
    public set flipY(value: boolean) {
        this._flip.y = value;
        this.applyFlip();
    }

    public setFlip(booleanPair?: BooleanPair): void;
    public setFlip(x?: boolean, y?: boolean): void;
    public setFlip(booleanPairOrX?: BooleanPair | boolean, y?: boolean): void;
    public setFlip(...args: any[]): void {
        this._flip.set(...args);
        this.applyFlip();
    }

    /**
     * @internal
     */
    public applyFlip(): void {
        this._renderNode.applyFlip();
    }

    /*************************** color ***************************/
    private _color: Color = Color.white;
    public get color(): Color {
        return this._color;
    }
    public set color(value: Color) {
        this._color.set(value);
        this.applyColor();
    }

    public get colorR(): number {
        return this._color.r;
    }
    public set colorR(value: number) {
        this._color.r = value;
        this.applyColor();
    }

    public get colorG(): number {
        return this._color.g;
    }
    public set colorG(value: number) {
        this._color.g = value;
        this.applyColor();
    }

    public get colorB(): number {
        return this._color.b;
    }
    public set colorB(value: number) {
        this._color.b = value;
        this.applyColor();
    }

    public get colorA(): number {
        return this._color.a;
    }
    public set colorA(value: number) {
        this._color.a = value;
        this.applyColor();
    }

    public setColor(color?: Color): void;
    public setColor(r?: number, g?: number, b?: number, a?: number): void;
    public setColor(colorOrR?: Color | number, g?: number, b?: number, a?: number): void;
    public setColor(...args: any[]): void {
        this._color.set(...args);
        this.applyColor();
    }

    /**
     * @internal
     */
    public applyColor(): void {
        this._renderNode.applyColor();
    }

    /*************************** opacity ***************************/
    private _opacity: number = 255;
    public get opacity(): number {
        return this._opacity;
    }
    public set opacity(value: number) {
        this._opacity = value;
        this.applyOpacity();
    }

    /**
     * @internal
     */
    public applyOpacity(): void {
        this._renderNode.applyOpacity();
    }

    public get scene(): Scene | null {
        return sceneManager.currentScene;
    }

    private _destroyed: boolean = false;
    public get destroyed(): boolean {
        return this._destroyed;
    }
    public destroy(): void {
        if (this._destroyed) return;

        this._destroyed = true;

        for (let i = this._children.length - 1; i >= 0; i--) {
            const child = this._children[i];
            child.destroy();
        }

        for (let i = this._components.length - 1; i >= 0; i--) {
            this.removeComponent(i);
        }

        nodeManager.addDestroyedNode(this);
    }

    /**
     * @internal
     */
    public destroyRenderer(): void {
        if (!this._destroyed) return;
        this._renderNode.destroy();
    }

    private _layer: Layer | null = null;
    public get layer(): Layer | null {
        return this._layer;
    }
    public set layer(value: Layer | null) {
        if (this._destroyed || value === this._layer) return;

        this._parent?._removeChild(this);

        this._layer?.removeNode(this);
        this._layer = value;
        this._layer?.addNode(this);
    }

    public get currentLayer(): Layer | null {
        if (this._layer) return this._layer;

        let node: Node | null = this;
        while (node?._parent) {
            node = node._parent;
        }

        return node._layer;
    }

    /*************************** parent ***************************/
    private _parent: Node | null = null;
    public get parent(): Node | null {
        return this._parent;
    }
    public set parent(value: Node | null) {
        if (this._destroyed || value === this._parent) return;

        this._layer?.removeNode(this);
        this._layer = null;

        this._parent?._removeChild(this);
        value?._addChild(this);
    }

    /*************************** children ***************************/
    private _children: Node[] = [];
    public get children(): Readonly<Node[]> {
        return this._children;
    }

    private _addChild(child: Node): void {
        this._children.push(child);
        child._parent = this;

        const childRenderNode = child._renderNode;
        this._renderNode.addChild(childRenderNode);
    }
    private _removeChild(child: Node): void {
        const index = this._children.indexOf(child);
        if (index === -1) return;

        this._children.splice(index, 1);
        child._parent = null;

        const childRenderNode = child._renderNode;
        this._renderNode.removeChild(childRenderNode);
    }

    public getChildByName(name: string): Node | null {
        for (const child of this._children) {
            if (child.name === name) return child;
        }
        return null;
    }
    public getChildByPath(path: string): Node | null {
        const names = path.split("/");

        while (names.length > 0) {
            const name = names.shift()!;
            const child = this.getChildByName(name);
            if (child) {
                if (names.length === 0) {
                    return child;
                }
            } else {
                return null;
            }
        }
        return null;
    }

    /*************************** siblingIndex ***************************/
    public getSiblingIndex(): number {
        if (this._layer) return this._layer.getNodeIndex(this);
        return this._parent?._children.indexOf(this) ?? -1;
    }
    public setSiblingIndex(index: number): void {
        if (this._layer) {
            this._layer.setNodeIndex(this, index);
            return;
        }

        if (!this._parent) return;
        if (index < 0 || index >= this._parent._children.length) return;

        const currentIndex = this._parent._children.indexOf(this);
        if (currentIndex === -1 || currentIndex === index) return;

        this._parent._children.splice(currentIndex, 1);
        this._parent._children.splice(index, 0, this);

        this._renderNode.setSiblingIndex(index);
    }

    /*************************** transform ***************************/
    public toLocalPosition(layerPosition: Vec2): Vec2;
    public toLocalPosition(layerX: number, layerY: number): Vec2;
    public toLocalPosition(layerPositionOrX: Vec2 | number, y?: number): Vec2;
    public toLocalPosition(layerPositionOrX: Vec2 | number, y?: number): Vec2 {
        const localPosition =
            typeof layerPositionOrX === "object" ? layerPositionOrX.clone() : vec2(layerPositionOrX, y);

        const parents: Node[] = [];
        let parent = this._parent;

        while (parent) {
            parents.push(parent);
            parent = parent._parent;
        }

        for (let i = parents.length - 1; i >= 0; i--) {
            parent = parents[i];

            localPosition.subtractSelf(parent._position);
            localPosition.rotateSelf(-parent._rotation);

            const inverseScale = vec2(1 / parent._scale.x, 1 / parent._scale.y);
            localPosition.multiplySelf(inverseScale);
        }

        localPosition.subtractSelf(this._position);
        localPosition.rotateSelf(-this._rotation);
        localPosition.multiplySelf(vec2(1 / this._scale.x, 1 / this._scale.y));

        return localPosition;
    }

    public toLayerPosition(localPosition: Vec2): Vec2;
    public toLayerPosition(localX: number, localY: number): Vec2;
    public toLayerPosition(localPositionOrX: Vec2 | number, y?: number): Vec2;
    public toLayerPosition(localPositionOrX: Vec2 | number, y?: number): Vec2 {
        const layerPosition =
            typeof localPositionOrX === "object" ? localPositionOrX.clone() : vec2(localPositionOrX, y);

        layerPosition.multiplySelf(this._scale);
        layerPosition.rotateSelf(this._rotation);
        layerPosition.addSelf(this._position);

        return layerPosition;
    }

    public getLayerPosition(): Vec2 {
        const layerPosition = this._position.clone();

        let parent = this._parent;

        while (parent) {
            layerPosition.multiplySelf(parent._scale);
            layerPosition.rotateSelf(parent._rotation);
            layerPosition.addSelf(parent._position);

            parent = parent._parent;
        }
        return layerPosition;
    }
    public setLayerPosition(layerPosition?: Vec2): void;
    public setLayerPosition(layerX: number, layerY: number): void;
    public setLayerPosition(layerPositionOrX?: Vec2 | number, y?: number): void;
    public setLayerPosition(layerPositionOrX?: Vec2 | number, y?: number): void {
        const layerPosition = typeof layerPositionOrX === "object" ? layerPositionOrX : vec2(layerPositionOrX, y);

        if (this._parent) {
            const localPosition = this._parent.toLocalPosition(layerPosition);
            this.setPosition(localPosition);
        } else {
            this.setPosition(layerPosition);
        }
    }

    public toLocalRotation(layerRotation: number): number {
        let localRotation = layerRotation;

        const parents: Node[] = [];
        let parent = this._parent;
        while (parent) {
            parents.push(parent);
            parent = parent._parent;
        }

        for (let i = parents.length - 1; i >= 0; i--) {
            parent = parents[i];
            localRotation -= parent._rotation;
        }

        localRotation -= this._rotation;
        return localRotation;
    }
    public toLayerRotation(localRotation: number): number {
        let layerRotation = localRotation;
        layerRotation += this._rotation;

        return layerRotation;
    }

    public getLayerRotation(): number {
        let layerRotation = this._rotation;

        let parent = this._parent;
        while (parent) {
            layerRotation += parent._rotation;
            parent = parent._parent;
        }

        return layerRotation;
    }
    public setLayerRotation(layerRotation: number): void {
        if (this._parent) {
            const localRotation = this._parent.toLocalRotation(layerRotation);
            this.rotation = localRotation;
        } else {
            this.rotation = layerRotation;
        }
    }

    public getLayerAngle(): number {
        return Mathf.radiansToDegrees(this.getLayerRotation());
    }
    public setLayerAngle(layerAngle: number): void {
        this.setLayerRotation(Mathf.degreesToRadians(layerAngle));
    }

    public toLocalScale(layerScale: Vec2): Vec2;
    public toLocalScale(layerScaleX: number, layerScaleY: number): Vec2;
    public toLocalScale(layerScaleOrX: Vec2 | number, y?: number): Vec2;
    public toLocalScale(layerScaleOrX: Vec2 | number, y?: number): Vec2 {
        const localScale = typeof layerScaleOrX === "object" ? layerScaleOrX.clone() : vec2(layerScaleOrX, y);

        const parents: Node[] = [];
        let parent = this._parent;
        while (parent) {
            parents.push(parent);
            parent = parent._parent;
        }

        for (let i = parents.length - 1; i >= 0; i--) {
            parent = parents[i];
            localScale.divideSelf(parent._scale);
        }

        localScale.divideSelf(this._scale);
        return localScale;
    }
    public toLayerScale(localScale: Vec2): Vec2;
    public toLayerScale(localScaleX: number, localScaleY: number): Vec2;
    public toLayerScale(localScaleOrX: Vec2 | number, y?: number): Vec2;
    public toLayerScale(localScaleOrX: Vec2 | number, y?: number): Vec2 {
        const layerScale = typeof localScaleOrX === "object" ? localScaleOrX.clone() : vec2(localScaleOrX, y);
        layerScale.multiplySelf(this._scale);
        return layerScale;
    }

    public getLayerScale(): Vec2 {
        const layerScale = this._scale.clone();

        let parent = this._parent;
        while (parent) {
            layerScale.multiplySelf(parent._scale);
            parent = parent._parent;
        }

        return layerScale;
    }
    public setLayerScale(layerScale: Vec2): void;
    public setLayerScale(layerScaleX: number, layerScaleY: number): void;
    public setLayerScale(layerScaleOrX: Vec2 | number, y?: number): void;
    public setLayerScale(layerScaleOrX: Vec2 | number, y?: number): void {
        const layerScale = typeof layerScaleOrX === "object" ? layerScaleOrX : vec2(layerScaleOrX, y);

        if (this._parent) {
            const localScale = this._parent.toLocalScale(layerScale);
            this.setScale(localScale);
        } else {
            this.setScale(layerScale);
        }
    }

    /*************************** component ***************************/
    private _components: Component[] = [];
    public get components(): Component[] {
        return this._components;
    }

    private _comp: any = {};
    public get comp(): any {
        return this._comp;
    }

    public addComponent<T extends Component>(
        componentClass: IComponentConstructor<T>,
        options?: Partial<IWritablePropertiesOnly<T>>
    ): T | null;
    public addComponent<T extends Component>(
        componentName: string,
        options?: Partial<IWritablePropertiesOnly<T>>
    ): T | null;
    public addComponent<T extends Component>(
        componentClassOrName: IComponentConstructor<T> | string,
        options?: Partial<IWritablePropertiesOnly<T>>
    ): T | null;
    public addComponent<T extends Component>(
        componentClassOrName: IComponentConstructor<T> | string,
        options?: Partial<IWritablePropertiesOnly<T>>
    ): T | null {
        const componentClass =
            typeof componentClassOrName === "string"
                ? ComponentManager.getComponentClass(componentClassOrName)
                : componentClassOrName;
        if (!componentClass || !(componentClass.prototype as T | null)?.componentName) {
            console.error(`Component ${componentClassOrName} is not defined.`);
            return null;
        }

        if ((componentClass.prototype as T).isRenderComponent) {
            for (const component of this._components) {
                if (component.isRenderComponent) {
                    console.error(
                        `添加组件 ${
                            (componentClass.prototype as T).componentName
                        } 失败，每个节点只可以拥有一个渲染组件.`
                    );
                    return null;
                }
            }
        }

        const component = new componentClass(this);
        this._components.push(component);

        componentManager.addUnStartedComponent(component);

        (this._comp as any)[component.componentName] = component;

        registerComponentOnUse(component);

        component["onCreate"]?.();

        if (options) {
            for (const key in options) {
                (component as any)[key] = (options as any)[key];
            }
        }

        component["onInit"]();
        return component as T;
    }

    public getComponent<T extends Component>(componentClass: IComponentConstructor<T>): T | null;
    public getComponent<T extends Component>(componentName: string): T | null;
    public getComponent<T extends Component>(componentIndex: number): T | null;
    public getComponent<T extends Component>(
        componentClassOrNameOrIndex: IComponentConstructor<T> | string | number
    ): T | null;
    public getComponent<T extends Component>(
        componentClassOrNameOrIndex: IComponentConstructor<T> | string | number
    ): T | null {
        if (typeof componentClassOrNameOrIndex === "number")
            return (this._components[componentClassOrNameOrIndex] as T) ?? null;

        const componentName =
            typeof componentClassOrNameOrIndex === "string"
                ? componentClassOrNameOrIndex
                : (componentClassOrNameOrIndex.prototype as T).componentName;

        return (this._components.findLast((component) => component.componentName === componentName) as T) ?? null;
    }

    public removeComponent<T extends Component>(componentClass: IComponentConstructor<T>): void;
    public removeComponent<T extends Component>(componentName: string): void;
    public removeComponent<T extends Component>(componentIndex: number): void;
    public removeComponent<T extends Component>(
        componentClassOrNameOrIndex: IComponentConstructor<T> | string | number
    ): void;
    public removeComponent<T extends Component>(
        componentClassOrNameOrIndex: IComponentConstructor<T> | string | number
    ): void {
        const component = this.getComponent(componentClassOrNameOrIndex);
        if (!component || component.destroyed) return;

        componentManager.addDestroyedComponent(component);
    }

    public hitTest(layerPoint: Vec2): boolean;
    public hitTest(layerX: number, layerY: number): boolean;
    public hitTest(layerPointOrX: Vec2 | number, y?: number): boolean;
    public hitTest(layerPointOrX: Vec2 | number, y?: number): boolean {
        const layerPoint = typeof layerPointOrX === "object" ? layerPointOrX : vec2(layerPointOrX, y);
        const layerVertices = Node.getNodeCurrentLayerVertices(this);

        return Mathf.isPointInPolygon(layerPoint, layerVertices);
    }

    /**
     * @internal
     */
    public dispatchPointerEvent(event: IPointerEvent): void {
        this.emit(event.type, event);

        if (this._parent && event.bubbling) {
            this._parent.dispatchPointerEvent(event);
        }
    }

    public static getNodeCurrentLayerVertices(node: Node): IVec2[] {
        const layerPosition = node.getLayerPosition();
        const layerScale = node.getLayerScale();
        const layerRotation = node.getLayerRotation();
        const nodeSize = node._size.clone();
        const nodeAnchor = node._anchor.clone();

        const vertices = Mathf.calculatePolygonVertices(
            layerPosition.x,
            layerPosition.y,
            nodeSize.width,
            nodeSize.height,
            layerScale.x,
            layerScale.y,
            nodeAnchor.x,
            nodeAnchor.y,
            layerRotation
        );
        return vertices;
    }

    public static extractNodeRenderData(node: Node): Promise<string> {
        return renderSystem.extractRendererData(node.renderNode.renderer);
    }
}
