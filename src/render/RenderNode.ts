import { Node } from "cassia-engine/node";
import { ContainerRenderer } from "./define";

export class RenderNode {
    private _renderer: ContainerRenderer;
    public get renderer(): ContainerRenderer {
        return this._renderer;
    }

    private _renderContainer: ContainerRenderer;
    public get renderContainer(): ContainerRenderer {
        return this._renderContainer;
    }

    private _childrenContainer: ContainerRenderer;

    constructor(node: Node) {
        this._node = node;

        this._renderer = new ContainerRenderer();

        this._renderContainer = new ContainerRenderer();
        this._renderContainer.scale.y = -1;
        this._renderer.addChild(this._renderContainer);

        this._childrenContainer = new ContainerRenderer();
        this._renderer.addChild(this._childrenContainer);
    }

    private _parent: RenderNode | null = null;
    public get parent(): RenderNode | null {
        return this._parent;
    }

    private _children: RenderNode[] = [];
    public get children(): RenderNode[] {
        return this._children;
    }

    public addChild(child: RenderNode): void {
        if (child._parent === this) return;

        this._children.push(child);
        child._parent = this;

        const childRenderer = child._renderer;
        this._childrenContainer.addChild(childRenderer);
    }
    public removeChild(child: RenderNode): void {
        const index = this._children.indexOf(child);
        if (index === -1) return;

        this._children.splice(index, 1);
        child._parent = null;

        const childRenderer = child._renderer;
        this._childrenContainer.removeChild(childRenderer);
    }

    public setSiblingIndex(index: number): void {
        if (!this._parent) return;
        this._parent._childrenContainer.setChildIndex(this._renderer, index);
    }

    public destroy(): void {
        this._renderer.destroy();
        this._renderer = null!;
    }

    private _node: Node;
    public get node(): Node {
        return this._node;
    }

    public applyActive(): void {
        const active = this._node.active;
        this._renderer.visible = active;
    }
    public applyPosition(): void {
        const position = this._node.position;
        this._renderer.position.set(position.x, position.y);
    }
    public applySize(): void {
        const size = this._node.size;
        this._renderer.setSize(size.width, size.height);
    }
    public applyScale(): void {
        const scale = this._node.scale;
        this._renderer.scale.set(scale.x, scale.y);
    }
    public applyAnchor(): void {
        const anchor = this._node.anchor;
        const size = this._node.size;

        const pivotX = anchor.x * size.width;
        const pivotY = (1 - anchor.y) * size.height;

        this._renderContainer.pivot.set(pivotX, pivotY);
    }
    public applyRotation(): void {
        const rotation = this._node.rotation;
        this._renderer.rotation = rotation;
    }
    public applyColor(): void {}
    public applyOpacity(): void {
        const opacity = this._node.opacity;
        this._renderer.alpha = opacity / 255;
    }
    public applyFlip(): void {
        const flip = this._node.flip;

        this._renderContainer.scale.x = flip.x ? -1 : 1;
        this._renderContainer.scale.y = flip.y ? -1 : 1;
    }
}
