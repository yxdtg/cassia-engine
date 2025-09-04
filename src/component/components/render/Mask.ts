import { defineComponent } from "cassia-engine/component";
import { MASK_TYPE, RenderMask } from "cassia-engine/render";
import { RenderComponent } from "./RenderComponent";
import { TextureResource } from "cassia-engine/resource";
import { resourceSystem } from "cassia-engine";

@defineComponent({ componentName: "Mask" })
export class Mask extends RenderComponent<RenderMask> {
    protected onRenderCreate(): RenderMask {
        return new RenderMask(this);
    }

    private _maskType: MASK_TYPE = MASK_TYPE.Rect;
    public get maskType(): MASK_TYPE {
        return this._maskType;
    }
    public set maskType(value: MASK_TYPE) {
        this._maskType = value;
        this.applyMask();
    }

    private _inverse: boolean = false;
    public get inverse(): boolean {
        return this._inverse;
    }
    public set inverse(value: boolean) {
        this._inverse = value;
        this.applyMask();
    }

    private _maskTexture: TextureResource | null = null;
    public get maskTexture(): TextureResource | null {
        return this._maskTexture;
    }
    public set maskTexture(value: TextureResource | null) {
        this._maskTexture = value;
        this.applyMask();
    }

    public get maskTextureName(): string {
        return this._maskTexture?.name ?? "";
    }
    public set maskTextureName(value: string) {
        const texture = resourceSystem.getTexture(value);
        this.maskTexture = texture;
    }

    /**
     * @internal
     */
    public applyMask(): void {
        this.renderObject.applyMask();
    }

    public override onDestroy(): void {
        this.renderObject.clearMask();

        super.onDestroy();
    }
}
