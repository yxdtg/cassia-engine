# Cassia Engine

目标：一个专注于 2D、易用性和高性能的 TypeScript 游戏引擎。

版本：0.0.15

# 安装

npm

```bash
npm install cassia-engine
```

yarn

```bash
yarn add cassia-engine
```

pnpm

```bash
pnpm add cassia-engine
```

# 快速开始

```typescript
import {
    engine,
    resourceSystem,
    sceneManager,
    Scene,
    defineScene,
    Node,
    Component,
    defineComponent,
    Sprite,
    Text,
    Layer,
} from "cassia-engine";

await engine.start();

await resourceSystem.loadTextures([
    {
        name: "circle",
        src: "./circle.png",
    },
    {
        name: "square",
        src: "./square.png",
    },
]);

@defineScene({ sceneName: "GameScene" })
export class GameScene extends Scene {
    public mainLayer: Layer = null!;

    protected onInit(): void {
        this.mainLayer = new Layer("Main");
        this.addLayer(this.mainLayer);

        const squareNode = new Node({ layer: this.mainLayer });
        squareNode.addComponent(Sprite)!.texture = resourceSystem.getTexture("square");
        squareNode.setPosition(-200, 0);

        const circleNode = new Node({ layer: this.mainLayer });
        circleNode.addComponent(Sprite)!.texture = resourceSystem.getTexture("circle");
        circleNode.x = 200;

        const textNode = new Node({ layer: this.mainLayer });
        textNode.addComponent(Text)!.text = "Hello, Cassia Engine!";
        textNode.addComponent(MyComponent);
    }
}

@defineComponent({ componentName: "MyComponent" })
export class MyComponent extends Component {
    protected onStart(): void {
        console.log("MyComponent started");
    }
}

sceneManager.loadScene(GameScene);
```

## 开发打包

```bash
pnpm run dev
```

## 生产打包

```bash
pnpm run build
```

##

## 等等等

### 文档正在编写中，请先自行探索...

### -------------------------------------------------

## 特别鸣谢 (以下是使用到的开源项目，排名不分先后)

-   [pixi.js](https://pixijs.com/)
-   [howler](https://howlerjs.com/)
-   [rapier2d](https://rapier.rs/)
-   [tween.js](https://github.com/tweenjs/tween.js)

### 开发依赖

-   [fs-extra](https://github.com/jprichardson/node-fs-extra)
-   [madge](https://github.com/pahen/madge)
-   [nodemon](https://nodemon.io/)
-   [tsdown](https://tsdown.dev/)
-   [typedoc](https://typedoc.org/)
-   [typescript](https://www.typescriptlang.org/)
-   [vitest](https://cn.vitest.dev/)

### -------------------------------------------------

### 交流

[github](https://github.com/yxdtg/cassia-engine)

email:2430877819@qq.com

### 贡献

遇到问题或有好的建议，欢迎提交 issue 或 pr。

## 许可证

MIT
