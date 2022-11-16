# logseq-plugin-another-embed

本插件提供了两种不一样的嵌入块/页的方式。

This plugin provides 2 extra ways to embed blocks/pages.

插件十分依赖于 Logseq 的 DOM 结构，因此对版本比较敏感，作者会尽量保证对最新版 Logseq 的兼容性，其它版本由于精力有限，不会特意去支持。

The plugin relies heavily on Logseq's DOM structure, so it is version sensitive. The author will try to ensure compatibility with the latest version of Logseq, other versions will not be purposely supported.

## 使用展示 (Usage)

## 自定义样式 (Style Customization)

主题开发者可通过设置 `--kef-another-embed-handle-color` CSS 变量来控制嵌入块控制条的颜色。例如：

Theme developers can control the embed's control bar's color by setting the `--kef-another-embed-handle-color` CSS variable. E.g:

```css
::after {
  --kef-another-embed-handle-color: #ff0;
}
```
