import { defineComponent } from "cassia-engine/component";
import { RenderSpine, type ISpineAddAnimationOptions, type ISpineSetAnimationOptions } from "cassia-engine/render";
import { RenderComponent } from "./RenderComponent";
import type { SpineSkeletonResource } from "cassia-engine/resource";
import { RESOURCE_TYPE, resourceSystem } from "cassia-engine";

@defineComponent({ componentName: "Spine" })
export class Spine extends RenderComponent<RenderSpine> {
    protected override onRenderCreate(): RenderSpine {
        return new RenderSpine(this);
    }

    private _spineSkeleton: SpineSkeletonResource | null = null;
    public get spineSkeleton(): SpineSkeletonResource | null {
        return this._spineSkeleton;
    }
    public set spineSkeleton(value: SpineSkeletonResource | null) {
        this._spineSkeleton = value;
        this.applySpineSkeleton();
    }

    /**
     * @internal
     */
    public applySpineSkeleton(): void {
        this.renderObject.applySpineSkeleton();
    }

    public get spineSkeletonName(): string {
        return this._spineSkeleton?.name ?? "";
    }
    public set spineSkeletonName(value: string) {
        const spineSkeleton = resourceSystem.getResource(RESOURCE_TYPE.SpineSkeleton, value);
        this.spineSkeleton = spineSkeleton;
    }

    public get animations() {
        return this.renderObject.getAnimations();
    }
    public get animationNames(): string[] {
        return this.animations.map((animation) => animation.name);
    }

    public setAnimation(trackIndex: number, animationName: string, options: ISpineSetAnimationOptions = {}): void {
        this.renderObject.setAnimation(trackIndex, animationName, options);
    }
    public addAnimation(trackIndex: number, animationName: string, options: ISpineAddAnimationOptions = {}): void {
        this.renderObject.addAnimation(trackIndex, animationName, options);
    }

    public get tracks() {
        return this.renderObject.getTracks();
    }
    public getTrack(trackIndex: number) {
        return this.tracks[trackIndex] ?? null;
    }

    public setMix(fromName: string, toName: string, duration: number): void {
        this.renderObject.setMix(fromName, toName, duration);
    }

    public get bones() {
        return this.renderObject.getBones();
    }
    public get boneNames(): string[] {
        return this.bones.map((bone) => bone.data.name);
    }

    public findBone(boneName: string) {
        return this.renderObject.findBone(boneName);
    }
}
