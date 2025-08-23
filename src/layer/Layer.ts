import { Vec2 } from "cassia-engine/math";
import { Node } from "cassia-engine/node";
import { RenderLayer } from "cassia-engine/render";

export class Layer {
    private _renderLayer: RenderLayer;
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
