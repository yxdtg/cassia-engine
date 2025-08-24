import { Component, defineComponent } from "cassia-engine/component";
import type { RenderObject } from "cassia-engine/render";

@defineComponent({ componentName: "RenderComponent", isRenderComponent: true })
export class RenderComponent<T extends RenderObject = any> extends Component {
    private _renderObject: T = null!;
    public get renderObject(): T {
        return this._renderObject;
    }

    protected onInit(): void {
        this._renderObject = this.onRenderCreate();
    }
    protected onRenderCreate(): T {
        throw new Error("onRenderCreate method not implemented");
    }

    protected onDestroy(): void {
        this._renderObject.destroy();
    }

    protected onEnable(): void {
        this._renderObject.applyEnabled();
    }
    protected onDisable(): void {
        this._renderObject.applyEnabled();
    }
}
