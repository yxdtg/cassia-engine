import { Component, defineComponent } from "cassia-engine/component";
import { renderSystem } from "cassia-engine";
import { Vec2 } from "cassia-engine/math";

export const ALIGN_HORIZONTAL_TYPE = {
    Left: "left",
    Center: "center",
    Right: "right",
} as const;
export type ALIGN_HORIZONTAL_TYPE = (typeof ALIGN_HORIZONTAL_TYPE)[keyof typeof ALIGN_HORIZONTAL_TYPE];

export const ALIGN_VERTICAL_TYPE = {
    Top: "top",
    Center: "center",
    Bottom: "bottom",
} as const;
export type ALIGN_VERTICAL_TYPE = (typeof ALIGN_VERTICAL_TYPE)[keyof typeof ALIGN_VERTICAL_TYPE];

@defineComponent({ componentName: "Align" })
export class Align extends Component {
    public horizontalType: ALIGN_HORIZONTAL_TYPE = ALIGN_HORIZONTAL_TYPE.Center;
    public verticalType: ALIGN_VERTICAL_TYPE = ALIGN_VERTICAL_TYPE.Center;

    public offset: Vec2 = Vec2.zero;

    public get offsetX(): number {
        return this.offset.x;
    }
    public set offsetX(value: number) {
        this.offset.x = value;
    }

    public get offsetY(): number {
        return this.offset.y;
    }
    public set offsetY(value: number) {
        this.offset.y = value;
    }

    protected onLateUpdate(dt: number): void {
        this.applyAlign();
    }

    public applyAlign(): void {
        if (this.node.layer) {
            this._alignLayer();
            return;
        }
        if (this.node.parent) {
            this._alignParent();
            return;
        }
    }

    private _alignLayer(): void {
        const node = this.node;

        const currentLayer = node.layer;
        if (!currentLayer) return;

        const gameViewSize = renderSystem.getGameViewSize();

        const nodeSize = node.size;
        const nodeScale = node.scale;
        const nodeAnchor = node.anchor;

        const w = nodeSize.width * nodeScale.x * nodeAnchor.x;
        const h = nodeSize.height * nodeScale.y * (1 - nodeAnchor.y);

        let x = 0;
        let y = 0;

        if (this.horizontalType === ALIGN_HORIZONTAL_TYPE.Left) {
            x = -gameViewSize.width / 2 + w;
        }
        if (this.horizontalType === ALIGN_HORIZONTAL_TYPE.Center) {
            x = nodeSize.width * nodeScale.x * (nodeAnchor.x - 0.5);
        }
        if (this.horizontalType === ALIGN_HORIZONTAL_TYPE.Right) {
            x = gameViewSize.width / 2 - w;
        }

        if (this.verticalType === ALIGN_VERTICAL_TYPE.Top) {
            y = gameViewSize.height / 2 - h;
        }
        if (this.verticalType === ALIGN_VERTICAL_TYPE.Center) {
            y = nodeSize.height * nodeScale.y * (nodeAnchor.y - 0.5);
        }
        if (this.verticalType === ALIGN_VERTICAL_TYPE.Bottom) {
            y = -gameViewSize.height / 2 + h;
        }

        node.setPosition(x + this.offset.x, y + this.offset.y);
    }

    private _alignParent(): void {
        const node = this.node;

        const parent = node.parent;
        if (!parent) return;

        const nodeSize = node.size;
        const nodeScale = node.scale;
        const nodeAnchor = node.anchor;

        const w = nodeSize.width * nodeScale.x * nodeAnchor.x;
        const h = nodeSize.height * nodeScale.y * (1 - nodeAnchor.y);

        const parentSize = parent.size;
        const parentAnchor = parent.anchor;

        const parentW = parentSize.width * parentAnchor.x;
        const parentH = parentSize.height * (1 - parentAnchor.y);

        let x = 0;
        let y = 0;

        if (this.horizontalType === ALIGN_HORIZONTAL_TYPE.Left) {
            x = -parentW + w;
        }
        if (this.horizontalType === ALIGN_HORIZONTAL_TYPE.Center) {
            x = nodeSize.width * nodeScale.x * (nodeAnchor.x - 0.5);
        }
        if (this.horizontalType === ALIGN_HORIZONTAL_TYPE.Right) {
            x = parentW - w;
        }

        if (this.verticalType === ALIGN_VERTICAL_TYPE.Top) {
            y = parentH - h;
        }
        if (this.verticalType === ALIGN_VERTICAL_TYPE.Center) {
            y = nodeSize.height * nodeScale.y * (nodeAnchor.y - 0.5);
        }
        if (this.verticalType === ALIGN_VERTICAL_TYPE.Bottom) {
            y = -parentH + h;
        }

        node.setPosition(x + this.offset.x, y + this.offset.y);
    }
}
