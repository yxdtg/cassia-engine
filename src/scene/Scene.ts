import type { Node } from "cassia-engine/node";
import { RenderScene } from "cassia-engine/render";

export class Scene {
    private _renderScene: RenderScene;
    public get renderScene(): RenderScene {
        return this._renderScene;
    }

    constructor() {
        this._renderScene = new RenderScene(this);

        this.onCreate?.();
    }

    public onCreate?(): void;

    private _nodes: Node[] = [];
    public get nodes(): Node[] {
        return this._nodes;
    }

    public getFlatNodes(): Node[] {
        const flatNodes: Node[] = [];
        this._nodes.forEach((node) => this._addToFlatNodes(node, flatNodes));
        return flatNodes;
    }
    private _addToFlatNodes(node: Node, flatNodes: Node[]): void {
        flatNodes.push(node);
        node.children.forEach((child) => this._addToFlatNodes(child, flatNodes));
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
        this._renderScene.addRenderNode(renderNode);
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
        this._renderScene.removeRenderNode(renderNode);
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
        this._renderScene.setRenderNodeIndex(renderNode, index);
    }
}

export type ISceneConstructor = new (...args: any[]) => Scene;
