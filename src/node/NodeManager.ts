import { Node } from "./Node";

export class NodeManager {
    constructor() {}

    private _nodes: Node[] = [];
    public get nodes(): Node[] {
        return this._nodes;
    }

    /**
     * @internal
     * @param node
     * @returns
     */
    public addNode(node: Node): void {
        if (this._nodes.includes(node)) return;
        this._nodes.push(node);
    }

    private _destroyedNodes: Node[] = [];
    /**
     * @internal
     */
    public addDestroyedNode(node: Node): void {
        if (this._destroyedNodes.includes(node)) return;
        this._destroyedNodes.push(node);
    }

    private _callNodeDestroy(node: Node): void {
        if (!node.destroyed) return;

        node.parent?.removeChild(node);
        node.scene?.removeNode(node);

        const index = this._nodes.indexOf(node);
        this._nodes.splice(index, 1);
    }

    /**
     * @internal
     */
    public clearDestroyedNodes(): void {
        this._destroyedNodes.forEach((node) => this._callNodeDestroy(node));
        this._destroyedNodes.length = 0;
    }
}
