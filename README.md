# Lagoon UI

我所有 macOS 桌面 app 共用的界面风格。来自 Cine 的「潟湖」配色：深青底色 + 薄荷绿强调色。

打开 `preview.html` 看效果（右上角可以切换深色 / 浅色、标准 / 紧凑）。

## 文件

| 文件 | 内容 |
|---|---|
| `tokens.css` | 所有颜色、字号、间距、圆角的变量。深色、浅色、紧凑模式都在这里 |
| `components.css` | 窗口骨架和组件：标题栏、侧边栏、状态栏、按钮、胶囊标签、输入框、卡片、表格、提示条、对话框 |
| `icons.tsx` | 线条图标（React），用法 `<Icon name="search" />` |
| `preview.html` | 示例页面：一个任务管理 app，证明这套风格不只适合电影 |

## 在新 app 里用

1. 把 `tokens.css`、`components.css`、`icons.tsx` 复制到新项目的 `src/` 下。
2. 入口文件里按顺序引入：

   ```ts
   import "./tokens.css";
   import "./components.css";
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
         .sidebar     .sb-group > .sb-title + .sb-row
         .panel       .panel-header + .panel-body
     .statusbar       .st-item
   ```

5. 切换主题和密度：在 `<html>` 上设置属性。

   ```js
   document.documentElement.dataset.theme = "light";     // "dark" | "light"，删掉属性 = 跟随系统
   document.documentElement.dataset.density = "compact"; // 删掉属性 = 标准
   ```

## 规则

1. **只用变量，不写死颜色。** 写 `color: var(--muted)`，不写 `color: #8ea4a2`。这样换主题时整个 app 一起变。
2. **薄荷绿 `--accent` 只表示「选中」和「主要操作」。** 选中的标签、主按钮、徽标数字。不要用它表示成功。
3. **状态用固定的 4 种颜色：** `--success`（成功）、`--warning`（警告）、`--danger`（错误、删除）、`--info`（进行中、提示）。每个 app 含义都一样。
4. **状态永远「图标 + 文字」。** 不能只靠颜色区分，色弱的人也要看得懂。成功色和薄荷绿比较接近，图标就是用来区分它们的。
5. **一个画面里只有一个实心绿按钮**（`.btn.accent`），其余用 `.secondary` 或 `.ghost`。
6. **没有图片的 app 要补颜色。** 海报类 app 靠图片撑起画面；纯文字的 app 会显得单调，用 `.swatch-block` 色块、图标、状态标签来补。
7. **信息多的页面用紧凑模式**（表格、日志、文件列表）；浏览类页面用标准模式。
8. **深色边框上的强调色用 `--frame-accent`**，内容区里用 `--accent`。浅色主题的边框仍是深色，两者颜色不同。

## 层次

边框 `--frame` 最暗 < 侧边栏 `--side` < 内容 `--panel` 最亮。内容面板看起来浮在上面。
卡片、输入框在内容面板上再往上一层：`--panel-2`、`--surface`、`--surface-hi`。
