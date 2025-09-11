# Docusaurus Style Admonitions for Obsidian (Fuwari Adapted)

A plugin for Obsidian that adds support for [Docusaurus-style admonitions](https://docusaurus.io/docs/markdown-features/admonitions). This plugin allows you to create stylish, colored callout boxes with icons for different types of information. 

**This version has been specially adapted for the [Fuwari blog template](https://github.com/saicaca/fuwari)** to ensure seamless compatibility between Obsidian notes and Fuwari blog posts. This is especially useful if you manage your Fuwari blog content as an Obsidian Vault and want consistent admonition styling across both platforms.

[中文文档](./README_zh.md) | [English Documentation](./README.md)

## Features

- Supports five admonition types: note, tip, important, warning, and caution
- GitHub-style admonition syntax support (> [!NOTE], > [!TIP], etc.)
- Works in both Reading Mode and Live Preview (Edit Mode)
- Custom styling with attractive icons and color-coding
- Full compatibility with Obsidian themes
- Flexible syntax options
- Custom titles support

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Navigate to Community Plugins
3. Click "Browse" and search for "Docusaurus Style Admonitions Fuwari"
4. Install the plugin and enable it

### Manual Installation

1. Download the latest release (main.js, styles.css, manifest.json)
2. Create a folder named obsidian-docusaurus-style-admonitions in your vault's .obsidian/plugins/ directory
3. Copy the downloaded files into this folder
4. Enable the plugin in Obsidian settings

## Usage

You can create admonitions using the official Docusaurus syntax:

```text
:::note
This is a note
:::

:::tip
Here's a useful tip!
:::

:::important
This is very important information
:::

:::warning
Be careful with this
:::

:::caution
This is a dangerous action!
:::
```

### Custom Titles

You can include custom titles like this:

```text
:::note[My Custom Title]
This is a note with a custom title
:::
```

### GitHub-Style Syntax

The plugin also supports GitHub-style admonition syntax:

```text
> [!NOTE]
> This is a GitHub-style note

> [!TIP]
> Here's a GitHub-style tip

> [!IMPORTANT]
> This is important GitHub-style information

> [!WARNING]
> This is a GitHub-style warning

> [!CAUTION]
> This is a GitHub-style caution
```

## Configuration

The plugin settings allow you to:

1. Enable or disable specific admonition types (note, tip, important, warning, caution)
2. Each admonition type can be individually toggled on or off

## Compatibility

- Requires Obsidian v1.4.0 or higher
- Works with most community themes

## Support

If you encounter any issues or have suggestions for this Fuwari-adapted version, please file an issue on the [GitHub repository](https://github.com/CuteLeaf/obsidian-docusaurus-style-admonitions).

For the original plugin, please visit the [original repository](https://github.com/rwbr/obsidian-docusaurus-style-admonitions).

## License

This project is licensed under the MIT License.

## Acknowledgments

This plugin is based on the original [Docusaurus Style Admonitions](https://github.com/rwbr/obsidian-docusaurus-style-admonitions) by [Ralf Weinbrecher](https://github.com/rwbr). Special thanks to the original author for creating this excellent foundation.

This adapted version has been specifically modified for compatibility with the [Fuwari blog template](https://github.com/saicaca/fuwari) to provide seamless admonition styling between Obsidian and Fuwari blog posts.

## Author

Adapted for Fuwari by [CuteLeaf](https://github.com/CuteLeaf)
Original plugin by [Ralf Weinbrecher](https://github.com/rwbr)

