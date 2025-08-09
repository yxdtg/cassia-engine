import { componentManager, nodeManager, sceneManager } from "cassia-engine";
import { type Collider, type Component, ComponentManager, type IComponentConstructor } from "cassia-engine/component";
import { EventObject } from "cassia-engine/event";
import {
    GLOBAL_POINTER_EVENT_TYPE,
    IGlobalPointerEvent,
    type IPointerEvent,
    POINTER_EVENT_TYPE,
} from "cassia-engine/input";
import { BooleanPair, Color, IVec2, Mathf, Size, vec2, Vec2 } from "cassia-engine/math";
import { RenderNode } from "cassia-engine/render";
import type { Scene } from "cassia-engine/scene";

export interface INodeOptions {
    name?: string;
    parent?: Node | null;
}

export const NODE_EVENT_TYPE = {
    ...POINTER_EVENT_TYPE,
    ...GLOBAL_POINTER_EVENT_TYPE,
    CollisionEnter: "collision-enter",
    CollisionExit: "collision-exit",
} as const;
export type NODE_EVENT_TYPE = (typeof NODE_EVENT_TYPE)[keyof typeof NODE_EVENT_TYPE];

interface INodeEventTypeMap {
    [NODE_EVENT_TYPE.PointerDown]: (event: IPointerEvent) => void;
    [NODE_EVENT_TYPE.PointerMove]: (event: IPointerEvent) => void;
    [NODE_EVENT_TYPE.PointerUp]: (event: IPointerEvent) => void;

    [NODE_EVENT_TYPE.GlobalPointerDown]: (event: IGlobalPointerEvent) => void;
    [NODE_EVENT_TYPE.GlobalPointerMove]: (event: IGlobalPointerEvent) => void;
    [NODE_EVENT_TYPE.GlobalPointerUp]: (event: IGlobalPointerEvent) => void;

    [NODE_EVENT_TYPE.CollisionEnter]: (selfCollider: Collider, otherCollider: Collider) => void;
    [NODE_EVENT_TYPE.CollisionExit]: (selfCollider: Collider, otherCollider: Collider) => void;
}

export class Node extends EventObject<INodeEventTypeMap> {
    private _renderNode: RenderNode;
    public get renderNode(): RenderNode {
        return this._renderNode;
    }

    constructor(options: INodeOptions = {}) {
        super();

        this._renderNode = new RenderNode(this);

        this._name = options.name ?? "";
        this.parent = options.parent ?? null;

        this.applySize();
        this.applyColor();
    }

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
                    component.onEnable();
                }
            } else {
                for (const component of this._components) {
                    component.onDisable();
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

    /**
     * --------------------------- position ---------------------------
     */
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
    }

    /**
     * --------------------------- size ---------------------------
     */
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

    /**
     * --------------------------- scale ---------------------------
     */
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

    /**
     * --------------------------- anchor ---------------------------
     */
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

    /**
     * --------------------------- rotation ---------------------------
     */
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
    }

    /**
     * --------------------------- angle ---------------------------
     */
    public get angle(): number {
        return Mathf.radiansToDegrees(this._rotation);
    }
    public set angle(value: number) {
        this.rotation = Mathf.degreesToRadians(value);
    }

    /**
     * --------------------------- flip ---------------------------
     */
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

    /**
     * --------------------------- color ---------------------------
     */
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

    /**
     * --------------------------- opacity ---------------------------
     */
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
     * --------------------------- parent ---------------------------
     */
    private _parent: Node | null = null;
    public get parent(): Node | null {
        return this._parent;
    }
    public set parent(value: Node | null) {
        if (value) {
            value.addChild(this);
        } else {
            if (this._parent) {
                this._parent.removeChild(this);
            } else {
                this._parent = null;
                this.scene?.addNode(this);
            }
        }
    }

    /**
     * --------------------------- children ---------------------------
     */
    private _children: Node[] = [];
    public get children(): Node[] {
        return this._children;
    }

    /**
     * @internal
     * @param child
     * @returns
     */
    public addChild(child: Node): void {
        if (this._destroyed || child._parent === this) return;

        child._parent?.removeChild(child);
        this.scene?.removeNode(child);

        this._children.push(child);
        child._parent = this;

        const childRenderNode = child._renderNode;
        this._renderNode.addChild(childRenderNode);
    }
    /**
     * @internal
     * @param child
     * @returns
     */
    public removeChild(child: Node): void {
        const index = this._children.indexOf(child);
        if (this._destroyed || index === -1) return;

        this._children.splice(index, 1);
        child._parent = null;

        const childRenderNode = child._renderNode;
        this._renderNode.removeChild(childRenderNode);

        this.scene?.addNode(child);
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

    /**
     * --------------------------- siblingIndex ---------------------------
     */
    public getSiblingIndex(): number {
        if (!this._parent) return this.scene?.getNodeIndex(this) ?? -1;
        return this._parent._children.indexOf(this);
    }
    public setSiblingIndex(index: number): void {
        if (!this._parent) {
            this.scene?.setNodeIndex(this, index);
            return;
        }

        if (index < 0 || index >= this._parent._children.length) return;

        const currentIndex = this._parent._children.indexOf(this);
        if (currentIndex === -1 || currentIndex === index) return;

        this._parent._children.splice(currentIndex, 1);
        this._parent._children.splice(index, 0, this);

        this._renderNode.setSiblingIndex(index);
    }

    /**
     * --------------------------- transform ---------------------------
     */
    public toLocalPosition(worldPosition: Vec2): Vec2;
    public toLocalPosition(x: number, y: number): Vec2;
    public toLocalPosition(worldPositionOrX: Vec2 | number, y?: number): Vec2 {
        const localPosition =
            typeof worldPositionOrX === "object" ? worldPositionOrX.clone() : vec2(worldPositionOrX, y);

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

    public toWorldPosition(localPosition: Vec2): Vec2;
    public toWorldPosition(x: number, y: number): Vec2;
    public toWorldPosition(localPositionOrX: Vec2 | number, y?: number): Vec2 {
        const worldPosition =
            typeof localPositionOrX === "object" ? localPositionOrX.clone() : vec2(localPositionOrX, y);

        worldPosition.multiplySelf(this._scale);
        worldPosition.rotateSelf(this._rotation);
        worldPosition.addSelf(this._position);

        return worldPosition;
    }

    public getWorldPosition(): Vec2 {
        const worldPosition = this._position.clone();

        let parent = this._parent;

        while (parent) {
            worldPosition.multiplySelf(parent._scale);
            worldPosition.rotateSelf(parent._rotation);
            worldPosition.addSelf(parent._position);

            parent = parent._parent;
        }
        return worldPosition;
    }
    public setWorldPosition(worldPosition?: Vec2): void;
    public setWorldPosition(x: number, y: number): void;
    public setWorldPosition(worldPositionOrX?: Vec2 | number, y?: number): void {
        const worldPosition = typeof worldPositionOrX === "object" ? worldPositionOrX : vec2(worldPositionOrX, y);

        if (this._parent) {
            const localPosition = this._parent.toLocalPosition(worldPosition);
            this.setPosition(localPosition);
        } else {
            this.setPosition(worldPosition);
        }
    }

    public toLocalRotation(worldRotation: number): number {
        let localRotation = worldRotation;

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
    public toWorldRotation(localRotation: number): number {
        let worldRotation = localRotation;
        worldRotation += this._rotation;

        return worldRotation;
    }

    public getWorldRotation(): number {
        let worldRotation = this._rotation;

        let parent = this._parent;
        while (parent) {
            worldRotation += parent._rotation;
            parent = parent._parent;
        }

        return worldRotation;
    }
    public setWorldRotation(worldRotation: number): void {
        if (this._parent) {
            const localRotation = this._parent.toLocalRotation(worldRotation);
            this.rotation = localRotation;
        } else {
            this.rotation = worldRotation;
        }
    }

    public getWorldAngle(): number {
        return Mathf.radiansToDegrees(this.getWorldRotation());
    }
    public setWorldAngle(worldAngle: number): void {
        this.setWorldRotation(Mathf.degreesToRadians(worldAngle));
    }

    public toLocalScale(worldScale: Vec2): Vec2;
    public toLocalScale(x: number, y: number): Vec2;
    public toLocalScale(worldScaleOrX: Vec2 | number, y?: number): Vec2 {
        const localScale = typeof worldScaleOrX === "object" ? worldScaleOrX.clone() : vec2(worldScaleOrX, y);

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
    public toWorldScale(localScale: Vec2): Vec2;
    public toWorldScale(x: number, y: number): Vec2;
    public toWorldScale(localScaleOrX: Vec2 | number, y?: number): Vec2 {
        const worldScale = typeof localScaleOrX === "object" ? localScaleOrX.clone() : vec2(localScaleOrX, y);
        worldScale.multiplySelf(this._scale);
        return worldScale;
    }

    public getWorldScale(): Vec2 {
        const worldScale = this._scale.clone();

        let parent = this._parent;
        while (parent) {
            worldScale.multiplySelf(parent._scale);
            parent = parent._parent;
        }

        return worldScale;
    }
    public setWorldScale(worldScale: Vec2): void;
    public setWorldScale(x: number, y: number): void;
    public setWorldScale(worldScaleOrX: Vec2 | number, y?: number): void {
        const worldScale = typeof worldScaleOrX === "object" ? worldScaleOrX : vec2(worldScaleOrX, y);

        if (this._parent) {
            const localScale = this._parent.toLocalScale(worldScale);
            this.setScale(localScale);
        } else {
            this.setScale(worldScale);
        }
    }

    /**
     * --------------------------- component ---------------------------
     */
    private _components: Component[] = [];
    public get components(): Component[] {
        return this._components;
    }

    private _comp: any = {};
    public get comp(): any {
        return this._comp;
    }

    public addComponent<T extends Component>(componentClass: IComponentConstructor<T>): T;
    public addComponent<T extends Component>(componentName: string): T;
    public addComponent<T extends Component>(componentClassOrName: IComponentConstructor<T> | string): T;
    public addComponent<T extends Component>(componentClassOrName: IComponentConstructor<T> | string): T {
        const componentClass =
            typeof componentClassOrName === "string"
                ? ComponentManager.getComponentClass(componentClassOrName)
                : componentClassOrName;
        if (!componentClass || !(componentClass.prototype as T | null)?.componentName) {
            console.error(`Component ${componentClassOrName} is not defined.`);
            return null as any;
        }

        const component = new componentClass(this);
        this._components.push(component);

        componentManager.addUnStartedComponent(component);

        (this._comp as any)[component.componentName] = component;

        // on Use onPointerDown, onPointerMove, onPointerUp
        {
            if (component.useOnPointerDown) {
                component.node.on(NODE_EVENT_TYPE.PointerDown, component.onPointerDown, component);
            }
            if (component.useOnPointerMove) {
                component.node.on(NODE_EVENT_TYPE.PointerMove, component.onPointerMove, component);
            }
            if (component.useOnPointerUp) {
                component.node.on(NODE_EVENT_TYPE.PointerUp, component.onPointerUp, component);
            }
        }
        // on Use onGlobalPointerDown, onGlobalPointerMove, onGlobalPointerUp
        {
            if (component.useOnGlobalPointerDown) {
                component.node.on(NODE_EVENT_TYPE.GlobalPointerDown, component.onGlobalPointerDown, component);
            }
            if (component.useOnGlobalPointerMove) {
                component.node.on(NODE_EVENT_TYPE.GlobalPointerMove, component.onGlobalPointerMove, component);
            }
            if (component.useOnGlobalPointerUp) {
                component.node.on(NODE_EVENT_TYPE.GlobalPointerUp, component.onGlobalPointerUp, component);
            }
        }
        // on Use onCollisionEnter, onCollisionExit
        {
            if (component.useOnCollisionEnter) {
                component.node.on(NODE_EVENT_TYPE.CollisionEnter, component.onCollisionEnter, component);
            }
            if (component.useOnCollisionExit) {
                component.node.on(NODE_EVENT_TYPE.CollisionExit, component.onCollisionExit, component);
            }
        }

        component.onInit();

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
        if (!component) return;

        componentManager.addDestroyedComponent(component);
    }

    public getWorldVertices(): IVec2[] {
        const selfWorldPosition = this.getWorldPosition();
        const selfWorldScale = this.getWorldScale();
        const selfWorldRotation = this.getWorldRotation();
        const selfSize = this._size.clone();
        const selfAnchor = this._anchor.clone();

        const vertices = Mathf.calculatePolygonVertices(
            selfWorldPosition.x,
            selfWorldPosition.y,
            selfSize.width,
            selfSize.height,
            selfWorldScale.x,
            selfWorldScale.y,
            selfAnchor.x,
            selfAnchor.y,
            selfWorldRotation
        );
        return vertices;
    }

    public hitTest(worldPoint: Vec2): boolean;
    public hitTest(x: number, y: number): boolean;
    public hitTest(worldPointOrX: Vec2 | number, y?: number): boolean;
    public hitTest(worldPointOrX: Vec2 | number, y?: number): boolean {
        const worldPoint = typeof worldPointOrX === "object" ? worldPointOrX : vec2(worldPointOrX, y);
        const worldVertices = this.getWorldVertices();
        return Mathf.isPointInPolygon(worldPoint, worldVertices);
    }

    public addToHitNodes(worldPoint: Vec2, hitNodes: Node[]): void {
        if (!this._active) return;

        if (this._interactive && this.hitTest(worldPoint)) {
            hitNodes.push(this);
        }

        this._children.forEach((child) => child.addToHitNodes(worldPoint, hitNodes));
    }
}
