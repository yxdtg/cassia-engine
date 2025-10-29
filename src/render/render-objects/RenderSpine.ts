import type { Animation, Bone, SkeletonData, TrackEntry } from "@esotericsoftware/spine-pixi-v8";
import type { Spine } from "cassia-engine/component";
import { Size, size, vec2, Vec2 } from "cassia-engine/math";
import { NODE_EVENT_TYPE } from "cassia-engine/node";
import { SpineRenderer } from "../define";
import { RenderObject } from "./RenderObject";

export interface RenderSpine {
    /**
     * @internal
     */
    _spineRenderer: SpineRenderer | null;
}

export class RenderSpine extends RenderObject<Spine> {
    protected override onRenderCreate(): void {
        this.renderNode.applySize = (): void => {
            if (!this._spineRenderer) return;

            const skeletonData = this.component.spineSkeleton?.data;
            if (!skeletonData) return;

            const skeletonDataSize = this._getSkeletonDataSize(skeletonData);
            this.node.size.set(skeletonDataSize);
        };

        this.renderNode.applyAnchor = (): void => {
            if (!this._spineRenderer) return;

            const skeletonData = this.component.spineSkeleton?.data;
            if (!skeletonData) return;

            const skeletonDataAnchor = this._getSkeletonDataAnchor(skeletonData);
            this.node.anchor.set(skeletonDataAnchor);
        };
        this.renderNode.applyColor = (): void => {
            if (!this._spineRenderer) return;

            const color = this.node.color.toDecimal();
            const alpha = this.node.color.a / 255;

            this._spineRenderer.tint = color;
            this._spineRenderer.alpha = alpha;
        };
    }

    /**
     * @internal
     */
    public applySpineSkeleton(): void {
        const skeletonData = this.component.spineSkeleton?.data;

        if (!skeletonData) {
            this._spineRenderer?.destroy();
            this._spineRenderer = null;
            return;
        }

        if (this._spineRenderer && this._spineRenderer.skeleton.data !== skeletonData) {
            this._spineRenderer.destroy();
            this._spineRenderer = null;
        }

        if (!this._spineRenderer) {
            this._spineRenderer = new SpineRenderer(skeletonData);
            this.renderContainer.addChild(this._spineRenderer);

            const skeletonDataSize = this._getSkeletonDataSize(skeletonData);
            const skeletonDataAnchor = this._getSkeletonDataAnchor(skeletonData);

            this.node.setSize(skeletonDataSize);
            this.node.setAnchor(skeletonDataAnchor);

            this.renderNode.applyColor();

            this._spineRenderer.state.addListener({
                start: (trackEntry: ITrackEntry) => {
                    this.component.node.emit(
                        NODE_EVENT_TYPE.SpineAnimationStart,
                        trackEntry,
                        trackEntry.trackIndex,
                        trackEntry.animation?.name ?? ""
                    );
                },
                end: (trackEntry: ITrackEntry) => {
                    this.component.node.emit(
                        NODE_EVENT_TYPE.SpineAnimationEnd,
                        trackEntry,
                        trackEntry.trackIndex,
                        trackEntry.animation?.name ?? ""
                    );
                },
                complete: (trackEntry: ITrackEntry) => {
                    this.component.node.emit(
                        NODE_EVENT_TYPE.SpineAnimationComplete,
                        trackEntry,
                        trackEntry.trackIndex,
                        trackEntry.animation?.name ?? ""
                    );
                },
            });
            return;
        }
    }

    private _getSkeletonDataSize(skeletonData: SkeletonData): Size {
        return size(skeletonData.width, skeletonData.height);
    }
    private _getSkeletonDataAnchor(skeletonData: SkeletonData): Vec2 {
        const anchorX = -(skeletonData.x / skeletonData.width);
        const anchorY = -(skeletonData.y / skeletonData.height);
        return vec2(anchorX, anchorY);
    }

    public getAnimations(): Animation[] {
        return this._spineRenderer?.skeleton.data.animations ?? [];
    }

    public setAnimation(trackIndex: number, animationName: string, options: ISpineSetAnimationOptions = {}): void {
        if (!this._spineRenderer) return;

        const loop = options.loop ?? true;
        const reverse = options.reverse ?? false;
        const timeScale = options.timeScale ?? 1;
        const alpha = options.alpha ?? 1;

        const track = this._spineRenderer.state.setAnimation(trackIndex, animationName, loop);
        track.timeScale = timeScale;
        track.reverse = reverse;
        track.alpha = alpha;
    }
    public addAnimation(trackIndex: number, animationName: string, options: ISpineAddAnimationOptions = {}): void {
        if (!this._spineRenderer) return;

        const loop = options.loop ?? true;
        const reverse = options.reverse ?? false;
        const timeScale = options.timeScale ?? 1;
        const alpha = options.alpha ?? 1;
        const delay = options.delay ?? 0;

        const track = this._spineRenderer.state.addAnimation(trackIndex, animationName, loop, delay);
        track.timeScale = timeScale;
        track.reverse = reverse;
        track.alpha = alpha;
    }

    public getTracks(): ITrackEntry[] {
        return (this._spineRenderer?.state.tracks as ITrackEntry[]) ?? [];
    }

    public getMix(from: Animation, to: Animation): number | null {
        return this._spineRenderer?.state.data.getMix(from, to) ?? null;
    }
    public setMix(fromName: string, toName: string, duration: number): void {
        this._spineRenderer?.state.data.setMix(fromName, toName, duration);
    }

    public getBones(): Bone[] {
        return this._spineRenderer?.skeleton.bones ?? [];
    }
    public findBone(boneName: string): Bone | null {
        return this._spineRenderer?.skeleton.findBone(boneName) ?? null;
    }
}

export interface ISpineSetAnimationOptions {
    loop?: boolean;
    reverse?: boolean;
    timeScale?: number;
    alpha?: number;
}

export interface ISpineAddAnimationOptions extends ISpineSetAnimationOptions {
    delay?: number;
}

export type ITrackEntry = TrackEntry;
