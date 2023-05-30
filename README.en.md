[中文](README.md) | English

# logseq-plugin-another-embed

This plugin provides 2 extra ways to embed blocks/pages. Supports auto heading processing for embedded blocks, automatically adjusting the heading size according to the context.

## Feature Highlights

- Provide 2 extra ways to embed blocks/pages.
- Path breadcrumb for embeds.
- Auto heading processing for embedded blocks, automatically adjusting the heading size according to the context.
- Shortcut for using auto heading.
- Handling for cases where a block cut-and-paste (cut via menu not supported) or backward deletion would cause missing references.
- Tree structure for "Favorites" and "Recents" based on namespaces and/or tagged pages. You can affect the order of display by writing a `fixed` property on the page you want to adjust, e.g, `fixed:: 100`. Smaller the number, closer to the top it will be.
- Slider to adjust the left sidebar's width.

The plugin relies heavily on Logseq's DOM structure, so it is version sensitive. The author will try to ensure compatibility with the latest version of Logseq, other versions will not be purposely supported.

## Usage

https://user-images.githubusercontent.com/3410293/202061912-7a1495ba-09af-4657-9442-c29d6d5abb55.mp4

https://user-images.githubusercontent.com/3410293/220614901-4aa9bb01-414a-4eb2-bd37-5428edc0a4e8.mp4

https://github.com/sethyuan/logseq-plugin-another-embed/assets/3410293/32b2a19e-19b3-4113-8fee-f2a445d151cc

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
