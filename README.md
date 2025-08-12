# Cassia Engine

目标：一个专注于 2D、易用性和高性能的 TypeScript 游戏引擎。

版本：0.0.12

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
import { engine } from "cassia-engine";

// 启动引擎
await engine.start();
```

## 资源

```typescript
import { resourceSystem, RESOURCE_TYPE } from "cassia-engine";

// 加载图片/音频资源
await resourceSystem.loadResources([
    {
        name: "square",
        type: RESOURCE_TYPE.Texture,
        src: "./square.png",
    },
    {
        name: "title",
        type: RESOURCE_TYPE.Texture,
        src: "./title.png",
        options: {
            pixelStyle: true,
        },
    },
    {
        name: "eat",
        type: RESOURCE_TYPE.Audio,
        src: "./eat.mp3",
    },
]);
```

## 场景

```typescript
import { Scene, defineScene, sceneManager } from "cassia-engine";

// 定义场景
@defineScene({ sceneName: "MainScene" })
export class MainScene extends Scene {
    onInit(): void {
        // ...
    }
}

// 加载场景
sceneManager.loadScene(MainScene);
```

## 节点与组件

```typescript
import { Component, defineComponent, Node } from "cassia-engine";

// 定义组件
@defineComponent({ componentName: "MyComponent" })
export class MyComponent extends Component {
    onInit(): void {
        // ...
    }

    onStart(): void {
        // ...
    }

    onDestroy(): void {
        // ...
    }

    // 更多生命周期函数详见类型定义或API文档...
}

// 创建节点
const myNode = new Node();

// 添加组件
myNode.addComponent(MyComponent);

// 获取组件
myNode.getComponent(MyComponent);

// 移除组件
myNode.removeComponent(MyComponent);

// ...
```

## 精灵组件

```typescript
import { Node, Sprite, resourceSystem } from "cassia-engine";

// 创建节点
const myNode = new Node();

// 添加精灵组件
const sprite = myNode.addComponent(Sprite);

// 设置纹理
sprite.texture = resourceSystem.getTexture("square")!;

// ...
```

## 文本组件

```typescript
import { Node, Text } from "cassia-engine";

// 创建节点
const myNode = new Node();

// 添加文本组件
const text = myNode.addComponent(Text);

// 设置文本内容
text.text = "Hello, Cassia Engine!";

// 设置字体大小
text.fontSize = 32;

// ...
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

-   渲染/pixi.js https://pixijs.com/
-   音频/howler https://howlerjs.com/
-   物理/rapier2d https://rapier.rs/

### 开发依赖

-   fs-extra https://github.com/jprichardson/node-fs-extra
-   madge https://github.com/pahen/madge
-   nodemon https://nodemon.io/
-   tsdown https://tsdown.dev/
-   typedoc https://typedoc.org/
-   typescript https://www.typescriptlang.org/
-   vitest https://cn.vitest.dev/

### -------------------------------------------------

### 交流

github: https://github.com/yxdtg/cassia-engine

email: <EMAIL> 2430877819@qq.com

### 贡献

遇到问题或有好的建议，欢迎提交 issue 或 pr。

## 许可证

MIT
