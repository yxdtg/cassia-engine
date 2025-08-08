import type { Node } from "cassia-engine/node";
import { RenderScene } from "cassia-engine/render";
import { SceneManager } from "./SceneManager";

export class Scene {
    private _renderScene: RenderScene;
    public get renderScene(): RenderScene {
        return this._renderScene;
    }

    constructor() {
        this._renderScene = new RenderScene(this);
    }

    public onInit(): void {}

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

    public destroyAllNodes(): void {
        for (let i = this._nodes.length - 1; i >= 0; i--) {
            const node = this._nodes[i];
            node.destroy();
        }
    }
}

export interface Scene {
    readonly sceneName: string;
}

export interface IDefineSceneOptions {
    sceneName: string;
}

export type ISceneConstructor<T extends Scene = Scene> = new () => T;

export function defineScene<T extends Scene>(options: IDefineSceneOptions): Function {
    return function (constructor: ISceneConstructor<T>) {
        const sceneClassPrototype = constructor.prototype as T;
        const sceneName = options.sceneName;

        if (sceneName.length === 0) throw new Error("sceneName is empty");

        Object.defineProperty(sceneClassPrototype, "sceneName", {
            get: (): string => sceneName,
        });

        SceneManager.defineScene(constructor);
    };
}
