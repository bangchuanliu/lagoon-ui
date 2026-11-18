# Lagoon UI

我所有 macOS 桌面 app 共用的界面风格，从 Cine 抽出来。默认是「潟湖」配色：深青底色 + 薄荷绿强调色。

打开 `preview.html` 看效果（右上角可以切换 5 种配色和标准 / 紧凑）。

## 配色

| `data-theme` | 名字 | 样子 | 适合 |
|---|---|---|---|
| `lagoon`（默认） | 潟湖 | 深青 + 薄荷绿 | 什么都行 |
| `lagoon-light` | 潟湖浅色 | 深青边框 + 白色内容 | 白天、长时间阅读 |
| `cinema` | 放映厅 | 中性暖灰 + 琥珀 | 图片多的 app（电影、照片）。纯文字的 app 会显得很灰 |
| `graphite` | 石墨 | 深灰 + 蓝，接近 VS Code | 工具类 |
| `daylight` | 日光 | 茄紫边框 + 白色内容 | 浅色 |
| `dracula` | Dracula | 深紫灰 + 紫色，和 iTerm、IntelliJ 的 Dracula 同一套颜色 | 什么都行。状态色和紫色区分得最清楚 |

已知的弱点：
- **石墨、日光**的提示色（info）和强调色都是蓝色，看起来接近。所以状态标签一定要带图标。
- **放映厅**的强调色是琥珀，警告色改成了橙色来区分，但两者还是比较像。
- 只有潟湖同时有深色和浅色。放映厅、石墨、Dracula 只有深色，日光只有浅色。
- 想跟随系统深浅色，需要 app 自己用 `matchMedia("(prefers-color-scheme: light)")` 判断，再设置 `data-theme`。

## 文件

| 文件 | 内容 |
|---|---|
| `tokens.css` | 所有颜色、字号、间距、圆角的变量。深色、浅色、紧凑模式都在这里 |
| `components.css` | 窗口骨架和组件：标题栏、侧边栏、状态栏、按钮、胶囊标签、输入框、卡片、表格、提示条、对话框 |
| `icons.tsx` | 线条图标（React），用法 `<Icon name="search" />` |
| `i18n.tsx` / `language.ts` | English / 简体中文 / 日本語：语言选择、翻译、通用文案、本地保存和跨窗口同步 |
| `preview.html` | 示例页面：一个任务管理 app，证明这套风格不只适合电影 |
| `package.json` | 让它能作为本地包安装 |

## 谁在用

- **Cine**：用 `cinema`、`graphite`、`lagoon`、`daylight`、`dracula` 五种配色。Cine 特有的样式（海报、详情页等）留在 Cine 自己的 `styles.css`。

改这里的通用组件之前，先想想会不会影响 Cine。

## 在新 app 里用

1. 作为本地包安装（lagoon-ui 和新项目放在同一个文件夹下）：

   ```sh
   npm install ../lagoon-ui
   ```

   它是指向这个文件夹的链接，改了 lagoon-ui，所有 app 立刻生效。
   因为是链接，要让它用到 app 自己的 React，需要两处设置：

   ```jsonc
   // tsconfig.json 的 compilerOptions
   "preserveSymlinks": true
   ```

   ```ts
   // vite.config.ts
   resolve: { preserveSymlinks: true },
   ```

2. 入口文件里按顺序引入，app 自己的样式放最后：

   ```ts
   import "lagoon-ui/tokens.css";
   import "lagoon-ui/components.css";
   import "./styles.css";
   import { Icon } from "lagoon-ui/icons";
   ```

3. Tauri 窗口要隐藏系统标题栏，界面才能延伸到顶部（`src-tauri/tauri.conf.json`）：

   ```json
   "windows": [{ "titleBarStyle": "Overlay", "hiddenTitle": true }]
   ```

   左边 84px 是给红黄绿按钮留的位置（`--traffic-light-w`）。

4. 照 `preview.html` 搭骨架：

   ```
   .app
     .titlebar        左：工具按钮  中：.search-field  右：工具按钮
     .app-body
       .workspace     圆角容器
         .sidebar     .sb-group > .sb-title + .sb-row（宽度由 app 自己定）
         .panel       横向排列；上下排就放 .column > .panel-header + .panel-body
     .statusbar       .st-item
   ```

5. 切换主题和密度：在 `<html>` 上设置属性。

   ```js
   document.documentElement.dataset.theme = "lagoon-light"; // 见上面「配色」
   document.documentElement.dataset.density = "compact"; // 删掉属性 = 标准
   ```

## Language

`lagoon-ui/i18n` provides English (`en`), Simplified Chinese (`zh-CN`), and Japanese (`ja`),
common labels, a `LanguageSelect` component, and a React subscription.
Apps own their domain-specific messages and choose their default language and
storage key. The same key synchronizes windows on the same origin; other apps
can use separate keys.

```tsx
import { createI18n, LanguageSelect } from "lagoon-ui/i18n";

export const { t, useI18n } = createI18n({
  defaultLanguage: "zh-CN",
  storageKey: "my-app:language",
  messages: {
    en: { "共 {count} 项": "{count} items" },
    ja: { "共 {count} 项": "{count} 件" },
  },
});

function Preferences() {
  const { language, setLanguage } = useI18n();
  return <label>{t("语言")}<LanguageSelect language={language} onChange={setLanguage} /></label>;
}
```

Source strings are the fallback when a translation is absent. Named values
use `t("共 {count} 项", { count: 3 })`. Unknown placeholders are kept intact,
including link-template tokens. App messages override shared labels.
Call `useI18n()` in components with translated content so language changes
update the screen without resetting app state. The exported `t` reads the
current language when used in callbacks. Include `language` in dependencies
of memoized translated values.

Language preferences use plain `en`, `zh-CN`, or `ja` values in local storage.
Storage failures are reported to the console; switching still works in memory.
Invalid saved languages fall back to the app's default.
`lagoon-ui/language` exposes `translate`, `createLanguageStore`, and the language
list without importing React.

Run the core tests with Node 22.18+ or Node 24+: `npm test`.

## 规则

1. **只用变量，不写死颜色。** 写 `color: var(--muted)`，不写 `color: #8ea4a2`。这样换主题时整个 app 一起变。
2. **薄荷绿 `--accent` 只表示「选中」和「主要操作」。** 选中的标签、主按钮、徽标数字。不要用它表示成功。
3. **状态用固定的 4 种颜色：** `--success`（成功）、`--warning`（警告）、`--danger`（错误、删除）、`--info`（进行中、提示）。每个 app 含义都一样。
4. **状态永远「图标 + 文字」。** 不能只靠颜色区分，色弱的人也要看得懂。成功色和薄荷绿比较接近，图标就是用来区分它们的。
5. **一个画面里只有一个实心绿按钮**（`.btn.accent`），其余用 `.secondary` 或 `.ghost`。
6. **没有图片的 app 要补颜色。** 海报类 app 靠图片撑起画面；纯文字的 app 会显得单调，用 `.swatch-block` 色块、图标、状态标签来补。
7. **信息多的页面用紧凑模式**（表格、日志、文件列表）；浏览类页面用标准模式。
8. **深色边框上的强调色用 `--frame-accent`**，内容区里用 `--accent`。浅色主题的边框仍是深色，两者颜色不同。
9. **新加主题时，每个变量都要定义。** 照抄一个现有主题再改颜色，不要漏。

## 层次

边框 `--frame` 最暗 < 侧边栏 `--side` < 内容 `--panel` 最亮。内容面板看起来浮在上面。
卡片、输入框在内容面板上再往上一层：`--panel-2`、`--surface`、`--surface-hi`。
