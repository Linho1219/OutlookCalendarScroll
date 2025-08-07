# Outlook Calendar Scroll Enhancer

[中文](#outlook-日历滚动增强脚本)

A userscript to enhance the scrolling experience in the Outlook Web Calendar.

Supports natural vertical or horizontal scroll navigation depending on the calendar view (month view scrolls vertically, week/day views scroll horizontally).

## Features

- Detect Outlook calendar views (day, workweek, week, month) dynamically in the SPA environment.
- Enable intuitive scrolling navigation:
  - Month view: scroll up/down to switch months.
  - Week/day views: scroll left/right to switch weeks/days.
- Visual scroll indicator with smooth feedback and trigger threshold.
- Written in TypeScript with Vite build setup.
- Easy to customize and extend.

## Installation

The source code does not contain the built userscript file (*.user.js).

Please visit the [Releases page](https://github.com/Linho1219/OutlookCalendarScroll/releases/latest) on GitHub, download `outlook-calendar-scroll.user.js` and put it in a userscript manager (Tampermonkey, Violentmonkey, etc.). Enjoy.

## Development

- Node.js and pnpm required.
- `pnpm install` to install dependencies.
- `pnpm dev` `pnpm dev` starts a development server that serves the userscript at `http://localhost:3000/outlook-calendar-scroll.user.js`, which reloads automatically on source changes.  You can load this URL directly in your userscript manager for live testing.
- `pnpm build` to build the userscript (`dist/outlook-calendar-scroll.user.js`).

## License

MIT

---

# Outlook 日历滚动增强脚本

一个用于增强 Outlook 网页版日历滚动体验的油猴脚本。月份视图垂直滚动，周/日视图水平滚动。

## 功能介绍

- 动态识别 Outlook PWA 中的日历视图（天、工作周、周、月）
- 根据视图类型切换滚动方向：
  - 月视图：上下滚动切换月份
  - 周/日视图：左右滚动切换周或日
- 滚动触发带有视觉指示器

## 使用

源码不包含构建产物。请前往 [Release 页面](https://github.com/Linho1219/OutlookCalendarScroll/releases/latest) 下载后导入脚本管理器。

## 开发

- 需要 Node.js 和 pnpm。
- 执行 `pnpm install` 安装依赖。
- 执行 `pnpm dev` 启动开发服务器，脚本文件实时编译并托管于 `http://localhost:3000/outlook-calendar-scroll.user.js`，支持热更新。可在脚本管理器中直接加载此链接进行调试。
- 执行 `pnpm build` 编译生成 `dist/outlook-calendar-scroll.user.js`，此即最终脚本。

## 许可证

MIT
