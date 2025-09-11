# Obsidian Docusaurus 风格提示框插件 (Fuwari 适配版)

一个为 Obsidian 添加 [Docusaurus 风格提示框](https://docusaurus.io/docs/markdown-features/admonitions) 支持的插件。此插件允许您为不同类型的信息创建带有图标的彩色提示框。

**此版本专为 [Fuwari 博客模板](https://github.com/saicaca/fuwari) 进行了特别适配**，确保 Obsidian 笔记与 Fuwari 博客文章之间的无缝兼容性。如果您使用 Obsidian Vault 管理 Fuwari 博客内容，并希望在两个平台之间保持一致的提示框样式，这将非常有用。

[中文文档](./README_zh.md) | [English Documentation](./README.md)

## 功能特性

- 支持五种提示框类型：note（笔记）、tip（提示）、important（重要）、warning（警告）和 caution（注意）
- 支持 GitHub 风格的提示框语法（> [!NOTE]、> [!TIP] 等）
- 在阅读模式和实时预览（编辑模式）下均可正常工作
- 带有精美图标和颜色编码的自定义样式
- 与 Obsidian 主题完全兼容
- 灵活的语法选项
- 支持自定义标题

## 安装方法

### 从 Obsidian 社区插件安装

1. 打开 Obsidian 设置
2. 导航到社区插件
3. 点击"浏览"并搜索"Docusaurus Style Admonitions Fuwari"
4. 安装并启用插件

### 手动安装

1. 下载最新版本文件（main.js、styles.css、manifest.json）
2. 在您的库的 .obsidian/plugins/ 目录中创建名为 obsidian-docusaurus-style-admonitions-fuwari 的文件夹
3. 将下载的文件复制到此文件夹中
4. 在 Obsidian 设置中启用插件

## 使用方法

您可以使用官方 Docusaurus 语法创建提示框：

```text
:::note
这是一个笔记
:::

:::tip
这里有一个有用的提示！
:::

:::important
这是非常重要的信息
:::

:::warning
请小心这个操作
:::

:::caution
这是一个危险的操作！
:::
```

### 自定义标题

您可以像这样包含自定义标题：

```text
:::note[我的自定义标题]
这是一个带有自定义标题的笔记
:::
```

### GitHub 风格语法

插件还支持 GitHub 风格的提示框语法：

```text
> [!NOTE]
> 这是一个 GitHub 风格的笔记

> [!TIP]
> 这是一个 GitHub 风格的提示
```

## 配置设置

插件设置允许您：

1. 启用或禁用特定的提示框类型（note、tip、important、warning、caution）
2. 每种提示框类型都可以单独开启或关闭

## 兼容性

- 需要 Obsidian v1.4.0 或更高版本
- 与大多数社区主题兼容

## 技术支持

如果您在使用此 Fuwari 适配版本时遇到任何问题或有建议，请在 [GitHub 仓库](https://github.com/CuteLeaf/obsidian-docusaurus-style-admonitions) 中提交 issue。

有关原始插件的问题，请访问 [原始仓库](https://github.com/rwbr/obsidian-docusaurus-style-admonitions)。

## 许可证

本项目基于 MIT 许可证授权。

## 致谢

此插件基于 [Ralf Weinbrecher](https://github.com/rwbr) 开发的原始 [Docusaurus Style Admonitions](https://github.com/rwbr/obsidian-docusaurus-style-admonitions) 插件。特别感谢原作者创建了这个优秀的基础版本。

此适配版本专门为 [Fuwari 博客模板](https://github.com/saicaca/fuwari) 兼容性进行了修改，以在 Obsidian 和 Fuwari 博客文章之间提供无缝的提示框样式。

## 作者

Fuwari 适配：[CuteLeaf](https://github.com/CuteLeaf)
原始插件作者：[Ralf Weinbrecher](https://github.com/rwbr)
