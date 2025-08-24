import { Component, defineComponent } from "cassia-engine/component";
import type { RenderObject } from "cassia-engine/render";

@defineComponent({ componentName: "RenderComponent", isRenderComponent: true })
export class RenderComponent<T extends RenderObject = any> extends Component {
    private _renderObject: T = null!;
    public get renderObject(): T {
        return this._renderObject;
    }

    public onInit(): void {
        this._renderObject = this.onRenderCreate();
    }
    protected onRenderCreate(): T {
        throw new Error("onRenderCreate method not implemented");
    }

    public onDestroy(): void {
        this._renderObject.destroy();
    }

    public onEnable(): void {
        this._renderObject.applyEnabled();
    }
    public onDisable(): void {
        this._renderObject.applyEnabled();
    }
}
