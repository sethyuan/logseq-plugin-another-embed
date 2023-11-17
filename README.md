中文 | [English](README.en.md)

# logseq-plugin-another-embed

本插件提供了两种不一样的嵌入块/页的方式。支持嵌入块的自动标题（auto heading）处理，自动根据上下文调整标题大小。

## 功能

- 提供了两种不一样的嵌入块/页的方式。
- 嵌入块路径的面包屑。
- 支持嵌入块的自动标题（auto heading）处理，自动根据上下文调整标题大小。
- 设置自动标题的快捷键。
- 在页面引用上显示页面图标，如有设置的话。
- 切换块属性显示隐藏的命令。
- 拖拽调整表格列宽（不支持 v2 表格）。

插件十分依赖于 Logseq 的 DOM 结构，因此对版本比较敏感，作者会尽量保证对最新版 Logseq 的兼容性，其它版本由于精力有限，不会特意去支持。

## 使用展示

https://user-images.githubusercontent.com/3410293/202061912-7a1495ba-09af-4657-9442-c29d6d5abb55.mp4

https://github.com/sethyuan/logseq-plugin-another-embed/assets/3410293/d341babd-4898-4558-bb06-04e2e4dc7f10

https://github.com/sethyuan/logseq-plugin-another-embed/assets/3410293/cb0bf2e5-2bac-4cc6-b2d5-77e9024154df

如果想要隐藏 `col-w-?` 属性可以在 `config.edn` 中进行配置：

```clojure
:block-hidden-properties #{:col-w-1 :col-w-2 :col-w-3 :col-w-4 :col-w-5 :col-w-6 :col-w-7 :col-w-8 :col-w-9}
```

## 自定义样式

主题开发者可通过设置 `--kef-ae-handle-color` CSS 变量来控制嵌入块控制条的颜色。例如：

```css
::after {
  --kef-ae-handle-color: #ff0;
}
```

每级标题的字体大小可通过以下 CSS 变量设置：

```css
:root {
  --kef-ae-h1-fs: 2em;
  --kef-ae-h2-fs: 1.5em;
  --kef-ae-h3-fs: 1.2em;
  --kef-ae-h4-fs: 1em;
  --kef-ae-h5-fs: 0.83em;
  --kef-ae-h6-fs: 0.75em;
}
```

## Buy me a coffee

如果您认为我所开发的软件对您有所帮助，并且愿意给予肯定和支持，不妨扫描下方的二维码进行打赏。感谢您的支持与关注。

![wx](https://user-images.githubusercontent.com/3410293/236807219-cf21180a-e7f8-44a9-abde-86e1e6df999b.jpg) ![ap](https://user-images.githubusercontent.com/3410293/236807256-f79768a7-16e0-4cbf-a9f3-93f230feee30.jpg)
