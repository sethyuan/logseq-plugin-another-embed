中文 | [English](README.en.md)

# logseq-plugin-another-embed

本插件提供了两种不一样的嵌入块/页的方式。支持嵌入块的自动标题（auto heading）处理，自动根据上下文调整标题大小。

本插件还额外提供了对块剪切粘贴以及回退删除导致引用消失的处理。

插件十分依赖于 Logseq 的 DOM 结构，因此对版本比较敏感，作者会尽量保证对最新版 Logseq 的兼容性，其它版本由于精力有限，不会特意去支持。

## 使用展示

https://user-images.githubusercontent.com/3410293/202061912-7a1495ba-09af-4657-9442-c29d6d5abb55.mp4

## 自定义样式

主题开发者可通过设置 `--kef-another-embed-handle-color` CSS 变量来控制嵌入块控制条的颜色。例如：

```css
::after {
  --kef-another-embed-handle-color: #ff0;
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
