import { createBuiltinCanvas } from "cassia-engine/canvas";
import { type Color, type Size, size, type Vec2, vec2 } from "cassia-engine/math";
import { Application, Container, Graphics } from "pixi.js";
import type { RenderScene } from "./RenderScene";
import type { ContainerRenderer } from "./define";

export class RenderSystem {
    private _app!: Application;
    private _stage!: Container;
    private _canvas!: HTMLCanvasElement;

    public get canvasParent(): HTMLDivElement {
        return this._canvas.parentElement as HTMLDivElement;
    }

    private _rootContainer!: Container;
    private _sceneContainer!: Container;
    private _drawContainer!: Container;
    private _drawGraphics!: Graphics;

    private _designSize: Size = size(1280, 720);
    public get designSize(): Size {
        return this._designSize;
    }
    public set designSize(value: Size) {
        this._designSize.set(value);
        this.applyDesignSize();
    }

    public setDesignSize(size?: Size): void;
    public setDesignSize(width?: number, height?: number): void;
    public setDesignSize(sizeOrWidth?: Size | number, height?: number): void;
    public setDesignSize(...args: any[]): void {
        this._designSize.set(...args);
        this.applyDesignSize();
    }

    public applyDesignSize(): void {
        this._resize();
    }

    public extractRendererData(renderer: ContainerRenderer): Promise<string> {
        return this._app.renderer.extract.base64(renderer);
    }

    private _resize(): void {
        if (!this._app) return;

        const viewSize = this.getViewSize();
        this._app.renderer.resize(viewSize.width, viewSize.height);

        const stage = this._app.stage;
        stage.position.set(this._app.screen.width / 2, this._app.screen.height / 2);

        const designSize = this._designSize;
        const scale = vec2(viewSize.width / designSize.width, viewSize.height / designSize.height);

        this._viewScale = Math.min(scale.x, scale.y);
        stage.scale.set(this._viewScale, -this._viewScale);
    }

    public async init(options: Partial<IRenderSystemInitOptions>): Promise<void> {
        try {
            this._app = await this._createApp(options.canvas ?? createBuiltinCanvas());
            this._stage = this._app.stage;
            this._canvas = this._app.canvas;

            this._rootContainer = new Container({
                isRenderGroup: true,
            });
            this._rootContainer.label = "RootContainer";

            this._sceneContainer = new Container();
            this._sceneContainer.label = "SceneContainer";

            this._drawContainer = new Container();
            this._drawContainer.label = "DrawContainer";

            this._drawGraphics = new Graphics();
            this._drawGraphics.label = "DrawGraphics";

            this._stage.addChild(this._rootContainer);
            this._rootContainer.addChild(this._sceneContainer);
            this._rootContainer.addChild(this._drawContainer);
            this._drawContainer.addChild(this._drawGraphics);

            this._resize();
            window.addEventListener("resize", () => {
                this._resize();
            });

            if (options.designSize) {
                this.setDesignSize(options.designSize);
            }
            if (options.backgroundColor) {
                this.setBackgroundColor(options.backgroundColor);
            }
        } catch (e) {
            throw e;
        }
    }

    public render(): void {
        this._app.render();
    }

    public drawPolygon(vertices: Vec2[], color: Color): void {
        if (!this._drawGraphics) return;

        this._drawGraphics.poly(vertices).stroke({
            color: color.toHex(),
            pixelLine: true,
        });
    }
    public drawRect(position: Vec2, size: Size, color: Color): void {
        if (!this._drawGraphics) return;

        this._drawGraphics.rect(position.x, position.y, size.width, size.height).stroke({
            color: color.toHex(),
            pixelLine: true,
        });
    }
    public clearDraw(): void {
        if (!this._drawGraphics) return;
        this._drawGraphics.clear();
    }

    private _renderScene: RenderScene | null = null;
    public get renderScene(): RenderScene | null {
        return this._renderScene;
    }
    public setRenderScene(renderScene: RenderScene): void {
        this._renderScene = renderScene;

        const sceneRenderer = this._renderScene.renderer;
        this._sceneContainer.addChild(sceneRenderer);
    }

    /**
     * 获取屏幕尺寸
     */
    public getScreenSize(): Size {
        return size(window.screen.width, window.screen.height);
    }
    public get screenWidth(): number {
        return this.getScreenSize().width;
    }
    public get screenHeight(): number {
        return this.getScreenSize().height;
    }

    /**
     * 获取视口尺寸
     */
    public getViewSize(): Size {
        return size(this.canvasParent.clientWidth, this.canvasParent.clientHeight);
    }
    public get viewWidth(): number {
        return this.getViewSize().width;
    }
    public get viewHeight(): number {
        return this.getViewSize().height;
    }

    /**
     * 获取游戏视口尺寸
     */
    public getGameViewSize(): Size {
        const viewSize = this.getViewSize();
        return size(viewSize.width / this._viewScale, viewSize.height / this._viewScale);
    }
    public get gameViewWidth(): number {
        return this.getGameViewSize().width;
    }
    public get gameViewHeight(): number {
        return this.getGameViewSize().height;
    }

    private _viewScale: number = 1;
    public get viewScale(): number {
        return this._viewScale;
    }

    public setBackgroundColor(color: Color): void {
        this._app.renderer.background.color = color.toDecimal();
    }

    private async _createApp(canvas: HTMLCanvasElement): Promise<Application> {
        try {
            const app = new Application();
            await app.init({
                width: this._designSize.width,
                height: this._designSize.height,
                backgroundColor: "#808080",
                resolution: window.devicePixelRatio * 1,
                autoDensity: true,
                autoStart: false,

                eventMode: "none",
                eventFeatures: {
                    move: false,
                    globalMove: false,
                    click: false,
                    wheel: false,
                },

                canvas: canvas,
            });

            window.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            });

            return app;
        } catch (e) {
            throw e;
        }
    }
}

export interface IRenderSystemInitOptions {
    canvas: HTMLCanvasElement;
    backgroundColor: Color;
    designSize: Size;
}
