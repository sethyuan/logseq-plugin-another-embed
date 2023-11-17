[中文](README.md) | English

# logseq-plugin-another-embed

This plugin provides 2 extra ways to embed blocks/pages. Supports auto heading processing for embedded blocks, automatically adjusting the heading size according to the context.

## Feature Highlights

- Provide 2 extra ways to embed blocks/pages.
- Path breadcrumb for embeds.
- Auto heading processing for embedded blocks, automatically adjusting the heading size according to the context.
- Shortcut for using auto heading.
- Show page's icon in page references when it's set on the page.
- Command to toggle to displaying of block properties.
- Drag to adjust table's column width (v2 tables not supported).

The plugin relies heavily on Logseq's DOM structure, so it is version sensitive. The author will try to ensure compatibility with the latest version of Logseq, other versions will not be purposely supported.

## Usage

https://user-images.githubusercontent.com/3410293/202061912-7a1495ba-09af-4657-9442-c29d6d5abb55.mp4

https://github.com/sethyuan/logseq-plugin-another-embed/assets/3410293/d341babd-4898-4558-bb06-04e2e4dc7f10

https://github.com/sethyuan/logseq-plugin-another-embed/assets/3410293/cb0bf2e5-2bac-4cc6-b2d5-77e9024154df
To disable displaying of `col-w-?` properties use `config.edn`:
```clojure
:block-hidden-properties #{:col-w-1 :col-w-2 :col-w-3 :col-w-4 :col-w-5 :col-w-6 :col-w-7 :col-w-8 :col-w-9}
```

## Style Customization

Theme developers can control the embed's control bar's color by setting the `--kef-ae-handle-color` CSS variable. E.g:

```css
::after {
  --kef-ae-handle-color: #ff0;
}
```

The font size of each heading level can be set with the following CSS variables:

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

If you think the software I have developed is helpful to you and would like to give recognition and support, you may buy me a coffee using following link. Thank you for your support and attention.

<a href="https://www.buymeacoffee.com/sethyuan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
