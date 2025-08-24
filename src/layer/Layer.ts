import { Mathf, Vec2 } from "cassia-engine/math";
import { Node } from "cassia-engine/node";
import { RenderLayer } from "cassia-engine/render";

export class Layer {
    private _renderLayer: RenderLayer;
    /**
     * @internal
     */
    public get renderLayer(): RenderLayer {
        return this._renderLayer;
    }

    constructor() {
        this._renderLayer = new RenderLayer(this);
    }

    public onInit(): void {}

    private _nodes: Node[] = [];
    public get nodes(): Node[] {
        return this._nodes;
    }

    public getFlatNodes(): Node[] {
        const addToFlatNodes = (node: Node, flatNodes: Node[]): void => {
            flatNodes.push(node);
            node.children.forEach((child) => addToFlatNodes(child, flatNodes));
        };

        const flatNodes: Node[] = [];
        this._nodes.forEach((node) => addToFlatNodes(node, flatNodes));
        return flatNodes;
    }

    public screenToLayer(screenPoint: Vec2): Vec2 {
        return this._renderLayer.screenToLayer(screenPoint);
    }
    public layerToScreen(layerPoint: Vec2): Vec2 {
        return this._renderLayer.layerToScreen(layerPoint);
    }

    private _cameraPosition: Vec2 = Vec2.zero;
    public get cameraPosition(): Vec2 {
        return this._cameraPosition;
    }
    public set cameraPosition(value: Vec2) {
        this._cameraPosition.set(value);
        this.applyCameraPosition();
    }

    public get cameraX(): number {
        return this._cameraPosition.x;
    }
    public set cameraX(value: number) {
        this._cameraPosition.x = value;
        this.applyCameraPosition();
    }

    public get cameraY(): number {
        return this._cameraPosition.y;
    }
    public set cameraY(value: number) {
        this._cameraPosition.y = value;
        this.applyCameraPosition();
    }

    public setCameraPosition(vec2?: Vec2): void;
    public setCameraPosition(x?: number, y?: number): void;
    public setCameraPosition(vec2OrX?: Vec2 | number, y?: number): void;
    public setCameraPosition(...args: any[]): void {
        this._cameraPosition.set(...args);
        this.applyCameraPosition();
    }

    /**
     * @internal
     */
    public applyCameraPosition(): void {
        this._renderLayer.applyCameraPosition();
    }

    private _cameraZoom: number = 1;
    public get cameraZoom(): number {
        return this._cameraZoom;
    }
    public set cameraZoom(value: number) {
        this._cameraZoom = Math.max(0.001, value);
        this.applyCameraZoom();
    }
    /**
     * @internal
     */
    public applyCameraZoom(): void {
        this._renderLayer.applyCameraZoom();
    }

    private _cameraRotation: number = 0;
    public get cameraRotation(): number {
        return this._cameraRotation;
    }
    public set cameraRotation(value: number) {
        this._cameraRotation = value;
        this.applyCameraRotation();
    }

    /**
     * @internal
     */
    public applyCameraRotation(): void {
        this._renderLayer.applyCameraRotation();
    }

    public get cameraAngle(): number {
        return Mathf.radiansToDegrees(this._cameraRotation);
    }
    public set cameraAngle(value: number) {
        this.cameraRotation = Mathf.degreesToRadians(value);
    }

    /**
     * @internal
     * @param node
     * @returns
     */
    public addNode(node: Node): void {
        if (this._nodes.includes(node)) return;
        this._nodes.push(node);

        const renderNode = node.renderNode;
        this._renderLayer.addRenderNode(renderNode);
    }
    /**
     * @internal
     * @param node
     * @returns
     */
    public removeNode(node: Node): void {
        const index = this._nodes.indexOf(node);
        if (index === -1) return;
        this._nodes.splice(index, 1);

        const renderNode = node.renderNode;
        this._renderLayer.removeRenderNode(renderNode);
    }

    /**
     * @internal
     * @param node
     * @returns
     */
    public getNodeIndex(node: Node): number {
        return this._nodes.indexOf(node);
    }
    /**
     * @internal
     * @param node
     * @param index
     * @returns
     */
    public setNodeIndex(node: Node, index: number): void {
        if (index < 0 || index >= this._nodes.length) return;

        const currentIndex = this._nodes.indexOf(node);
        if (currentIndex === -1 || currentIndex === index) return;

        this._nodes.splice(currentIndex, 1);
        this._nodes.splice(index, 0, node);

        const renderNode = node.renderNode;
        this._renderLayer.setRenderNodeIndex(renderNode, index);
    }

    public destroyAllNodes(): void {
        for (let i = this._nodes.length - 1; i >= 0; i--) {
            const node = this._nodes[i];
            node.destroy();
        }
    }

    public destroy(): void {}
}
