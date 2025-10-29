import { Component, defineComponent, Sprite } from "cassia-engine/component";
import { resourceSystem } from "cassia-engine";

export interface ISpriteAnimationData {
    name: string;
    frames: ISpriteAnimationFrameData[];
}

export interface ISpriteAnimationFrameData {
    textureName: string;
    duration: number;
}

@defineComponent({ componentName: "SpriteAnimation" })
export class SpriteAnimation extends Component {
    private _animations: ISpriteAnimationData[] = [];
    public get animations(): ISpriteAnimationData[] {
        return this._animations;
    }
    public setAnimations(animations: ISpriteAnimationData[]): void {
        if (this._currentAnimation) return console.warn("Cannot set animations while an animation is playing");

        this._animations = animations;
    }

    private _currentAnimation: ISpriteAnimationData | null = null;
    public get currentAnimation(): ISpriteAnimationData | null {
        return this._currentAnimation;
    }

    public get isPlaying(): boolean {
        return this._currentAnimation !== null;
    }

    private _currentFrameIndex: number = 0;
    public get currentFrameIndex(): number {
        return this._currentFrameIndex;
    }

    private _currentFrameDuration: number = 0;
    public get currentFrameDuration(): number {
        return this._currentFrameDuration;
    }

    private _loop: boolean = false;
    public get loop(): boolean {
        return this._loop;
    }
    public set loop(value: boolean) {
        this._loop = value;
    }

    private _paused: boolean = false;
    public get paused(): boolean {
        return this._paused;
    }
    public set paused(value: boolean) {
        this._paused = value;
    }

    private _getAnimation(animationName: string): ISpriteAnimationData | null {
        return this._animations.find((animation) => animation.name === animationName) ?? null;
    }

    public play(animationName: string, loop: boolean = true): void {
        const animation = this._getAnimation(animationName);
        if (!animation) return console.warn(`Animation ${animationName} not found`);

        this._currentAnimation = animation;
        this._currentFrameIndex = 0;
        this._currentFrameDuration = 0;
        this._loop = loop;
    }

    public pause(): void {
        this._paused = true;
    }
    public resume(): void {
        this._paused = false;
    }

    public stop(): void {
        this._currentAnimation = null;
        this._currentFrameIndex = 0;
        this._currentFrameDuration = 0;
        this._loop = false;
    }

    protected override onLateUpdate(dt: number): void {
        if (this._paused) return;
        if (!this._currentAnimation) return;

        const sprite = this.node.getComponent(Sprite);
        if (!sprite) return console.error("Sprite component not found");

        const frame = this._currentAnimation.frames[this._currentFrameIndex];
        if (!frame) {
            console.error(`Frame ${this._currentFrameIndex} not found`);
            return;
        }

        const texture = resourceSystem.getTexture(frame.textureName);
        if (texture) {
            sprite.texture = texture;
        } else {
            console.error(`Texture ${frame.textureName} not found`);
        }

        this._currentFrameDuration += dt;
        if (this._currentFrameDuration >= frame.duration) {
            this._currentFrameDuration = 0;

            if (this._currentFrameIndex < this._currentAnimation.frames.length - 1) {
                this._currentFrameIndex++;
            } else {
                this._currentFrameIndex = 0;

                if (!this._loop) {
                    this.stop();
                }
            }
        }
    }
}
