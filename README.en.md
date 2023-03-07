[中文](README.md) | English

# logseq-plugin-another-embed

This plugin provides 2 extra ways to embed blocks/pages. Supports auto heading processing for embedded blocks, automatically adjusting the heading size according to the context.

## Feature Highlights

- Provide 2 extra ways to embed blocks/pages.
- Path breadcrumb for embeds.
- Auto heading processing for embedded blocks, automatically adjusting the heading size according to the context.
- Shortcut for using auto heading.
- Handling for cases where a block cut-and-paste (cut via menu not supported) or backward deletion would cause missing references.
- Namespace or tagged pages based tree like "Favorites" and "Recents".
- Slider to adjust the left sidebar's width.

The plugin relies heavily on Logseq's DOM structure, so it is version sensitive. The author will try to ensure compatibility with the latest version of Logseq, other versions will not be purposely supported.

## Usage

https://user-images.githubusercontent.com/3410293/202061912-7a1495ba-09af-4657-9442-c29d6d5abb55.mp4

https://user-images.githubusercontent.com/3410293/218662951-59a99b70-b86c-476b-8389-b388a147a7c9.mp4

https://user-images.githubusercontent.com/3410293/220614901-4aa9bb01-414a-4eb2-bd37-5428edc0a4e8.mp4

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
